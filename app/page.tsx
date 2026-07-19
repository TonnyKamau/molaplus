import Image from "next/image";
import Link from "next/link";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAwRvcWiP9YQFEBPyxVFkGP4uzsHdrUbBoftg7o3sEKB610PJGuEuz4sFdqMhecXUAoORpmcSX1DPFv1XUdouj9U8WRBxYElMdET6ZjR1aDUcW5sHklOSt2VWNBn9Y5Q6-csKZte1cQSTJ6gintVVj8oDszi5uDZuBcutpvXG2UBEfYd899fNSA_qvHRuBlEs2kwf11M23Be146oIAJNITK7igMd3IivsOrgE0oflDjSG03lHMdDptInrLdDgwiKe0Evcw3BKc3SDrf";

const labImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1OetczkU1LmtrYlrGhwKnWW8elzKIvGOUFnNn47SmDRofKEZE2hXnUDef8bEICEXp9staFnjrMFplOGt_WRF5tnHNZBaxc-iaOWBVYhSz3rXI0XFsCQJrm5cU6hCNBULH2VIWPjUq6xnVEL8w1oHoZdDVsTJz_O-TV3VOGgw4bMFlstxKHWIqXx9b1gw8Qx7Sah-ECUMhQwEzUP9040euvAHj3jfJ3SGaPyLLoxS9KhhZ3YJVpckcJyV5BAkrwcZ1o_8w-X4qSAA1";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-container-max-width items-center justify-between px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 transition-colors hover:bg-surface-container-high active:opacity-80 md:hidden">
              <span className="material-symbols-outlined text-primary">menu</span>
            </button>
            <Link className="flex items-center gap-3" href="/">
              <Image alt="MolaPlus Africa logo" className="h-10 w-10 rounded-full object-contain" height={40} src="/molaplus/logo.png" width={40} />
              <h1 className="font-headline-md text-headline-md font-extrabold tracking-tight text-primary">
                MolaPlus Africa
              </h1>
            </Link>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link className="font-label-md text-label-md font-bold text-primary transition-colors" href="/">
              Home
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/products">
              Products
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/consultancy">
              Consultancy
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/contact">
              Contact
            </Link>
          </nav>
          <Link className="hidden rounded-full bg-primary px-5 py-2 font-label-md text-sm font-bold text-white transition-colors hover:bg-primary-container md:inline-flex" href="/distributors">
            Find Distributors
          </Link>
        </div>
      </header>

      <main className="pt-16">
        <section className="relative flex h-[85vh] items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-ink-black/80 via-ink-black/40 to-transparent" />
            <Image
              alt="A lush green modern dairy farm with healthy cows grazing"
              className="h-full w-full object-cover"
              fill
              priority
              sizes="100vw"
              src={heroImage}
            />
          </div>
          <div className="relative z-20 mx-auto w-full max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="max-w-2xl text-white">
              <span className="font-label-md mb-6 inline-block rounded-full bg-secondary-container px-4 py-1.5 text-sm uppercase tracking-wider text-white">
                AgriTech Innovation
              </span>
              <h2 className="font-headline-xl text-headline-xl mb-6 leading-[1.1]">
                Advanced Animal <br />
                <span className="text-growth-green">Nutrition Solutions</span>
              </h2>
              <p className="font-body-lg text-body-lg mb-10 max-w-lg text-surface-container opacity-90">
                Empowering farmers with innovative feed supplements and probiotics for sustainable livestock growth and improved yields.
              </p>
              <div className="flex flex-wrap gap-4">
                <a className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-container" href="#products">
                  Discover Our Products
                  <span className="material-symbols-outlined">chevron_right</span>
                </a>
                <a className="glass-effect rounded-xl border-2 border-white/30 px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-primary" href="#services">
                  Our Services
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-outline-variant/30 bg-surface-container-low py-12">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <p className="mb-8 text-center font-label-md text-xs uppercase tracking-[0.2em] text-on-surface-variant">
              As featured and trusted by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 md:gap-24">
              <span className="font-headline-md font-extrabold text-on-surface-variant">African Farming</span>
              <span className="font-headline-md font-extrabold text-on-surface-variant">Farmbiz</span>
              <span className="font-headline-md font-extrabold text-on-surface-variant">Business Daily</span>
              <span className="font-headline-md font-extrabold text-on-surface-variant">KNA</span>
            </div>
          </div>
        </section>

        <section className="bg-surface-bright py-stack-lg" id="products">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <h2 className="font-headline-lg text-headline-lg mb-4 text-primary">Optimized Feed Supplements</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Scientifically formulated additives designed to maximize health, productivity, and profitability across different livestock sectors.
                </p>
              </div>
              <Link className="flex items-center gap-1 font-bold text-primary underline-offset-4 hover:underline" href="/products">
                View Product Catalog <span className="material-symbols-outlined">arrow_outward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
              <div className="group relative overflow-hidden rounded-xl border border-outline-variant bg-white p-6 transition-all hover:border-primary/20 hover:shadow-xl md:col-span-7">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  <div className="relative aspect-[1.5] w-full overflow-hidden rounded-lg border border-surface-container md:w-1/2">
                    <Image alt="Super Milk Booster" className="object-contain transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 768px) 320px, 100vw" src="/molaplus/milkbooster-2kg.png" />
                  </div>
                  <div className="w-full md:w-1/2">
                    <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase text-primary">Best Seller</span>
                    <h3 className="font-headline-md text-headline-md mb-3 text-ink-black">Super Milk Booster</h3>
                    <p className="font-body-md text-body-md mb-6 text-on-surface-variant">
                      Enhance milk production and quality in dairy cows with our signature mineral and probiotic blend.
                    </p>
                    <Link className="inline-flex items-center gap-2 font-bold text-secondary transition-all hover:gap-3" href="/products/super-milk-booster">
                      View Products <span className="material-symbols-outlined">trending_flat</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="group relative flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-white p-6 transition-all hover:border-primary/20 hover:shadow-xl md:col-span-5">
                <div className="relative mb-6 aspect-[1.5] w-full overflow-hidden rounded-lg border border-surface-container">
                  <Image alt="Poultry Microbes" className="object-contain transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 768px) 420px, 100vw" src="/molaplus/poultry-5ltr.png" />
                </div>
                <h3 className="font-headline-md text-headline-md mb-2 text-ink-black">Poultry Microbes</h3>
                <p className="font-body-md text-body-md mb-6 flex-grow text-on-surface-variant">
                  Improve intestinal health and feed conversion rates in broilers and layers naturally.
                </p>
                <Link className="inline-flex items-center gap-2 font-bold text-secondary transition-all hover:gap-3" href="/products#poultry-microbes">
                  View Products <span className="material-symbols-outlined">trending_flat</span>
                </Link>
              </div>

              <div className="group relative overflow-hidden rounded-xl border border-outline-variant bg-white p-8 transition-all hover:border-primary/20 hover:shadow-xl md:col-span-12">
                <div className="flex flex-col items-center gap-12 md:flex-row">
                  <div className="order-2 flex-1 md:order-1">
                    <h3 className="font-headline-md text-headline-md mb-4 text-ink-black">Livestock Microbes</h3>
                    <p className="font-body-lg text-body-lg mb-8 text-on-surface-variant">
                      A multi-species probiotic solution for pigs, goats, and beef cattle. Improves digestion, reduces odors, and boosts immune response without antibiotic reliance.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <span className="rounded-lg bg-surface-container-high px-4 py-2 font-label-md text-xs">PIGS</span>
                      <span className="rounded-lg bg-surface-container-high px-4 py-2 font-label-md text-xs">GOATS</span>
                      <span className="rounded-lg bg-surface-container-high px-4 py-2 font-label-md text-xs">SHEEP</span>
                      <span className="rounded-lg bg-surface-container-high px-4 py-2 font-label-md text-xs">BEEF</span>
                    </div>
                    <Link className="mt-10 inline-flex items-center gap-2 font-bold text-secondary transition-all hover:gap-3" href="/products#pig-microbes">
                      View Products <span className="material-symbols-outlined">trending_flat</span>
                    </Link>
                  </div>
                  <div className="relative order-1 aspect-[1.5] w-full overflow-hidden rounded-lg border border-surface-container md:order-2 md:w-2/5">
                    <Image alt="Livestock Microbes" className="object-contain transition-transform duration-500 group-hover:scale-105" fill sizes="(min-width: 768px) 420px, 100vw" src="/molaplus/pig-20ltr.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface py-stack-lg" id="services">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-16 text-center">
              <h2 className="font-headline-lg text-headline-lg mb-4 text-primary">Value-Added Expert Services</h2>
              <p className="font-body-lg text-body-lg mx-auto max-w-2xl text-on-surface-variant">
                Beyond products, we provide the technical knowledge needed to scale your agricultural operations sustainably.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <div className="group text-center">
                <div className="relative mx-auto mb-6 h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-primary/5 transition-all duration-300 group-hover:ring-primary/20">
                  <Image alt="Expert Consultancy" className="object-cover" fill sizes="96px" src="/molaplus/service-cows.png" />
                </div>
                <h3 className="font-headline-md text-headline-md mb-3 text-primary">Expert Consultancy</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Customized feed formulation and farm management strategies from seasoned veterinarians and nutritionists.
                </p>
              </div>
              <div className="group text-center">
                <div className="relative mx-auto mb-6 h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-primary/5 transition-all duration-300 group-hover:ring-primary/20">
                  <Image alt="Training Programs" className="object-cover" fill sizes="96px" src="/molaplus/service-poultry.png" />
                </div>
                <h3 className="font-headline-md text-headline-md mb-3 text-primary">Training Programs</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Practical workshops and digital courses for modern farming techniques and biological additive application.
                </p>
              </div>
              <div className="group text-center">
                <div className="relative mx-auto mb-6 h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-primary/5 transition-all duration-300 group-hover:ring-primary/20">
                  <Image alt="Technical Support" className="object-cover" fill sizes="96px" src="/molaplus/service-pigs.png" />
                </div>
                <h3 className="font-headline-md text-headline-md mb-3 text-primary">Technical Support</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Round-the-clock assistance for distributors and large-scale commercial farmers regarding product efficacy.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-stack-lg" id="values">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 gap-gutter text-center md:grid-cols-3">
              <div className="p-8">
                <span className="material-symbols-outlined mb-4 text-5xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  workspace_premium
                </span>
                <h3 className="font-headline-md mb-2 text-primary">Quality</h3>
                <p className="text-on-surface-variant">
                  Premium nutrition solutions backed by rigorous laboratory research and testing.
                </p>
              </div>
              <div className="p-8">
                <span className="material-symbols-outlined mb-4 text-5xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  biotech
                </span>
                <h3 className="font-headline-md mb-2 text-primary">Innovation</h3>
                <p className="text-on-surface-variant">
                  Cutting-edge formulations developed to solve specific East African agricultural challenges.
                </p>
              </div>
              <div className="p-8">
                <span className="material-symbols-outlined mb-4 text-5xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  handshake
                </span>
                <h3 className="font-headline-md mb-2 text-primary">Reliability</h3>
                <p className="text-on-surface-variant">
                  Consistent performance you can trust, season after season, for your livestock&apos;s health.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-highest/30 py-stack-lg" id="research">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div>
                <h2 className="font-headline-lg text-headline-lg mb-6 text-ink-black">Scientific Resources &amp; Research</h2>
                <p className="font-body-lg text-body-lg mb-10 text-on-surface-variant">
                  We believe in evidence-based nutrition. Access our laboratory trials, white papers, and performance data to understand the MolaPlus difference.
                </p>
                <div className="space-y-4">
                  {[
                    ["description", "Probiotic Efficacy Report 2023", "PDF - 4.2 MB", "download", "/resources"],
                    ["science", "Dairy Performance Analysis", "External Link - Scientific Journal", "open_in_new", "https://www.sciencedirect.com/science/article/pii/S2405654518300726"],
                    ["analytics", "Feed Conversion Ratio Calculator", "Web Tool - Interactive", "arrow_forward", "/product-comparison"],
                  ].map(([icon, title, meta, action, href]) => (
                    <a
                      className="group flex items-center justify-between rounded-xl border border-outline-variant bg-white p-4 transition-all hover:border-primary hover:shadow-md"
                      href={href}
                      key={title}
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                        <div>
                          <p className="font-bold text-ink-black">{title}</p>
                          <p className="text-sm text-on-surface-variant">{meta}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">{action}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-primary-container">
                  <Image alt="Scientist examining a feed sample in a laboratory" className="object-cover opacity-60 mix-blend-overlay" fill sizes="(min-width: 1024px) 50vw, 100vw" src={labImage} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-xs rounded-2xl border border-white bg-white/90 p-8 text-center shadow-2xl backdrop-blur-md">
                      <div className="font-headline-xl mb-2 text-5xl text-primary">15+</div>
                      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-ink-black">Years of Research</p>
                      <p className="text-sm text-on-surface-variant">
                        Pioneering probiotic feed additives across the East African region since 2009.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-stack-lg" id="contact">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-center text-white md:p-16">
              <div className="absolute right-0 top-0 -mr-32 -mt-32 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-growth-green/20 blur-3xl" />
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="font-headline-lg text-headline-xl mb-6">Ready to Boost Your Farm&apos;s Productivity?</h2>
                <p className="font-body-lg text-body-lg mb-12 text-white/80">
                  Order directly online or contact our sales department for bulk orders and distributor pricing.
                </p>
                <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                    <p className="font-label-md mb-2 text-xs uppercase tracking-widest text-white/60">Lipa Na M-Pesa</p>
                    <p className="font-headline-md text-secondary-fixed">Till No: 906520</p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                    <p className="font-label-md mb-2 text-xs uppercase tracking-widest text-white/60">Direct Support</p>
                    <p className="font-headline-md text-white">+254 724 968 847</p>
                  </div>
                </div>
                <a className="inline-flex items-center gap-3 rounded-2xl bg-secondary px-12 py-5 text-lg font-bold text-white shadow-xl transition-all hover:bg-secondary-container" href="tel:+254724968847">
                  Buy MolaPlus Products Online
                  <span className="material-symbols-outlined">shopping_cart</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant bg-surface-container-highest pb-stack-md pt-stack-lg">
        <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
          <div className="mb-16 flex flex-col items-start justify-between gap-12 text-left md:flex-row">
            <div className="max-w-xs">
              <h2 className="font-headline-md text-headline-md mb-6 font-bold text-primary">MolaPlus Africa</h2>
              <p className="font-body-md mb-6 text-on-surface-variant">
                Leaders in modern animal nutrition, biotech solutions, and sustainable farming practices across the continent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 md:grid-cols-3">
              <FooterColumn
                title="Products"
                items={[
                  ["All Products", "/products"],
                  ["Milk Booster", "/products/super-milk-booster"],
                  ["Compare Products", "/product-comparison"],
                ]}
              />
              <FooterColumn
                title="Company"
                items={[
                  ["About Us", "/about-us"],
                  ["Resources", "/resources"],
                  ["Distributors", "/distributors"],
                  ["Contact", "/contact"],
                ]}
              />
              <FooterColumn
                title="Legal"
                items={[
                  ["Privacy Policy", "/privacy"],
                  ["Terms of Service", "/terms"],
                ]}
                className="hidden md:block"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 md:flex-row">
            <p className="font-label-md text-label-md text-on-surface-variant">© 2026 MolaPlus Africa. Advanced Animal Nutrition.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  items,
  className = "",
}: {
  title: string;
  items: [string, string][];
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className="mb-6 font-bold text-ink-black">{title}</h4>
      <ul className="space-y-4 font-label-md text-on-surface-variant">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link className="transition-colors hover:text-primary" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
