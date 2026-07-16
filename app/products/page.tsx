import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products | MolaPlus Africa",
  description:
    "Explore MolaPlus feed supplements and probiotics: Super Milk Booster, Poultry Microbes, and Pig Microbes in every package size.",
};

const milkBoosterSizes = [
  {
    name: "1KG Package",
    description: "Ideal for small-scale dairy farms and individual homesteads.",
    image: "/molaplus/milkbooster-1kg.png",
    badge: "Dairy",
  },
  {
    name: "2KG Package",
    description: "Perfect for medium-sized dairy operations seeking efficiency.",
    image: "/molaplus/milkbooster-2kg.png",
  },
  {
    name: "5KG Package",
    description: "Designed for large commercial dairy farms and bulk buyers.",
    image: "/molaplus/milkbooster-5kg.png",
  },
];

const poultrySizes = [
  {
    name: "500ml Solution",
    description: "For small poultry flocks",
    image: "/molaplus/poultry-500ml.png",
  },
  {
    name: "1 Litre Solution",
    description: "For medium-sized farms",
    image: "/molaplus/poultry-1ltr.png",
  },
  {
    name: "5 Litre Solution",
    description: "For large operations",
    image: "/molaplus/poultry-5ltr.png",
  },
];

const pigSizes = [
  {
    name: "1 Litre Solution",
    overlay: "1 Litre - Small Farms",
    image: "/molaplus/pig-1ltr.png",
  },
  {
    name: "5 Litre Solution",
    overlay: "5 Litre - Commercial",
    image: "/molaplus/pig-5ltr.png",
  },
  {
    name: "20 Litre Solution",
    overlay: "20 Litre - Large Scale",
    image: "/molaplus/pig-20ltr.png",
  },
];

export default function ProductsPage() {
  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-container-max-width items-center justify-between px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 transition-colors hover:bg-surface-container-high active:opacity-80 md:hidden">
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            <Link className="flex items-center gap-3" href="/">
              <img alt="MolaPlus Africa logo" className="h-10 w-10 rounded-full object-contain" src="/molaplus/logo.png" />
              <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-primary">
                MolaPlus Africa
              </h1>
            </Link>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/">
              Home
            </Link>
            <Link className="font-label-md text-label-md font-bold text-primary transition-colors" href="/products">
              Products
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/consultancy">
              Consultancy
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/resources">
              Resources
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/contact">
              Contact
            </Link>
          </nav>
          <Link
            className="hidden rounded-full bg-secondary px-6 py-2 font-label-md text-label-md font-bold text-on-secondary transition-opacity hover:opacity-90 md:inline-block"
            href="/product-comparison"
          >
            Compare Products
          </Link>
        </div>
      </header>

      <main className="pt-16">
        <section className="border-b border-outline-variant bg-surface-container-low py-stack-lg">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <h1 className="font-headline-xl text-headline-xl mb-4 text-ink-black">Our Products</h1>
            <p className="font-body-lg text-body-lg max-w-2xl text-on-surface-variant">
              Scientifically formulated feed supplements and probiotics for dairy, poultry, and swine — available in package sizes for every scale of operation.
            </p>
          </div>
        </section>

        <section className="bg-surface-container-low pb-stack-md">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-outline-variant bg-white p-4 md:flex-row">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-secondary-container p-3">
                  <span className="material-symbols-outlined text-on-secondary-container">payments</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-label-md uppercase tracking-wider text-secondary">
                    Buy Online &amp; Pay via MPESA
                  </h3>
                  <p className="font-bold text-ink-black">Till no: 906520</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-label-md text-on-surface-variant">Logistics &amp; Prices Call:</p>
                <a className="text-body-lg font-bold text-primary" href="tel:+254724968847">
                  +254 724 968 847
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-stack-lg" id="super-milk-booster">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-stack-md flex flex-col">
              <span className="font-label-md text-label-md font-bold uppercase tracking-widest text-secondary">Best Seller</span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Super Milk Booster</h2>
              <p className="max-w-2xl text-on-surface-variant">
                Advanced formula for enhanced milk production in dairy animals, ensuring optimal nutritional balance.
              </p>
            </div>
            <div className="flex gap-gutter overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible">
              {milkBoosterSizes.map((size) => (
                <div
                  className="group min-w-[280px] overflow-hidden rounded-xl border border-outline-variant bg-white transition-shadow hover:shadow-lg"
                  key={size.name}
                >
                  <div className="relative h-56 bg-surface-container">
                    <img
                      alt={`Super Milk Booster ${size.name}`}
                      className="h-full w-full object-contain p-4 transition-transform group-hover:scale-110"
                      src={size.image}
                    />
                    {size.badge && (
                      <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase text-white">
                        {size.badge}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h4 className="font-headline-md mb-1 text-primary">{size.name}</h4>
                    <p className="mb-4 font-label-md text-label-md text-on-surface-variant">{size.description}</p>
                    <Link
                      className="block w-full rounded-full border-2 border-primary py-2 text-center font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                      href="/products/super-milk-booster"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-stack-lg" id="poultry-microbes">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-stack-md flex flex-col">
              <span className="font-label-md text-label-md font-bold uppercase tracking-widest text-secondary">
                Growth &amp; Health
              </span>
              <h2 className="font-headline-lg text-headline-lg text-primary">Poultry Microbes</h2>
              <p className="max-w-2xl text-on-surface-variant">
                Specialized probiotic solution for optimal poultry health, weight gain, and disease resistance.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {poultrySizes.map((size) => (
                <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-white p-4" key={size.name}>
                  <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-surface-container p-2">
                    <img alt={`Poultry Microbes ${size.name}`} className="h-full w-full object-contain" src={size.image} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-headline-md text-body-lg text-ink-black">{size.name}</h4>
                    <p className="font-label-md text-label-md text-on-surface-variant">{size.description}</p>
                    <Link className="mt-2 inline-block font-label-md text-label-md font-bold text-primary" href="/contact">
                      Order Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-stack-lg" id="pig-microbes">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-stack-md flex flex-col text-center">
              <h2 className="font-headline-lg text-headline-lg text-primary">Pig Microbes</h2>
              <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-secondary" />
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {pigSizes.map((size) => (
                <div className="group cursor-pointer" key={size.name}>
                  <div className="relative mb-4 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container">
                    <img
                      alt={`Pig Microbes ${size.name}`}
                      className="aspect-square w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                      src={size.image}
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="font-bold text-white">{size.overlay}</span>
                    </div>
                  </div>
                  <h4 className="font-headline-md text-center text-primary">{size.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-stack-lg">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col items-center justify-between gap-6 rounded-xl bg-secondary-container p-8 text-on-secondary-container shadow-lg md:flex-row">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[32px]">analytics</span>
                <div>
                  <p className="font-bold">Not sure which product fits your farm?</p>
                  <p className="font-label-md text-label-md opacity-90">
                    Compare technical specs, probiotic counts, and ROI side by side.
                  </p>
                </div>
              </div>
              <Link
                className="rounded-lg bg-ink-black px-8 py-3 font-bold text-white transition-all hover:bg-opacity-80"
                href="/product-comparison"
              >
                Compare Products
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-highest py-stack-lg">
        <div className="mx-auto grid max-w-container-max-width grid-cols-1 items-center gap-6 px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
          <div>
            <div className="font-headline-md text-headline-md mb-2 text-primary">MolaPlus Africa</div>
            <p className="font-body-md text-on-surface">© 2026 MolaPlus Africa. Scientific Nutrition for Growth.</p>
          </div>
          <div className="flex flex-wrap gap-x-gutter gap-y-stack-sm md:justify-end">
            <Link className="font-label-md text-on-surface-variant underline hover:text-primary" href="/resources">
              Lab Results
            </Link>
            <Link className="font-label-md text-on-surface-variant underline hover:text-primary" href="/outlets">
              Find an Outlet
            </Link>
            <Link className="font-label-md text-on-surface-variant underline hover:text-primary" href="/contact">
              Technical Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
