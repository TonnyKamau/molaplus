import { remoteAuthenticated, remoteMedia, remotePosts } from "../../lib/studio/remote";
import { Login } from "./Login";
import { Studio } from "./Studio";

export default async function StudioPage() {
  if (!await remoteAuthenticated()) return <Login />;
  const [{ posts }, { media }] = await Promise.all([remotePosts(), remoteMedia()]);
  return <Studio initialPosts={posts} initialMedia={media} />;
}
