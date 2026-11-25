"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { plural, type Lang, useT } from "../../lib/i18n";
import { toast } from "../../lib/toast";

type Comment = { id: string; authorName: string; body: string; createdAt: string };

function formatCommentDate(value: string, lang: Lang) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(date);
}

export function ArticleComments({ slug }: { slug: string }) {
  const t = useT();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (Array.isArray(data?.comments)) setComments(data.comments);
        setLoaded(true);
      })
      .catch(() => toast.error(t("Comments are temporarily unavailable.", "Les commentaires sont temporairement indisponibles.")));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps -- t only changes on reload

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, authorName, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("Could not save comment.", "Impossible d’enregistrer le commentaire."));
      if (data.comment) setComments((current) => [data.comment, ...current]);
      setAuthorName("");
      setBody("");
      toast.success(t("Comment posted.", "Commentaire publié."));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("Could not save comment.", "Impossible d’enregistrer le commentaire."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="journal-comments" aria-labelledby={`comments-${slug}`} translate="no">
      <div className="journal-comments__heading">
        <div>
          <p className="journal-eyebrow">{t("Join the conversation", "Participez à la discussion")}</p>
          <h2 id={`comments-${slug}`}>{t("What do you think?", "Qu’en pensez-vous ?")}</h2>
        </div>
        <span>{plural(comments.length, t("comment", "commentaire"), t("comments", "commentaires"), t.lang)}</span>
      </div>
      <form className="journal-comments__form" onSubmit={submit}>
        <label>{t("Name", "Nom")}<input value={authorName} onChange={(event) => setAuthorName(event.target.value)} minLength={2} maxLength={80} required disabled={submitting} /></label>
        <label className="journal-comments__message">{t("Comment", "Commentaire")}<textarea value={body} onChange={(event) => setBody(event.target.value)} minLength={2} maxLength={2000} rows={4} required disabled={submitting} /></label>
        <div className="journal-comments__form-footer"><span>{t("Be thoughtful and constructive.", "Restez courtois et constructif.")}</span><button type="submit" disabled={submitting}>{submitting ? <><span className="journal-comments__spinner" aria-hidden="true" />{t("Posting…", "Publication…")}</> : t("Post comment", "Publier")}</button></div>
      </form>
      {loaded && comments.length === 0 && (
        <div className="journal-comments__empty">
          <span className="material-symbols-outlined notranslate" aria-hidden="true">forum</span>
          <p>{t("No comments yet. Be the first to share your thoughts.", "Aucun commentaire pour l’instant. Soyez le premier à donner votre avis.")}</p>
        </div>
      )}
      {comments.length > 0 && <div className="journal-comments__list">{comments.map((comment) => <article key={comment.id}><div><strong>{comment.authorName}</strong><time dateTime={comment.createdAt}>{formatCommentDate(comment.createdAt, t.lang)}</time></div><p>{comment.body}</p></article>)}</div>}
    </section>
  );
}