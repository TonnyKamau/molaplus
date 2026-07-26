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
      <h4 className="mb-5 font-bold text-ink-black">{title}</h4>
      <ul className="space-y-3 font-label-md text-label-md text-on-surface-variant">
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

export function SiteFooter() {
  return (
    <footer className="border-t border-outline-variant bg-surface-container-highest pb-stack-md pt-stack-lg">
      <div className="mx-auto max-w-container-max-width px-margin-mobile md:px-margin-desktop">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">
            <Link className="mb-5 flex items-center gap-3" href="/">
              <Image alt="MolaPlus Africa logo" className="h-10 w-10 rounded-full object-contain" height={40} src="/molaplus/logo.png" width={40} />
              <span className="font-headline-md text-headline-md font-extrabold text-primary">MolaPlus Africa</span>
            </Link>
            <p className="font-body-md mb-6 text-on-surface-variant">
              Leaders in modern animal nutrition, biotech solutions, and sustainable farming practices across the continent.
            </p>
            <div className="flex flex-col gap-2 font-label-md text-label-md">
              <a className="inline-flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary" href="tel:+254724968847">
                <span className="material-symbols-outlined text-[18px] text-primary">call</span>
                +254 724 968 847
              </a>
              <a className="inline-flex items-center gap-2 text-on-surface-variant transition-colors hover:text-primary" href="mailto:info@molaplusafrica.com">
                <span className="material-symbols-outlined text-[18px] text-primary">mail</span>
                info@molaplusafrica.com
              </a>
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

        <div className="flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 md:flex-row">
          <p className="font-label-md text-label-md text-on-surface-variant">
            © 2026 MolaPlus Africa. Advanced Animal Nutrition.
          </p>
          <p className="font-label-md text-label-md text-on-surface-variant">
            Lipa na M-Pesa · Till No: <span className="font-bold text-primary">906520</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
