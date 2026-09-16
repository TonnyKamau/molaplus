import { NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { products } from "../../../lib/orders/catalog";

type OrderPayload = Record<string, unknown>;
type OrderItem = { name: string; quantity: number };
const recentRequests = new Map<string, number[]>();

function text(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function normalizePhone(value: string) {
  const cleaned = value.replace(/[\s()-]/g, "");
  if (/^0[17]\d{8}$/.test(cleaned)) return `+254${cleaned.slice(1)}`;
  if (/^254[17]\d{8}$/.test(cleaned)) return `+${cleaned}`;
  if (/^\+254[17]\d{8}$/.test(cleaned)) return cleaned;
  return "";
}

function rateLimited(ip: string) {
  const now = Date.now();
  for (const [key, times] of recentRequests) if (times.every((time) => now - time >= 15 * 60_000)) recentRequests.delete(key);
  const attempts = (recentRequests.get(ip) ?? []).filter((time) => now - time < 15 * 60_000);
  attempts.push(now);
  recentRequests.set(ip, attempts);
  return attempts.length > 5;
}

async function sendSms(message: string) {
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  const username = process.env.AFRICASTALKING_USERNAME;
  const recipients = process.env.MOLAPLUS_ORDER_SMS_TO;
  if (!apiKey || !username || !recipients) {
    return { configured: false };
  }

  const body = new URLSearchParams({ username, to: recipients, message });
  if (process.env.AFRICASTALKING_SENDER_ID) body.set("from", process.env.AFRICASTALKING_SENDER_ID);
  const response = await fetch("https://api.africastalking.com/version1/messaging", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded", apiKey },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`SMS provider returned ${response.status}`);
  const result = await response.json();
  const deliveries = result?.SMSMessageData?.Recipients;
  if (!Array.isArray(deliveries) || !deliveries.some((item: { statusCode?: number }) => item.statusCode === 101)) {
    throw new Error("SMS provider did not accept the notification.");
  }
  return { configured: true };
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ ok: false, message: "Please submit your order from this website." }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false, message: "Too many order attempts. Please wait a few minutes or call us." }, { status: 429 });

  let data: OrderPayload;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    let size = 0; const chunks: Uint8Array[] = [];
    for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 16000) { await reader.cancel(); return Response.json({ ok: false, message: "Order details are too large." }, { status: 413 }); } chunks.push(value); }
    data = JSON.parse(Buffer.concat(chunks).toString());
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid body");
  } catch { return Response.json({ ok: false, message: "Invalid order details." }, { status: 400 }); }
  if (text(data.website)) return Response.json({ ok: true, reference: "MP-RECEIVED" });

  const name = text(data.name, 80);
  const phone = normalizePhone(text(data.phone, 30));
  const items: OrderItem[] = Array.isArray(data.items) ? data.items.slice(0, 20).map((item) => {
    const value = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return { name: text(value.name, 120), quantity: Number(value.quantity) };
  }) : [];
  const county = text(data.county, 80);
  const town = text(data.town, 80);
  const address = text(data.address, 220);
  const coordinates = text(data.coordinates, 60);
  const notes = text(data.notes, 220);
  const validItems = Array.isArray(data.items) && data.items.length <= 20 && items.length > 0 && new Set(items.map((item) => item.name)).size === items.length && items.every((item) => products.some(([name]) => name === item.name) && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 999);
  if (!name || !phone || !validItems || !county || !town || !address) {
    return Response.json({ ok: false, message: "Please provide a valid name, Kenyan phone number, order items and delivery location." }, { status: 400 });
  }

  const reference = `MP-${randomUUID().slice(0, 8).toUpperCase()}`;
  const location = `${county}, ${town} — ${address}${coordinates ? ` (GPS ${coordinates})` : ""}`;
  const orderLines = items.map((item) => `${item.quantity} x ${item.name}`).join("\n");
  const message = `NEW ORDER ${reference}\n${orderLines}\n${name} ${phone}\nDeliver: ${location}${notes ? `\nNotes: ${notes}` : ""}`;
  try {
    const sms = await sendSms(message);
    if (!sms.configured) {
      return Response.json({ ok: false, message: "Online orders are temporarily unavailable. Please call +254 722 656 142 or message us on WhatsApp to order." }, { status: 503 });
    }
    return Response.json({ ok: true, reference });
  } catch (error) {
    console.error("Order SMS failed", error);
    return Response.json({ ok: false, message: "We could not notify the order team. Please call +254 722 656 142." }, { status: 502 });
  }
}
