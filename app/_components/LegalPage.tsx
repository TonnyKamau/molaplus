export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="editorial-page legal-editorial overflow-x-hidden bg-surface text-on-surface">
      <section className="mp-scene mp-grain relative overflow-hidden">
        <div className="relative z-10 mx-auto max-w-3xl px-margin-mobile py-16 text-white md:px-margin-desktop md:py-20">
          <span className="mp-eyebrow text-primary-fixed-dim">Legal</span>
          <h1 className="mp-display-sm mt-4">{title}</h1>
        </div>
      </section>
      <main className="mx-auto min-h-[40vh] max-w-3xl px-margin-mobile pb-24 pt-14 md:px-margin-desktop">
        <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant">{children}</div>
      </main>
    </div>
  );
}
