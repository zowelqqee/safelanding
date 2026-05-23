import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Globe,
  MapPin,
  Route,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrackPageEvent } from "@/components/analytics/track-page-event";
import { FeedbackCard } from "@/components/feedback/feedback-card";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import { buildMoveBrief } from "@/lib/move-brief/build-move-brief";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { getProfileLanguage } from "@/lib/profile/profile-labels";

export const metadata = {
  title: "Move Brief — Soft Landing",
};

const COPY = {
  en: {
    backToRoadmap: "Back to roadmap",
    kicker: "Move Brief",
    title: "Your Move Brief",
    intro:
      "A clear summary of your destination, legal path, blockers, and next step.",
    currentStage: "Current stage",
    destination: "Destination",
    moveGoal: "Move goal",
    destinationSummary: "Destination summary",
    destinationSummaryText:
      "Where you are planning to go and what route you are currently building around.",
    country: "Country",
    city: "City",
    legalPath: "Legal path",
    goal: "Goal",
    userProfileSummary: "User profile summary",
    userProfileSummaryText:
      "The current facts your roadmap and fit logic are using.",
    mainBlockers: "Main blockers",
    mainBlockersText:
      "Pressure points to verify before this plan becomes document-ready.",
    blocker: "Blocker",
    fitSummary: "Fit summary",
    fitSummaryText:
      "A high-level fit view based on your current profile and selection.",
    overallFit: "Overall fit",
    lifestyleFit: "Lifestyle fit",
    legalFit: "Legal fit",
    nextStep: "Recommended next step",
    nextStepText:
      "The safest next move before any document-level work exists in product.",
    primaryNextStep: "Primary next step",
    primaryNextStepTitle: "Request partner-reviewed document guidance",
    primaryNextStepBody:
      "Use this brief to prepare a cleaner handoff before document guidance is unlocked.",
    requestPartnerReview: "Request partner review",
    compare: "Compare",
    reviewRoadmap: "Review roadmap",
    editMoveProfile: "Edit move profile",
    preparedForPartnerReview: "Prepared for partner review",
    preparedForPartnerReviewText:
      "A clean summary you can use before the partner-reviewed layer is fully active.",
    partnerReviewBody:
      "This brief can later be shared with a verified relocation partner or agency so they can understand your situation faster.",
    noSubmission:
      "No submission, payment, upload, or external integration is active yet.",
    legalDisclaimer:
      "This brief is a planning summary, not legal advice. Requirements vary and should be verified before applying.",
    emptyTitle: "Build your move brief",
    emptyBody:
      "Finish your destination, legal path, and roadmap choices first, then we'll summarize your plan here.",
    viewRoadmap: "View roadmap",
    startOnboarding: "Start onboarding",
  },
  ru: {
    backToRoadmap: "Назад к роадмапу",
    kicker: "Move Brief",
    title: "Ваш Move Brief",
    intro:
      "Короткая сводка по направлению, легальному пути, главным блокерам и следующему шагу.",
    currentStage: "Текущий этап",
    destination: "Направление",
    moveGoal: "Цель переезда",
    destinationSummary: "Сводка по направлению",
    destinationSummaryText:
      "Куда вы планируете ехать и вокруг какого маршрута сейчас строится план.",
    country: "Страна",
    city: "Город",
    legalPath: "Легальный путь",
    goal: "Цель",
    userProfileSummary: "Сводка профиля",
    userProfileSummaryText:
      "Какие факты сейчас использует ваш роадмап и fit-логика.",
    mainBlockers: "Главные блокеры",
    mainBlockersText:
      "Что нужно перепроверить, прежде чем план станет пригодным для документов.",
    blocker: "Блокер",
    fitSummary: "Сводка по fit",
    fitSummaryText:
      "Верхнеуровневая оценка на основе текущего профиля и выбранного направления.",
    overallFit: "Общий fit",
    lifestyleFit: "Lifestyle fit",
    legalFit: "Legal fit",
    nextStep: "Рекомендуемый следующий шаг",
    nextStepText:
      "Самое безопасное следующее действие, пока в продукте нет документного слоя.",
    primaryNextStep: "Главный следующий шаг",
    primaryNextStepTitle:
      "Запросить проверенные рекомендации по документам через partner review",
    primaryNextStepBody:
      "Используйте brief как аккуратную передачу контекста перед тем, как появится слой с документными рекомендациями.",
    requestPartnerReview: "Запросить partner review",
    compare: "Сравнить",
    reviewRoadmap: "Посмотреть роадмап",
    editMoveProfile: "Изменить профиль переезда",
    preparedForPartnerReview: "Подготовлено для partner review",
    preparedForPartnerReviewText:
      "Чистая сводка, которую можно использовать до полного запуска партнёрского слоя.",
    partnerReviewBody:
      "Позже этот brief можно будет передать проверенному relocation-партнёру или агентству, чтобы они быстрее поняли вашу ситуацию.",
    noSubmission:
      "Отправка, оплата, загрузка файлов и внешние интеграции пока не активны.",
    legalDisclaimer:
      "Этот brief нужен для планирования и не является юридической консультацией. Требования отличаются и должны быть перепроверены до подачи.",
    emptyTitle: "Сначала соберите Move Brief",
    emptyBody:
      "Сначала завершите выбор направления, легального пути и ключевых шагов роадмапа, а потом здесь появится сводка плана.",
    viewRoadmap: "Открыть роадмап",
    startOnboarding: "Начать онбординг",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

export default async function MoveBriefPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    return (
      <div className="mx-auto flex max-w-xl px-4 py-8">
        <EmptyState language="en" />
      </div>
    );
  }

  const language = getProfileLanguage(profile);
  const copy = COPY[language];
  const brief = buildMoveBrief(profile, language);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <TrackPageEvent
        eventName="move_brief_viewed"
        payload={{
          moveProfileId: profile.id,
          countryId: profile.selected_country_id,
          cityId: profile.selected_city_id,
          legalPathId: profile.selected_legal_path_id,
        }}
      />
      <div className="space-y-4">
        <section className="city-card overflow-hidden rounded-[28px]">
          <div className="border-b border-[var(--city-border)] bg-[var(--city-warm-muted)] px-5 py-6 md:px-7">
            <Link
              href="/app/roadmap"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--city-muted-fg)] transition-colors hover:text-stone-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {copy.backToRoadmap}
            </Link>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <p className="city-section-kicker">{copy.kicker}</p>
                <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900 md:text-3xl">
                  {copy.title}
                </h1>
                <p className="max-w-xl text-sm leading-relaxed text-[var(--city-muted-fg)] md:text-base">
                  {copy.intro}
                </p>
              </div>

              <div className="city-card rounded-2xl px-4 py-3 text-right">
                <p className="city-section-kicker mb-1">{copy.currentStage}</p>
                <p className="font-serif text-lg font-medium text-stone-900">
                  {brief.destination.currentStage}
                </p>
                <p className="mt-0.5 text-xs text-[var(--city-muted-fg)]">
                  {brief.destination.legalPath}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-5 md:grid-cols-2 md:px-7">
            <SummaryCard icon={MapPin} label={copy.destination} value={brief.headline} />
            <SummaryCard
              icon={Route}
              label={copy.moveGoal}
              value={brief.destination.moveGoal}
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Card>
              <CardHeader
                title={copy.destinationSummary}
                subtitle={copy.destinationSummaryText}
              />
              <div className="space-y-4 px-5 py-5">
                <div>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">
                    {brief.headline}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {brief.destination.legalPath}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailCard label={copy.country} value={brief.destination.country} />
                  <DetailCard label={copy.city} value={brief.destination.city} />
                  <DetailCard label={copy.legalPath} value={brief.destination.legalPath} />
                  <DetailCard
                    label={copy.currentStage}
                    value={brief.destination.currentStage}
                  />
                </div>

                <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/40 px-4 py-4">
                  <p className="city-section-kicker mb-1.5">{copy.goal}</p>
                  <p className="text-sm font-medium text-stone-900">
                    {brief.destination.moveGoal}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title={copy.userProfileSummary}
                subtitle={copy.userProfileSummaryText}
              />
              <div className="divide-y paper-divider">
                {brief.profileSummary.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 px-5 py-4">
                    <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="editorial-kicker text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader
                title={copy.mainBlockers}
                subtitle={copy.mainBlockersText}
              />
              <div className="space-y-3 px-5 py-5">
                {brief.blockers.map((blocker) => (
                  <div
                    key={blocker}
                    className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
                      <div>
                        <p className="editorial-kicker text-amber-700">
                          {copy.blocker}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-amber-950">
                          {blocker}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader title={copy.fitSummary} subtitle={copy.fitSummaryText} />
              <div className="space-y-3 px-5 py-5">
                <FitCard label={copy.overallFit} fit={brief.fit.overall} />
                <FitCard label={copy.lifestyleFit} fit={brief.fit.lifestyle} />
                <FitCard label={copy.legalFit} fit={brief.fit.legal} />
              </div>
            </Card>

            <Card>
              <CardHeader title={copy.nextStep} subtitle={copy.nextStepText} />
              <div className="space-y-4 px-5 py-5">
                <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-4 py-4">
                  <p className="city-section-kicker mb-1.5">{copy.primaryNextStep}</p>
                  <p className="text-sm font-medium text-stone-900">
                    {copy.primaryNextStepTitle}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--city-muted-fg)]">
                    {copy.primaryNextStepBody}
                  </p>
                </div>

                <div className="space-y-2">
                  <Link href="/app/partner-review" className="block">
                    <Button className="h-10 w-full justify-between gap-2 rounded-full">
                      {copy.requestPartnerReview}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/app/explore" className="block">
                    <Button
                      variant="outline"
                      className="h-11 w-full justify-between gap-2"
                    >
                      {copy.compare}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/app/roadmap" className="block">
                    <Button
                      variant="outline"
                      className="h-11 w-full justify-between gap-2"
                    >
                      {copy.reviewRoadmap}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/app/profile" className="block">
                    <Button
                      variant="outline"
                      className="h-11 w-full justify-between gap-2"
                    >
                      {copy.editMoveProfile}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader
                title={copy.preparedForPartnerReview}
                subtitle={copy.preparedForPartnerReviewText}
              />
              <div id="partner-review" className="space-y-4 px-5 py-5 scroll-mt-24">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {copy.partnerReviewBody}
                </p>

                <div className="rounded-2xl border border-dashed bg-muted/35 px-4 py-4">
                  <p className="text-sm leading-relaxed text-foreground">
                    {copy.noSubmission}
                  </p>
                </div>

                <Link href="/app/partner-review" className="block">
                  <Button className="h-11 w-full gap-2">
                    {copy.requestPartnerReview}
                  </Button>
                </Link>
              </div>
            </Card>

            <div className="rounded-2xl border border-dashed px-4 py-4 text-sm text-muted-foreground">
              {copy.legalDisclaimer}
            </div>
          </div>
        </section>

        <FeedbackCard
          moveProfileId={profile.id}
          source="move_brief"
          mode="move_brief"
          language={language}
        />
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="city-card overflow-hidden rounded-[24px]">{children}</section>;
}

function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-[var(--city-border)] px-5 py-4">
      <h2 className="text-sm font-semibold tracking-tight text-stone-900">{title}</h2>
      <p className="mt-1 text-xs leading-relaxed text-[var(--city-muted-fg)]">{subtitle}</p>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/50 px-4 py-4">
      <div className="mb-2 flex items-center gap-2 city-section-kicker">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm font-medium leading-snug text-stone-900">{value}</p>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/40 px-4 py-4">
      <p className="city-section-kicker mb-1.5">{label}</p>
      <p className="text-sm font-medium leading-snug text-stone-900">{value}</p>
    </div>
  );
}

function FitCard({
  label,
  fit,
}: {
  label: string;
  fit: { label: string; tone: "strong" | "medium" | "weak"; score?: number };
}) {
  const fitColor =
    fit.tone === "strong"
      ? "text-emerald-700 border-emerald-200 bg-emerald-50"
      : fit.tone === "weak"
        ? "text-rose-700 border-rose-200 bg-rose-50"
        : "text-amber-700 border-amber-200 bg-amber-50";

  return (
    <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/40 px-4 py-4">
      <p className="city-section-kicker mb-2">{label}</p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-stone-900">{fit.label}</span>
        {typeof fit.score === "number" && (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${fitColor}`}
          >
            {fit.score}%
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ language }: { language: UiLanguage }) {
  const copy = COPY[language];

  return (
    <div className="w-full city-card rounded-[28px] p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]">
        <CheckCircle2 className="h-6 w-6 text-stone-600" />
      </div>
      <h1 className="mt-5 font-serif text-2xl font-medium text-stone-900">
        {copy.emptyTitle}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">
        {copy.emptyBody}
      </p>
      <Link href="/app/roadmap" className="mt-6 inline-flex">
        <Button size="lg" className="gap-2 rounded-full">
          {copy.viewRoadmap}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
      <Link href="/start" className="mt-3 ml-3 inline-flex">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-full border-[var(--city-border)]"
        >
          {copy.startOnboarding}
          <Globe className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
