import Link from "next/link";
import { ArrowRight, BarChart3, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/lib/data/countries";

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Explore</h1>
          <p className="text-sm text-muted-foreground">
            Browse countries, compare cities, and pressure-test what fits you
            before you commit.
          </p>
        </div>

        <div className="rounded-[28px] border bg-card p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">What can you do here?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Compare countries, compare cities inside a country, review legal-path fit,
                and understand the real blocker before you choose your move.
              </p>
            </div>
            <Link href="/compare">
              <Button className="gap-2">
                Compare now
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {COUNTRIES.map((country) => (
            <div key={country.id} className="rounded-[26px] border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-3xl">{country.emoji}</div>
                  <h2 className="mt-3 text-lg font-semibold">{country.name}</h2>
                  <p className="text-sm text-muted-foreground">{country.region}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {country.city_ids.length} cities
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {country.summary}
              </p>

              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-amber-700">Main blocker</p>
                <p className="mt-1 text-sm text-amber-900">{country.main_legal_blocker}</p>
              </div>

              <div className="mt-5 flex gap-2">
                <Link href={`/explore/${country.slug}`} className="flex-1">
                  <Button variant="outline" className="h-11 w-full gap-2">
                    <Globe className="h-4 w-4" />
                    View country
                  </Button>
                </Link>
                <Link
                  href={`/compare?type=city&country=${country.id}&city=${country.city_ids.join(",")}`}
                  className="flex-1"
                >
                  <Button className="h-11 w-full gap-2">
                    <MapPin className="h-4 w-4" />
                    Compare cities
                  </Button>
                </Link>
              </div>

              <Link href="/start" className="mt-3 inline-flex">
                <Button variant="ghost" className="gap-2 px-0 text-primary">
                  Start here
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
