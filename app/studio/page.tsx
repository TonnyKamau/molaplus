"use client";

import { useCallback, useEffect, useState } from "react";
import type { Media, StudioPost } from "../../lib/studio/model";
import { Login } from "./Login";
import { Studio } from "./Studio";

type Status = "loading" | "login" | "ready";

export default function StudioPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [posts, setPosts] = useState<StudioPost[]>([]);
  const [media, setMedia] = useState<Media[]>([]);

  const load = useCallback(async () => {
    try {
      const session = await fetch("/api/studio/session", { cache: "no-store" }).then((r) => r.json());
      if (!session?.authenticated) {
        setStatus("login");
        return;
      }
      const [postsRes, mediaRes] = await Promise.all([
        fetch("/api/studio/posts", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/studio/media", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setPosts(Array.isArray(postsRes?.posts) ? postsRes.posts : []);
      setMedia(Array.isArray(mediaRes?.media) ? mediaRes.media : []);
      setStatus("ready");
    } catch {
      setStatus("login");
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

  return <Studio initialPosts={posts} initialMedia={media} onLogout={() => setStatus("login")} />;
}
