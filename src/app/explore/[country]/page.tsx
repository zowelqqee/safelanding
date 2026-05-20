import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCitiesForCountry } from "@/lib/data/cities";
import { COUNTRIES, getCountryBySlug } from "@/lib/data/countries";
import { getLegalPathsForCountry } from "@/lib/data/legal-paths";

export async function generateStaticParams() {
  return COUNTRIES.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) return {};

  return {
    title: `${country.name} — Soft Landing`,
    description: country.summary,
  };
}

function ScoreRail({ value, invert = false }: { value: number; invert?: boolean }) {
  const display = invert ? 6 - value : value;
  const getSegmentClass = (index: number) => {
    if (index >= display) return "h-2.5 w-4 rounded-full bg-[var(--city-border)]";
    if (invert) {
      return display <= 2
        ? "h-2.5 w-4 rounded-full bg-[var(--accent-sage)]"
        : display === 3
        ? "h-2.5 w-4 rounded-full bg-[var(--accent-gold)]"
        : "h-2.5 w-4 rounded-full bg-[var(--accent-clay)]";
    }
    return display >= 4
      ? "h-2.5 w-4 rounded-full bg-[var(--accent-sage)]"
      : display === 3
      ? "h-2.5 w-4 rounded-full bg-[var(--accent-gold)]"
      : "h-2.5 w-4 rounded-full bg-[var(--accent-clay)]";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={getSegmentClass(index)} />
        ))}
      </div>
      <span className="text-xs text-[var(--city-muted-fg)]">{display}/5</span>
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
    <section className="city-card rounded-[22px] p-5">
      <h2 className="font-semibold text-base text-stone-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) notFound();

  const cities = getCitiesForCountry(country.id);
  const paths = getLegalPathsForCountry(country.id);
  const cityCompareHref = `/compare?type=city&country=${country.id}&city=${cities
    .map((city) => city.id)
    .join(",")}`;

  return (
    <div className="city-page-wrap min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[var(--city-border)] bg-[var(--city-card)]/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/explore" className="flex items-center gap-2 text-sm text-[var(--city-muted-fg)] hover:text-stone-900 transition-colors">
            <Globe className="h-4 w-4" />
            All destinations
          </Link>
          <Link href="/start">
            <Button size="sm" className="rounded-full">Start your move</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="space-y-6">
          <section className="city-card rounded-[28px] p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="text-4xl">{country.emoji}</div>
                <p className="mt-4 city-section-kicker">{country.region}</p>
                <h1 className="mt-1 font-serif text-3xl font-medium text-stone-900">{country.name}</h1>
                <p className="mt-4 text-base leading-relaxed text-[var(--city-muted-fg)]">
                  {country.summary}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-4">
                  <p className="city-section-kicker">Main legal blocker</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-stone-900">
                    {country.main_legal_blocker}
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-4">
                  <p className="city-section-kicker">Main lifestyle blocker</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-stone-900">
                    {country.main_lifestyle_blocker}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/compare?type=country&c=${country.id}`}>
                <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)]">
                  Compare
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={cityCompareHref}>
                <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)]">
                  Compare cities
                  <MapPin className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/start">
                <Button className="gap-2 rounded-full">
                  Start my move
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

          <SectionCard title="Does this fit you?">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-stone-900 mb-2">Good fit if</p>
                <ul className="space-y-2">
                  {country.best_for.map((item) => (
                    <li key={item} className="text-sm text-[var(--city-muted-fg)] flex items-start gap-1.5">
                      <span className="text-[var(--accent-sage)] mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900 mb-2">Watch out if</p>
                <ul className="space-y-2">
                  {country.watch_out.map((item) => (
                    <li key={item} className="text-sm text-[var(--city-muted-fg)] flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <SectionCard title="Reality preview">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-stone-900 mb-2">Lifestyle fit factors</p>
                  <ul className="space-y-1.5">
                    {country.lifestyle_fit_factors.map((item) => (
                      <li key={item} className="text-sm text-[var(--city-muted-fg)]">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900 mb-2">Legal fit factors</p>
                  <ul className="space-y-1.5">
                    {country.legal_fit_factors.map((item) => (
                      <li key={item} className="text-sm text-[var(--city-muted-fg)]">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900 mb-2">What people usually underestimate</p>
                  <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">
                    {country.what_people_underestimate}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="At a glance">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--city-muted-fg)]">Cost level</span>
                  <ScoreRail value={country.cost_level} invert />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--city-muted-fg)]">Housing difficulty</span>
                  <ScoreRail value={country.housing_difficulty} invert />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--city-muted-fg)]">English friendliness</span>
                  <ScoreRail value={country.english_friendliness} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--city-muted-fg)]">Career upside</span>
                  <ScoreRail value={country.career_opportunities} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--city-muted-fg)]">Study fit</span>
                  <ScoreRail value={country.study_fit} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--city-muted-fg)]">Remote work fit</span>
                  <ScoreRail value={country.remote_work_fit} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[var(--city-muted-fg)]">Long-term stability</span>
                  <ScoreRail value={country.long_term_stability} />
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="First 90 days preview">
            <div className="grid gap-3 md:grid-cols-3">
              {country.first_90_days_preview.map((item) => (
                <div key={item} className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-4">
                  <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">{item}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Compare cities inside this country">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/explore/${country.slug}/${city.slug}`}
                  className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/40 p-4 transition-colors hover:border-stone-400 hover:bg-[var(--city-warm-muted)]"
                >
                  <h3 className="text-base font-semibold text-stone-900">{city.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">
                    {city.summary}
                  </p>
                  <div className="mt-3 space-y-1 text-xs text-[var(--city-muted-fg)]">
                    <p>Rent: {city.avg_rent_range}</p>
                    <p>Budget: {city.monthly_budget_range}</p>
                  </div>
                  <p className="mt-4 text-sm font-medium text-stone-700">
                    Explore city →
                  </p>
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Legal paths">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-4">
              These are fit assessments, not legal advice. Requirements vary and must be verified before applying.
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {paths.map((path) => (
                <div key={path.id} className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-stone-900">{path.name}</h3>
                      <p className="mt-1 text-sm text-[var(--city-muted-fg)]">{path.summary}</p>
                    </div>
                    <span className="rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1 text-xs font-medium text-stone-700 shrink-0">
                      {path.estimated_preparation_time}
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="city-section-kicker mb-2">Good fit if</p>
                    <ul className="space-y-1">
                      {path.good_if.slice(0, 2).map((item) => (
                        <li key={item} className="text-sm text-[var(--city-muted-fg)]">
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
