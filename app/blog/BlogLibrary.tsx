"use client";

import { useEffect, useState } from "react";
import { BlogCard } from "./BlogCard";
import { categories, type Category, type PostSummary } from "./posts";

export function BlogLibrary({ posts }: { posts: PostSummary[] }) {
  const [category, setCategory] = useState<Category>("All stories");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(window.location.search);
      const topic = params.get("topic") as Category;
      setCategory(categories.includes(topic) ? topic : "All stories");
      setQuery(params.get("q") || "");
      setSort(params.get("sort") === "oldest" ? "oldest" : "newest");
      setPage(Math.max(1, Number(params.get("page")) || 1));
    }
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  function update(values: { topic?: Category; q?: string; sort?: string; page?: number }) {
    const next = { topic: category, q: query, sort, page: 1, ...values };
    setCategory(next.topic); setQuery(next.q); setSort(next.sort); setPage(next.page);
    const params = new URLSearchParams();
    if (next.topic !== "All stories") params.set("topic", next.topic);
    if (next.q) params.set("q", next.q);
    if (next.sort !== "newest") params.set("sort", next.sort);
    if (next.page > 1) params.set("page", String(next.page));
    window.history.replaceState(null, "", `${window.location.pathname}${params.size ? `?${params}` : ""}#stories`);
  }
  const normalized = query.trim().toLowerCase();
  const matches = posts.filter((post) => (category === "All stories" || post.category === category) && `${post.title} ${post.excerpt} ${post.category} ${post.author ?? ""} ${(post.tags ?? []).join(" ")}`.toLowerCase().includes(normalized)).sort((a, b) => sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  const totalPages = Math.max(1, Math.ceil(matches.length / 6));
  const currentPage = Math.min(totalPages, Math.floor(page));
  const visible = matches.slice((currentPage - 1) * 6, currentPage * 6);
  function reset() { update({ topic: "All stories", q: "", sort: "newest" }); }

  return (
    <section className="journal-library" id="stories" aria-labelledby="stories-heading">
      <div className="journal-section-heading"><div><p className="journal-eyebrow">Ideas for your everyday</p><h2 id="stories-heading">From the field.</h2></div><p>Good habits. Useful perspectives. A little more know-how.</p></div>
      <div className="journal-toolbar">
        <div className="journal-filters" role="group" aria-label="Filter articles by topic">
          {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => update({ topic: item })}>{item}</button>)}
        </div>
        <label className="journal-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><span className="sr-only">Search articles</span><input type="search" placeholder="Search stories" value={query} onChange={(event) => update({ q: event.target.value })} /></label>
      </div>
      <div className="journal-results"><p role="status" aria-live="polite">{matches.length} {matches.length === 1 ? "story" : "stories"}{category !== "All stories" ? ` in ${category.toLowerCase()}` : " to explore"}{normalized ? ` matching “${query.trim()}”` : ""}</p>{(normalized || category !== "All stories") && <button type="button" onClick={reset}>Clear filters <span aria-hidden="true">×</span></button>}</div>
      <div className="journal-library-options"><a href="/blog/feed.xml">Follow via RSS <span aria-hidden="true">↗</span></a><label>Sort by <select value={sort} onChange={(event) => update({ sort: event.target.value })}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label></div>
      {matches.length ? <div className="journal-grid">{visible.map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="journal-empty"><span aria-hidden="true">↗</span><h3>No stories found.</h3><p>Try a different word or explore another topic.</p><button className="journal-button" type="button" onClick={reset}>Show all stories <span aria-hidden="true">→</span></button></div>}
      {totalPages > 1 && <nav className="journal-pagination" aria-label="Article pages"><button disabled={currentPage === 1} onClick={() => update({ page: currentPage - 1 })}>← Previous</button><span role="status">Page {currentPage} of {totalPages}</span><button disabled={currentPage === totalPages} onClick={() => update({ page: currentPage + 1 })}>Next →</button></nav>}
    </section>
  );
}
