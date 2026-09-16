"use client";

import { useEffect, useState } from "react";

export function BlogCardShare({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/blog/${slug}`;
  const [url, setUrl] = useState(path);

  useEffect(() => {
    setUrl(new URL(path, window.location.origin).toString());
  }, [path]);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}\n${url}`);
  async function copy() {
    try {
      await navigator.clipboard.writeText(new URL(path, window.location.origin).toString());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }
  return <div className="journal-card-share" aria-label={`Share ${title}`}><button type="button" onClick={copy}>{copied ? "Copied" : "Copy link"}</button><a href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">Facebook</a></div>;
}
