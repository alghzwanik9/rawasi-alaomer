import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseClientConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (
    supabaseUrl.includes("PASTE_") ||
    supabaseAnonKey.includes("PASTE_") ||
    supabaseAnonKey === "your_supabase_anon_key_here"
  ) {
    return false;
  }
  return true;
}

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseClientConfigured()) {
    return null;
  }

  if (typeof window === "undefined") {
    return createClient(supabaseUrl!, supabaseAnonKey!);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
  }

  return browserClient;
}
