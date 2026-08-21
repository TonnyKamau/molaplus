import type { Metadata } from "next";
import { OrderForm } from "./OrderForm";

export const metadata: Metadata = {
  title: "Place an Order | MolaPlus Africa",
  description: "Order MolaPlus animal nutrition and crop products for delivery across Kenya.",
};

type OrderPageProps = {
  searchParams: Promise<{ product?: string | string[] }>;
};

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const params = await searchParams;
  const requestedProduct = typeof params.product === "string" ? params.product : undefined;

  return (
    <main className="order-page min-h-screen bg-surface text-on-surface">
      <section className="order-page__intro mp-scene mp-grain overflow-hidden text-white">
        <div className="mx-auto grid max-w-container-max-width gap-5 px-margin-mobile py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:px-margin-desktop md:py-8">
          <div>
            <span className="mp-eyebrow text-primary-fixed-dim">Direct farm ordering</span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-[-.045em] md:text-5xl">Place your order.</h1>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              Choose a product, share your delivery location, then review. We confirm stock, price and delivery by phone.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-white/85" aria-label="Order assurances">
            <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-xl text-primary-fixed-dim">sms</span>Instant SMS</span>
            <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-xl text-primary-fixed-dim">support_agent</span>Human confirmation</span>
          </div>
        </div>
      </section>
      <OrderForm requestedProduct={requestedProduct} />
    </main>
  );
}
