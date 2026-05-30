"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2, Mail, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site/site-header";
import { resetPasswordForEmail } from "@/lib/auth/authService";
import { useUiLanguage } from "@/hooks/useUiLanguage";
import { translateAuthError } from "@/lib/auth/authErrors";
import type { UiLanguage } from "@/lib/i18n/onboarding";

const RESEND_COOLDOWN = 60;

const COPY = {
  en: {
    kicker: "Soft Landing",
    title: "Reset your password",
    subtitle: "Enter your email and we'll send you a link to create a new password.",
    email: "Email",
    submit: "Send reset link",
    backToSignIn: "Back to sign in",
    // sent view
    sentTitle: "Check your inbox",
    sentSubtitle: (email: string) =>
      `We sent a password reset link to ${email}. Click it to create a new password.`,
    sentNote: "The link expires in 1 hour. Check spam if you don't see it.",
    resend: "Resend link",
    resendCooldown: (s: number) => `Resend in ${s}s`,
    resendDone: "Sent again! Check your inbox.",
    wrongEmail: "Wrong email? Go back",
  },
  ru: {
    kicker: "Soft Landing",
    title: "Сброс пароля",
    subtitle: "Укажите email — мы отправим ссылку для создания нового пароля.",
    email: "Электронная почта",
    submit: "Отправить ссылку",
    backToSignIn: "Назад ко входу",
    // экран «отправлено»
    sentTitle: "Проверьте почту",
    sentSubtitle: (email: string) =>
      `Мы отправили ссылку для сброса пароля на ${email}. Перейдите по ней, чтобы создать новый пароль.`,
    sentNote: "Ссылка действует 1 час. Если письма нет — проверьте папку «Спам».",
    resend: "Отправить повторно",
    resendCooldown: (s: number) => `Повторная отправка через ${s} с`,
    resendDone: "Отправлено! Проверьте почту.",
    wrongEmail: "Неверный email? Назад",
  },
} satisfies Record<UiLanguage, {
  kicker: string; title: string; subtitle: string; email: string;
  submit: string; backToSignIn: string;
  sentTitle: string; sentSubtitle: (email: string) => string;
  sentNote: string; resend: string; resendCooldown: (s: number) => string;
  resendDone: string; wrongEmail: string;
}>;

type View = "form" | "sent";

export default function ForgotPasswordPage() {
  const language = useUiLanguage();
  const copy = COPY[language];

  const [view, setView] = useState<View>("form");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const { error: authError } = await resetPasswordForEmail(email);
    setLoading(false);

    if (authError) {
      setError(translateAuthError(authError.message, language));
      return;
    }

    setView("sent");
    startCooldown();
  }

  async function handleResend() {
    if (cooldown > 0) return;
    setResendInfo("");
    const { error: authError } = await resetPasswordForEmail(email);
    if (!authError) {
      setResendInfo("sent");
      startCooldown();
    }
  }

  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" action="sign-in" />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="city-card rounded-[28px] p-8 space-y-6">

            {view === "form" ? (
              <>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                    <Mail className="h-5 w-5 text-stone-700" />
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

                <p className="text-center">
                  <Link
                    href="/auth/sign-in"
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--city-muted-fg)] hover:text-stone-900 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {copy.backToSignIn}
                  </Link>
                </p>
              </>
            ) : (
              /* ── Sent view ── */
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                  <Mail className="h-6 w-6 text-stone-700" />
                </div>

                <div className="space-y-2">
                  <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">
                    {copy.sentTitle}
                  </h1>
                  <p className="text-sm text-[var(--city-muted-fg)] leading-relaxed">
                    {copy.sentSubtitle(email)}
                  </p>
                  <p className="text-xs text-[var(--city-muted-fg)]">
                    {copy.sentNote}
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
