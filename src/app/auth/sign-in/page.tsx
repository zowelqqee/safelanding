"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site/site-header";
import { signInWithEmail } from "@/lib/auth/authService";
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
