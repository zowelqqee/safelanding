import Link from "next/link";
import { ArrowRight, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { COUNTRIES } from "@/lib/data/countries";

export const metadata = {
  title: "Explore destinations — Soft Landing",
  description: "Browse countries and cities for your relocation.",
};

export default function ExplorePage() {
  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">
        <div>
          <p className="city-section-kicker mb-2">Global relocation planner</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 mb-3">Explore destinations</h1>
          <p className="text-[var(--city-muted-fg)] text-sm max-w-md">
            Browse countries, compare cities, review legal-path fit, and understand the blocker before you commit.
          </p>
        </div>

        <div className="city-card rounded-[22px] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-900">Need side-by-side clarity?</p>
              <p className="mt-1 text-sm text-[var(--city-muted-fg)]">
                Compare multiple countries or compare cities inside one country before you choose.
              </p>
            </div>
            <Link href="/compare">
              <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)] text-stone-700 shrink-0">
                Compare
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
                  <span>{country.cityIds.length} cities</span>
                  <span>·</span>
                  <span>{country.availableLegalPathIds.length} paths</span>
                  {country.journeyAvailable && (
                    <>
                      <span>·</span>
                      <span className="font-medium text-stone-700">Full journey</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2 pb-4">
          <p className="text-sm text-[var(--city-muted-fg)] mb-4">
            Not sure where to go? Let us match you.
          </p>
          <Link href="/start">
            <Button className="gap-2 rounded-full">
              Start my move
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
