"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle, ArrowRight, MapPin, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { matchCitiesForCountry } from "@/lib/scoring/city-matcher";
import { getCityById } from "@/lib/data/cities";
import { getCountryById } from "@/lib/data/countries";
import type { OnboardingState, CityMatchResult } from "@/types";

interface Props {
  state: OnboardingState;
  onSelect: (cityId: string) => void;
  onShortlistToggle: (cityId: string) => void;
  onBack: () => void;
}

function buildCityCompareQuery(state: OnboardingState) {
  const params = new URLSearchParams();
  params.set("type", "city");
  params.set("country", state.selectedCountry);
  params.set("city", state.shortlistedCities.join(","));
  return params.toString();
}

function MatchScore({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-green-100 text-green-700" :
    score >= 65 ? "bg-blue-100 text-blue-700" :
    "bg-muted text-muted-foreground";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${color}`}>
      {score}% fit
    </span>
  );
}

function CityCard({
  result,
  countrySlug,
  shortlisted,
  onSelect,
  onShortlist,
}: {
  result: CityMatchResult;
  countrySlug: string;
  shortlisted: boolean;
  onSelect: () => void;
  onShortlist: () => void;
}) {
  const city = getCityById(result.cityId);
  if (!city) return null;

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-base">{city.name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
            {city.housingAvgRent && <span>Rent from {city.housingAvgRent}</span>}
            {city.housingAvgRent && city.monthlyBudgetMin && <span>·</span>}
            {city.monthlyBudgetMin && <span>Budget {city.monthlyBudgetMin}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <MatchScore score={result.score} />
          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(); }}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            {shortlisted
              ? <BookmarkCheck className="h-4 w-4 text-primary" />
              : <Bookmark className="h-4 w-4 text-muted-foreground" />
            }
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{city.summary}</p>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-muted/60 px-3 py-2">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            First 90 days
          </div>
          <div className="mt-1 text-sm font-semibold">
            {result.first90DaysDifficulty}/5 difficulty
          </div>
        </div>
        <div className="rounded-xl bg-muted/60 px-3 py-2">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            Main blocker
          </div>
          <div className="mt-1 text-sm font-semibold leading-tight">
            {result.mainBlocker}
          </div>
        </div>
      </div>

      {result.reasons.length > 0 && (
        <div className="flex flex-col gap-1">
          {result.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {result.risks.slice(0, 1).map((r, i) => (
        <div key={i} className="flex items-start gap-1.5 text-xs">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{r}</span>
        </div>
      ))}

      <div className="flex gap-2 pt-0.5">
        <Button size="sm" className="flex-1 h-10 gap-1.5" onClick={onSelect}>
          Choose {city.name}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
        <Link href={`/explore/${countrySlug}/${city.slug}`} target="_blank">
          <Button variant="outline" size="sm" className="h-10 px-3">
            View
          </Button>
        </Link>
      </div>
    </div>
  );
}

export function StepCityResults({ state, onSelect, onShortlistToggle, onBack }: Props) {
  const country = getCountryById(state.selectedCountry);

  const results = useMemo(
    () =>
      matchCitiesForCountry({
        countryId: state.selectedCountry,
        lifePreferences: state.lifePreferences,
        moveGoal: state.moveGoal,
        monthlyIncome: state.monthlyIncome,
      }),
    [state]
  );

  return (
    <div className="flex flex-col flex-1 gap-5 pt-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-primary">
            {country ? `${country.emoji} ${country.name}` : "Cities"}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Choose your city</h2>
        <p className="text-sm text-muted-foreground">
          Matched to your preferences. Save favorites or pick one to continue.
        </p>
      </div>

      {state.shortlistedCities.length >= 2 && (
        <Link
          href={`/compare?${buildCityCompareQuery(state)}`}
          target="_blank"
          className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
        >
          Compare {state.shortlistedCities.length} shortlisted cities
          <ArrowRight className="ml-auto h-3.5 w-3.5" />
        </Link>
      )}

      {results.length === 0 ? (
        <div className="text-sm text-muted-foreground py-8 text-center">
          No cities found for this country yet.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {results.map((result) => (
            <CityCard
              key={result.cityId}
              result={result}
              countrySlug={country?.slug ?? state.selectedCountry}
              shortlisted={state.shortlistedCities.includes(result.cityId)}
              onSelect={() => onSelect(result.cityId)}
              onShortlist={() => onShortlistToggle(result.cityId)}
            />
          ))}
        </div>
      )}

      <div className="pb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-muted-foreground">
          ← Choose a different country
        </Button>
      </div>
    </div>
  );
}
