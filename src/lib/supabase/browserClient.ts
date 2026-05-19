import { createClient } from "@supabase/supabase-js";

let instance: ReturnType<typeof createClient> | null = null;

export function getBrowserClient() {
  if (typeof window === "undefined") return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  if (!url || !key || url.includes("placeholder")) return null;

  if (!instance) {
    instance = createClient(url, key);
  }
  return instance;
}
