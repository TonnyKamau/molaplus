import Link from "next/link";

export default function StoryNotFound() {
  return <main className="journal-shell journal-empty journal-missing"><p className="journal-eyebrow">Field notes / 404</p><h1>This story isn’t here.</h1><p>The address may have changed. There’s more to explore in the journal.</p><Link className="journal-button" href="/blog">Back to all stories <span aria-hidden="true">↗</span></Link></main>;
}
