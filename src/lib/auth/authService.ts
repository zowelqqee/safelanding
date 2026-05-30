import { createClient } from "@/lib/supabase/client";

const DEFAULT_POST_CONFIRM_PATH = "/start";

function normalizeOrigin(origin: string | undefined) {
  return origin?.replace(/\/$/, "");
}

function isLocalhostOrigin(origin: string) {
  try {
    const hostname = new URL(origin).hostname;
    return ["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"].includes(hostname);
  } catch {
    return false;
  }
}

function getAuthCallbackUrl(nextPath = DEFAULT_POST_CONFIRM_PATH) {
  const configuredOrigin = normalizeOrigin(
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL
  );
  const safeConfiguredOrigin =
    configuredOrigin && !isLocalhostOrigin(configuredOrigin) ? configuredOrigin : undefined;
  const browserOrigin = typeof window !== "undefined" ? window.location.origin : undefined;
  const origin =
    safeConfiguredOrigin || (browserOrigin && !isLocalhostOrigin(browserOrigin) ? browserOrigin : undefined);

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
  const emailRedirectTo = getAuthCallbackUrl();

  return supabase.auth.signUp({
    email,
    password,
    options: emailRedirectTo ? { emailRedirectTo } : undefined,
  });
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function resendConfirmation(email: string) {
  const supabase = createClient();
  return supabase.auth.resend({ type: "signup", email });
}

export async function resetPasswordForEmail(email: string) {
  const supabase = createClient();
  const redirectTo = getAuthCallbackUrl("/auth/reset-password");
  return supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
}

export async function updatePassword(password: string) {
  const supabase = createClient();
  return supabase.auth.updateUser({ password });
}

export async function signOut() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
