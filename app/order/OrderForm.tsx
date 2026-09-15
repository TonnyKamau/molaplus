"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

import { products } from "../../lib/orders/catalog";

type Result = { ok: boolean; reference?: string; message?: string };
type CartItem = { name: string; image: string; quantity: number };

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
  const initialSelection = products.find(([name]) => name === (initialProduct ?? products[0][0])) ?? products[0];
  const [cart, setCart] = useState<CartItem[]>(initialProduct ? [{ name: initialSelection[0], image: initialSelection[1], quantity: 1 }] : []);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [addedMessage, setAddedMessage] = useState("");
  const selected = useMemo(() => products.find(([name]) => name === product) ?? products[0], [product]);
  const matchingProducts = useMemo(() => {
    const query = productSearch.trim().toLowerCase();
    return query
      ? products.filter(([name]) => `${name} ${productCategory(name)}`.toLowerCase().includes(query))
      : products;
  }, [productSearch]);
  const totalUnits = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart() {
    setCart((items) => {
      const existing = items.find((item) => item.name === selected[0]);
      if (existing) return items.map((item) => item.name === selected[0] ? { ...item, quantity: Math.min(999, item.quantity + quantity) } : item);
      return [...items, { name: selected[0], image: selected[1], quantity }];
    });
    setQuantity(1);
    setAddedMessage(`${selected[0]} added to your order.`);
    window.setTimeout(() => setAddedMessage(""), 2600);
  }

  function updateCartQuantity(name: string, quantityValue: number) {
    setCart((items) => items.map((item) => item.name === name ? { ...item, quantity: Math.max(1, Math.min(999, quantityValue)) } : item));
  }

  function removeFromCart(name: string) {
    setCart((items) => items.filter((item) => item.name !== name));
  }

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
    if (pending || step !== 3 || !cart.length) return;
    setPending(true);
    setResult(null);
    const form = event.currentTarget;
    const payload: Record<string, unknown> = Object.fromEntries(new FormData(form));
    payload.items = cart;
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as Result;
      setResult(response.ok ? data : { ok: false, message: data.message || "We could not send this order." });
      if (response.ok && data.ok) setStep(4);
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
        <ol className="order-progress mb-7 grid grid-cols-3" aria-label="Order progress">
          {["Products", "Delivery", "Review"].map((label, index) => (
            <li className={`relative flex flex-col items-center gap-2 text-center text-[10px] font-extrabold uppercase tracking-[.12em] ${step >= index + 1 ? "text-primary" : "text-on-surface-variant"}`} key={label}><span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 ${step > index + 1 ? "border-primary bg-primary text-white" : step === index + 1 ? "border-secondary bg-secondary text-white" : "border-outline-variant bg-white"}`}>{step > index + 1 ? <span className="material-symbols-outlined text-base">check</span> : index + 1}</span><span>{label}</span></li>
          ))}
        </ol>

        {step === 1 && <div>
          <span className="mp-eyebrow text-secondary">Step 1</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-black">What would you like to order?</h2>
          <div className="order-product-picker relative mt-5 rounded-3xl border border-outline-variant bg-surface-container-low p-4 md:p-5">
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
          <div className="order-quantity mt-5">
            <p className="font-bold" id="quantity-label">Quantity</p>
            <div className="mt-2 inline-grid grid-cols-[52px_76px_52px] overflow-hidden rounded-2xl border border-outline-variant bg-white" aria-labelledby="quantity-label">
              <button aria-label="Decrease quantity" className="grid place-items-center text-2xl text-primary hover:bg-surface-container-low disabled:opacity-35" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">−</button>
              <input aria-label="Quantity" className="h-14 w-full border-x border-outline-variant bg-white text-center text-lg font-extrabold text-ink-black outline-none" min="1" max="999" required type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
              <button aria-label="Increase quantity" className="grid place-items-center text-2xl text-primary hover:bg-surface-container-low" onClick={() => setQuantity((value) => Math.min(999, value + 1))} type="button">+</button>
            </div>
          </div>
          <button className="order-add-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-secondary/90" onClick={addToCart} type="button"><span className="material-symbols-outlined">add_shopping_cart</span>Add this product</button>
          <p className={`mt-3 flex min-h-6 items-center justify-center gap-2 text-center text-sm font-bold text-primary transition ${addedMessage ? "opacity-100" : "opacity-0"}`} aria-live="polite"><span className="material-symbols-outlined text-lg">check_circle</span>{addedMessage || "Product added"}</p>

          <div className="order-basket-inline mt-7 border-t border-outline-variant pt-6">
            <div className="flex items-end justify-between gap-4"><div><span className="mp-eyebrow text-secondary">Your basket</span><h3 className="mt-1 text-xl font-extrabold text-ink-black">{cart.length} {cart.length === 1 ? "product" : "products"} · {totalUnits} units</h3></div></div>
            {cart.length ? <div className="mt-4 space-y-3">{cart.map((item) => <div className="order-basket-item grid grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-outline-variant bg-white p-3" key={item.name}>
              <span className="relative h-12 overflow-hidden rounded-xl bg-white"><Image alt="" className="object-contain p-1" fill sizes="52px" src={item.image} /></span>
              <div className="min-w-0"><strong className="block text-sm leading-tight text-ink-black">{item.name}</strong><div className="mt-2 inline-flex items-center overflow-hidden rounded-full border border-outline-variant bg-white"><button aria-label={`Decrease ${item.name}`} className="h-8 w-9 text-primary disabled:opacity-30" disabled={item.quantity <= 1} onClick={() => updateCartQuantity(item.name, item.quantity - 1)} type="button">−</button><span className="min-w-8 text-center text-sm font-extrabold">{item.quantity}</span><button aria-label={`Increase ${item.name}`} className="h-8 w-9 text-primary" onClick={() => updateCartQuantity(item.name, item.quantity + 1)} type="button">+</button></div></div>
              <button aria-label={`Remove ${item.name}`} className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant hover:bg-white hover:text-secondary" onClick={() => removeFromCart(item.name)} type="button"><span className="material-symbols-outlined">delete</span></button>
            </div>)}</div> : <p className="mt-4 rounded-2xl bg-surface-container-low p-5 text-sm text-on-surface-variant">Add at least one product to continue.</p>}
          </div>
          <button className="order-continue-inline mt-6 w-full rounded-full bg-primary px-7 py-4 font-extrabold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40" disabled={!cart.length} onClick={() => setStep(2)} type="button">Continue with {cart.length} {cart.length === 1 ? "product" : "products"} <span aria-hidden>→</span></button>
        </div>}

        <div className={step < 2 ? "hidden" : ""}>
          {step === 2 && <><span className="mp-eyebrow text-secondary">Step 2</span><h2 className="mt-2 text-3xl font-extrabold text-ink-black">Where should we deliver?</h2></>}
          <div className={step === 2 ? "mt-7 grid gap-5 sm:grid-cols-2" : "hidden"}>
            <label className="block font-bold">Full name<input className={inputClass} name="name" required autoComplete="name" /></label>
            <label className="block font-bold">Phone number<input className={inputClass} name="phone" required pattern="[+0-9 ()-]{10,20}" title="Enter a Kenyan mobile number, for example 0722656142 or +254722656142" autoComplete="tel" inputMode="tel" placeholder="07… or +254…" /></label>
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
          <div className="flex items-start justify-between gap-4"><div><h2 className="mt-2 text-3xl font-extrabold text-ink-black">Double-check your order.</h2><p className="mt-2 text-sm text-on-surface-variant">Review products and quantities before sending the request.</p></div><button className="mt-2 shrink-0 rounded-full border border-outline-variant px-4 py-2 text-sm font-bold text-primary hover:bg-surface-container-low" onClick={() => setStep(1)} type="button">Edit basket</button></div>
          <div className="mt-7 rounded-2xl bg-surface-container-low p-5"><div className="space-y-3">{cart.map((item) => <div className="flex items-start justify-between gap-4 border-b border-outline-variant pb-3 last:border-0 last:pb-0" key={item.name}><p className="font-extrabold text-ink-black">{item.name}</p><strong className="shrink-0 text-primary">× {item.quantity}</strong></div>)}</div><p className="mt-4 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">MolaPlus will call to confirm the current price, available stock, delivery cost and payment instructions.</p></div>
          {result && !result.ok && <p className="mt-5 rounded-2xl bg-red-50 p-4 font-semibold text-red-800" role="alert">{result.message}</p>}
          <div className="mt-8 flex gap-3"><button className="rounded-full border border-outline-variant px-6 py-3.5 font-bold text-primary" onClick={() => setStep(2)} type="button">Back</button><button className="flex-1 rounded-full bg-secondary px-6 py-3.5 font-extrabold text-white disabled:opacity-60" disabled={pending} type="submit">{pending ? "Sending order…" : "Place order"}</button></div>
          <p className="mt-4 text-center text-xs text-on-surface-variant">By placing the order, you agree that MolaPlus may contact you about this request.</p>
        </div>}
      </form>

      <aside className={`order-checkout__summary overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest ${step === 1 ? "is-basket-step" : ""}`}>
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3"><div><span className="mp-eyebrow text-secondary">Your order</span><h3 className="mt-1 text-xl font-extrabold text-ink-black">{cart.length} {cart.length === 1 ? "product" : "products"}</h3></div><span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">{totalUnits} units</span></div>
          {cart.length ? <div className="mt-5 space-y-3">{cart.map((item) => <div className="order-summary-item grid grid-cols-[52px_minmax(0,1fr)_36px] items-center gap-3 rounded-2xl border border-outline-variant p-3" key={item.name}>
            <span className="relative h-12 overflow-hidden rounded-lg bg-surface-container-low"><Image alt="" className="object-contain p-1" fill sizes="52px" src={item.image} /></span>
            <div className="min-w-0"><strong className="block text-sm leading-tight text-ink-black">{item.name}</strong>{step === 1 ? <div className="mt-2 inline-flex items-center overflow-hidden rounded-full border border-outline-variant"><button aria-label={`Decrease ${item.name}`} className="h-7 w-8 text-primary disabled:opacity-30" disabled={item.quantity <= 1} onClick={() => updateCartQuantity(item.name, item.quantity - 1)} type="button">−</button><span className="min-w-7 text-center text-sm font-extrabold">{item.quantity}</span><button aria-label={`Increase ${item.name}`} className="h-7 w-8 text-primary" onClick={() => updateCartQuantity(item.name, item.quantity + 1)} type="button">+</button></div> : <span className="mt-1 block text-sm font-extrabold text-primary">Quantity {item.quantity}</span>}</div>
            {step === 1 ? <button aria-label={`Remove ${item.name}`} className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-secondary" onClick={() => removeFromCart(item.name)} type="button"><span className="material-symbols-outlined text-xl">delete</span></button> : <span className="font-extrabold text-primary">×{item.quantity}</span>}
          </div>)}</div> : <p className="mt-5 rounded-2xl bg-surface-container-low p-5 text-sm text-on-surface-variant">Choose a product and add it to your order.</p>}
          {step === 1 && <button className="mt-5 w-full rounded-full bg-primary px-6 py-4 font-extrabold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40" disabled={!cart.length} onClick={() => setStep(2)} type="button">Continue with {cart.length} {cart.length === 1 ? "product" : "products"} <span aria-hidden>→</span></button>}
          <p className="mt-5 border-t border-outline-variant pt-4 text-sm text-on-surface-variant"><span className="material-symbols-outlined mr-2 align-middle text-primary">sms</span>MolaPlus receives one SMS with the complete order.</p>
        </div>
      </aside>
    </section>
  );
}
