"use client";

export default function BlogError({ reset }: { reset: () => void }) {
  return <main className="journal-shell"><section className="journal-empty"><p className="journal-eyebrow">Field Notes</p><h1>We couldn’t load the stories.</h1><p>Please try again in a moment. For farm support, call <a href="tel:+254722656142">+254 722 656 142</a>.</p><button className="journal-button" onClick={reset}>Try again ↻</button></section></main>;
}
