"use client";

import { useState } from "react";

export function ShareArticle({ title, slug }: { title: string; slug: string }) {
  const [status, setStatus] = useState("");
  const url = `https://molaplusafrica.com/blog/${slug}`;
  async function copy() {
    try { await navigator.clipboard.writeText(url); setStatus("Link copied."); }
    catch { setStatus("Copy the article address from your browser to share it."); }
  }
  return <div className="journal-share"><p className="journal-eyebrow">Pass it on</p><div><button type="button" onClick={copy}>Copy link <span aria-hidden="true">↗</span></button><a href={`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Share article on WhatsApp (opens in a new tab)">WhatsApp <span aria-hidden="true">↗</span></a></div><p role="status" aria-live="polite">{status}</p></div>;
}
