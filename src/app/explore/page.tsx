import Link from "next/link";
import { ArrowRight, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { COUNTRIES } from "@/lib/data/countries";
import { getServerLanguage } from "@/lib/i18n/server";
import type { UiLanguage } from "@/lib/i18n/onboarding";

const COPY = {
  en: {
    kicker: "Global relocation planner",
    title: "Explore destinations",
    subtitle: "Browse countries, compare cities, review legal-path fit, and understand the blockers before you commit.",
    compareCard: {
      title: "Need side-by-side clarity?",
      body: "Compare multiple countries or compare cities inside one country before you choose.",
      button: "Compare",
    },
    card: {
      cities: "cities",
      paths: "paths",
      fullJourney: "Full journey",
      explore: "Explore",
    },
    cta: {
      body: "Not sure where to go? Let us match you.",
      button: "Start my move",
    },
  },
  ru: {
    kicker: "Планировщик переезда",
    title: "Направления",
    subtitle: "Смотрите страны, сравнивайте города, разбирайтесь в легальных путях и блокерах — до того, как определитесь.",
    compareCard: {
      title: "Хотите сравнить несколько вариантов?",
      body: "Сравните страны или города внутри одной страны, прежде чем делать выбор.",
      button: "Сравнить",
    },
    card: {
      cities: "города",
      paths: "пути",
      fullJourney: "Полный маршрут",
      explore: "Обзор",
    },
    cta: {
      body: "Не знаете, куда ехать? Мы подберём.",
      button: "Начать план переезда",
    },
  },
} satisfies Record<UiLanguage, unknown>;

export const metadata = {
  title: "Explore destinations — Soft Landing",
  description: "Browse countries and cities for your relocation.",
};

export default async function ExplorePage() {
  const language = await getServerLanguage();
  const copy = COPY[language];

  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" initialLanguage={language} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div>
          <p className="city-section-kicker mb-2">{copy.kicker}</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 mb-3">{copy.title}</h1>
          <p className="text-[var(--city-muted-fg)] text-sm max-w-md">{copy.subtitle}</p>
        </div>

        <div className="city-card rounded-[22px] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-900">{copy.compareCard.title}</p>
              <p className="mt-1 text-sm text-[var(--city-muted-fg)]">{copy.compareCard.body}</p>
            </div>
            <Link href="/compare">
              <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)] text-stone-700 shrink-0">
                {copy.compareCard.button}
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {COUNTRIES.map((country) => (
            <Link key={country.id} href={`/explore/${country.slug}`}>
              <div className="group city-card rounded-[18px] p-4 hover:border-stone-400 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{country.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-sm text-stone-900">{country.name}</h3>
                      <p className="text-xs text-[var(--city-muted-fg)]">{country.continent}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[var(--city-muted-fg)] group-hover:text-stone-700 transition-colors shrink-0 mt-1" />
                </div>
                <p className="text-xs text-[var(--city-muted-fg)] leading-relaxed line-clamp-2 mb-2.5">
                  {country.summary}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[var(--city-muted-fg)]">
                  <span>{country.cityIds.length} {copy.card.cities}</span>
                  <span>·</span>
                  <span>{country.availableLegalPathIds.length} {copy.card.paths}</span>
                  {country.journeyAvailable && (
                    <>
                      <span>·</span>
                      <span className="font-medium text-stone-700">{copy.card.fullJourney}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2 pb-4">
          <p className="text-sm text-[var(--city-muted-fg)] mb-4">{copy.cta.body}</p>
          <Link href="/start">
            <Button className="gap-2 rounded-full">
              {copy.cta.button}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
