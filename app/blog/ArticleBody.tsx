import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { postHeadings } from "../../lib/studio/model";

export function ArticleBody({ body }: { body: string }) {
  const headings = postHeadings(body);
  let index = 0;
  return <div className="journal-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    h1: ({ children }) => <h2>{children}</h2>,
    h2: ({ children }) => <h2 id={headings[index++]?.id}>{children}</h2>,
    a: ({ href, children }) => <a href={href} {...(href?.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>,
    // Uploaded assets are re-encoded server-side; arbitrary remote image URLs are not loaded.
    img: ({ src, alt }) => typeof src === "string" && (/^\/api\/blog\/media\/[a-f0-9-]{36}$/.test(src) || /^\/molaplus\/[a-z0-9-]+\.webp$/.test(src)) ? <picture><img src={src} alt={alt || ""} loading="lazy" /></picture> : <span>{alt}</span>,
  }}>{body}</ReactMarkdown></div>;
}
