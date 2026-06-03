"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, Loader2, Mail, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { SiteHeader } from "@/components/site/site-header";
import { signUpWithEmail, resendConfirmation, signInWithGoogle } from "@/lib/auth/authService";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { useUiLanguage } from "@/hooks/useUiLanguage";
import { translateAuthError } from "@/lib/auth/authErrors";
import type { UiLanguage } from "@/lib/i18n/onboarding";

const RESEND_COOLDOWN = 60;

const COPY = {
  en: {
    kicker: "Soft Landing",
    title: "Create your profile",
    subtitle: "Save your relocation progress, shortlist, and legal path.",
    google: "Continue with Google",
    divider: "or",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    confirm: "Confirm password",
    confirmPlaceholder: "Repeat your password",
    submit: "Create profile",
    hasAccount: "Already have an account?",
    signIn: "Sign in",
    errorShort: "Password must be at least 8 characters.",
    errorMatch: "Passwords don't match.",
    // check-email view
    checkTitle: "Check your inbox",
    checkSubtitle: (email: string) =>
      `We sent a confirmation link to ${email}. Click it to activate your account.`,
    checkNote: "The link expires in 24 hours. Check spam if you don't see it.",
    resend: "Resend email",
    resendCooldown: (s: number) => `Resend in ${s}s`,
    resendDone: "Sent! Check your inbox.",
    wrongEmail: "Wrong email? Go back",
  },
  ru: {
    kicker: "Soft Landing",
    title: "Создайте профиль",
    subtitle: "Сохраните прогресс, список стран и выбранный путь.",
    google: "Продолжить с Google",
    divider: "или",
    email: "Электронная почта",
    password: "Пароль",
    passwordPlaceholder: "Минимум 8 символов",
    confirm: "Повторите пароль",
    confirmPlaceholder: "Введите пароль ещё раз",
    submit: "Создать профиль",
    hasAccount: "Уже есть аккаунт?",
    signIn: "Войти",
    errorShort: "Пароль должен содержать минимум 8 символов.",
    errorMatch: "Пароли не совпадают.",
    // экран «проверьте почту»
    checkTitle: "Проверьте почту",
    checkSubtitle: (email: string) =>
      `Мы отправили ссылку для подтверждения на ${email}. Перейдите по ней, чтобы активировать аккаунт.`,
    checkNote: "Ссылка действует 24 часа. Если письма нет — проверьте папку «Спам».",
    resend: "Отправить повторно",
    resendCooldown: (s: number) => `Повторная отправка через ${s} с`,
    resendDone: "Отправлено! Проверьте почту.",
    wrongEmail: "Неверный email? Назад",
  },
} satisfies Record<UiLanguage, {
  kicker: string; title: string; subtitle: string; google: string; divider: string; email: string;
  password: string; passwordPlaceholder: string; confirm: string;
  confirmPlaceholder: string; submit: string; hasAccount: string; signIn: string;
  errorShort: string; errorMatch: string;
  checkTitle: string; checkSubtitle: (email: string) => string;
  checkNote: string; resend: string; resendCooldown: (s: number) => string;
  resendDone: string; wrongEmail: string;
}>;

type View = "form" | "check-email";

export default function SignUpPage() {
  const router = useRouter();
  const language = useUiLanguage();
  const copy = COPY[language];

  const [view, setView] = useState<View>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend cooldown
  const [cooldown, setCooldown] = useState(0);
  const [resendInfo, setResendInfo] = useState<"" | "sent">("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startCooldown() {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(copy.errorShort);
      return;
    }
    if (password !== confirm) {
      setError(copy.errorMatch);
      return;
    }

    setLoading(true);
    const { data, error: authError } = await signUpWithEmail(email, password);
    setLoading(false);

    if (authError) {
      setError(translateAuthError(authError.message, language));
      return;
    }

    void trackEvent("signup_completed");

    // Auto-confirmed (email confirmation disabled in Supabase settings)
    if (data.session) {
      router.push("/start");
      router.refresh();
      return;
    }

    // Needs email confirmation
    setView("check-email");
    startCooldown();
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setResendInfo("");
    const { error: resendError } = await resendConfirmation(email);
    if (!resendError) {
      setResendInfo("sent");
      startCooldown();
    }
  }

  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" action="sign-up" />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="city-card rounded-[28px] p-8 space-y-6">

            {view === "form" ? (
              <>
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

                <GoogleAuthButton label={copy.google} onClick={() => signInWithGoogle()} />

                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-[var(--city-border)]" />
                  <span className="text-xs text-[var(--city-muted-fg)]">{copy.divider}</span>
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
                    <Label htmlFor="password" className="text-sm font-medium text-stone-800">{copy.password}</Label>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={copy.passwordPlaceholder}
                      className="border-[var(--city-border)] bg-[var(--city-card)] focus-visible:ring-stone-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm" className="text-sm font-medium text-stone-800">{copy.confirm}</Label>
                    <Input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder={copy.confirmPlaceholder}
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
                  {copy.hasAccount}{" "}
                  <Link href="/auth/sign-in" className="text-stone-900 hover:underline font-medium">
                    {copy.signIn}
                  </Link>
                </p>
              </>
            ) : (
              /* ── Check email view ── */
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                  <Mail className="h-6 w-6 text-stone-700" />
                </div>

                <div className="space-y-2">
                  <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">
                    {copy.checkTitle}
                  </h1>
                  <p className="text-sm text-[var(--city-muted-fg)] leading-relaxed">
                    {copy.checkSubtitle(email)}
                  </p>
                  <p className="text-xs text-[var(--city-muted-fg)]">
                    {copy.checkNote}
                  </p>
                </div>

                {resendInfo === "sent" && (
                  <p className="text-sm text-[var(--accent-sage)] font-medium">
                    {copy.resendDone}
                  </p>
                )}

                <div className="w-full space-y-2">
                  <Button
                    variant="outline"
                    className="w-full h-10 gap-2 rounded-full border-[var(--city-border)]"
                    onClick={handleResend}
                    disabled={cooldown > 0}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {cooldown > 0 ? copy.resendCooldown(cooldown) : copy.resend}
                  </Button>

                  <button
                    type="button"
                    onClick={() => { setView("form"); setResendInfo(""); }}
                    className="w-full text-sm text-[var(--city-muted-fg)] hover:text-stone-900 transition-colors py-1"
                  >
                    {copy.wrongEmail}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
