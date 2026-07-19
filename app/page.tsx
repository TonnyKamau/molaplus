import Image from "next/image";
import Link from "next/link";
import { FadeIn, MotionDiv, Stagger, StaggerItem } from "./_components/MotionPrimitives";
import { SiteFooter, SiteHeader } from "./_components/SiteChrome";

const proof = [
  ["15+", "years of applied nutrition research"],
  ["500+", "commercial farms and distributors served"],
  ["906520", "M-Pesa till for direct product orders"],
] as const;

const products = [
  {
    title: "Super Milk Booster",
    copy: "Mineral and probiotic support for higher dairy yield, stronger recovery, and consistent herd performance.",
    image: "/molaplus/milkbooster-2kg.png",
    href: "/products/super-milk-booster",
  },
  {
    title: "Poultry Microbes",
    copy: "Gut-health support for better feed conversion, stronger flocks, and cleaner poultry production.",
    image: "/molaplus/poultry-5ltr.png",
    href: "/products#poultry-microbes",
  },
  {
    title: "Livestock Microbes",
    copy: "Multi-species microbial support for pigs, goats, sheep, and beef operations at commercial scale.",
    image: "/molaplus/pig-20ltr.png",
    href: "/products#pig-microbes",
  },
] as const;

const values = [
  ["biotech", "Science First", "Formulations guided by field data, microbial nutrition, and practical farm results."],
  ["verified", "Premium Quality", "Clean packaging, stable dosing, and consistent support for repeatable productivity."],
  ["support_agent", "Expert Guidance", "Technical advice for distributors, commercial farms, and ambitious smallholders."],
] as const;

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f8fbf4] text-on-surface">
      <SiteHeader active="/" />

      <main>
        <section className="relative min-h-[92svh] overflow-hidden bg-[#07130c] pt-24 text-white md:pt-28">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,19,12,0.98)_0%,rgba(7,19,12,0.84)_42%,rgba(7,19,12,0.18)_100%)]" />
            <Image
              alt="Premium dairy farm landscape"
              className="h-full w-full object-cover opacity-62"
              fill
              priority
              sizes="100vw"
              src="/molaplus/service-cows.png"
            />
          </div>
          <div className="relative mx-auto grid min-h-[calc(92svh-6rem)] max-w-container-max-width grid-cols-1 items-center gap-10 px-margin-mobile pb-10 md:grid-cols-[1.02fr_0.98fr] md:px-margin-desktop">
            <FadeIn>
              <span className="mb-5 inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-fixed backdrop-blur">
                Advanced Animal Nutrition
              </span>
              <h1 className="max-w-3xl text-[2.75rem] font-extrabold leading-[1.02] tracking-normal text-white md:text-[5.8rem]">
                Premium nutrition for productive farms.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/72">
                MolaPlus Africa combines probiotics, mineral science, and field support to help dairy, poultry, and livestock operations grow with confidence.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="inline-flex items-center justify-center rounded-full bg-primary-fixed px-7 py-4 font-bold text-primary shadow-xl shadow-primary-fixed/10 transition-transform hover:-translate-y-0.5" href="/products">
                  Explore Products
                </Link>
                <Link className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition-colors hover:bg-white/15" href="/contact">
                  Talk to an Expert
                </Link>
              </div>
            </FadeIn>

            <FadeIn delay={0.12} className="relative">
              <MotionDiv
                animate={{ y: [0, -12, 0] }}
                className="mx-auto max-w-[26rem] rounded-[2rem] border border-white/12 bg-white/[0.08] p-5 shadow-[0_32px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
              >
                <div className="rounded-[1.5rem] bg-[#f8fbf4] p-6 text-primary">
                  <div className="relative mx-auto aspect-square max-w-[18rem]">
                    <Image alt="Super Milk Booster product pack" className="object-contain drop-shadow-2xl" fill priority sizes="320px" src="/molaplus/milkbooster-2kg.png" />
                  </div>
                  <div className="mt-5 rounded-2xl border border-primary/10 bg-white p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Best Seller</p>
                    <h2 className="mt-1 text-2xl font-extrabold">Super Milk Booster</h2>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      Dairy support for yield, fertility, and recovery.
                    </p>
                  </div>
                </div>
              </MotionDiv>
            </FadeIn>
          </div>
        </section>

        <section className="border-b border-outline-variant/50 bg-white py-7">
          <Stagger className="mx-auto grid max-w-container-max-width grid-cols-1 gap-4 px-margin-mobile md:grid-cols-3 md:px-margin-desktop">
            {proof.map(([stat, label]) => (
              <StaggerItem className="rounded-2xl border border-outline-variant/70 bg-[#fbfdf8] p-5" key={stat}>
                <p className="text-3xl font-extrabold text-primary">{stat}</p>
                <p className="mt-1 text-sm font-semibold text-on-surface-variant">{label}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <FadeIn className="mb-12 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary">Product Suite</p>
              <h2 className="text-4xl font-extrabold leading-tight text-ink-black md:text-5xl">
                Built for the animals that drive your farm economics.
              </h2>
            </FadeIn>
            <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {products.map((product) => (
                <StaggerItem className="group overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm transition-shadow hover:shadow-2xl" key={product.title}>
                  <Link href={product.href}>
                    <div className="relative h-64 bg-surface-container-low">
                      <Image alt={product.title} className="object-contain p-8 transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 768px) 33vw, 100vw" src={product.image} />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-extrabold text-primary">{product.title}</h3>
                      <p className="mt-3 min-h-24 text-sm leading-6 text-on-surface-variant">{product.copy}</p>
                      <span className="mt-5 inline-flex items-center font-bold text-secondary">
                        View product
                        <span className="material-symbols-outlined ml-1 text-lg">arrow_forward</span>
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="bg-[#0b1b11] py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-container-max-width grid-cols-1 gap-10 px-margin-mobile md:grid-cols-[0.9fr_1.1fr] md:items-center md:px-margin-desktop">
            <FadeIn>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed">Why MolaPlus</p>
              <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
                Elegant science, practical farm outcomes.
              </h2>
              <p className="mt-5 text-lg leading-8 text-white/68">
                The site now mirrors the product promise: clear, premium, responsive, and confident on small screens.
              </p>
            </FadeIn>
            <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {values.map(([icon, title, copy]) => (
                <StaggerItem className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur" key={title}>
                  <span className="material-symbols-outlined text-4xl text-primary-fixed">{icon}</span>
                  <h3 className="mt-5 text-xl font-extrabold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/65">{copy}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <FadeIn className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="overflow-hidden rounded-[2rem] bg-primary p-7 text-white shadow-2xl shadow-primary/20 md:p-12">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-fixed">Direct Support</p>
                  <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">Ready to improve feed performance?</h2>
                  <p className="mt-4 max-w-2xl text-white/72">
                    Call the MolaPlus team for logistics, bulk pricing, and expert livestock nutrition support.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <a className="rounded-full bg-white px-7 py-4 text-center font-extrabold text-primary" href="tel:+254724968847">
                    +254 724 968 847
                  </a>
                  <Link className="rounded-full bg-secondary px-7 py-4 text-center font-extrabold text-white" href="/distributors">
                    Find Distributors
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
