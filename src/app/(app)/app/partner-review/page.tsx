import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PartnerReviewForm } from "@/components/partner-review/partner-review-form";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import { buildMoveBrief } from "@/lib/move-brief/build-move-brief";
import {
  getCurrentUserWithMoveProfile,
} from "@/lib/profile/profileServer";
import { getProfileLanguage } from "@/lib/profile/profile-labels";
import { getPartnerReviewRequestServer } from "@/lib/partner-review/partner-review-server";

export const metadata = {
  title: "Request Partner Review — Soft Landing",
};

const COPY = {
  en: {
    emptyTitle: "Build your Move Brief first",
    emptyBody:
      "Choose your destination, legal path, and roadmap details first, then you can request partner review here.",
    viewRoadmap: "View roadmap",
    backToMoveBrief: "Back to Move Brief",
    badge: "Partner review",
    title: "Request partner review",
    intro:
      "We'll use your Move Brief to help a verified relocation partner understand your situation faster.",
    moveBrief: "Move brief",
    currentStage: "Current stage",
    moveGoal: "Move goal",
    footnote:
      "This request saves contact context only. No document checklist, file upload, payment, or real partner integration is active yet.",
  },
  ru: {
    emptyTitle: "Сначала соберите Move Brief",
    emptyBody:
      "Сначала выберите направление, легальный путь и ключевые детали роадмапа, а потом здесь можно будет запросить partner review.",
    viewRoadmap: "Открыть роадмап",
    backToMoveBrief: "Назад к Move Brief",
    badge: "Partner review",
    title: "Запросить partner review",
    intro:
      "Мы используем ваш Move Brief, чтобы проверенный relocation-партнёр быстрее понял вашу ситуацию.",
    moveBrief: "Move Brief",
    currentStage: "Текущий этап",
    moveGoal: "Цель переезда",
    footnote:
      "Здесь сохраняется только контактный контекст. Чеклист документов, загрузка файлов, оплата и реальные внешние интеграции пока не активны.",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

export default async function PartnerReviewPage() {
  const { user, profile } = await getCurrentUserWithMoveProfile();
  const language = getProfileLanguage(profile);
  const copy = COPY[language];

  if (!user || !profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="city-card rounded-[28px] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]">
            <FileText className="h-6 w-6 text-stone-600" />
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
        </div>
      </div>
    );
  }

  const existingRequest = await getPartnerReviewRequestServer(user.id, profile.id);
  const brief = buildMoveBrief(profile, language);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
      <div className="space-y-5">
        <section className="city-card overflow-hidden rounded-[28px]">
          <div className="border-b border-[var(--city-border)] bg-[var(--city-warm-muted)] px-5 py-6 md:px-7">
            <Link
              href="/app/move-brief"
              className="inline-flex items-center gap-2 text-sm text-[var(--city-muted-fg)] transition-colors hover:text-stone-900"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.backToMoveBrief}
            </Link>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--city-border)] bg-[var(--city-card)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {copy.badge}
                </span>
                <div className="space-y-1">
                  <h1 className="font-serif text-2xl font-medium text-stone-900 md:text-3xl">
                    {copy.title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-[var(--city-muted-fg)] md:text-base">
                    {copy.intro}
                  </p>
                </div>
              </div>

              <div className="city-card rounded-2xl px-4 py-3 text-right">
                <p className="city-section-kicker">{copy.moveBrief}</p>
                <p className="mt-1 text-base font-semibold text-stone-900">
                  {brief.headline}
                </p>
                <p className="text-xs text-[var(--city-muted-fg)]">
                  {brief.destination.legalPath}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-5 md:grid-cols-2 md:px-7">
            <SummaryCard label={copy.currentStage} value={brief.destination.currentStage} />
            <SummaryCard label={copy.moveGoal} value={brief.destination.moveGoal} />
          </div>
        </section>

        <PartnerReviewForm
          moveProfileId={profile.id}
          selectedCountryId={profile.selected_country_id}
          selectedCityId={profile.selected_city_id}
          selectedLegalPathId={profile.selected_legal_path_id}
          initialEmail={existingRequest?.email ?? user.email ?? ""}
          initialMessage={existingRequest?.message ?? ""}
          initialConsent={existingRequest?.consent_given ?? false}
          existingRequest={existingRequest}
          language={language}
        />

        <div className="rounded-2xl border border-dashed border-[var(--city-border)] bg-[var(--city-warm-muted)]/40 px-4 py-4 text-sm text-[var(--city-muted-fg)]">
          {copy.footnote}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-4">
      <p className="city-section-kicker">{label}</p>
      <p className="mt-2 text-sm font-medium leading-relaxed text-stone-900">{value}</p>
    </div>
  );
}
