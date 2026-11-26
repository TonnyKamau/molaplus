"use client";

import Image from "next/image";
import Link from "next/link";
import { type SubmitEvent, useEffect, useMemo, useState } from "react";

import { products } from "../../lib/orders/catalog";
import { plural, useT } from "../../lib/i18n";
import { toast } from "../../lib/toast";

type Result = { ok: boolean; reference?: string; message?: string };
type CartItem = { name: string; image: string; quantity: number };

function productCategory(name: string, fr = false) {
  if (name.includes("Milk") || name.includes("Dairy") || name.includes("Bovine") || name.includes("Calf") || name.includes("Steaming")) return fr ? "Nutrition laitière" : "Dairy nutrition";
  if (name.includes("Poultry") || name.includes("Layer")) return fr ? "Volaille" : "Poultry";
  if (name.includes("Pig")) return fr ? "Porcs et bétail" : "Pig & livestock";
  return fr ? "Nutrition des cultures" : "Crop nutrition";
}

export function OrderForm() {
  // Native French (not Google) so counts, totals and messages stay exact.
  const t = useT();
  const fr = t.lang === "fr";
  const productCount = (count: number) => plural(count, t("product", "produit"), t("products", "produits"), t.lang);
  const unitCount = (count: number) => plural(count, t("unit", "unité"), t("units", "unités"), t.lang);
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState<string>(products[0][0]);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Preselect a product from ?product= (read client-side so the statically
  // exported page hydrates cleanly before applying the query).
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("product");
    if (!requested) return;
    const match = products.find(([name, image]) => name === requested || image === requested);
    if (match) {
      setProduct(match[0]);
      setCart([{ name: match[0], image: match[1], quantity: 1 }]);
    }
  }, []);
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
      ? products.filter(([name]) => `${name} ${productCategory(name)} ${productCategory(name, true)}`.toLowerCase().includes(query))
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
    setAddedMessage(t(`${selected[0]} added to your order.`, `${selected[0]} ajouté à votre commande.`));
    window.setTimeout(() => setAddedMessage(""), 2600);
  }

  function updateCartQuantity(name: string, quantityValue: number) {
    setCart((items) => items.map((item) => item.name === name ? { ...item, quantity: Math.max(1, Math.min(999, quantityValue)) } : item));
  }

  function removeFromCart(name: string) {
    setCart((items) => items.filter((item) => item.name !== name));
  }

  function useLocation() {
    if (!navigator.geolocation) return setLocationStatus(t("Location is not supported on this device.", "La localisation n’est pas prise en charge sur cet appareil."));
    setLocationStatus(t("Getting your location…", "Recherche de votre position…"));
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const field = document.querySelector<HTMLInputElement>("#coordinates");
        if (field) field.value = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
        setLocationStatus(t("Location added to your order.", "Position ajoutée à votre commande."));
      },
      () => setLocationStatus(t("We could not access your location. Enter your town and delivery details instead.", "Impossible d’accéder à votre position. Indiquez plutôt votre ville et l’adresse de livraison.")),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
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
      if (response.ok && data.ok) {
        setResult(data);
        setStep(4);
      } else {
        toast.error(data.message || t("We could not send this order.", "Impossible d’envoyer cette commande."));
      }
    } catch {
      toast.error(t("We could not send the order. Please call +254 724 968 847.", "Impossible d’envoyer la commande. Appelez le +254 724 968 847."));
    } finally {
      setPending(false);
    }
  };

  const inputClass = "mt-2 w-full rounded-2xl border border-outline-variant bg-white px-4 py-3.5 text-base text-ink-black outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10";

  if (step === 4 && result?.ok) {
    return (
      <section className="mx-auto max-w-3xl px-margin-mobile py-16 text-center md:px-margin-desktop md:py-24" translate="no">
        <div className="rounded-[2rem] border border-outline-variant bg-surface-container-lowest p-8 shadow-xl md:p-14">
          <span className="material-symbols-outlined notranslate rounded-full bg-primary p-4 text-4xl text-white">check</span>
          <span className="mp-eyebrow mt-8 block text-secondary">{t("Order received", "Commande reçue")}</span>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-black">{t("Thank you. We’ll call you shortly.", "Merci. Nous vous appelons très vite.")}</h2>
          <p className="mx-auto mt-5 max-w-xl text-on-surface-variant">{t("Your order has been sent to the MolaPlus team. Keep this reference for follow-up.", "Votre commande a été transmise à l’équipe MolaPlus. Conservez cette référence pour le suivi.")}</p>
          <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-surface-container-low p-5">
            <span className="text-xs font-bold uppercase tracking-[.18em] text-on-surface-variant">{t("Order reference", "Référence de commande")}</span>
            <strong className="mt-1 block text-2xl text-primary">{result.reference}</strong>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="rounded-full bg-primary px-7 py-3.5 font-bold text-white" href="/products">{t("Continue browsing", "Continuer mes achats")}</Link>
            <a className="rounded-full border border-outline-variant px-7 py-3.5 font-bold text-primary" href="tel:+254724968847">{t("Call MolaPlus", "Appeler MolaPlus")}</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section translate="no" className="order-checkout mx-auto grid max-w-container-max-width gap-6 px-margin-mobile py-7 md:px-margin-desktop md:py-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
      <form className="order-checkout__form rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest p-5 shadow-sm md:p-8" onSubmit={submit}>
        <ol className="order-progress mb-7 grid grid-cols-3" aria-label={t("Order progress", "Étapes de la commande")}>
          {[t("Products", "Produits"), t("Delivery", "Livraison"), t("Review", "Vérification")].map((label, index) => (
            <li className={`relative flex flex-col items-center gap-2 text-center text-[10px] font-extrabold uppercase tracking-[.12em] ${step >= index + 1 ? "text-primary" : "text-on-surface-variant"}`} key={label}><span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border-2 ${step > index + 1 ? "border-primary bg-primary text-white" : step === index + 1 ? "border-secondary bg-secondary text-white" : "border-outline-variant bg-white"}`}>{step > index + 1 ? <span className="material-symbols-outlined notranslate text-base">check</span> : index + 1}</span><span>{label}</span></li>
          ))}
        </ol>

        {step === 1 && <div>
          <span className="mp-eyebrow text-secondary">{t("Step 1", "Étape 1")}</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-black">{t("What would you like to order?", "Que souhaitez-vous commander ?")}</h2>
          <div className="order-product-picker relative mt-5 rounded-3xl border border-outline-variant bg-surface-container-low p-4 md:p-5">
            <p className="font-bold" id="product-picker-label">{t("Product", "Produit")}</p>
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
                <span className="mt-1 block text-sm text-on-surface-variant">{productCategory(selected[0], fr)}</span>
              </span>
              <span className={`material-symbols-outlined notranslate justify-self-center text-primary transition-transform ${pickerOpen ? "rotate-180" : ""}`}>expand_more</span>
            </button>

            {pickerOpen && (
              <div className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-2xl" onKeyDown={(event) => { if (event.key === "Escape") setPickerOpen(false); }}>
                <div className="sticky top-0 z-10 border-b border-outline-variant bg-white p-3">
                  <label className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3">
                    <span className="material-symbols-outlined notranslate text-primary">search</span>
                    <span className="sr-only">{t("Search products", "Rechercher un produit")}</span>
                    <input autoFocus className="min-w-0 flex-1 bg-transparent text-base text-ink-black outline-none placeholder:text-on-surface-variant" onChange={(event) => setProductSearch(event.target.value)} placeholder={t("Search milk, poultry, pig or crop products", "Rechercher : lait, volaille, porc, cultures")} type="search" value={productSearch} />
                  </label>
                </div>
                <div className="max-h-[min(420px,52vh)] overflow-y-auto p-2" role="listbox" aria-label={t("Products", "Produits")}>
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
                        <span className="min-w-0"><strong className="block truncate text-sm md:text-base">{name}</strong><span className={`mt-0.5 block text-xs ${active ? "text-white/75" : "text-on-surface-variant"}`}>{productCategory(name, fr)}</span></span>
                        {active && <span className="material-symbols-outlined notranslate text-xl">check</span>}
                      </button>
                    );
                  }) : <p className="px-4 py-10 text-center text-sm text-on-surface-variant">{t(`No products match “${productSearch}”.`, `Aucun produit ne correspond à « ${productSearch} ».`)}</p>}
                </div>
              </div>
            )}
          </div>
          <div className="order-quantity mt-5">
            <p className="font-bold" id="quantity-label">{t("Quantity", "Quantité")}</p>
            <div className="mt-2 inline-grid grid-cols-[52px_76px_52px] overflow-hidden rounded-2xl border border-outline-variant bg-white" aria-labelledby="quantity-label">
              <button aria-label={t("Decrease quantity", "Diminuer la quantité")} className="grid place-items-center text-2xl text-primary hover:bg-surface-container-low disabled:opacity-35" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} type="button">−</button>
              <input aria-label={t("Quantity", "Quantité")} className="h-14 w-full border-x border-outline-variant bg-white text-center text-lg font-extrabold text-ink-black outline-none" min="1" max="999" required type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
              <button aria-label={t("Increase quantity", "Augmenter la quantité")} className="grid place-items-center text-2xl text-primary hover:bg-surface-container-low" onClick={() => setQuantity((value) => Math.min(999, value + 1))} type="button">+</button>
            </div>
          </div>
          <button className="order-add-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-secondary/90" onClick={addToCart} type="button"><span className="material-symbols-outlined notranslate">add_shopping_cart</span>{t("Add this product", "Ajouter ce produit")}</button>
          <p className={`mt-3 flex min-h-6 items-center justify-center gap-2 text-center text-sm font-bold text-primary transition ${addedMessage ? "opacity-100" : "opacity-0"}`} aria-live="polite"><span className="material-symbols-outlined notranslate text-lg">check_circle</span>{addedMessage || t("Product added", "Produit ajouté")}</p>

          <div className="order-basket-inline mt-7 border-t border-outline-variant pt-6">
            <div className="flex items-end justify-between gap-4"><div><span className="mp-eyebrow text-secondary">{t("Your basket", "Votre panier")}</span><h3 className="mt-1 text-xl font-extrabold text-ink-black">{`${productCount(cart.length)} · ${unitCount(totalUnits)}`}</h3></div></div>
            {cart.length ? <div className="mt-4 space-y-3">{cart.map((item) => <div className="order-basket-item grid grid-cols-[58px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-outline-variant bg-white p-3" key={item.name}>
              <span className="relative h-12 overflow-hidden rounded-xl bg-white"><Image alt="" className="object-contain p-1" fill sizes="52px" src={item.image} /></span>
              <div className="min-w-0"><strong className="block text-sm leading-tight text-ink-black">{item.name}</strong><div className="mt-2 inline-flex items-center overflow-hidden rounded-full border border-outline-variant bg-white"><button aria-label={t(`Decrease ${item.name}`, `Diminuer ${item.name}`)} className="h-8 w-9 text-primary disabled:opacity-30" disabled={item.quantity <= 1} onClick={() => updateCartQuantity(item.name, item.quantity - 1)} type="button">−</button><span className="min-w-8 text-center text-sm font-extrabold">{item.quantity}</span><button aria-label={t(`Increase ${item.name}`, `Augmenter ${item.name}`)} className="h-8 w-9 text-primary" onClick={() => updateCartQuantity(item.name, item.quantity + 1)} type="button">+</button></div></div>
              <button aria-label={t(`Remove ${item.name}`, `Retirer ${item.name}`)} className="grid h-10 w-10 place-items-center rounded-full text-on-surface-variant hover:bg-white hover:text-secondary" onClick={() => removeFromCart(item.name)} type="button"><span className="material-symbols-outlined notranslate">delete</span></button>
            </div>)}</div> : <p className="mt-4 rounded-2xl bg-surface-container-low p-5 text-sm text-on-surface-variant">{t("Add at least one product to continue.", "Ajoutez au moins un produit pour continuer.")}</p>}
          </div>
          <button className="order-continue-inline mt-6 w-full rounded-full bg-primary px-7 py-4 font-extrabold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40" disabled={!cart.length} onClick={() => setStep(2)} type="button">{t(`Continue with ${productCount(cart.length)}`, `Continuer avec ${productCount(cart.length)}`)} <span aria-hidden>→</span></button>
        </div>}

        <div className={step < 2 ? "hidden" : ""}>
          {step === 2 && <><span className="mp-eyebrow text-secondary">{t("Step 2", "Étape 2")}</span><h2 className="mt-2 text-3xl font-extrabold text-ink-black">{t("Where should we deliver?", "Où devons-nous livrer ?")}</h2></>}
          <div className={step === 2 ? "mt-7 grid gap-5 sm:grid-cols-2" : "hidden"}>
            <label className="block font-bold">{t("Full name", "Nom complet")}<input className={inputClass} name="name" required autoComplete="name" /></label>
            <label className="block font-bold">{t("Phone number", "Numéro de téléphone")}<input className={inputClass} name="phone" required pattern="[+0-9 ()-]{10,20}" title={t("Enter a Kenyan mobile number, for example 0724968847 or +254724968847", "Saisissez un numéro mobile kényan, par exemple 0724968847 ou +254724968847")} autoComplete="tel" inputMode="tel" placeholder="07… or +254…" /></label>
            <label className="block font-bold">{t("County", "Comté / région")}<input className={inputClass} name="county" required placeholder={t("e.g. Nakuru", "ex. Nakuru")} /></label>
            <label className="block font-bold">{t("Town / area", "Ville / quartier")}<input className={inputClass} name="town" required placeholder={t("e.g. Njoro", "ex. Njoro")} /></label>
            <label className="block font-bold sm:col-span-2">{t("Delivery directions", "Indications de livraison")}<textarea className={inputClass} name="address" required rows={3} placeholder={t("Village, road, landmark or farm name", "Village, route, point de repère ou nom de la ferme")} /></label>
            <label className="block font-bold sm:col-span-2">{t("Order notes", "Notes de commande")} <span className="font-normal text-on-surface-variant">{t("(optional)", "(facultatif)")}</span><textarea className={inputClass} name="notes" rows={3} placeholder={t("Package mix, preferred delivery day or questions", "Formats souhaités, jour de livraison préféré ou questions")} /></label>
            <input id="coordinates" name="coordinates" type="hidden" />
            <input className="hidden" name="website" tabIndex={-1} autoComplete="off" />
            <div className="sm:col-span-2">
              <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-5 py-3 font-bold text-primary hover:bg-surface-container-low" onClick={useLocation} type="button"><span className="material-symbols-outlined notranslate">my_location</span>{t("Use my current location", "Utiliser ma position actuelle")}</button>
              <p className="mt-2 text-sm text-on-surface-variant" aria-live="polite">{locationStatus}</p>
            </div>
          </div>
          {step === 2 && <div className="mt-8 flex gap-3"><button className="rounded-full border border-outline-variant px-6 py-3.5 font-bold text-primary" onClick={() => setStep(1)} type="button">{t("Back", "Retour")}</button><button className="flex-1 rounded-full bg-primary px-6 py-3.5 font-bold text-white" onClick={(event) => { if (event.currentTarget.form?.reportValidity()) setStep(3); }} type="button">{t("Review order", "Vérifier la commande")}</button></div>}
        </div>

        {step === 3 && <div>
          <span className="mp-eyebrow text-secondary">{t("Step 3", "Étape 3")}</span>
          <div className="flex items-start justify-between gap-4"><div><h2 className="mt-2 text-3xl font-extrabold text-ink-black">{t("Double-check your order.", "Vérifiez votre commande.")}</h2><p className="mt-2 text-sm text-on-surface-variant">{t("Review products and quantities before sending the request.", "Contrôlez les produits et les quantités avant d’envoyer la demande.")}</p></div><button className="mt-2 shrink-0 rounded-full border border-outline-variant px-4 py-2 text-sm font-bold text-primary hover:bg-surface-container-low" onClick={() => setStep(1)} type="button">{t("Edit basket", "Modifier le panier")}</button></div>
          <div className="mt-7 rounded-2xl bg-surface-container-low p-5"><div className="space-y-3">{cart.map((item) => <div className="flex items-start justify-between gap-4 border-b border-outline-variant pb-3 last:border-0 last:pb-0" key={item.name}><p className="font-extrabold text-ink-black">{item.name}</p><strong className="shrink-0 text-primary">× {item.quantity}</strong></div>)}</div><p className="mt-4 border-t border-outline-variant pt-4 text-sm text-on-surface-variant">{t("MolaPlus will call to confirm the current price, available stock, delivery cost and payment instructions.", "MolaPlus vous appellera pour confirmer le prix, le stock disponible, les frais de livraison et les modalités de paiement.")}</p></div>
          <div className="mt-8 flex gap-3"><button className="rounded-full border border-outline-variant px-6 py-3.5 font-bold text-primary" onClick={() => setStep(2)} type="button">{t("Back", "Retour")}</button><button className="flex-1 rounded-full bg-secondary px-6 py-3.5 font-extrabold text-white disabled:opacity-60" disabled={pending} type="submit">{pending ? t("Sending order…", "Envoi de la commande…") : t("Place order", "Passer la commande")}</button></div>
          <p className="mt-4 text-center text-xs text-on-surface-variant">{t("By placing the order, you agree that MolaPlus may contact you about this request.", "En passant commande, vous acceptez que MolaPlus vous contacte au sujet de cette demande.")}</p>
        </div>}
      </form>

      <aside className={`order-checkout__summary overflow-hidden rounded-[1.75rem] border border-outline-variant bg-surface-container-lowest ${step === 1 ? "is-basket-step" : ""}`}>
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3"><div><span className="mp-eyebrow text-secondary">{t("Your order", "Votre commande")}</span><h3 className="mt-1 text-xl font-extrabold text-ink-black">{productCount(cart.length)}</h3></div><span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-white">{unitCount(totalUnits)}</span></div>
          {cart.length ? <div className="mt-5 space-y-3">{cart.map((item) => <div className="order-summary-item grid grid-cols-[52px_minmax(0,1fr)_36px] items-center gap-3 rounded-2xl border border-outline-variant p-3" key={item.name}>
            <span className="relative h-12 overflow-hidden rounded-lg bg-surface-container-low"><Image alt="" className="object-contain p-1" fill sizes="52px" src={item.image} /></span>
            <div className="min-w-0"><strong className="block text-sm leading-tight text-ink-black">{item.name}</strong>{step === 1 ? <div className="mt-2 inline-flex items-center overflow-hidden rounded-full border border-outline-variant"><button aria-label={t(`Decrease ${item.name}`, `Diminuer ${item.name}`)} className="h-7 w-8 text-primary disabled:opacity-30" disabled={item.quantity <= 1} onClick={() => updateCartQuantity(item.name, item.quantity - 1)} type="button">−</button><span className="min-w-7 text-center text-sm font-extrabold">{item.quantity}</span><button aria-label={t(`Increase ${item.name}`, `Augmenter ${item.name}`)} className="h-7 w-8 text-primary" onClick={() => updateCartQuantity(item.name, item.quantity + 1)} type="button">+</button></div> : <span className="mt-1 block text-sm font-extrabold text-primary">{`${t("Quantity", "Quantité")} ${item.quantity}`}</span>}</div>
            {step === 1 ? <button aria-label={t(`Remove ${item.name}`, `Retirer ${item.name}`)} className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-secondary" onClick={() => removeFromCart(item.name)} type="button"><span className="material-symbols-outlined notranslate text-xl">delete</span></button> : <span className="font-extrabold text-primary">×{item.quantity}</span>}
          </div>)}</div> : <p className="mt-5 rounded-2xl bg-surface-container-low p-5 text-sm text-on-surface-variant">{t("Choose a product and add it to your order.", "Choisissez un produit et ajoutez-le à votre commande.")}</p>}
          {step === 1 && <button className="mt-5 w-full rounded-full bg-primary px-6 py-4 font-extrabold text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40" disabled={!cart.length} onClick={() => setStep(2)} type="button">{t(`Continue with ${productCount(cart.length)}`, `Continuer avec ${productCount(cart.length)}`)} <span aria-hidden>→</span></button>}
          <p className="mt-5 border-t border-outline-variant pt-4 text-sm text-on-surface-variant"><span className="material-symbols-outlined notranslate mr-2 align-middle text-primary">sms</span>{t("MolaPlus receives one SMS with the complete order.", "MolaPlus reçoit un SMS avec la commande complète.")}</p>
        </div>
      </aside>
    </section>
  );
}
