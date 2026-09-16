"use client";

import { useEffect, useState } from "react";

type Reaction = "helpful" | "not_helpful";
type Counts = { helpful: number; notHelpful: number };

function visitorKey() {
  const key = "molaplus:visitor-id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
}

export function ArticleFeedback({ slug }: { slug: string }) {
  const [counts, setCounts] = useState<Counts>({ helpful: 0, notHelpful: 0 });
  const [selected, setSelected] = useState<Reaction | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const selectionKey = `molaplus:article-feedback:${slug}`;
    const saved = localStorage.getItem(selectionKey);
    Promise.resolve(saved).then((value) => {
      if (value === "helpful" || value === "not_helpful") setSelected(value);
    });
    fetch(`/api/blog/reactions?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (typeof data?.helpful === "number" && typeof data?.notHelpful === "number") {
          setCounts({ helpful: data.helpful, notHelpful: data.notHelpful });
        }
      })
      .catch(() => undefined);
  }, [slug]);

  async function react(reaction: Reaction) {
    const previous = selected;
    const nextCounts = { ...counts };
    if (previous && previous !== reaction) {
      nextCounts[previous === "helpful" ? "helpful" : "notHelpful"] -= 1;
    }
    if (previous !== reaction) {
      nextCounts[reaction === "helpful" ? "helpful" : "notHelpful"] += 1;
    }
    setSelected(reaction);
    setCounts(nextCounts);
    setStatus("Thanks for your feedback.");
    localStorage.setItem(`molaplus:article-feedback:${slug}`, reaction);

    try {
      const response = await fetch("/api/blog/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, reaction, visitorKey: visitorKey() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error("Reaction failed");
      if (typeof data.helpful === "number" && typeof data.notHelpful === "number") {
        setCounts({ helpful: data.helpful, notHelpful: data.notHelpful });
      }
    } catch {
      setSelected(previous);
      setCounts(counts);
      if (previous) localStorage.setItem(`molaplus:article-feedback:${slug}`, previous);
      else localStorage.removeItem(`molaplus:article-feedback:${slug}`);
      setStatus("Your feedback could not be saved. Please try again.");
    }
  }

  return (
    <section className="journal-feedback" aria-labelledby={`feedback-${slug}`}>
      <div>
        <p id={`feedback-${slug}`} className="journal-eyebrow">Was this article helpful?</p>
        <p className="journal-feedback__note">Your response helps us make Field Notes more useful.</p>
      </div>
      <div className="journal-feedback__actions">
        <button type="button" aria-pressed={selected === "helpful"} onClick={() => react("helpful")}><span aria-hidden="true">👍</span> Yes <strong>{counts.helpful}</strong></button>
        <button type="button" aria-pressed={selected === "not_helpful"} onClick={() => react("not_helpful")}><span aria-hidden="true">👎</span> No <strong>{counts.notHelpful}</strong></button>
      </div>
      <p className="journal-feedback__status" role="status" aria-live="polite">{status}</p>
    </section>
  );
}