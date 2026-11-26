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
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* Top CTA row */}
        <div className="site-footer__cta">
          <div className="max-w-3xl">
            <span className="site-footer__eyebrow">Ready when you are</span>
            <h2>
              Better nutrition.<br /><em>Stronger farms.</em>
            </h2>
            <p>
              Talk to our technical team about the right nutrition programme for
              your livestock, or order directly via <span className="whitespace-nowrap" translate="no">M-Pesa</span>.
            </p>
          </div>
          <div className="site-footer__actions">
            <Link
              className="site-footer__primary"
              href="/order"
            >
              <span className="material-symbols-outlined notranslate text-[20px]">shopping_bag</span>
              Place an order
            </Link>
            <Link
              className="site-footer__secondary"
              href="/contact"
            >
              Contact us
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="site-footer__grid">
          <div className="max-w-xs">
            <Link className="site-footer__logo" href="/">
              <Image alt="MolaPlus" className="h-9 w-auto" height={205} sizes="220px" src="/molaplus-logo-v2.png" width={720} />
            </Link>
            <p className="mb-6 text-sm text-white/70">
              Advanced animal nutrition, biotechnology and sustainable farming
              solutions across East Africa.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white" href="tel:+254724968847">
                <span className="material-symbols-outlined notranslate text-[18px] text-primary-fixed-dim">call</span>
                0724 968 847
              </a>
              <a className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white" href="/contact#team">
                <span className="material-symbols-outlined notranslate text-[18px] text-primary-fixed-dim">groups</span>
                More direct lines
              </a>
              <a className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white" href="mailto:info@molaplus.org">
                <span className="material-symbols-outlined notranslate text-[18px] text-primary-fixed-dim">mail</span>
                info@molaplus.org
              </a>
              <span className="inline-flex items-center gap-2 text-white/80">
                <span className="material-symbols-outlined notranslate text-[18px] text-primary-fixed-dim">payments</span>
                Lipa na <span className="whitespace-nowrap" translate="no">M-Pesa</span> &middot; <span className="whitespace-nowrap" translate="no">Till 906520</span>
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
              ["Blog", "/blog"],
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
        <div className="site-footer__bottom">
          <p>&copy; 2026 MolaPlus. Advanced Animal Nutrition.</p>
          <p>Made in Kenya &middot; For East African farmers</p>
        </div>
      </div>

      {/* Oversized brand wordmark */}
      <div className="site-footer__wordmark" aria-hidden>
        <p>
          MOLAPLUS
        </p>
      </div>
    </footer>
  );
}

