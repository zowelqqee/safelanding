"use client";

import { CheckCircle, MapPin, Route, AlertTriangle, ArrowRight, Clock, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCountryById } from "@/lib/data/countries";
import { getCityById } from "@/lib/data/cities";
import { getLegalPathById } from "@/lib/data/legal-paths";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import type { OnboardingState } from "@/types";

const COPY = {
  en: {
    title: "Your move plan is ready",
    subtitle: "Here's what you've chosen. Review it before we build your roadmap.",
    destination: "Destination",
    legalPath: "Legal path",
    preparationTime: "Preparation time",
    blockers: "Top blockers to watch",
    firstStep: "Your first step",
    planSnapshot: "Plan snapshot",
    moveBrief: "Move Brief",
    moveBriefText:
      "Next we'll turn this into a roadmap and a brief you can use to discuss the plan clearly.",
    verificationNote:
      "Legal requirements still need source-level verification before you treat this as a document plan.",
    createRoadmap: "Create my roadmap",
    changePath: "← Change legal path",
    nextStep: {
      remote: "Confirm your timeline, budget, and work details before you move into partner-reviewed guidance later.",
      study: "Confirm your timeline, study status, and budget before you move into the next roadmap stage.",
      work: "Confirm your timing, work status, and financial reality before you move into the next roadmap stage.",
      exploration: "Plan your scouting trip and research neighborhoods in person",
      family: "Confirm who is moving with you and what practical constraints that creates for the plan.",
      capital: "Pressure-test your financial reality before you move into the next roadmap stage.",
      talent: "Confirm your profile strength, timing, and employer or portfolio evidence before you move into the next stage.",
      business: "Pressure-test your business activity, income proof, and setup timeline before you move into the next stage.",
      fallback: "Review your move profile and create your roadmap.",
    },
  },
  ru: {
    title: "План переезда готов",
    subtitle: "Проверьте выбранное направление и путь перед созданием роадмапа.",
    destination: "Направление",
    legalPath: "Легальный путь",
    preparationTime: "Время подготовки",
    blockers: "Главные блокеры",
    firstStep: "Первый шаг",
    planSnapshot: "Снимок плана",
    moveBrief: "Move Brief",
    moveBriefText:
      "Дальше мы превратим это в роадмап и brief, с которым план проще обсуждать.",
    verificationNote:
      "Юридические требования всё равно нужно проверять по источникам, прежде чем считать это документным планом.",
    createRoadmap: "Создать роадмап",
    changePath: "← Изменить легальный путь",
    nextStep: {
      remote: "Подтвердите сроки, бюджет и рабочие детали перед переходом к проверенным партнёрским рекомендациям.",
      study: "Подтвердите сроки, учебный статус и бюджет перед следующим этапом роадмапа.",
      work: "Подтвердите сроки, рабочий статус и финансовую реальность перед следующим этапом.",
      exploration: "Спланируйте разведочную поездку и изучите районы на месте.",
      family: "Подтвердите, кто переезжает с вами и какие ограничения это создаёт для плана.",
      capital: "Проверьте финансовую реальность перед следующим этапом роадмапа.",
      talent: "Проверьте силу профиля, сроки и доказательства от работодателя или портфолио перед следующим этапом.",
      business: "Проверьте бизнес-активность, подтверждение дохода и сроки подготовки перед следующим этапом.",
      fallback: "Проверьте профиль переезда и создайте роадмап.",
    },
  },
} satisfies Record<UiLanguage, {
  title: string;
  subtitle: string;
  destination: string;
  legalPath: string;
  preparationTime: string;
  blockers: string;
  firstStep: string;
  planSnapshot: string;
  moveBrief: string;
  moveBriefText: string;
  verificationNote: string;
  createRoadmap: string;
  changePath: string;
  nextStep: Record<string, string>;
}>;

interface Props {
  state: OnboardingState;
  onConfirm: () => void;
  onBack: () => void;
  language: UiLanguage;
}

export function StepPlanReady({ state, onConfirm, onBack, language }: Props) {
  const country = getCountryById(state.selectedCountry);
  const city = getCityById(state.selectedCity);
  const path = getLegalPathById(state.selectedLegalPath);

  if (!country || !city || !path) return null;

  const blockers = path.weakPoints.slice(0, 3);
  const copy = COPY[language];
  const nextStep = copy.nextStep[path.scenario] ?? copy.nextStep.fallback;

  return (
    <div className="flex flex-col flex-1 gap-6 pt-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--city-warm-muted)] border border-[var(--city-border)] mb-4">
          <CheckCircle className="h-7 w-7 text-stone-600" />
        </div>
        <h2 className="font-serif text-2xl font-medium text-stone-900 mb-1">{copy.title}</h2>
        <p className="text-sm text-[var(--city-muted-fg)]">
          {copy.subtitle}
        </p>
      </div>

      <div>
        <div className="city-section-kicker mb-2">{copy.planSnapshot}</div>
        <div className="city-card rounded-[18px] divide-y divide-[var(--city-border)]">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-2xl">{country.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="city-section-kicker">{copy.destination}</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{city.name}, {country.name}</div>
          </div>
          <MapPin className="h-4 w-4 text-[var(--city-muted-fg)] shrink-0" />
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--city-warm-muted)] border border-[var(--city-border)] flex items-center justify-center shrink-0">
            <Route className="h-4 w-4 text-stone-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="city-section-kicker">{copy.legalPath}</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{path.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--city-warm-muted)] border border-[var(--city-border)] flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4 text-stone-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="city-section-kicker">{copy.preparationTime}</div>
            <div className="text-sm font-semibold text-stone-900 mt-0.5">{path.estimatedPreparationTime}</div>
          </div>
        </div>
        </div>
      </div>

      {blockers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-stone-900">{copy.blockers}</span>
          </div>
          <div className="flex flex-col gap-2">
            {blockers.map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-amber-900 bg-amber-50 border border-amber-200/70 rounded-xl px-3 py-2.5">
                <span className="text-amber-600 font-semibold shrink-0">{i + 1}.</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl bg-[var(--city-warm-muted)] border border-[var(--city-border)] px-4 py-3">
        <div className="city-section-kicker mb-1">{copy.firstStep}</div>
        <p className="text-sm text-stone-800 leading-relaxed">{nextStep}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-4">
          <div className="mb-2 flex items-center gap-2 city-section-kicker">
            <FileText className="h-3.5 w-3.5" />
            {copy.moveBrief}
          </div>
          <p className="text-sm leading-relaxed text-stone-800">{copy.moveBriefText}</p>
        </div>
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-4">
          <div className="mb-2 flex items-center gap-2 city-section-kicker">
            <ShieldCheck className="h-3.5 w-3.5" />
            {language === "ru" ? "Проверка" : "Verification"}
          </div>
          <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">{copy.verificationNote}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pb-6">
        <Button onClick={onConfirm} className="h-12 gap-2 text-base rounded-full">
          {copy.createRoadmap}
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack} className="text-[var(--city-muted-fg)]">
          {copy.changePath}
        </Button>
      </div>
    </div>
  );
}
