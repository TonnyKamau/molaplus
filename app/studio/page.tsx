import { authenticated, configured } from "../../lib/studio/auth";
import { listPosts, listMedia } from "../../lib/studio/db";
import { Login } from "./Login";
import { Studio } from "./Studio";

export default async function StudioPage() {
  if (!await authenticated()) return <Login configured={configured()} />;
  return <Studio initialPosts={listPosts()} initialMedia={listMedia()} />;
}
