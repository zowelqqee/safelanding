import { createClient } from "@/lib/supabase/client";

const DEFAULT_POST_CONFIRM_PATH = "/start";

function getAuthCallbackUrl(nextPath = DEFAULT_POST_CONFIRM_PATH) {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : configuredOrigin?.replace(/\/$/, "");

  if (!origin) {
    return undefined;
  }

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", nextPath.startsWith("/") ? nextPath : DEFAULT_POST_CONFIRM_PATH);

  return callbackUrl.toString();
}

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getAuthCallbackUrl(),
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
