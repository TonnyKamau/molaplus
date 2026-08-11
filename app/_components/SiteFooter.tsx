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
              your livestock, or order directly via M-Pesa.
            </p>
          </div>
          <div className="site-footer__actions">
            <a
              className="site-footer__primary"
              href="https://wa.me/254722656142"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              Order on WhatsApp
            </a>
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
              <Image alt="MolaPlus Africa" className="h-9 w-auto" height={243} sizes="220px" src="/molaplus-brand.webp" width={1028} />
            </Link>
            <p className="mb-6 text-sm text-white/70">
              Advanced animal nutrition, biotechnology and sustainable farming
              solutions across East Africa.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white" href="tel:+254722656142">
                <span className="material-symbols-outlined text-[18px] text-primary-fixed-dim">call</span>
                +254 722 656 142
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
        <div className="site-footer__bottom">
          <p>&copy; 2026 MolaPlus Africa. Advanced Animal Nutrition.</p>
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

