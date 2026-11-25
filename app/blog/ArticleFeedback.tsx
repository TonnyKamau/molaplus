"use client";

import { useEffect, useState } from "react";
import { useT } from "../../lib/i18n";
import { toast } from "../../lib/toast";

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
  const t = useT();
  const [counts, setCounts] = useState<Counts>({ helpful: 0, notHelpful: 0 });
  const [selected, setSelected] = useState<Reaction | null>(null);
  const [pending, setPending] = useState(false);

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
    if (pending) return;
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
    setPending(true);
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
      toast.success(t("Thanks for your feedback.", "Merci pour votre avis."));
    } catch {
      setSelected(previous);
      setCounts(counts);
      if (previous) localStorage.setItem(`molaplus:article-feedback:${slug}`, previous);
      else localStorage.removeItem(`molaplus:article-feedback:${slug}`);
      toast.error(t("Your feedback could not be saved. Please try again.", "Votre avis n’a pas pu être enregistré. Veuillez réessayer."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="journal-feedback" aria-labelledby={`feedback-${slug}`} aria-busy={pending} translate="no">
      <div className="journal-feedback__copy">
        <p id={`feedback-${slug}`} className="journal-eyebrow">{t("Was this article helpful?", "Cet article vous a-t-il été utile ?")}</p>
        <p className="journal-feedback__note">{t("Your response helps us make Field Notes more useful.", "Votre réponse nous aide à rendre nos articles plus utiles.")}</p>
      </div>
      <div className="journal-feedback__actions">
        <button type="button" aria-pressed={selected === "helpful"} onClick={() => react("helpful")} disabled={pending}><span aria-hidden="true">👍</span> {t("Yes", "Oui")} <strong>{counts.helpful}</strong></button>
        <button type="button" aria-pressed={selected === "not_helpful"} onClick={() => react("not_helpful")} disabled={pending}><span aria-hidden="true">👎</span> {t("No", "Non")} <strong>{counts.notHelpful}</strong></button>
      </div>
    </section>
  );
}
