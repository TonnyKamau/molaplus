"use client";

import { useCallback, useEffect, useState } from "react";
import type { StudioPost } from "../../lib/studio/model";
import { Login } from "./Login";
import { Studio, freshUrl } from "./Studio";

type Status = "loading" | "login" | "ready";

type Editor = { email: string; name: string | null };

export default function StudioPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [posts, setPosts] = useState<StudioPost[]>([]);
  const [editor, setEditor] = useState<Editor | null>(null);

  const load = useCallback(async (): Promise<boolean> => {
    try {
      const session = await fetch(freshUrl("/api/studio/session"), { cache: "no-store", credentials: "same-origin" }).then((r) => r.json());
      if (!session?.authenticated) {
        setStatus("login");
        return false;
      }
      setEditor(session.editor ?? null);
      // Load posts first so the workspace opens fast; media (heavier) loads
      // in the background inside Studio.
      const postsRes = await fetch(freshUrl("/api/studio/posts"), { cache: "no-store", credentials: "same-origin" }).then((r) => r.json());
      setPosts(Array.isArray(postsRes?.posts) ? postsRes.posts : []);
      setStatus("ready");
      return true;
    } catch {
      setStatus("login");
      return false;
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === "loading") {
    return (
      <main className="studio-login is-loading" aria-busy="true">
        <div className="studio-login__form">
          <p className="studio-hint" role="status" aria-live="polite">
            <span className="studio-spinner" aria-hidden="true" /> Opening your studio…
          </p>
        </div>
      </main>
    );
  }

  if (status === "login") {
    return <Login onAuthenticated={load} />;
  }

  return <Studio initialPosts={posts} editor={editor} onLogout={() => setStatus("login")} />;
}
