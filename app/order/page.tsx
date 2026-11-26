import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { T } from "../_components/T";
import { OrderForm } from "./OrderForm";

export const metadata: Metadata = pageMetadata({
  title: "Order Feed Supplements & Fertilizers Online",
  description:
    "Order MolaPlus animal feed supplements, livestock feeds and crop fertilizers online. Choose products, share your delivery location and our team confirms stock, price and delivery by phone. Pay via M-Pesa Till 906520.",
  path: "/order",
  keywords: ["order animal feed online", "buy milk booster", "buy layer mash", "buy organic fertilizer"],
});

export default function OrderPage() {
  return (
    <main className="order-page min-h-screen bg-surface text-on-surface">
      <section className="order-page__intro mp-scene mp-grain overflow-hidden text-white">
        <div className="mx-auto grid max-w-container-max-width gap-5 px-margin-mobile py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:px-margin-desktop md:py-8">
          <div>
            <span className="mp-eyebrow text-primary-fixed-dim"><T en="Direct farm ordering" fr="Commande directe pour les éleveurs" /></span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] md:text-5xl"><T en="Place your order." fr="Passez votre commande." /></h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              <T en="Choose a product, share your delivery location, then review. We confirm stock, price and delivery by phone." fr="Choisissez un produit, indiquez votre lieu de livraison, puis vérifiez. Nous confirmons le stock, le prix et la livraison par téléphone." />
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-white/85" aria-label="Order assurances">
            <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined notranslate text-xl text-primary-fixed-dim">sms</span><T en="Instant SMS" fr="SMS instantané" /></span>
            <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined notranslate text-xl text-primary-fixed-dim">support_agent</span><T en="Human confirmation" fr="Confirmation par un conseiller" /></span>
          </div>
        </div>
      </section>
      <OrderForm />
    </main>
  );
}
