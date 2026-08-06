import Image from "next/image";
import Link from "next/link";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAwRvcWiP9YQFEBPyxVFkGP4uzsHdrUbBoftg7o3sEKB610PJGuEuz4sFdqMhecXUAoORpmcSX1DPFv1XUdouj9U8WRBxYElMdET6ZjR1aDUcW5sHklOSt2VWNBn9Y5Q6-csKZte1cQSTJ6gintVVj8oDszi5uDZuBcutpvXG2UBEfYd899fNSA_qvHRuBlEs2kwf11M23Be146oIAJNITK7igMd3IivsOrgE0oflDjSG03lHMdDptInrLdDgwiKe0Evcw3BKc3SDrf";

const labImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD1OetczkU1LmtrYlrGhwKnWW8elzKIvGOUFnNn47SmDRofKEZE2hXnUDef8bEICEXp9staFnjrMFplOGt_WRF5tnHNZBaxc-iaOWBVYhSz3rXI0XFsCQJrm5cU6hCNBULH2VIWPjUq6xnVEL8w1oHoZdDVsTJz_O-TV3VOGgw4bMFlstxKHWIqXx9b1gw8Qx7Sah-ECUMhQwEzUP9040euvAHj3jfJ3SGaPyLLoxS9KhhZ3YJVpckcJyV5BAkrwcZ1o_8w-X4qSAA1";

const marqueeItems = [
  "Healthier herds",
  "Higher milk yields",
  "Stronger poultry",
  "Better digestion",
  "Naturally",
];

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      <main>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="mp-scene mp-grain relative isolate flex min-h-[86svh] items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              alt="A lush green modern dairy farm with healthy cows grazing"
              className="h-full w-full object-cover opacity-40"
              fill
              priority
              sizes="100vw"
              src={heroImage}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-black/85 via-ink-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#013a20] via-transparent to-transparent" />
          </div>

          <div className="relative z-20 mx-auto w-full max-w-container-max-width px-margin-mobile pb-10 pt-20 md:pb-14 md:px-margin-desktop">
            <div className="max-w-3xl text-white">
              <span className="mp-eyebrow inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-white/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-growth-green" />
                AgriTech Innovation &middot; East Africa
              </span>
              <h1 className="mp-display mt-5 md:mt-7">
                Nutrition that works
                <br />
                <span className="text-primary-fixed-dim">with nature.</span>
              </h1>
              <p className="text-pretty mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg md:mt-6 md:text-xl">
                Probiotics, microbes and mineral feed supplements that help East
                African farmers raise healthier livestock and harvest better
                yields &mdash; season after season.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-8 md:gap-4">
                <Link
                  className="group inline-flex items-center gap-2 rounded-full bg-secondary-container px-8 py-4 font-bold text-white shadow-xl shadow-black/20 transition-all hover:bg-secondary"
                  href="/products"
                >
                  Explore Products
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  className="glass-effect inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 font-bold text-white transition-all hover:bg-white hover:text-primary"
                  href="/distributors"
                >
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                  Find Distributors
                </Link>
              </div>

              {/* Trust strip - all facts verifiable from real site + data */}
              <dl className="mt-7 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/15 pt-5 sm:gap-6 md:mt-8 md:pt-6">
                {[
                  ["3,800+", "Stockists nationwide"],
                  ["Lipa na M-Pesa", "Till No. 906520"],
                  ["+254 724 968 847", "Talk to our team"],
                ].map(([big, small]) => (
                  <div key={small}>
                    <dt className="text-sm font-extrabold text-white sm:text-lg md:text-xl">{big}</dt>
                    <dd className="mt-1 text-[11px] leading-tight text-white/70 sm:text-sm">{small}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Brand statement marquee */}
        <section aria-hidden className="overflow-hidden bg-primary py-5 text-white">
          <div className="mp-marquee-track">
            {[0, 1].map((dup) => (
              <div className="flex items-center" key={dup}>
                {marqueeItems.map((item) => (
                  <span className="flex items-center" key={item}>
                    <span className="px-8 text-2xl font-extrabold tracking-tight md:text-3xl">
                      {item}
                    </span>
                    <span className="material-symbols-outlined text-secondary-fixed-dim">
                      grass
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* --------------------------------------------------------- Products */}
        <section className="bg-surface py-20 md:py-28" id="products">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div
              className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end"
              data-reveal
            >
              <div className="max-w-2xl">
                <span className="mp-eyebrow text-secondary">The Range</span>
                <h2 className="mp-display-sm mt-4 text-ink-black">
                  Feed supplements, engineered for the tropics
                </h2>
              </div>
              <Link
                className="group inline-flex items-center gap-1 whitespace-nowrap font-bold text-primary underline-offset-4 hover:underline"
                href="/products"
              >
                View full catalog
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_outward
                </span>
              </Link>
            </div>

            <div
              className="grid grid-cols-1 gap-gutter md:grid-cols-12"
              data-reveal
              data-reveal-stagger
            >
              {/* Feature card - Super Milk Booster on a green pedestal scene */}
              <Link
                className="mp-hover-lift group relative flex flex-col justify-between overflow-hidden rounded-3xl md:col-span-7"
                href="/products/super-milk-booster"
              >
                <div className="mp-scene mp-grain absolute inset-0" />
                <div className="relative z-10 flex h-full flex-col p-8 md:p-10">
                  <div className="flex items-center justify-between">
                    <span className="mp-eyebrow rounded-full bg-secondary-container px-3 py-1.5 text-white">
                      Best Seller
                    </span>
                    <span className="material-symbols-outlined text-white/70 transition-transform group-hover:translate-x-1">
                      arrow_outward
                    </span>
                  </div>
                  <div className="relative my-6 h-52 w-full md:h-64">
                    <Image
                      alt="Super Milk Booster"
                      className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(min-width: 768px) 480px, 100vw"
                      src="/molaplus/milkbooster-2kg.png"
                    />
                  </div>
                  <div className="text-white">
                    <p className="mp-eyebrow text-primary-fixed-dim">Dairy</p>
                    <h3 className="mt-2 text-3xl font-extrabold tracking-tight">
                      Super Milk Booster
                    </h3>
                    <p className="mt-3 max-w-md text-white/80">
                      Our signature mineral and probiotic blend for more milk,
                      better body condition and healthier dairy cows. Available
                      in 1kg, 2kg and 5kg.
                    </p>
                  </div>
                </div>
              </Link>

              {/* Poultry */}
              <Link
                className="mp-hover-lift group relative flex flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-low p-8 md:col-span-5"
                href="/products#poultry-microbes"
              >
                <div className="relative mb-6 h-52 w-full">
                  <Image
                    alt="Poultry Microbes"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(min-width: 768px) 420px, 100vw"
                    src="/molaplus/poultry-5ltr.png"
                  />
                </div>
                <div className="mt-auto">
                  <p className="mp-eyebrow text-secondary">Poultry</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-black">
                    Poultry Microbes
                  </h3>
                  <p className="mt-3 text-on-surface-variant">
                    Improve gut health and feed conversion in broilers and
                    layers, the natural way. 500ml, 1L &amp; 5L.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-primary transition-all group-hover:gap-3">
                    View products
                    <span className="material-symbols-outlined">trending_flat</span>
                  </span>
                </div>
              </Link>

              {/* Livestock - full width */}
              <Link
                className="mp-hover-lift group relative overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-low p-8 md:col-span-12 md:p-10"
                href="/products#pig-microbes"
              >
                <div className="flex flex-col items-center gap-10 md:flex-row">
                  <div className="order-2 flex-1 md:order-1">
                    <p className="mp-eyebrow text-secondary">Pigs &middot; Goats &middot; Cattle</p>
                    <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-black md:text-3xl">
                      Livestock Microbes
                    </h3>
                    <p className="mt-3 max-w-2xl text-on-surface-variant">
                      A multi-species probiotic for pigs, goats, sheep and beef
                      cattle. Improves digestion, cuts odour and supports immune
                      response &mdash; without relying on antibiotics. 1L, 5L &amp; 20L.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {["PIGS", "GOATS", "SHEEP", "BEEF"].map((tag) => (
                        <span
                          className="rounded-full border border-outline-variant bg-white px-4 py-1.5 text-xs font-bold tracking-wide text-on-surface-variant"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-7 inline-flex items-center gap-2 font-bold text-primary transition-all group-hover:gap-3">
                      View products
                      <span className="material-symbols-outlined">trending_flat</span>
                    </span>
                  </div>
                  <div className="relative order-1 h-52 w-full md:order-2 md:h-64 md:w-2/5">
                    <Image
                      alt="Livestock Microbes"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(min-width: 768px) 420px, 100vw"
                      src="/molaplus/pig-20ltr.png"
                    />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- How it works */}
        <section className="bg-surface-container-low py-20 md:py-28" id="how-it-works">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-14 max-w-2xl" data-reveal>
              <span className="mp-eyebrow text-secondary">How it works</span>
              <h2 className="mp-display-sm mt-4 text-ink-black">
                Living microbes, working from the inside out
              </h2>
            </div>
            <div
              className="grid grid-cols-1 gap-gutter md:grid-cols-3"
              data-reveal
              data-reveal-stagger
            >
              {[
                [
                  "01",
                  "science",
                  "Beneficial microbes",
                  "Live probiotics and minerals are added to everyday feed and water - no change to your routine.",
                ],
                [
                  "02",
                  "eco",
                  "A healthier gut",
                  "They balance gut flora, improving digestion and how efficiently animals convert feed.",
                ],
                [
                  "03",
                  "trending_up",
                  "Better output",
                  "The result: more milk, stronger poultry and steadier weight gain across your herd.",
                ],
              ].map(([num, icon, title, body]) => (
                <div
                  className="relative rounded-3xl border border-outline-variant bg-white p-8"
                  key={num}
                >
                  <span className="absolute right-6 top-6 text-5xl font-extrabold text-surface-container-highest">
                    {num}
                  </span>
                  <span
                    className="material-symbols-outlined text-4xl text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold tracking-tight text-ink-black">
                    {title}
                  </h3>
                  <p className="mt-3 text-on-surface-variant">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Services */}
        <section className="bg-surface py-20 md:py-28" id="services">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mb-14 text-center" data-reveal>
              <span className="mp-eyebrow text-secondary">Beyond the bottle</span>
              <h2 className="mp-display-sm mx-auto mt-4 max-w-3xl text-ink-black">
                Expertise that grows with your farm
              </h2>
            </div>
            <div
              className="grid grid-cols-1 gap-gutter md:grid-cols-3"
              data-reveal
              data-reveal-stagger
            >
              {[
                [
                  "/molaplus/service-cows.png",
                  "Expert Consultancy",
                  "Tailored feed formulation and farm-management strategies for your specific livestock and goals.",
                  "/consultancy",
                ],
                [
                  "/molaplus/service-poultry.png",
                  "Training Programs",
                  "Practical workshops and guides on modern farming techniques and applying biological additives.",
                  "/resources",
                ],
                [
                  "/molaplus/service-pigs.png",
                  "Technical Support",
                  "Ongoing assistance for farmers and distributors to get the most from every MolaPlus product.",
                  "/contact",
                ],
              ].map(([img, title, body, href]) => (
                <Link
                  className="mp-hover-lift group overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest"
                  href={href}
                  key={title}
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      alt={title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      fill
                      sizes="(min-width: 768px) 400px, 100vw"
                      src={img}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-black/50 to-transparent" />
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-extrabold tracking-tight text-primary">
                      {title}
                    </h3>
                    <p className="mt-3 text-on-surface-variant">{body}</p>
                    <span className="mt-5 inline-flex items-center gap-2 font-bold text-secondary transition-all group-hover:gap-3">
                      Learn more
                      <span className="material-symbols-outlined">trending_flat</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------ Values / evidence split */}
        <section className="bg-surface-container-low py-20 md:py-28" id="values">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
              <div data-reveal>
                <span className="mp-eyebrow text-secondary">Why MolaPlus</span>
                <h2 className="mp-display-sm mt-4 text-ink-black">
                  Built on quality, innovation &amp; reliability
                </h2>
                <p className="text-pretty mt-5 max-w-lg text-lg text-on-surface-variant">
                  We formulate evidence-based nutrition for the realities of
                  East African farming &mdash; and stand behind it season after season.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    [
                      "workspace_premium",
                      "Quality",
                      "Premium nutrition backed by careful research and testing.",
                    ],
                    [
                      "biotech",
                      "Innovation",
                      "Formulations built to solve real regional challenges.",
                    ],
                    [
                      "handshake",
                      "Reliability",
                      "Consistent performance you can trust, every season.",
                    ],
                  ].map(([icon, title, body]) => (
                    <div
                      className="flex items-start gap-4 rounded-2xl border border-outline-variant bg-white p-5"
                      key={title}
                    >
                      <span
                        className="material-symbols-outlined text-3xl text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {icon}
                      </span>
                      <div>
                        <p className="font-extrabold text-ink-black">{title}</p>
                        <p className="text-sm text-on-surface-variant">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative" data-reveal>
                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-primary-container">
                  <Image
                    alt="Scientist examining a feed sample in a laboratory"
                    className="object-cover opacity-60 mix-blend-overlay"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    src={labImage}
                  />
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="max-w-xs rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-2xl backdrop-blur-md">
                      <span
                        className="material-symbols-outlined mb-2 text-5xl text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        biotech
                      </span>
                      <p className="mp-eyebrow mb-3 text-ink-black">
                        Evidence-based nutrition
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        Feed supplements and probiotics formulated for productive
                        livestock across East Africa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Distributors CTA */}
        <section className="bg-surface py-20 md:py-28" id="distributors">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div
              className="flex flex-col items-center justify-between gap-8 rounded-3xl border border-outline-variant bg-surface-container-low p-8 text-center md:flex-row md:p-12 md:text-left"
              data-reveal
            >
              <div className="max-w-xl">
                <span className="mp-eyebrow text-secondary">Nationwide network</span>
                <h2 className="mp-display-sm mt-3 text-ink-black">
                  Find MolaPlus near you
                </h2>
                <p className="mt-4 text-on-surface-variant">
                  Thousands of stockists across Kenya. Search our distributor
                  directory by town, or find the closest outlet to your farm.
                </p>
              </div>
              <Link
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-primary-container"
                href="/distributors"
              >
                <span className="material-symbols-outlined">map</span>
                Browse distributors
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Order CTA */}
        <section className="pb-24" id="contact">
          <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
            <div className="mp-scene mp-grain relative overflow-hidden rounded-[2.5rem] p-8 text-center text-white md:p-16">
              <div className="relative z-10 mx-auto max-w-3xl">
                <h2 className="mp-display-sm">
                  Ready to boost your farm&apos;s productivity?
                </h2>
                <p className="text-pretty mx-auto mt-5 max-w-xl text-lg text-white/80">
                  Order directly or contact our team for bulk orders and
                  distributor pricing.
                </p>
                <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                    <p className="mp-eyebrow mb-2 text-white/60">Lipa na M-Pesa</p>
                    <p className="text-2xl font-extrabold text-secondary-fixed-dim">
                      Till No. 906520
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
                    <p className="mp-eyebrow mb-2 text-white/60">Direct support</p>
                    <p className="text-2xl font-extrabold text-white">
                      +254 724 968 847
                    </p>
                  </div>
                </div>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
                  <a
                    className="inline-flex items-center gap-3 rounded-full bg-secondary-container px-10 py-4 text-lg font-bold text-white shadow-xl transition-all hover:bg-secondary"
                    href="https://wa.me/254724968847"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined">chat</span>
                    Order on WhatsApp
                  </a>
                  <a
                    className="glass-effect inline-flex items-center gap-3 rounded-full border border-white/30 px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white hover:text-primary"
                    href="tel:+254724968847"
                  >
                    <span className="material-symbols-outlined">call</span>
                    Call us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}



