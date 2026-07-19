import Image from "next/image";
import Link from "next/link";

const links = [
  ["Home", "/"],
  ["Products", "/products"],
  ["Resources", "/resources"],
  ["Distributors", "/distributors"],
  ["About", "/about-us"],
] as const;

export function SiteHeader({ active = "/" }: { active?: string }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#07130c]/85 text-white shadow-[0_16px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-container-max-width items-center justify-between px-margin-mobile md:h-20 md:px-margin-desktop">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 text-primary-fixed transition-colors hover:bg-white/15 md:hidden"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link className="flex min-w-0 items-center gap-3" href="/">
            <Image alt="MolaPlus Africa logo" className="h-10 w-10 rounded-full object-contain ring-1 ring-white/20" height={40} src="/molaplus/logo.png" width={40} />
            <span className="truncate font-headline-md text-[1.2rem] font-extrabold tracking-normal text-primary-fixed md:text-headline-md">
              MolaPlus Africa
            </span>
          </Link>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map(([label, href]) => {
            const isActive = active === href;
            return (
              <Link
                className={
                  isActive
                    ? "rounded-full bg-white px-4 py-2 font-label-md text-sm font-bold text-primary shadow-sm"
                    : "rounded-full px-4 py-2 font-label-md text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                }
                href={href}
                key={href}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <Link className="hidden rounded-full bg-secondary px-5 py-2.5 font-label-md text-sm font-bold text-white shadow-lg shadow-secondary/20 transition-transform hover:-translate-y-0.5 md:inline-flex" href="/contact">
          Contact Expert
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#07130c] pb-28 pt-14 text-white md:pb-10">
      <div className="mx-auto flex max-w-container-max-width flex-col gap-10 px-margin-mobile md:flex-row md:items-end md:justify-between md:px-margin-desktop">
        <div className="max-w-sm">
          <Link className="mb-5 flex items-center gap-3" href="/">
            <Image alt="MolaPlus Africa logo" className="h-10 w-10 rounded-full object-contain" height={40} src="/molaplus/logo.png" width={40} />
            <span className="font-headline-md text-headline-md font-extrabold text-primary-fixed">MolaPlus Africa</span>
          </Link>
          <p className="text-sm leading-6 text-white/65">
            Premium livestock nutrition, probiotics, and technical support for farms scaling across East Africa.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/70">
          {links.map(([label, href]) => (
            <Link className="transition-colors hover:text-primary-fixed" href={href} key={href}>
              {label}
            </Link>
          ))}
          <Link className="transition-colors hover:text-primary-fixed" href="/privacy">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
