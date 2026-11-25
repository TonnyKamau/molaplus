"use client";

import { useState, useSyncExternalStore } from "react";

import { useT } from "../../lib/i18n";

export function ShareArticle({ title, slug }: { title: string; slug: string }) {
  const t = useT();
  const [status, setStatus] = useState("");
  const path = `/blog/${slug}`;
  const url = useSyncExternalStore(() => () => {}, () => new URL(path, window.location.origin).toString(), () => path);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}\n${url}`);
  function currentUrl() {
    return new URL(path, window.location.origin).toString();
  }

  async function copy() {
    try { await navigator.clipboard.writeText(currentUrl()); setStatus(t("Link copied.", "Lien copié.")); }
    catch { setStatus(t("Copy the article address from your browser to share it.", "Copiez l’adresse de l’article depuis votre navigateur pour la partager.")); }
  }
  async function share() {
    if (!navigator.share) return copy();
    try { await navigator.share({ title, url: currentUrl() }); setStatus(t("Share sheet opened.", "Menu de partage ouvert.")); }
    catch { setStatus(""); }
  }
  return <div className="journal-share" translate="no"><p className="journal-eyebrow">{t("Share this story", "Partager cet article")}</p><div><button type="button" onClick={share}>{t("Share", "Partager")} <span aria-hidden="true">↗</span></button><button type="button" onClick={copy}>{t("Copy link", "Copier le lien")}</button><a href={`https://wa.me/?text=${encodedText}`} target="_blank" rel="noopener noreferrer" aria-label={t("Share article on WhatsApp", "Partager sur WhatsApp")}>WhatsApp</a><a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label={t("Share article on Facebook", "Partager sur Facebook")}>Facebook</a><a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" aria-label={t("Share article on X", "Partager sur X")}>X</a><a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label={t("Share article on LinkedIn", "Partager sur LinkedIn")}>LinkedIn</a></div><p role="status" aria-live="polite">{status}</p></div>;
}
