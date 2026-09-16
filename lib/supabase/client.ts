import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
let browserClient: SupabaseClient | undefined;

export function createClient() {
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  browserClient ??= createBrowserClient(supabaseUrl, supabasePublishableKey);
  return browserClient;
}
