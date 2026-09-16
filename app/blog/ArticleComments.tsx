"use client";

import { useEffect, useState, type SubmitEvent } from "react";

type Comment = { id: string; authorName: string; body: string; createdAt: string };

function formatCommentDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export function ArticleComments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (Array.isArray(data?.comments)) setComments(data.comments);
      })
      .catch(() => setStatus("Comments are temporarily unavailable."));
  }, [slug]);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, authorName, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save comment.");
      if (data.comment) setComments((current) => [data.comment, ...current]);
      setAuthorName("");
      setBody("");
      setStatus("Comment posted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save comment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="journal-comments" aria-labelledby={`comments-${slug}`}>
      <div className="journal-comments__heading">
        <div>
          <p className="journal-eyebrow">Join the conversation</p>
          <h2 id={`comments-${slug}`}>What do you think?</h2>
        </div>
        <span>{comments.length} {comments.length === 1 ? "comment" : "comments"}</span>
      </div>
      <form className="journal-comments__form" onSubmit={submit}>
        <label>Name<input value={authorName} onChange={(event) => setAuthorName(event.target.value)} minLength={2} maxLength={80} required disabled={submitting} /></label>
        <label className="journal-comments__message">Comment<textarea value={body} onChange={(event) => setBody(event.target.value)} minLength={2} maxLength={2000} rows={4} required disabled={submitting} /></label>
        <div className="journal-comments__form-footer"><span>Be thoughtful and constructive.</span><button type="submit" disabled={submitting}>{submitting ? <><span className="journal-comments__spinner" aria-hidden="true" />Posting…</> : "Post comment"}</button></div>
      </form>
      <p className="journal-comments__status" role="status" aria-live="polite">{status}</p>
      {comments.length > 0 && <div className="journal-comments__list">{comments.map((comment) => <article key={comment.id}><div><strong>{comment.authorName}</strong><time dateTime={comment.createdAt}>{formatCommentDate(comment.createdAt)}</time></div><p>{comment.body}</p></article>)}</div>}
    </section>
  );
}