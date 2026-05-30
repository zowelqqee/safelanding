import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  Route,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import { getCityById } from "@/lib/data/cities";
import { getCountryById } from "@/lib/data/countries";
import { getLegalPathById } from "@/lib/data/legal-paths";
import {
  formatPreferredLanguage,
  getNotSetLabel,
} from "@/lib/profile/profile-labels";
import { getServerLanguage } from "@/lib/i18n/server";
import { getCurrentUserWithMoveProfile } from "@/lib/profile/profileServer";
import { buildCountryMatchInputFromMoveProfile } from "@/lib/scoring/move-profile-match";
import { matchCountries } from "@/lib/scoring/country-matcher";
import {
  generateRoadmap,
  getMovePreparationLabel,
} from "@/lib/roadmap/roadmapGenerator";

const COPY = {
  en: {
    kicker: "Your account",
    title: "Profile",
    intro: "Your account, selections, and current move preparation snapshot.",
    account: "Account",
    name: "Name",
    email: "Email",
    moveSummary: "Move summary",
    city: "City",
    country: "Country",
    legalPath: "Legal path",
    lifestyleFit: "Lifestyle fit",
    legalFit: "Legal fit",
    movePreparation: "Move preparation",
    currentRoadmapStage: "Current roadmap stage",
    viewMoveBrief: "View Move Brief",
    requestPartnerReview: "Request partner review",
    profileState: "Profile state",
    onboardingCompleted: "Onboarding completed",
    activeStep: "Active step",
    savedCountries: "Saved countries",
    savedCities: "Saved cities",
    yes: "Yes",
    inProgress: "In progress",
    settings: "Settings",
    language: "Language",
    noProfile:
      "You're signed in, but you haven't created a move profile yet. Start onboarding to generate your roadmap.",
    startMove: "Start your move",
    footer: "Soft Landing v0.1 · Relocation intelligence",
    signOut: "Sign out",
    signingOut: "Signing out...",
  },
  ru: {
    kicker: "Ваш аккаунт",
    title: "Профиль",
    intro: "Аккаунт, выбранные направления и текущий срез по подготовке к переезду.",
    account: "Аккаунт",
    name: "Имя",
    email: "Email",
    moveSummary: "Сводка по переезду",
    city: "Город",
    country: "Страна",
    legalPath: "Легальный путь",
    lifestyleFit: "Lifestyle fit",
    legalFit: "Legal fit",
    movePreparation: "Готовность к переезду",
    currentRoadmapStage: "Текущий этап роадмапа",
    viewMoveBrief: "Открыть Move Brief",
    requestPartnerReview: "Запросить partner review",
    profileState: "Состояние профиля",
    onboardingCompleted: "Онбординг завершён",
    activeStep: "Текущий шаг",
    savedCountries: "Сохранённые страны",
    savedCities: "Сохранённые города",
    yes: "Да",
    inProgress: "В процессе",
    settings: "Настройки",
    language: "Язык",
    noProfile:
      "Вы вошли в аккаунт, но ещё не создали профиль переезда. Запустите онбординг, чтобы появился роадмап.",
    startMove: "Начать переезд",
    footer: "Soft Landing v0.1 · Relocation intelligence",
    signOut: "Выйти",
    signingOut: "Выходим...",
  },
} satisfies Record<UiLanguage, Record<string, string>>;

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="city-card overflow-hidden rounded-[22px]">{children}</div>;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-[var(--city-border)] px-5 py-3.5">
      <h2 className="city-section-kicker">{title}</h2>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--city-border)] px-5 py-3.5 last:border-b-0">
      <Icon className="size-4 shrink-0 text-[var(--city-muted-fg)]" />
      <span className="flex-1 text-sm text-[var(--city-muted-fg)]">{label}</span>
      <span className="max-w-[220px] break-words text-right text-sm font-medium leading-snug text-stone-900">
        {value}
      </span>
    </div>
  );
}

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUserWithMoveProfile();
  const language = await getServerLanguage(profile?.preferred_language);
  const copy = COPY[language];
  const notSet = getNotSetLabel(language);

  const email = user?.email ?? "—";
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? null;
  const countryLabel = profile?.selected_country_id
    ? getCountryById(profile.selected_country_id)?.name ?? profile.selected_country_id
    : "—";
  const cityLabel = profile?.selected_city_id
    ? getCityById(profile.selected_city_id)?.name ?? profile.selected_city_id
    : "—";
  const pathLabel = profile?.selected_legal_path_id
    ? getLegalPathById(profile.selected_legal_path_id)?.name ??
      profile.selected_legal_path_id
    : "—";
  const roadmap = profile ? generateRoadmap(profile) : null;
  const countryMatch = profile?.selected_country_id
    ? matchCountries(buildCountryMatchInputFromMoveProfile(profile)).find(
        (match) => match.countryId === profile.selected_country_id
      ) ?? null
    : null;
  const currentLevel =
    roadmap?.levels.find((level) => level.id === roadmap.currentLevelId) ?? null;
  const savedCountryLabels =
    profile?.saved_country_ids.map((id) => getCountryById(id)?.name ?? id) ?? [];
  const savedCityLabels =
    profile?.saved_city_ids.map((id) => getCityById(id)?.name ?? id) ?? [];
  const preferredLanguageLabel = formatPreferredLanguage(
    profile?.preferred_language,
    language
  );

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <div className="space-y-0.5">
        <p className="city-section-kicker mb-1">{copy.kicker}</p>
        <h1 className="font-serif text-2xl font-medium text-stone-900">
          {copy.title}
        </h1>
        <p className="text-sm text-[var(--city-muted-fg)]">{copy.intro}</p>
      </div>

      <SectionCard>
        <SectionHeader title={copy.account} />
        <Row icon={User} label={copy.name} value={displayName ?? notSet} />
        <Row icon={Mail} label={copy.email} value={email} />
      </SectionCard>

      {profile ? (
        <>
          <SectionCard>
            <SectionHeader title={copy.moveSummary} />
            <Row icon={MapPin} label={copy.city} value={cityLabel} />
            <Row icon={Globe} label={copy.country} value={countryLabel} />
            <Row icon={Route} label={copy.legalPath} value={pathLabel} />
            <Row
              icon={TrendingUp}
              label={copy.lifestyleFit}
              value={countryMatch ? `${countryMatch.lifestyleFit}%` : "—"}
            />
            <Row
              icon={TrendingUp}
              label={copy.legalFit}
              value={countryMatch ? `${countryMatch.legalFit}%` : "—"}
            />
            <Row
              icon={TrendingUp}
              label={copy.movePreparation}
              value={`${roadmap?.readinessPercent ?? 0}% · ${getMovePreparationLabel(
                roadmap?.readinessPercent ?? 0,
                Boolean(profile.selected_legal_path_id)
              )}`}
            />
            <Row
              icon={ArrowRight}
              label={copy.currentRoadmapStage}
              value={currentLevel?.title ?? "—"}
            />
            <div className="border-t border-[var(--city-border)] px-5 py-4">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <Link href="/app/move-brief" className="inline-flex">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full border-[var(--city-border)]"
                  >
                    {copy.viewMoveBrief}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/app/partner-review" className="inline-flex">
                  <Button className="gap-2 rounded-full">
                    {copy.requestPartnerReview}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader title={copy.profileState} />
            <Row
              icon={User}
              label={copy.onboardingCompleted}
              value={profile.onboarding_completed ? copy.yes : copy.inProgress}
            />
            <Row icon={Route} label={copy.activeStep} value={profile.active_step} />
            <Row
              icon={Globe}
              label={copy.savedCountries}
              value={savedCountryLabels.length > 0 ? savedCountryLabels.join(", ") : "—"}
            />
            <Row
              icon={MapPin}
              label={copy.savedCities}
              value={savedCityLabels.length > 0 ? savedCityLabels.join(", ") : "—"}
            />
          </SectionCard>
        </>
      ) : (
        <SectionCard>
          <SectionHeader title={copy.moveSummary} />
          <div className="space-y-4 px-5 py-5">
            <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">
              {copy.noProfile}
            </p>
            <Link href="/start" className="inline-flex">
              <Button className="gap-2 rounded-full">
                {copy.startMove}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <SectionHeader title={copy.settings} />
        <div className="border-b border-[var(--city-border)] px-5 py-3.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--city-muted-fg)]">
              {copy.language}
            </span>
            <span className="inline-flex items-center rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-2.5 py-0.5 text-xs font-medium text-stone-800">
              {preferredLanguageLabel}
            </span>
          </div>
        </div>
        <div className="px-5 py-4">
          <SignOutButton
            label={copy.signOut}
            pendingLabel={copy.signingOut}
          />
        </div>
      </SectionCard>

      <p className="pb-2 text-center text-xs text-[var(--city-muted-fg)]">
        {copy.footer}
      </p>
    </div>
  );
}
