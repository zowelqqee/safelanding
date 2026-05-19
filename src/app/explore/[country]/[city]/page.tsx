import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, Globe, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CITIES, getCityBySlug } from "@/lib/data/cities";
import { COUNTRIES, getCountryBySlug } from "@/lib/data/countries";
import { getLegalPathsForCountry } from "@/lib/data/legal-paths";

export async function generateStaticParams() {
  return CITIES.map((city) => {
    const country = COUNTRIES.find((entry) => entry.id === city.countryId);
    return { country: country?.slug ?? city.countryId, city: city.slug };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}) {
  const { country: countrySlug, city: citySlug } = await params;
  const country = getCountryBySlug(countrySlug);
  const city = country ? getCityBySlug(citySlug, country.id) : undefined;

  if (!country || !city) return {};

  return {
    title: `${city.name}, ${country.name} — Soft Landing`,
    description: city.summary,
  };
}

function ScoreRail({ value, invert = false }: { value: number; invert?: boolean }) {
  const display = invert ? 6 - value : value;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={index < display ? "h-2.5 w-4 rounded-full bg-primary" : "h-2.5 w-4 rounded-full bg-muted"}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{display}/5</span>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; city: string }>;
}) {
  const { country: countrySlug, city: citySlug } = await params;
  const country = getCountryBySlug(countrySlug);

  if (!country) notFound();

  const city = getCityBySlug(citySlug, country.id);

  if (!city) notFound();

  const compareCityIds = [city.id, ...country.city_ids.filter((id) => id !== city.id)].slice(0, 2);
  const cityCompareHref = `/compare?type=city&country=${country.id}&city=${compareCityIds.join(",")}`;
  const paths = getLegalPathsForCountry(country.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href={`/explore/${country.slug}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            {country.name}
          </Link>
          <Link href="/start">
            <Button size="sm">Start your move</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-8">
          <section className="rounded-[32px] border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="flex items-center gap-2 text-sm font-medium text-primary">
                  <MapPin className="h-4 w-4" />
                  {country.name}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">{city.name}</h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {city.summary}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <div className="rounded-2xl bg-muted/50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Main legal blocker</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed">
                    {country.main_legal_blocker}
                  </p>
                </div>
                <div className="rounded-2xl bg-muted/50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Main lifestyle blocker</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed">
                    {city.main_lifestyle_blocker}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={cityCompareHref}>
                <Button variant="outline" className="gap-2">
                  Compare
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/compare?type=country&c=${country.id}`}>
                <Button variant="outline" className="gap-2">
                  Compare countries
                  <Shield className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/start">
                <Button className="gap-2">
                  Start my move
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <SectionCard title="Does this fit you?">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Good fit if</p>
                  <ul className="mt-3 space-y-2">
                    {city.best_for.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Bad fit if</p>
                  <ul className="mt-3 space-y-2">
                    {city.watch_out.map((item) => (
                      <li key={item} className="text-sm text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="At a glance">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Cost</span>
                  <ScoreRail value={city.cost_level} invert />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Housing</span>
                  <ScoreRail value={city.housing_difficulty} invert />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Transport</span>
                  <ScoreRail value={city.public_transport} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">English friendliness</span>
                  <ScoreRail value={city.english_friendliness} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Remote work fit</span>
                  <ScoreRail value={city.remote_worker_fit} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-muted-foreground">Family fit</span>
                  <ScoreRail value={city.family_fit} />
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Reality preview">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border bg-background px-4 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Average rent</p>
                <p className="mt-2 text-sm font-medium">{city.avg_rent_range}</p>
              </div>
              <div className="rounded-2xl border bg-background px-4 py-4">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Monthly budget</p>
                <p className="mt-2 text-sm font-medium">{city.monthly_budget_range}</p>
              </div>
              <div className="rounded-2xl border bg-background px-4 py-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">What people usually underestimate</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {city.what_people_underestimate}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="First 90 days preview">
            <div className="grid gap-3 md:grid-cols-3">
              {city.first_90_days_preview.map((item) => (
                <div key={item} className="rounded-2xl border bg-background px-4 py-4">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={`Legal paths for ${country.name}`}>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              These are fit assessments, not legal advice. Requirements vary and should be verified before applying.
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {paths.map((path) => (
                <div key={path.id} className="rounded-2xl border bg-background p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{path.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{path.summary}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {path.estimated_preparation_time}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Good fit if</p>
                    <ul className="mt-2 space-y-1">
                      {path.good_if.slice(0, 2).map((item) => (
                        <li key={item} className="text-sm text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                    {path.legal_disclaimer}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
