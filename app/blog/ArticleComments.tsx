"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "../../lib/toast";

type Comment = { id: string; authorName: string; body: string; createdAt: string };

function formatCommentDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export function ArticleComments({ slug }: { slug: string }) {
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
      .catch(() => toast.error("Comments are temporarily unavailable."));
  }, [slug]);

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
      if (!response.ok) throw new Error(data.error || "Could not save comment.");
      if (data.comment) setComments((current) => [data.comment, ...current]);
      setAuthorName("");
      setBody("");
      toast.success("Comment posted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save comment.");
    } finally {
      setSubmitting(false);
    }
  };

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
      {loaded && comments.length === 0 && (
        <div className="journal-comments__empty">
          <span className="material-symbols-outlined" aria-hidden="true">forum</span>
          <p>No comments yet. Be the first to share your thoughts.</p>
        </div>
      )}
      {comments.length > 0 && <div className="journal-comments__list">{comments.map((comment) => <article key={comment.id}><div><strong>{comment.authorName}</strong><time dateTime={comment.createdAt}>{formatCommentDate(comment.createdAt)}</time></div><p>{comment.body}</p></article>)}</div>}
    </section>
  );
}