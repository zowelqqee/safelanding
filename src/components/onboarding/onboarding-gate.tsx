"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MapPin, LogIn, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUiLanguage } from "@/hooks/useUiLanguage";
import { SiteHeader } from "@/components/site/site-header";
import { OnboardingFlow } from "./onboarding-flow";
import type { UiLanguage } from "@/lib/i18n/onboarding";

type GateView = "gate" | "preview";

const COPY = {
  en: {
    loading: "Loading your move profile...",
    title: "Find where you fit",
    subtitle:
      "Answer a few questions. Get a ranked country shortlist, city match, and legal path — tailored to your profile.",
    start: "Start — no account needed",
    saveProgress: "or save your progress",
    createAccount: "Create free account",
    signIn: "Already have an account? Sign in",
  },
  ru: {
    loading: "Загружаем профиль переезда...",
    title: "Найдите своё направление",
    subtitle:
      "Ответьте на несколько вопросов. Получите подборку стран, подходящий город и варианты визы или ВНЖ под ваш профиль.",
    start: "Начать без аккаунта",
    saveProgress: "или сохраните прогресс",
    createAccount: "Создать бесплатный аккаунт",
    signIn: "Уже есть аккаунт? Войти",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

type OnboardingGateProps = {
  initialLanguage?: UiLanguage;
};

export function OnboardingGate({ initialLanguage = "en" }: OnboardingGateProps) {
  const { user, loading } = useAuth();
  const language = useUiLanguage(initialLanguage);
  const copy = COPY[language];
  const [view, setView] = useState<GateView>("gate");
  const router = useRouter();

  let content: ReactNode;

  if (loading) {
    content = (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {copy.loading}
        </p>
      </div>
    );
  } else if (user) {
    content = <OnboardingFlow isPreview={false} />;
  } else if (view === "preview") {
    content = <OnboardingFlow isPreview={true} />;
  } else {
    content = (
      <div className="flex flex-1 flex-col items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--city-warm-muted)] border border-[var(--city-border)] flex items-center justify-center">
              <MapPin className="h-6 w-6 text-stone-600" />
            </div>
            <div className="space-y-1.5">
              <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">{copy.title}</h1>
              <p className="text-sm text-[var(--city-muted-fg)] leading-relaxed max-w-xs mx-auto">
                {copy.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="h-12 gap-2 text-base rounded-full"
              onClick={() => setView("preview")}
            >
              {copy.start}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[var(--city-border)]" />
              <span className="text-xs text-[var(--city-muted-fg)]">{copy.saveProgress}</span>
              <div className="flex-1 h-px bg-[var(--city-border)]" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 rounded-full border-[var(--city-border)] text-stone-700"
              onClick={() => router.push("/auth/sign-up")}
            >
              {copy.createAccount}
            </Button>

            <button
              className="text-xs text-[var(--city-muted-fg)] hover:text-stone-700 transition-colors flex items-center justify-center gap-1"
              onClick={() => router.push("/auth/sign-in")}
            >
              <LogIn className="h-3 w-3" />
              {copy.signIn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" action="none" initialLanguage={language} />
      {content}
    </div>
  );
}
