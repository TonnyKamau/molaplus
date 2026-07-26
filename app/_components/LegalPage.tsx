export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto min-h-[60vh] max-w-3xl px-margin-mobile pb-stack-lg pt-stack-lg md:px-margin-desktop">
      <h1 className="font-headline-xl text-headline-lg mb-8 text-primary">{title}</h1>
      <div className="font-body-lg text-body-md space-y-6 text-on-surface-variant">{children}</div>
    </main>
  );
}
