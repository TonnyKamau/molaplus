import Image from "next/image";
import Link from "next/link";

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: [string, string][];
}) {
  return (
    <div>
      <h4 className="mp-eyebrow mb-5 text-primary-fixed-dim">{title}</h4>
      <ul className="space-y-3 text-sm text-white/70">
        {items.map(([label, href]) => (
          <li key={label}>
            <Link className="transition-colors hover:text-white" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mp-scene mp-grain relative overflow-hidden text-white">
      <div className="relative z-10 mx-auto max-w-container-max-width px-margin-mobile pb-8 pt-20 md:px-margin-desktop">
        {/* Top CTA row */}
        <div className="mb-16 flex flex-col justify-between gap-8 border-b border-white/15 pb-16 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <span className="mp-eyebrow text-primary-fixed-dim">Get started</span>
            <h2 className="mp-display-sm mt-3">
              Let&apos;s grow your farm together
            </h2>
            <p className="mt-4 text-white/70">
              Talk to our technical team about the right nutrition programme for
              your livestock, or order directly via M-Pesa.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-7 py-3.5 font-bold text-white transition-all hover:bg-secondary"
              href="https://wa.me/254724968847"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              Order on WhatsApp
            </a>
            <Link
              className="glass-effect inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-bold text-white transition-all hover:bg-white hover:text-primary"
              href="/contact"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Link className="mb-5 inline-flex items-center rounded-2xl bg-white px-4 py-3" href="/">
              <Image alt="MolaPlus Africa" className="h-9 w-auto" height={243} sizes="220px" src="/logo.png" width={1028} />
            </Link>
            <p className="mb-6 text-sm text-white/70">
              Advanced animal nutrition, biotechnology and sustainable farming
              solutions across East Africa.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white" href="tel:+254724968847">
                <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">call</span>
                +254 724 968 847
              </a>
              <a className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white" href="mailto:info@molaplusafrica.com">
                <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">mail</span>
                info@molaplusafrica.com
              </a>
              <span className="inline-flex items-center gap-2 text-white/80">
                <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">payments</span>
                Lipa na M-Pesa &middot; Till 906520
              </span>
            </div>
          </div>

          <FooterColumn
            title="Products"
            items={[
              ["All Products", "/products"],
              ["Super Milk Booster", "/products/super-milk-booster"],
              ["Compare Products", "/product-comparison"],
            ]}
          />
          <FooterColumn
            title="Company"
            items={[
              ["About Us", "/about-us"],
              ["Consultancy", "/consultancy"],
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
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-sm text-white/60 md:flex-row">
          <p>&copy; 2026 MolaPlus Africa. Advanced Animal Nutrition.</p>
          <p>Made in Kenya &middot; For East African farmers</p>
        </div>
      </div>

      {/* Oversized brand wordmark */}
      <div className="hidden select-none px-margin-mobile md:block md:px-margin-desktop pointer-events-none">
        <p className="-mb-4 whitespace-nowrap text-center text-[22vw] font-extrabold leading-none tracking-tighter text-white/[0.06] md:-mb-8">
          MolaPlus
        </p>
      </div>
    </footer>
  );
}

