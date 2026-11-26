"use client";

import { useEffect, useState } from "react";
import { BlogCard } from "./BlogCard";
import { plural, useT } from "../../lib/i18n";
import { categories, categoryFr, summarize, type Category, type Post, type PostSummary } from "./posts";
import { minuteUrl } from "../../lib/blog/live";

export function BlogLibrary({ posts }: { posts: PostSummary[] }) {
  // Filters, counts and paging use native French; the article cards themselves
  // are left to Google (they re-render as new elements, which it translates).
  const t = useT();
  const label = (item: Category) => (t.lang === "fr" ? categoryFr[item] : item);
  // Seed with the build-time list for instant paint + SEO, then refresh live
  // from the PHP API so Studio-added posts appear in realtime (no rebuild).
  const [livePosts, setLivePosts] = useState<PostSummary[]>(posts);
  useEffect(() => {
    const controller = new AbortController();
    fetch(minuteUrl("/api/blog/posts"), { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const live: Post[] = Array.isArray(data?.posts) ? data.posts : [];
        if (live.length) setLivePosts(live.map((p) => summarize(p)));
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
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
  const matches = livePosts.filter((post) => (category === "All stories" || post.category === category) && `${post.title} ${post.excerpt} ${post.category} ${post.author ?? ""} ${(post.tags ?? []).join(" ")}`.toLowerCase().includes(normalized)).sort((a, b) => sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  const totalPages = Math.max(1, Math.ceil(matches.length / 6));
  const currentPage = Math.min(totalPages, Math.floor(page));
  const visible = matches.slice((currentPage - 1) * 6, currentPage * 6);
  function reset() { update({ topic: "All stories", q: "", sort: "newest" }); }

  return (
    <section className="journal-library" id="stories" aria-labelledby="stories-heading">
      <div className="journal-section-heading"><div><p className="journal-eyebrow">Ideas for your everyday</p><h2 id="stories-heading">From the field.</h2></div><p>Good habits. Useful perspectives. A little more know-how.</p></div>
      <div className="journal-toolbar" translate="no">
        <div className="journal-filters" role="group" aria-label={t("Filter articles by topic", "Filtrer les articles par thème")}>
          {categories.map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => update({ topic: item })}>{label(item)}</button>)}
        </div>
        <label className="journal-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><span className="sr-only">{t("Search articles", "Rechercher un article")}</span><input type="search" placeholder={t("Search stories", "Rechercher un article")} value={query} onChange={(event) => update({ q: event.target.value })} /></label>
      </div>
      <div className="journal-results" translate="no"><p role="status" aria-live="polite">{t(
        `${plural(matches.length, "story", "stories")}${category !== "All stories" ? ` in ${category.toLowerCase()}` : " to explore"}${normalized ? ` matching “${query.trim()}”` : ""}`,
        `${plural(matches.length, "article", "articles", "fr")}${category !== "All stories" ? ` · ${categoryFr[category]}` : " à découvrir"}${normalized ? ` pour « ${query.trim()} »` : ""}`,
      )}</p>{(normalized || category !== "All stories") && <button type="button" onClick={reset}>{t("Clear filters", "Effacer les filtres")} <span aria-hidden="true">×</span></button>}</div>
      <div className="journal-library-options" translate="no"><a href="/blog/feed.xml">{t("Follow via RSS", "Suivre via RSS")} <span aria-hidden="true">↗</span></a><label>{t("Sort by", "Trier par")} <select value={sort} onChange={(event) => update({ sort: event.target.value })}><option value="newest">{t("Newest first", "Plus récents")}</option><option value="oldest">{t("Oldest first", "Plus anciens")}</option></select></label></div>
      {matches.length ? <div className="journal-grid">{visible.map((post) => <BlogCard key={post.slug} post={post} />)}</div> : <div className="journal-empty" translate="no"><span aria-hidden="true">↗</span><h3>{t("No stories found.", "Aucun article trouvé.")}</h3><p>{t("Try a different word or explore another topic.", "Essayez un autre mot ou explorez un autre thème.")}</p><button className="journal-button" type="button" onClick={reset}>{t("Show all stories", "Voir tous les articles")} <span aria-hidden="true">→</span></button></div>}
      {totalPages > 1 && <nav className="journal-pagination" aria-label={t("Article pages", "Pages d’articles")} translate="no"><button disabled={currentPage === 1} onClick={() => update({ page: currentPage - 1 })}>{t("← Previous", "← Précédent")}</button><span role="status">{t(`Page ${currentPage} of ${totalPages}`, `Page ${currentPage} sur ${totalPages}`)}</span><button disabled={currentPage === totalPages} onClick={() => update({ page: currentPage + 1 })}>{t("Next →", "Suivant →")}</button></nav>}
    </section>
  );
}
