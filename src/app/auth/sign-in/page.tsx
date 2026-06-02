"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site/site-header";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth/authService";
import { getCurrentMoveProfile } from "@/lib/profile/profileService";
import { useUiLanguage } from "@/hooks/useUiLanguage";
import { translateAuthError } from "@/lib/auth/authErrors";
import type { UiLanguage } from "@/lib/i18n/onboarding";

const COPY = {
  en: {
    kicker: "Soft Landing",
    title: "Welcome back",
    subtitle: "Sign in to continue your move planning.",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "Your password",
    forgotPassword: "Forgot password?",
    submit: "Sign in",
    noAccount: "Don't have an account?",
    createProfile: "Create profile",
    errorConfirmFailed: "The confirmation link is invalid or has expired. Try signing in to get a new one.",
    errorNotConfirmed: "Please confirm your email first. Check your inbox for the confirmation link.",
  },
  ru: {
    kicker: "Soft Landing",
    title: "С возвращением",
    subtitle: "Войдите, чтобы продолжить планирование переезда.",
    email: "Электронная почта",
    password: "Пароль",
    passwordPlaceholder: "Ваш пароль",
    forgotPassword: "Забыли пароль?",
    submit: "Войти",
    noAccount: "Ещё нет аккаунта?",
    createProfile: "Создать профиль",
    errorConfirmFailed: "Ссылка недействительна или срок действия истёк. Войдите заново, чтобы получить новое письмо.",
    errorNotConfirmed: "Сначала подтвердите email. Найдите письмо в почте и перейдите по ссылке.",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = useUiLanguage();
  const copy = COPY[language];

  const urlError = searchParams.get("error");
  const initialError =
    urlError === "confirmation_failed" ? copy.errorConfirmFailed : "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: authError } = await signInWithEmail(email, password);
    setLoading(false);

    if (authError) {
      const msg = authError.message;
      if (msg.includes("Email not confirmed")) {
        setError(copy.errorNotConfirmed);
      } else {
        setError(translateAuthError(msg, language));
      }
      return;
    }

    const profile = await getCurrentMoveProfile();
    const destination =
      profile?.selected_legal_path_id || profile?.active_step === "move_plan_ready"
        ? "/app/roadmap"
        : "/start";

    router.replace(destination);
    router.refresh();
  }

  return (
    <div className="city-card rounded-[28px] p-8 space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-10 h-10 rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
          <MapPin className="h-5 w-5 text-stone-700" />
        </div>
        <div>
          <p className="city-section-kicker mb-1">{copy.kicker}</p>
          <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">{copy.title}</h1>
          <p className="text-sm text-[var(--city-muted-fg)] mt-1.5">{copy.subtitle}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 gap-3 rounded-full border-[var(--city-border)] text-stone-700"
        onClick={() => signInWithGoogle()}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="relative flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--city-border)]" />
        <span className="text-xs text-[var(--city-muted-fg)]">or</span>
        <div className="flex-1 h-px bg-[var(--city-border)]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-stone-800">{copy.email}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="border-[var(--city-border)] bg-[var(--city-card)] focus-visible:ring-stone-400"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-stone-800">{copy.password}</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-[var(--city-muted-fg)] hover:text-stone-900 transition-colors"
            >
              {copy.forgotPassword}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={copy.passwordPlaceholder}
            className="border-[var(--city-border)] bg-[var(--city-card)] focus-visible:ring-stone-400"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 gap-2 rounded-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {copy.submit}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--city-muted-fg)]">
        {copy.noAccount}{" "}
        <Link href="/auth/sign-up" className="text-stone-900 hover:underline font-medium">
          {copy.createProfile}
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" action="sign-in" />
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <Suspense fallback={null}>
            <SignInForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
