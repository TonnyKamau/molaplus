"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const products = [
  ["Super Milk Booster — 1KG", "/molaplus/milkbooster-1kg.webp"],
  ["Super Milk Booster — 2KG", "/molaplus/milkbooster-2kg.webp"],
  ["Super Milk Booster — 5KG", "/molaplus/milk-booster-5kg-cutout.webp"],
  ["Poultry Microbes — 500ML", "/molaplus/poultry-500ml.webp"],
  ["Poultry Microbes — 1L", "/molaplus/poultry-microbes-1l-bottle.webp"],
  ["Poultry Microbes — 5L", "/molaplus/poultry-5ltr.webp"],
  ["Poultry Microbes — 10L", "/molaplus/poultry-microbes-10l.webp"],
  ["Pig Microbes — 1L", "/molaplus/pig-1ltr.webp"],
  ["Pig Microbes — 5L", "/molaplus/pig-5ltr.webp"],
  ["Pig Microbes — 10L", "/molaplus/pig-microbes-10l.webp"],
  ["Pig Microbes — 20L", "/molaplus/pig-20ltr.webp"],
  ["Dairy Ultra Mineral Lick — 2KG", "/molaplus/dairy-ultra-mineral-lick-2kg.webp"],
  ["Early Calf-Weaner Meal — 10KG", "/molaplus/early-calf-weaner-10kg.webp"],
  ["MolaPlus Steaming Formula — 5KG", "/molaplus/steaming-formula-5kg.webp"],
  ["MolaPlus Bovine Meal", "/molaplus/molaplus-bovine-meal.webp"],
  ["MolaPlus Layer Mash — 50KG", "/molaplus/molaplus-layer-mash-50kg.webp"],
  ["Mazao Cereals — 250ML", "/molaplus/mazao-cereals-250ml.webp"],
  ["Mazao Cereals — 500ML", "/molaplus/mazao-cereals-500ml.webp"],
  ["Mazao Organic Fertilizer", "/molaplus/mazao-organic-fertilizer.webp"],
  ["MolaPlus V-EM Mbolea", "/molaplus/v-em-mbolea.webp"],
] as const;

type Result = { ok: boolean; reference?: string; message?: string };

function productCategory(name: string) {
  if (name.includes("Milk") || name.includes("Dairy") || name.includes("Bovine") || name.includes("Calf") || name.includes("Steaming")) return "Dairy nutrition";
  if (name.includes("Poultry") || name.includes("Layer")) return "Poultry";
  if (name.includes("Pig")) return "Pig & livestock";
  return "Crop nutrition";
}

export function OrderForm({ requestedProduct }: { requestedProduct?: string }) {
  const initialProduct = requestedProduct
    ? products.find(([name, image]) => name === requestedProduct || image === requestedProduct)?.[0]
    : undefined;
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<string>(initialProduct ?? products[0][0]);
  const [quantity, setQuantity] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const selected = useMemo(() => products.find(([name]) => name === product) ?? products[0], [product]);
  const matchingProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    return query
      ? products.filter(([name]) => `${name} ${productCategory(name)}`.toLowerCase().includes(query))
      : products;
  }, [productSearch]);

  function useLocation() {
    if (!navigator.geolocation) return setLocationStatus("Location is not supported on this device.");
    setLocationStatus("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const field = document.querySelector<HTMLInputElement>("#coordinates");
        if (field) field.value = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
        setLocationStatus("Location added to your order.");
      },
      () => setLocationStatus("We could not access your location. Enter your town and delivery details instead."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    payload.product = product;
    payload.quantity = String(quantity);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as Result;
      setResult(data);
      if (data.ok) setStep(4);
    } catch {
      setResult({ ok: false, message: "We could not send the order. Please call +254 722 656 142." });
    } finally {
      setPending(false);
    }
  }

  const inputClass = "mt-2 w-full rounded-2xl border border-outline-variant bg-white px-4 py-3.5 text-base text-ink-black outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  if (step === 4 && result?.ok) {
    return (
      <section className="mx-auto max-w-3xl px-margin-mobile py-16 text-center md:px-margin-desktop md:py-24">
        <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-8 shadow-xl md:p-14">
          <span className="material-symbols-outlined rounded-full bg-primary p-4 text-4xl text-white">check</span>
          <span className="mp-eyebrow mt-8 block text-secondary">Order received</span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-black">Thank you. We’ll call you shortly.</h2>
          <p className="mx-auto mt-5 max-w-xl text-on-surface-variant">Your order has been sent to the MolaPlus team. Keep this reference for follow-up.</p>
          <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-surface-container-low p-5">
            <span className="text-xs font-bold uppercase tracking-[.18em] text-on-surface-variant">Order reference</span>
            <strong className="mt-1 block text-2xl text-primary">{result.reference}</strong>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="rounded-full bg-primary px-7 py-3.5 font-bold text-white" href="/products">Continue browsing</Link>
            <a className="rounded-full border border-outline-variant px-7 py-3.5 font-bold text-primary" href="tel:+254722656142">Call MolaPlus</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="order-checkout mx-auto grid max-w-container-max-width gap-6 px-margin-mobile py-7 md:px-margin-desktop md:py-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      <form className="order-checkout__form rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest p-5 shadow-sm md:p-8" onSubmit={submit}>
        <ol className="mb-7 grid grid-cols-3 gap-2" aria-label="Order progress">
          {["Products", "Delivery", "Review"].map((label, index) => (
            <li className={`border-b-4 pb-3 text-xs font-extrabold uppercase tracking-wider ${step >= index + 1 ? "border-secondary text-primary" : "border-outline-variant text-on-surface-variant"}`} key={label}>{index + 1}. {label}</li>
          ))}
        </ol>

        {step === 1 && <div>
          <span className="mp-eyebrow text-secondary">Step 1</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-black">What would you like to order?</h2>
          <div className="relative mt-5">
            <p className="font-bold" id="product-picker-label">Product</p>
            <button
              aria-expanded={pickerOpen}
              aria-haspopup="listbox"
              aria-labelledby="product-picker-label product-picker-value"
              className="mt-2 grid w-full grid-cols-[64px_minmax(0,1fr)_40px] items-center gap-4 rounded-2xl border border-outline-variant bg-white p-3 text-left transition hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              onClick={() => setPickerOpen((open) => !open)}
              type="button"
            >
              <span className="relative h-16 overflow-hidden rounded-xl bg-surface-container-low">
                <Image alt="" className="object-contain p-2" fill sizes="64px" src={selected[1]} />
              </span>
              <span className="min-w-0" id="product-picker-value">
                <strong className="block truncate text-base text-ink-black md:text-lg">{selected[0]}</strong>
                <span className="mt-1 block text-sm text-on-surface-variant">{productCategory(selected[0])}</span>
              </span>
              <span className={`material-symbols-outlined justify-self-center text-primary transition-transform ${pickerOpen ? "rotate-180" : ""}`}>expand_more</span>
            </button>

            {pickerOpen && (
              <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-2xl" onKeyDown={(event) => { if (event.key === "Escape") setPickerOpen(false); }}>
                <div className="sticky top-0 z-10 border-b border-outline-variant bg-white p-3">
                  <label className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3">
                    <span className="material-symbols-outlined text-primary">search</span>
                    <span className="sr-only">Search products</span>
                    <input autoFocus className="min-w-0 flex-1 bg-transparent text-base text-ink-black outline-none placeholder:text-on-surface-variant" onChange={(event) => setProductSearch(event.target.value)} placeholder="Search milk, poultry, pig or crop products" type="search" value={productSearch} />
                  </label>
                </div>
                <div className="max-h-[min(420px,52vh)] overflow-y-auto p-2" role="listbox" aria-label="Products">
                  {matchingProducts.length ? matchingProducts.map(([name, image]) => {
                    const active = name === product;
                    return (
                      <button
                        aria-selected={active}
                        className={`grid w-full grid-cols-[52px_minmax(0,1fr)_28px] items-center gap-3 rounded-xl p-2.5 text-left transition ${active ? "bg-primary text-white" : "text-ink-black hover:bg-surface-container-low"}`}
                        key={name}
                        onClick={() => { setProduct(name); setPickerOpen(false); setProductSearch(""); }}
                        role="option"
                        type="button"
                      >
                        <span className={`relative h-12 overflow-hidden rounded-lg ${active ? "bg-white/90" : "bg-surface-container-low"}`}><Image alt="" className="object-contain p-1" fill sizes="52px" src={image} /></span>
                        <span className="min-w-0"><strong className="block truncate text-sm md:text-base">{name}</strong><span className={`mt-0.5 block text-xs ${active ? "text-white/75" : "text-on-surface-variant"}`}>{productCategory(name)}</span></span>
                        {active && <span className="material-symbols-outlined text-xl">check</span>}
                      </button>
                    );
                  }) : <p className="px-4 py-10 text-center text-sm text-on-surface-variant">No products match “{productSearch}”.</p>}
                </div>
              </div>
            )}
          </div>
          <div className="mt-5">
            <p className="font-bold" id="quantity-label">Quantity</p>
            <div className="mt-2 inline-grid grid-cols-[52px_76px_52px] overflow-hidden rounded-2xl border border-outline-variant bg-white" aria-labelledby="quantity-label">
              <button aria-label="Decrease quantity" className="grid place-items-center text-2xl text-primary hover:bg-surface-container-low disabled:opacity-35" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">−</button>
              <input aria-label="Quantity" className="h-14 w-full border-x border-outline-variant bg-white text-center text-lg font-extrabold text-ink-black outline-none" min="1" max="999" required type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
              <button aria-label="Increase quantity" className="grid place-items-center text-2xl text-primary hover:bg-surface-container-low" onClick={() => setQuantity((value) => Math.min(999, value + 1))} type="button">+</button>
            </div>
          </div>
          <button className="mt-6 w-full rounded-full bg-primary px-7 py-4 font-extrabold text-white transition hover:bg-primary-container" onClick={() => setStep(2)} type="button">Continue to delivery <span aria-hidden>→</span></button>
        </div>}

        <div className={step < 2 ? "hidden" : ""}>
          {step === 2 && <><span className="mp-eyebrow text-secondary">Step 2</span><h2 className="mt-2 text-3xl font-extrabold text-ink-black">Where should we deliver?</h2></>}
          <div className={step === 2 ? "mt-7 grid gap-5 sm:grid-cols-2" : "hidden"}>
            <label className="block font-bold">Full name<input className={inputClass} name="name" required autoComplete="name" /></label>
            <label className="block font-bold">Phone number<input className={inputClass} name="phone" required autoComplete="tel" inputMode="tel" placeholder="07… or +254…" /></label>
            <label className="block font-bold">County<input className={inputClass} name="county" required placeholder="e.g. Nakuru" /></label>
            <label className="block font-bold">Town / area<input className={inputClass} name="town" required placeholder="e.g. Njoro" /></label>
            <label className="block font-bold sm:col-span-2">Delivery directions<textarea className={inputClass} name="address" required rows={3} placeholder="Village, road, landmark or farm name" /></label>
            <label className="block font-bold sm:col-span-2">Order notes <span className="font-normal text-on-surface-variant">(optional)</span><textarea className={inputClass} name="notes" rows={3} placeholder="Package mix, preferred delivery day or questions" /></label>
            <input id="coordinates" name="coordinates" type="hidden" />
            <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
            <div className="sm:col-span-2">
              <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-5 py-3 font-bold text-primary hover:bg-surface-container-low" onClick={useLocation} type="button"><span className="material-symbols-outlined">my_location</span>Use my current location</button>
              <p className="mt-2 text-sm text-on-surface-variant" aria-live="polite">{locationStatus}</p>
            </div>
          </div>
          {step === 2 && <div className="mt-8 flex gap-3"><button className="rounded-full border border-outline-variant px-6 py-3.5 font-bold text-primary" onClick={() => setStep(1)} type="button">Back</button><button className="flex-1 rounded-full bg-primary px-6 py-3.5 font-bold text-white" onClick={(event) => { if (event.currentTarget.form?.reportValidity()) setStep(3); }} type="button">Review order</button></div>}
        </div>

        {step === 3 && <div>
          <span className="mp-eyebrow text-secondary">Step 3</span>
          <h2 className="mt-2 text-3xl font-extrabold text-ink-black">Double-check your order.</h2>
          <div className="mt-7 rounded-2xl bg-surface-container-low p-5"><p className="font-extrabold text-ink-black">{quantity} × {product}</p><p className="mt-2 text-sm text-on-surface-variant">MolaPlus will call to confirm the current price, available stock, delivery cost and payment instructions.</p></div>
          {result && !result.ok && <p className="mt-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-800" role="alert">{result.message}</p>}
          <div className="mt-8 flex gap-3"><button className="rounded-full border border-outline-variant px-6 py-3.5 font-bold text-primary" onClick={() => setStep(2)} type="button">Back</button><button className="flex-1 rounded-full bg-secondary px-6 py-3.5 font-extrabold text-white disabled:opacity-60" disabled={pending} type="submit">{pending ? "Sending order…" : "Place order"}</button></div>
          <p className="mt-4 text-center text-xs text-on-surface-variant">By placing the order, you agree that MolaPlus may contact you about this request.</p>
        </div>}
      </form>

      <aside className="order-checkout__summary overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest xl:sticky xl:top-24">
        <div className="product-card__media relative h-44 md:h-52"><Image alt={selected[0]} className="object-contain p-5" fill sizes="(max-width: 1279px) 100vw, 360px" src={selected[1]} /></div>
        <div className="border-t border-outline-variant p-5 md:p-6"><span className="mp-eyebrow text-secondary">Your order</span><h3 className="mt-2 text-xl font-extrabold text-ink-black">{selected[0]}</h3><div className="mt-4 flex items-center justify-between"><span className="text-on-surface-variant">Quantity</span><strong className="text-xl text-primary">{quantity}</strong></div><p className="mt-4 border-t border-outline-variant pt-4 text-sm text-on-surface-variant"><span className="material-symbols-outlined mr-2 align-middle text-primary">sms</span>MolaPlus receives an SMS when you submit.</p></div>
      </aside>
    </section>
  );
}
