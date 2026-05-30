"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Shield, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { useCityCardViewTracking } from "@/lib/analytics/cityCardView";
import { getCitiesForCountry, getCityById } from "@/lib/data/cities";
import { COUNTRIES, getCountryById } from "@/lib/data/countries";
import { matchCountries, type CountryMatchInput } from "@/lib/scoring/country-matcher";
import { cn } from "@/lib/utils";
import type {
  CountryProfile,
  IncomeRange,
  LifePreference,
  MoveGoal,
  MoveOptimization,
  RegionPreference,
} from "@/types";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUiLanguage } from "@/hooks/useUiLanguage";

const COPY = {
  en: {
    badge: "Lifestyle fit vs legal fit",
    title: "Compare before you commit",
    subtitle: "Compare countries and cities side by side so you can see what fits, what blocks you, and what deserves a deeper look next.",
    tabs: { country: "Countries", city: "Cities" },
    selectCountries: "Select 2 to 4 countries",
    selectCities: "Select 2 to 4 cities or regions",
    chooseCountry: "Choose a country",
    overall: "overall",
    metrics: {
      cost: "Cost",
      housing: "Housing difficulty",
      language: "Language barrier",
      career: "Career upside",
      study: "Study route",
      remote: "Remote work route",
      longterm: "Long-term stability",
      transport: "Transport",
      english: "English friendliness",
      expat: "Expat community",
      family: "Family fit",
      difficulty: "First 90 days difficulty",
    },
    blocker: "Main blocker",
    realityPreview: "Reality preview",
    lifestyleFit: "Lifestyle fit",
    legalFit: "Legal fit",
    avgRent: "Average rent",
    monthlyBudget: "Monthly budget",
    first90: "First 90 days preview",
    chooseDestination: "Choose this destination",
    compareCities: "Compare cities",
    startMove: "Start your move",
    loading: "Loading comparison",
    loadingBody: "Preparing your side-by-side view...",
  },
  ru: {
    badge: "Образ жизни и легальный путь",
    title: "Сравните перед тем, как решить",
    subtitle: "Сравните страны и города рядом — чтобы видеть, что подходит, что блокирует и на что стоит обратить внимание.",
    tabs: { country: "Страны", city: "Города" },
    selectCountries: "Выберите от 2 до 4 стран",
    selectCities: "Выберите от 2 до 4 городов или регионов",
    chooseCountry: "Выберите страну",
    overall: "общий",
    metrics: {
      cost: "Расходы",
      housing: "Сложность с жильём",
      language: "Языковой барьер",
      career: "Карьерные возможности",
      study: "Путь для учёбы",
      remote: "Путь для удалёнщика",
      longterm: "Долгосрочная стабильность",
      transport: "Транспорт",
      english: "Без знания языка",
      expat: "Сообщество переехавших",
      family: "Подходит для семьи",
      difficulty: "Сложность первых 90 дней",
    },
    blocker: "Главный блокер",
    realityPreview: "Что важно знать",
    lifestyleFit: "Совпадение по образу жизни",
    legalFit: "Совпадение по документам",
    avgRent: "Средняя аренда",
    monthlyBudget: "Бюджет в месяц",
    first90: "Первые 90 дней",
    chooseDestination: "Выбрать это направление",
    compareCities: "Сравнить города",
    startMove: "Начать план переезда",
    loading: "Загружаем сравнение",
    loadingBody: "Готовим сравнение...",
  },
};

type CompareCopy = typeof COPY["en"];

type CompareMode = "country" | "city";

function levelLabel(value: number) {
  return `${value}/5`;
}

function ScoreRail({ value, invert = false }: { value: number; invert?: boolean }) {
  const display = invert ? 6 - value : value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-2.5 w-4 rounded-full",
              index < display
                ? (invert
                  ? display <= 2 ? "bg-[var(--accent-sage)]" : display === 3 ? "bg-[var(--accent-gold)]" : "bg-[var(--accent-clay)]"
                  : display >= 4 ? "bg-[var(--accent-sage)]" : display === 3 ? "bg-[var(--accent-gold)]" : "bg-[var(--accent-clay)]")
                : "bg-[var(--city-border)]"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-[var(--city-muted-fg)]">{display}/5</span>
    </div>
  );
}

function parseListParam(value: string | null) {
  return value ? value.split(",").filter(Boolean) : [];
}

function isMoveGoal(value: string | null): value is MoveGoal {
  return value === "remote_work" ||
    value === "study" ||
    value === "explore_first" ||
    value === "find_job" ||
    value === "family" ||
    value === "not_sure";
}

function isIncomeRange(value: string | null): value is IncomeRange {
  return value === "under_1000" ||
    value === "1000_2000" ||
    value === "2000_3000" ||
    value === "3000_5000" ||
    value === "5000_plus";
}

function isLifePreference(value: string): value is LifePreference {
  return value === "warm_climate" ||
    value === "lower_cost" ||
    value === "big_city" ||
    value === "sea_nearby" ||
    value === "expat_community" ||
    value === "english_friendly" ||
    value === "family_friendly" ||
    value === "career_opportunities" ||
    value === "calm_lifestyle" ||
    value === "student_life" ||
    value === "public_transport";
}

function isRegionPreference(value: string): value is RegionPreference {
  return value === "europe" ||
    value === "north_america" ||
    value === "asia" ||
    value === "middle_east" ||
    value === "latin_america" ||
    value === "not_sure";
}

function isMoveOptimization(value: string | null): value is MoveOptimization {
  return value === "fastest_legal_path" ||
    value === "best_career" ||
    value === "lowest_cost" ||
    value === "comfortable_life" ||
    value === "best_study" ||
    value === "safest_longterm";
}

function buildContext(params: URLSearchParams): CountryMatchInput {
  const goal = params.get("goal");
  const income = params.get("income");
  const optimization = params.get("opt");

  return {
    lifePreferences: parseListParam(params.get("prefs")).filter(isLifePreference),
    moveGoal: isMoveGoal(goal) ? goal : "",
    monthlyIncome: isIncomeRange(income) ? income : "",
    regionPreferences: parseListParam(params.get("regions")).filter(isRegionPreference),
    moveOptimization: isMoveOptimization(optimization) ? optimization : "",
  };
}

function CompareToggle({
  mode,
  onChange,
  tabs,
}: {
  mode: CompareMode;
  onChange: (mode: CompareMode) => void;
  tabs: { country: string; city: string };
}) {
  return (
    <div className="inline-flex rounded-full border border-[var(--city-border)] bg-[var(--city-card)] p-1">
      {(["country", "city"] as const).map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            mode === value
              ? "bg-stone-800 text-white"
              : "text-[var(--city-muted-fg)] hover:text-stone-900"
          )}
        >
          {value === "country" ? tabs.country : tabs.city}
        </button>
      ))}
    </div>
  );
}

function ChipSelector({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: Array<{ id: string; title: string; subtitle?: string; emoji?: string }>;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-stone-900">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.id);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onToggle(option.id)}
              className={cn(
                "rounded-full border px-3 py-2 text-left text-sm transition-colors",
                active
                  ? "border-stone-800 bg-stone-800 text-white"
                  : "border-[var(--city-border)] bg-[var(--city-card)] hover:border-stone-400 text-stone-700"
              )}
            >
              <span className="flex items-center gap-2">
                {option.emoji && <span>{option.emoji}</span>}
                <span>{option.title}</span>
              </span>
              {option.subtitle && (
                <span className={cn("mt-1 block text-xs", active ? "text-white/80" : "text-[var(--city-muted-fg)]")}>
                  {option.subtitle}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MetricList({
  items,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4">
          <span className="text-sm text-[var(--city-muted-fg)]">{item.label}</span>
          <div className="text-right">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function CountryCompareCard({
  country,
  fit,
  copy,
}: {
  country: CountryProfile;
  fit: ReturnType<typeof matchCountries>[number];
  copy: CompareCopy;
}) {
  return (
    <div className="city-card rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-3xl">{country.emoji}</div>
          <h2 className="mt-3 text-lg font-semibold text-stone-900">{country.name}</h2>
          <p className="text-sm text-[var(--city-muted-fg)]">{country.region}</p>
        </div>
        <span className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1 text-sm font-semibold text-stone-700">
          {fit.overallFit}% {copy.overall}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--city-muted-fg)]">{country.summary}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-3">
          <p className="city-section-kicker">{copy.lifestyleFit}</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{fit.lifestyleFit}%</p>
        </div>
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-3">
          <p className="city-section-kicker">{copy.legalFit}</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{fit.legalFit}%</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-3 py-3">
          <p className="city-section-kicker text-amber-700">{copy.blocker}</p>
          <p className="mt-1 text-sm font-medium leading-snug text-amber-950">{fit.mainBlocker}</p>
        </div>
      </div>

      <div className="mt-5">
        <MetricList
          items={[
            { label: copy.metrics.cost, value: <ScoreRail value={country.cost_level} invert /> },
            { label: copy.metrics.housing, value: <ScoreRail value={country.housing_difficulty} invert /> },
            { label: copy.metrics.language, value: <ScoreRail value={country.english_friendliness} /> },
            { label: copy.metrics.career, value: <ScoreRail value={country.career_opportunities} /> },
            { label: copy.metrics.study, value: <ScoreRail value={country.study_fit} /> },
            { label: copy.metrics.remote, value: <ScoreRail value={country.remote_work_fit} /> },
            { label: copy.metrics.longterm, value: <ScoreRail value={country.long_term_stability} /> },
          ]}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="city-section-kicker text-amber-700">{copy.realityPreview}</p>
        <p className="mt-1 text-sm text-amber-900">{country.main_legal_blocker}</p>
      </div>

      <div className="mt-5 flex gap-2">
        <Link href={`/explore/${country.slug}`} className="flex-1">
          <Button variant="outline" className="h-11 w-full gap-2 rounded-full border-[var(--city-border)]">
            {copy.chooseDestination}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href={`/compare?type=city&country=${country.id}&city=${country.city_ids.join(",")}`}
          className="flex-1"
        >
          <Button className="h-11 w-full gap-2 rounded-full">
            {copy.compareCities}
            <MapPin className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CityCompareCard({
  cityId,
  position,
  copy,
}: {
  cityId: string;
  position: number;
  copy: CompareCopy;
}) {
  const city = getCityById(cityId);
  const cardRef = useCityCardViewTracking({ cityId, position });

  if (!city) return null;

  return (
    <div ref={cardRef} className="city-card rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--city-muted-fg)]">{city.country}</p>
          <h2 className="text-lg font-semibold text-stone-900">{city.name}</h2>
        </div>
        <span className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1 text-sm font-semibold text-stone-700">
          {levelLabel(city.first_90_days_difficulty)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--city-muted-fg)]">{city.summary}</p>

      <div className="mt-5">
        <MetricList
          items={[
            { label: copy.metrics.cost, value: <ScoreRail value={city.cost_level} invert /> },
            { label: copy.metrics.housing, value: <ScoreRail value={city.housing_difficulty} invert /> },
            { label: copy.metrics.transport, value: <ScoreRail value={city.public_transport} /> },
            { label: copy.metrics.english, value: <ScoreRail value={city.english_friendliness} /> },
            { label: copy.metrics.expat, value: <ScoreRail value={city.expat_community} /> },
            { label: copy.metrics.career, value: <ScoreRail value={city.career_opportunities} /> },
            { label: copy.metrics.remote, value: <ScoreRail value={city.remote_worker_fit} /> },
            { label: copy.metrics.family, value: <ScoreRail value={city.family_fit} /> },
            { label: copy.metrics.difficulty, value: <ScoreRail value={city.first_90_days_difficulty} /> },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-3">
          <p className="city-section-kicker">{copy.avgRent}</p>
          <p className="mt-1 text-sm font-medium text-stone-900">{city.avg_rent_range}</p>
        </div>
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-3">
          <p className="city-section-kicker">{copy.monthlyBudget}</p>
          <p className="mt-1 text-sm font-medium text-stone-900">{city.monthly_budget_range}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="city-section-kicker text-amber-700">{copy.blocker}</p>
        <p className="mt-1 text-sm text-amber-900">{city.main_lifestyle_blocker}</p>
      </div>

      <div className="mt-5">
        <p className="city-section-kicker mb-2">{copy.first90}</p>
        <ul className="space-y-1.5">
          {city.first_90_days_preview.map((item) => (
            <li key={item} className="text-sm text-[var(--city-muted-fg)]">{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex gap-2">
        <Link href={`/explore/${city.countryId}/${city.slug}`} className="flex-1">
          <Button variant="outline" className="h-11 w-full gap-2 rounded-full border-[var(--city-border)]">
            {copy.chooseDestination}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/start" className="flex-1">
          <Button className="h-11 w-full gap-2 rounded-full">
            {copy.startMove}
            <Sparkles className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CompareExperience({
  searchParams,
}: {
  searchParams: ReturnType<typeof useSearchParams>;
}) {
  const language = useUiLanguage();
  const copy = COPY[language];
  const initialMode = searchParams.get("type") === "city" ? "city" : "country";
  const [mode, setMode] = useState<CompareMode>(initialMode);
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>(
    (() => {
      const ids = parseListParam(searchParams.get("c"));
      return ids.length > 0 ? ids : ["spain", "portugal"];
    })()
  );
  const [cityCountryId, setCityCountryId] = useState(searchParams.get("country") ?? "spain");
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>(
    (() => {
      const ids = parseListParam(searchParams.get("city"));
      return ids.length > 0 ? ids : getCitiesForCountry(searchParams.get("country") ?? "spain").slice(0, 2).map((city) => city.id);
    })()
  );
  const context = useMemo(() => buildContext(searchParams), [searchParams]);

  const countryMatches = useMemo(() => matchCountries(context), [context]);
  const countryMatchMap = useMemo(
    () => Object.fromEntries(countryMatches.map((match) => [match.countryId, match])),
    [countryMatches]
  );
  const selectedCountries = selectedCountryIds
    .map((id) => getCountryById(id))
    .filter((country): country is CountryProfile => Boolean(country));
  const cityOptions = getCitiesForCountry(cityCountryId);

  function toggleCountry(id: string) {
    setSelectedCountryIds((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((value) => value !== id)
          : current
        : current.length < 4
          ? [...current, id]
          : current
    );
  }

  function toggleCity(id: string) {
    setSelectedCityIds((current) =>
      current.includes(id)
        ? current.length > 1
          ? current.filter((value) => value !== id)
          : current
        : current.length < 4
          ? [...current, id]
          : current
    );
  }

  return (
    <div className="city-page-wrap min-h-screen">
      <SiteHeader variant="public" />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700">
              <Shield className="h-3.5 w-3.5" />
              {copy.badge}
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <h1 className="font-serif text-3xl font-medium text-stone-900">{copy.title}</h1>
                <p className="max-w-2xl text-sm leading-relaxed text-[var(--city-muted-fg)]">
                  {copy.subtitle}
                </p>
              </div>
              <CompareToggle mode={mode} onChange={setMode} tabs={copy.tabs} />
            </div>
          </div>

          {mode === "country" ? (
            <>
              <ChipSelector
                label={copy.selectCountries}
                options={COUNTRIES.map((country) => ({
                  id: country.id,
                  title: country.name,
                  subtitle: country.region,
                  emoji: country.emoji,
                }))}
                selected={selectedCountryIds}
                onToggle={toggleCountry}
              />

              <div className="grid gap-4 lg:grid-cols-2">
                {selectedCountries.map((country) => {
                  const fit = countryMatchMap[country.id];
                  if (!fit) return null;

                  return (
                    <CountryCompareCard
                      key={country.id}
                      country={country}
                      fit={fit}
                      copy={copy}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="city-card rounded-[22px] p-5">
                  <p className="text-sm font-medium text-stone-900">{copy.chooseCountry}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {COUNTRIES.map((country) => (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() => {
                          setCityCountryId(country.id);
                          setSelectedCityIds(getCitiesForCountry(country.id).slice(0, 2).map((city) => city.id));
                        }}
                        className={cn(
                          "rounded-full border px-3 py-2 text-sm transition-colors",
                          cityCountryId === country.id
                            ? "border-stone-800 bg-stone-800 text-white"
                            : "border-[var(--city-border)] text-stone-700 hover:border-stone-400"
                        )}
                      >
                        {country.emoji} {country.name}
                      </button>
                    ))}
                  </div>
                </div>

                <ChipSelector
                  label={copy.selectCities}
                  options={cityOptions.map((city) => ({
                    id: city.id,
                    title: city.name,
                    subtitle: city.avg_rent_range,
                  }))}
                  selected={selectedCityIds}
                  onToggle={toggleCity}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {selectedCityIds.map((cityId, index) => (
                  <CityCompareCard key={cityId} cityId={cityId} position={index + 1} copy={copy} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareLoadingState />}>
      <CompareContent />
    </Suspense>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();

  return <CompareExperience key={searchParams.toString()} searchParams={searchParams} />;
}

function CompareLoadingState() {
  const language = useUiLanguage();
  const copy = COPY[language];

  return (
    <div className="city-page-wrap min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="city-card rounded-[28px] p-6 text-center">
          <p className="text-lg font-semibold tracking-tight text-stone-900">
            {copy.loading}
          </p>
          <p className="mt-2 text-sm text-[var(--city-muted-fg)]">
            {copy.loadingBody}
          </p>
        </div>
      </div>
    </div>
  );
}
