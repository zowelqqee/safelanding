import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, MapPin } from "lucide-react";
import { RelocationVideoStories } from "@/components/city/relocation-video-stories";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { getCitiesForCountry } from "@/lib/data/cities";
import { COUNTRIES, getCountryBySlug } from "@/lib/data/countries";
import { getLegalPathsForCountry } from "@/lib/data/legal-paths";
import { getRelocationVideoStoriesForCountry } from "@/lib/data/relocation-video-stories";
import { getExistingPublicImageSrc } from "@/lib/server/public-image";

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

function EditorialImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative h-full min-h-[160px] overflow-hidden rounded-[22px] border border-[var(--city-border)] bg-[#f7efe0]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(194,124,43,0.18),transparent_30%),radial-gradient(circle_at_78%_35%,rgba(74,124,89,0.13),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.75),rgba(240,228,200,0.7))]" />
      <div className="absolute left-5 right-5 top-[54%] h-px bg-amber-900/20" />
      <div className="absolute left-8 top-[54%] h-3 w-3 -translate-y-1/2 rounded-full border border-amber-800/30 bg-[#fffdf8]" />
      <div className="absolute right-8 top-[54%] h-4 w-4 -translate-y-1/2 rounded-full border border-emerald-800/25 bg-[#fffdf8]" />
      <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/70 bg-white/65 px-3 py-2.5 backdrop-blur-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-900/70">
          Curated image pending
        </p>
        <p className="mt-1 text-sm font-medium text-stone-900">{label}</p>
      </div>
    </div>
  );
}

function CountryHeroImagePanel({
  countryName,
  imageSrc,
}: {
  countryName: string;
  imageSrc?: string;
}) {
  return (
    <div className="w-full rounded-[24px] border border-[var(--city-border)] bg-[var(--city-warm-muted)]/45 p-2">
      <div className="relative min-h-[190px] overflow-hidden rounded-[20px]">
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={`${countryName} relocation overview`}
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-stone-950/5 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                Country dossier
              </p>
              <p className="mt-1 font-serif text-xl font-medium text-white">{countryName}</p>
            </div>
          </>
        ) : (
          <EditorialImagePlaceholder label={`${countryName} relocation overview`} />
        )}
      </div>
    </div>
  );
}

function CityThumbnail({
  cityName,
  imageSrc,
}: {
  cityName: string;
  imageSrc?: string;
}) {
  return (
    <div className="relative mb-4 h-24 overflow-hidden rounded-2xl border border-[var(--city-border)] bg-[#f7efe0]">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={`${cityName} city preview`}
          fill
          sizes="(min-width: 1280px) 220px, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_30%,rgba(194,124,43,0.17),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.65),rgba(240,228,200,0.7))]">
          <div className="absolute left-4 right-4 top-1/2 h-px bg-amber-900/20" />
          <div className="absolute left-5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-amber-800/25 bg-white/70" />
          <div className="absolute right-6 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-emerald-800/20 bg-white/70" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/35 to-transparent px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
          City preview
        </p>
      </div>
    </div>
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
  const relocationVideoStories = getRelocationVideoStoriesForCountry(country.id);
  const countryHeroImage = getExistingPublicImageSrc(country.heroImage);
  const cityCompareHref = `/compare?type=city&country=${country.id}&city=${cities
    .map((city) => city.id)
    .join(",")}`;

  return (
    <div className="city-page-wrap min-h-screen">
      <SiteHeader variant="public" />

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

              <div className="flex flex-col gap-3 lg:w-[360px] lg:shrink-0">
                <CountryHeroImagePanel countryName={country.name} imageSrc={countryHeroImage} />

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
              {cities.map((city) => {
                const thumbnailImage = getExistingPublicImageSrc(city.thumbnailImage ?? city.heroImage);

                return (
                  <Link
                    key={city.id}
                    href={`/explore/${country.slug}/${city.slug}`}
                    className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/40 p-4 transition-colors hover:border-stone-400 hover:bg-[var(--city-warm-muted)]"
                  >
                    <CityThumbnail cityName={city.name} imageSrc={thumbnailImage} />
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
                );
              })}
            </div>
          </SectionCard>

          <RelocationVideoStories
            stories={relocationVideoStories}
            emptyMessage="Видео от переехавших для этой страны ещё подбираются."
          />

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
