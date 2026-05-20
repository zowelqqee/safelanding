"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}: {
  mode: CompareMode;
  onChange: (mode: CompareMode) => void;
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
          {value === "country" ? "Countries" : "Cities"}
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
}: {
  country: CountryProfile;
  fit: ReturnType<typeof matchCountries>[number];
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
          {fit.overallFit}% overall
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--city-muted-fg)]">{country.summary}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-3">
          <p className="city-section-kicker">Lifestyle fit</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{fit.lifestyleFit}%</p>
        </div>
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-3 py-3">
          <p className="city-section-kicker">Legal fit</p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">{fit.legalFit}%</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-3 py-3">
          <p className="city-section-kicker text-amber-700">Main blocker</p>
          <p className="mt-1 text-sm font-medium leading-snug text-amber-950">{fit.mainBlocker}</p>
        </div>
      </div>

      <div className="mt-5">
        <MetricList
          items={[
            { label: "Cost", value: <ScoreRail value={country.cost_level} invert /> },
            { label: "Housing difficulty", value: <ScoreRail value={country.housing_difficulty} invert /> },
            { label: "Language barrier", value: <ScoreRail value={country.english_friendliness} /> },
            { label: "Career upside", value: <ScoreRail value={country.career_opportunities} /> },
            { label: "Study route", value: <ScoreRail value={country.study_fit} /> },
            { label: "Remote work route", value: <ScoreRail value={country.remote_work_fit} /> },
            { label: "Long-term stability", value: <ScoreRail value={country.long_term_stability} /> },
          ]}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="city-section-kicker text-amber-700">Reality preview</p>
        <p className="mt-1 text-sm text-amber-900">{country.main_legal_blocker}</p>
      </div>

      <div className="mt-5 flex gap-2">
        <Link href={`/explore/${country.slug}`} className="flex-1">
          <Button variant="outline" className="h-11 w-full gap-2 rounded-full border-[var(--city-border)]">
            Choose this destination
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link
          href={`/compare?type=city&country=${country.id}&city=${country.city_ids.join(",")}`}
          className="flex-1"
        >
          <Button className="h-11 w-full gap-2 rounded-full">
            Compare cities
            <MapPin className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CityCompareCard({
  cityId,
}: {
  cityId: string;
}) {
  const city = getCityById(cityId);

  if (!city) return null;

  return (
    <div className="city-card rounded-[22px] p-5">
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
            { label: "Cost", value: <ScoreRail value={city.cost_level} invert /> },
            { label: "Housing", value: <ScoreRail value={city.housing_difficulty} invert /> },
            { label: "Transport", value: <ScoreRail value={city.public_transport} /> },
            { label: "English friendliness", value: <ScoreRail value={city.english_friendliness} /> },
            { label: "Expat community", value: <ScoreRail value={city.expat_community} /> },
            { label: "Career", value: <ScoreRail value={city.career_opportunities} /> },
            { label: "Remote work", value: <ScoreRail value={city.remote_worker_fit} /> },
            { label: "Family fit", value: <ScoreRail value={city.family_fit} /> },
            { label: "First 90 days difficulty", value: <ScoreRail value={city.first_90_days_difficulty} /> },
          ]}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-3">
          <p className="city-section-kicker">Average rent</p>
          <p className="mt-1 text-sm font-medium text-stone-900">{city.avg_rent_range}</p>
        </div>
        <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-3">
          <p className="city-section-kicker">Monthly budget</p>
          <p className="mt-1 text-sm font-medium text-stone-900">{city.monthly_budget_range}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="city-section-kicker text-amber-700">Main blocker</p>
        <p className="mt-1 text-sm text-amber-900">{city.main_lifestyle_blocker}</p>
      </div>

      <div className="mt-5">
        <p className="city-section-kicker mb-2">First 90 days preview</p>
        <ul className="space-y-1.5">
          {city.first_90_days_preview.map((item) => (
            <li key={item} className="text-sm text-[var(--city-muted-fg)]">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex gap-2">
        <Link href={`/explore/${city.countryId}/${city.slug}`} className="flex-1">
          <Button variant="outline" className="h-11 w-full gap-2 rounded-full border-[var(--city-border)]">
            Choose this destination
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/start" className="flex-1">
          <Button className="h-11 w-full gap-2 rounded-full">
            Start your move
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
      <header className="sticky top-0 z-50 border-b border-[var(--city-border)] bg-[var(--city-card)]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/explore" className="flex items-center gap-1.5 text-sm text-[var(--city-muted-fg)] hover:text-stone-900 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="font-semibold text-stone-900">Compare destinations</span>
          <Link href="/start" className="ml-auto">
            <Button size="sm" className="rounded-full">Start your move</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-stone-700">
              <Shield className="h-3.5 w-3.5" />
              Lifestyle fit vs legal fit
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <h1 className="font-serif text-3xl font-medium text-stone-900">Compare before you commit</h1>
                <p className="max-w-2xl text-sm leading-relaxed text-[var(--city-muted-fg)]">
                  Compare countries and cities side by side so you can see what fits,
                  what blocks you, and what deserves a deeper look next.
                </p>
              </div>
              <CompareToggle mode={mode} onChange={setMode} />
            </div>
          </div>

          {mode === "country" ? (
            <>
              <ChipSelector
                label="Select 2 to 4 countries"
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
                    />
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                <div className="city-card rounded-[22px] p-5">
                  <p className="text-sm font-medium text-stone-900">Choose a country</p>
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
                  label="Select 2 to 4 cities or regions"
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
                {selectedCityIds.map((cityId) => (
                  <CityCompareCard key={cityId} cityId={cityId} />
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
  return (
    <div className="city-page-wrap min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="city-card rounded-[28px] p-6 text-center">
          <p className="text-lg font-semibold tracking-tight text-stone-900">
            Loading comparison
          </p>
          <p className="mt-2 text-sm text-[var(--city-muted-fg)]">
            Preparing your side-by-side view...
          </p>
        </div>
      </div>
    </div>
  );
}
