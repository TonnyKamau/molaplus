import { authenticated, configured } from "../../lib/studio/auth";
import { isSupabaseStudio } from "../../lib/studio/backend";
import { listPosts, listMedia } from "../../lib/studio/db";
import { remoteAuthenticated, remoteMedia, remotePosts } from "../../lib/studio/remote";
import { Login } from "./Login";
import { Studio } from "./Studio";

export default async function StudioPage() {
  if (isSupabaseStudio()) {
    if (!await remoteAuthenticated()) return <Login configured mode="supabase" />;
    const [{ posts }, { media }] = await Promise.all([remotePosts(), remoteMedia()]);
    return <Studio initialPosts={posts} initialMedia={media} />;
  }
  if (!await authenticated()) return <Login configured={configured()} />;
  return <Studio initialPosts={listPosts()} initialMedia={listMedia()} />;
}
