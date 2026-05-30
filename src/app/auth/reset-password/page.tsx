"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site/site-header";
import { updatePassword } from "@/lib/auth/authService";
import { useUiLanguage } from "@/hooks/useUiLanguage";
import { translateAuthError } from "@/lib/auth/authErrors";
import { createClient } from "@/lib/supabase/client";
import type { UiLanguage } from "@/lib/i18n/onboarding";

const COPY = {
  en: {
    kicker: "Soft Landing",
    title: "Create new password",
    subtitle: "Choose a strong password for your account.",
    password: "New password",
    passwordPlaceholder: "At least 8 characters",
    confirm: "Confirm password",
    confirmPlaceholder: "Repeat your password",
    submit: "Save new password",
    errorShort: "Password must be at least 8 characters.",
    errorMatch: "Passwords don't match.",
    successTitle: "Password updated",
    successSubtitle: "Your password has been changed successfully.",
    goToApp: "Continue to app",
    noSession: "This link is invalid or has already been used.",
    goToForgot: "Request a new reset link",
  },
  ru: {
    kicker: "Soft Landing",
    title: "Новый пароль",
    subtitle: "Придумайте надёжный пароль для вашего аккаунта.",
    password: "Новый пароль",
    passwordPlaceholder: "Минимум 8 символов",
    confirm: "Повторите пароль",
    confirmPlaceholder: "Введите пароль ещё раз",
    submit: "Сохранить пароль",
    errorShort: "Пароль должен содержать минимум 8 символов.",
    errorMatch: "Пароли не совпадают.",
    successTitle: "Пароль изменён",
    successSubtitle: "Пароль успешно обновлён.",
    goToApp: "Продолжить",
    noSession: "Ссылка недействительна или уже была использована.",
    goToForgot: "Запросить новую ссылку",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

type View = "loading" | "form" | "success" | "invalid";

export default function ResetPasswordPage() {
  const router = useRouter();
  const language = useUiLanguage();
  const copy = COPY[language];

  const [view, setView] = useState<View>("loading");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verify the user has a valid recovery session
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setView("form");
      } else {
        setView("invalid");
      }
    });
  }, []);

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
    const { error: authError } = await updatePassword(password);
    setLoading(false);

    if (authError) {
      setError(translateAuthError(authError.message, language));
      return;
    }

    setView("success");
  }

  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" action="none" />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="city-card rounded-[28px] p-8 space-y-6">

            {view === "loading" && (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--city-muted-fg)]" />
              </div>
            )}

            {view === "invalid" && (
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl border border-amber-200 bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="font-serif text-xl font-medium text-stone-900">{copy.noSession}</h1>
                </div>
                <Link href="/auth/forgot-password">
                  <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)]">
                    {copy.goToForgot}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}

            {view === "form" && (
              <>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-stone-700" />
                  </div>
                  <div>
                    <p className="city-section-kicker mb-1">{copy.kicker}</p>
                    <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">{copy.title}</h1>
                    <p className="text-sm text-[var(--city-muted-fg)] mt-1.5">{copy.subtitle}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
              </>
            )}

            {view === "success" && (
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-12 h-12 rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-stone-700" />
                </div>
                <div className="space-y-1.5">
                  <h1 className="font-serif text-2xl font-medium text-stone-900">{copy.successTitle}</h1>
                  <p className="text-sm text-[var(--city-muted-fg)]">{copy.successSubtitle}</p>
                </div>
                <Button
                  className="gap-2 rounded-full"
                  onClick={() => { router.push("/start"); router.refresh(); }}
                >
                  {copy.goToApp}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
