"use client";

import { useEffect, useState } from "react";

export function ShareArticle({ title, slug }: { title: string; slug: string }) {
  const [status, setStatus] = useState("");
  const path = `/blog/${slug}`;
  const [url, setUrl] = useState(path);

  useEffect(() => {
    setUrl(new URL(path, window.location.origin).toString());
  }, [path]);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}\n${url}`);
  function currentUrl() {
    return new URL(path, window.location.origin).toString();
  }

  async function copy() {
    try { await navigator.clipboard.writeText(currentUrl()); setStatus("Link copied."); }
    catch { setStatus("Copy the article address from your browser to share it."); }
  }
  async function share() {
    if (!navigator.share) return copy();
    try { await navigator.share({ title, url: currentUrl() }); setStatus("Share sheet opened."); }
    catch { setStatus(""); }
  }
  return <div className="journal-share"><p className="journal-eyebrow">Share this story</p><div><button type="button" onClick={share}>Share <span aria-hidden="true">↗</span></button><button type="button" onClick={copy}>Copy link</button><a href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer" aria-label="Share article on WhatsApp">WhatsApp</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share article on Facebook">Facebook</a><a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share article on X">X</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Share article on LinkedIn">LinkedIn</a></div><p role="status" aria-live="polite">{status}</p></div>;
}
