"use client";
import { useRef, useState } from "react";
import type { Media } from "../../lib/studio/model";

const existing = [
  ["Dairy cow and calf", "/molaplus/service-cows.webp"], ["Poultry farm", "/molaplus/service-poultry.webp"], ["Livestock farm", "/molaplus/service-pigs.webp"], ["Super Milk Booster", "/molaplus/milk-booster-5kg-cutout.webp"], ["Complete product range", "/molaplus/full-product-range.webp"],
];
export function MediaLibrary({ media, onUploaded, onSelect }: { media: Media[]; onUploaded: (item: Media) => void; onSelect?: (url: string, name: string) => void }) {
  const input = useRef<HTMLInputElement>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [message, setMessage] = useState(""); const [copiedUrl, setCopiedUrl] = useState("");
  async function upload(file?: File) {
    if (!file) return; setError(""); setMessage("");
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError("Choose a JPG, PNG or WebP image under 5 MB."); return; }
    setBusy(true);
    try { const response = await fetch("/api/studio/media", { method: "POST", headers: { "Content-Type": file.type, "X-File-Name": encodeURIComponent(file.name) }, body: file }); const result = await response.json(); if (!response.ok) throw new Error(result.error); onUploaded(result.media); setMessage("Image uploaded and ready to use."); }
    catch (error) { setError((error as Error).message); } finally { setBusy(false); if (input.current) input.current.value = ""; }
  }
  async function copyAddress(url: string, name: string) {
    const address = new URL(url, window.location.origin).href;
    try {
      await copyText(address);
      setCopiedUrl(url);
      setMessage(`${name} image address copied.`);
      window.setTimeout(() => setCopiedUrl((current) => current === url ? "" : current), 1800);
    } catch {
      setMessage(`Copy this image address: ${address}`);
    }
  }
  return <div className="studio-media"><div className="studio-upload"><div><strong>Your next story, in a picture.</strong><p>JPG, PNG or WebP · Up to 5 MB · Images are optimised automatically.</p></div><label className="studio-primary">{busy ? "Uploading…" : "Upload image +"}<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => upload(event.target.files?.[0])} /></label></div>{error && <p className="studio-error" role="alert">{error}</p>}<p className="studio-hint" role="status">{message}</p><div className="studio-media-grid">{[...media.map((item) => [decodeName(item.name), item.url]), ...existing].map(([name, url]) => <button type="button" key={url} className="studio-media-item" onClick={() => { if (onSelect) onSelect(url, name); else void copyAddress(url, name); }}><picture><img src={url} alt={name} loading="lazy" /></picture><span>{name}</span><small>{onSelect ? "Use this image ↗" : copiedUrl === url ? "Copied ✓" : "Copy image address ↗"}</small></button>)}</div></div>;
}
function decodeName(name: string) { try { return decodeURIComponent(name); } catch { return name; } }
async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) throw new Error("Copy failed.");
}
