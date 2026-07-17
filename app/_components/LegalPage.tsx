import Image from "next/image";
import Link from "next/link";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface text-on-surface">
      <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface">
        <div className="mx-auto flex h-16 w-full max-w-container-max-width items-center justify-between px-margin-mobile md:px-margin-desktop">
          <Link className="flex items-center gap-3" href="/">
            <Image alt="MolaPlus Africa logo" className="h-10 w-10 rounded-full object-contain" height={40} src="/molaplus/logo.png" width={40} />
            <span className="font-headline-md text-headline-md font-extrabold tracking-tight text-primary">
              MolaPlus Africa
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/">
              Home
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/products">
              Products
            </Link>
            <Link className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary" href="/contact">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[70vh] max-w-3xl px-margin-mobile pb-stack-lg pt-32 md:px-margin-desktop">
        <h1 className="font-headline-xl text-headline-lg mb-8 text-primary">{title}</h1>
        <div className="font-body-lg text-body-md space-y-6 text-on-surface-variant">{children}</div>
      </main>
      <footer className="border-t border-outline-variant bg-surface-container-highest py-stack-md">
        <p className="text-center font-label-md text-label-md text-on-surface-variant">
          © 2026 MolaPlus Africa. Advanced Animal Nutrition.
        </p>
      </footer>
    </div>
  );
}
