import Link from "next/link";
import { ArrowRight, BarChart3, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/data/countries";

export const metadata = {
  title: "Explore destinations — Soft Landing",
  description: "Browse countries and cities for your relocation.",
};

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-semibold text-foreground">Soft Landing</Link>
          <Link href="/start"><Button size="sm">Start my move</Button></Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Global relocation planner</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Explore destinations</h1>
          <p className="text-muted-foreground text-sm">
            Browse countries, compare cities, review legal-path fit, and understand the blocker before you commit.
          </p>
        </div>

        <div className="rounded-[28px] border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Need side-by-side clarity?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Compare multiple countries or compare cities inside one country before you choose your next step.
              </p>
            </div>
            <Link href="/compare">
              <Button variant="outline" className="gap-2">
                Compare now
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {COUNTRIES.map((country) => (
            <Link key={country.id} href={`/explore/${country.slug}`}>
              <div className="group rounded-xl border bg-card p-4 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{country.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{country.name}</h3>
                      <p className="text-xs text-muted-foreground">{country.continent}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                  {country.summary}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{country.cityIds.length} cities</span>
                  <span>·</span>
                  <span>{country.availableLegalPathIds.length} paths</span>
                  {country.journeyAvailable && (
                    <>
                      <span>·</span>
                      <span className="text-primary font-medium">Step-by-step journey</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground mb-4">
            Not sure where to go? Let us match you.
          </p>
          <Link href="/start">
            <Button className="gap-2">
              Find my destination
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
