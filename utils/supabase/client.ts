import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createFallbackSupabaseClient, isSupabaseConfigured } from "./shared";

export function createSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    return createFallbackSupabaseClient();
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
