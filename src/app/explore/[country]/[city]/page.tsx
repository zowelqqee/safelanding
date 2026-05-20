import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, ChevronDown, Shield } from "lucide-react";
import { TrackPageEvent } from "@/components/analytics/track-page-event";
import { CityRealityLayer } from "@/components/city/city-reality-layer";
import { RelocationVideoStories } from "@/components/city/relocation-video-stories";
import { SiteHeader } from "@/components/site/site-header";
import { Button } from "@/components/ui/button";
import { CITIES, getCityBySlug } from "@/lib/data/cities";
import { COUNTRIES, getCountryBySlug } from "@/lib/data/countries";
import { getCityRealityReportById } from "@/lib/data/city-reality-reports";
import { getLegalPathsForCountry } from "@/lib/data/legal-paths";
import { getRelocationVideoStoriesForCity } from "@/lib/data/relocation-video-stories";
import { getExistingPublicImageSrc } from "@/lib/server/public-image";
import type { CityProfile, CountryProfile, LegalPath } from "@/types";

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

// ─── Design helpers ───────────────────────────────────────────────────────────

type MetricKind = "cost" | "housing" | "transport" | "english" | "remote" | "family";

function scoreLabel(kind: MetricKind, value: number) {
  switch (kind) {
    case "cost":
      return ["Very low", "Low", "Medium", "High", "Very high"][value - 1];
    case "housing":
      return ["Easy", "Manageable", "Competitive", "Hard", "Very difficult"][value - 1];
    case "transport":
      return ["Weak", "Basic", "Decent", "Strong", "Excellent"][value - 1];
    case "english":
      return ["Low", "Limited", "Moderate", "Good", "Very easy"][value - 1];
    case "remote":
      return ["Weak", "Okay", "Solid", "Strong", "Excellent"][value - 1];
    case "family":
      return ["Weak", "Limited", "Mixed", "Strong", "Excellent"][value - 1];
  }
}

function scoreSegmentClass(kind: MetricKind, value: number, index: number): string {
  if (index >= value) return "score-segment";
  if (kind === "cost" || kind === "housing") {
    return value >= 4 ? "score-segment score-segment-hard" : value >= 3 ? "score-segment score-segment-caution" : "score-segment score-segment-positive";
  }
  return value >= 4 ? "score-segment score-segment-positive" : value >= 3 ? "score-segment score-segment-caution" : "score-segment score-segment-hard";
}

function fitWarningLabel(item: string) {
  const lower = item.toLowerCase();
  if (lower.includes("housing") || lower.includes("rental") || lower.includes("rent")) return "You need stable housing quickly and with less competition";
  if (lower.includes("admin") || lower.includes("bureaucr") || lower.includes("german")) return "You hate paperwork and local-language bureaucracy";
  if (lower.includes("english")) return "You need English to carry most of daily life";
  if (lower.includes("salary market") || lower.includes("career") || lower.includes("opportunit")) return "You need a deeper local job market";
  if (lower.includes("transport") || lower.includes("transit")) return "You need easy transport from almost every neighborhood";
  if (lower.includes("crowd") || lower.includes("touris") || lower.includes("saturated") || lower.includes("chaotic")) return "You want a calmer, more predictable city rhythm";
  if (lower.includes("car")) return "You want a fully walkable, car-light routine everywhere";
  if (lower.includes("heat")) return "You dislike intense summer heat";
  if (lower.includes("cooler") || lower.includes("wetter") || lower.includes("weather")) return "You want warmer weather with fewer gray stretches";
  if (lower.includes("small")) return "You want more scale, energy, and big-city variety";
  return item;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ShowMore({ children, label = "Show more" }: { children: React.ReactNode; label?: string }) {
  return (
    <details className="group mt-4">
      <summary className="inline-flex max-w-full cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-2 text-xs font-medium text-[var(--city-muted-fg)] transition-colors hover:bg-[var(--city-warm-muted)]">
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function ScoreRail({ value, kind }: { value: number; kind: MetricKind }) {
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={scoreSegmentClass(kind, value, i)} />
      ))}
    </div>
  );
}

function BlockerCard({ text, variant }: { text: string; variant: "legal" | "lifestyle" }) {
  return (
    <div className={`min-w-0 rounded-2xl px-4 py-4 ${
      variant === "legal"
        ? "border border-rose-200/60 bg-rose-50/70"
        : "border border-amber-200/70 bg-amber-50/60"
    }`}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
        variant === "legal" ? "text-rose-700" : "text-amber-700"
      }`}>
        {variant === "legal" ? "Legal reality" : "Lifestyle reality"}
      </p>
      <p className="mt-2 break-words text-sm leading-relaxed text-stone-800">{text}</p>
    </div>
  );
}

function CityTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block max-w-full rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1 text-[11px] font-medium text-[var(--city-muted-fg)]">
      {children}
    </span>
  );
}

function EditorialImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="relative h-full min-h-[180px] overflow-hidden rounded-[22px] border border-[var(--city-border)] bg-[#f7efe0]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(194,124,43,0.18),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(74,124,89,0.14),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.7),rgba(240,228,200,0.65))]" />
      <div className="absolute left-6 right-6 top-1/2 h-px -translate-y-1/2 bg-amber-900/20" />
      <div className="absolute left-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-amber-800/30 bg-[#fffdf8]" />
      <div className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-emerald-800/25 bg-[#fffdf8]" />
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/70 bg-white/65 px-4 py-3 backdrop-blur-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-900/70">
          Curated image pending
        </p>
        <p className="mt-1 text-sm font-medium text-stone-900">{label}</p>
      </div>
    </div>
  );
}

function CityHeroImagePanel({
  city,
  country,
  imageSrc,
}: {
  city: CityProfile;
  country: CountryProfile;
  imageSrc?: string;
}) {
  return (
    <div className="min-w-0 rounded-[24px] border border-[var(--city-border)] bg-[var(--city-warm-muted)]/45 p-2">
      <div className="relative min-h-[190px] overflow-hidden rounded-[20px]">
        {imageSrc ? (
          <>
            <Image
              src={imageSrc}
              alt={`${city.name}, ${country.name}`}
              fill
              sizes="(min-width: 1024px) 300px, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/45 via-stone-950/5 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75">
                City image
              </p>
              <p className="mt-1 font-serif text-xl font-medium text-white">{city.name}</p>
            </div>
          </>
        ) : (
          <EditorialImagePlaceholder label={`${city.name} relocation dossier`} />
        )}
      </div>
    </div>
  );
}

// ─── Section components ───────────────────────────────────────────────────────

function FitSection({ city }: { city: CityProfile }) {
  return (
    <div className="city-card min-w-0 overflow-hidden rounded-[22px]">
      <div className="border-b border-[var(--city-border)] px-5 py-4">
        <p className="city-section-kicker">Fit assessment</p>
        <h2 className="mt-1 text-base font-semibold tracking-tight text-stone-900">Does this fit you?</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Good for</p>
          <ul className="mt-3 space-y-2.5">
            {city.best_for.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span className="min-w-0 break-words text-sm leading-snug text-stone-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Hard if</p>
          <ul className="mt-3 space-y-2.5">
            {city.watch_out.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span className="min-w-0 break-words text-sm leading-snug text-[var(--city-muted-fg)]">{fitWarningLabel(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function GlanceSection({ city }: { city: CityProfile }) {
  const metrics: { label: string; value: number; kind: MetricKind }[] = [
    { label: "Cost of living", value: city.cost_level, kind: "cost" },
    { label: "Housing access", value: city.housing_difficulty, kind: "housing" },
    { label: "Public transport", value: city.public_transport, kind: "transport" },
    { label: "English friendliness", value: city.english_friendliness, kind: "english" },
    { label: "Remote work fit", value: city.remote_worker_fit, kind: "remote" },
    { label: "Family fit", value: city.family_fit, kind: "family" },
  ];

  return (
    <div className="city-card min-w-0 overflow-hidden rounded-[22px]">
      <div className="border-b border-[var(--city-border)] px-5 py-4">
        <p className="city-section-kicker">City metrics</p>
        <h2 className="mt-1 text-base font-semibold tracking-tight text-stone-900">At a glance</h2>
      </div>
      <div className="divide-y divide-[var(--city-border)] px-5">
        {metrics.map(({ label, value, kind }) => (
          <div key={label} className="flex items-center justify-between gap-3 py-3">
            <span className="min-w-0 break-words text-sm text-[var(--city-muted-fg)]">{label}</span>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <span className="text-xs font-semibold text-stone-800">{scoreLabel(kind, value)}</span>
              <ScoreRail value={value} kind={kind} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RealityPreviewSection({ city }: { city: CityProfile }) {
  return (
    <div className="city-card min-w-0 overflow-hidden rounded-[22px]">
      <div className="border-b border-[var(--city-border)] px-5 py-4">
        <p className="city-section-kicker">Financial picture</p>
        <h2 className="mt-1 text-base font-semibold tracking-tight text-stone-900">Reality preview</h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">Avg rent</p>
            <p className="mt-1.5 break-words font-serif text-lg font-medium text-stone-900">{city.avg_rent_range}</p>
          </div>
          <div className="rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">Monthly budget</p>
            <p className="mt-1.5 break-words font-serif text-lg font-medium text-stone-900">{city.monthly_budget_range}</p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">What people underestimate</p>
          <p className="mt-1.5 break-words text-sm leading-relaxed text-stone-800">{city.what_people_underestimate}</p>
        </div>
        <ShowMore label="First 90 days">
          <div className="space-y-2">
            {city.first_90_days_preview.map((item, i) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-3">
                <span className="text-[10px] font-bold text-[var(--city-muted-fg)] mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                <p className="min-w-0 break-words text-sm leading-relaxed text-stone-800">{item}</p>
              </div>
            ))}
          </div>
        </ShowMore>
      </div>
    </div>
  );
}

function LegalPathCard({ path }: { path: LegalPath }) {
  const scenarioStyles: Record<LegalPath["scenario"], string> = {
    remote: "text-sky-700 bg-sky-50 border-sky-200",
    study: "text-violet-700 bg-violet-50 border-violet-200",
    work: "text-emerald-700 bg-emerald-50 border-emerald-200",
    family: "text-rose-700 bg-rose-50 border-rose-200",
    capital: "text-amber-700 bg-amber-50 border-amber-200",
    exploration: "text-teal-700 bg-teal-50 border-teal-200",
    talent: "text-purple-700 bg-purple-50 border-purple-200",
    business: "text-orange-700 bg-orange-50 border-orange-200",
  };
  const scenarioLabel: Record<LegalPath["scenario"], string> = {
    remote: "Remote work",
    study: "Study",
    work: "Employment",
    family: "Family",
    capital: "Capital",
    exploration: "Exploration",
    talent: "Talent",
    business: "Business",
  };

  return (
    <div className="city-card min-w-0 overflow-hidden rounded-[22px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium ${scenarioStyles[path.scenario]}`}>
            {scenarioLabel[path.scenario]}
          </span>
          <h3 className="mt-2.5 break-words text-base font-semibold tracking-tight text-stone-900">{path.name}</h3>
        </div>
        <span className="max-w-[42%] shrink-0 rounded-full border border-[var(--city-border)] bg-[var(--city-warm-muted)] px-3 py-1.5 text-right text-[11px] font-medium leading-snug text-[var(--city-muted-fg)] sm:max-w-none">
          {path.estimated_preparation_time}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--city-muted-fg)]">Complexity</span>
        <div className="flex gap-[3px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`h-[3px] w-4 rounded-full ${i < path.complexity ? "bg-stone-600" : "bg-[var(--city-border)]"}`} />
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--city-border)] pt-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">Good fit if</p>
        <ul className="mt-2 space-y-2">
          {path.good_if.slice(0, 2).map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span className="min-w-0 break-words text-sm leading-snug text-stone-800">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]/60 px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">Main friction</p>
        <p className="mt-1.5 break-words text-sm leading-relaxed text-stone-800">{path.weak_points[0]}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
  const realityReport = getCityRealityReportById(city.id);
  const relocationVideoStories = getRelocationVideoStoriesForCity(country.id, city.id);
  const cityHeroImage = getExistingPublicImageSrc(city.heroImage);

  const cityTags: string[] = [
    city.coastal ? "Coastal" : null,
    city.big_city ? "Large city" : "Smaller city",
    city.remote_worker_fit >= 4 ? "Remote-work friendly" : null,
    city.english_friendliness >= 4 ? "English-friendly" : null,
    city.family_fit >= 4 ? "Family-friendly" : null,
  ].filter(Boolean) as string[];

  return (
    <div className="city-page-wrap">
      <SiteHeader variant="public" />

      <main className="mx-auto min-w-0 max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="min-w-0 space-y-6">

          {/* Hero */}
          <section className="city-card min-w-0 overflow-hidden rounded-[28px] px-5 py-7 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              {/* Left: identity */}
              <div className="min-w-0 flex-1">
                <p className="city-section-kicker">{country.name} · City guide</p>
                <h1 className="mt-3 font-serif text-5xl font-medium leading-[1.05] tracking-[-0.02em] text-stone-900 sm:text-6xl lg:text-7xl">
                  {city.name}
                </h1>
                <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-[var(--city-muted-fg)]">
                  {city.summary}
                </p>
                {cityTags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {cityTags.map((tag) => (
                      <CityTag key={tag}>{tag}</CityTag>
                    ))}
                  </div>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={cityCompareHref}>
                    <Button variant="outline" size="sm" className="rounded-full gap-2 border-[var(--city-border)] bg-transparent text-stone-700 hover:bg-[var(--city-warm-muted)]">
                      Compare cities
                      <BarChart3 className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href={`/compare?type=country&c=${country.id}`}>
                    <Button variant="outline" size="sm" className="rounded-full gap-2 border-[var(--city-border)] bg-transparent text-stone-700 hover:bg-[var(--city-warm-muted)]">
                      Compare countries
                      <Shield className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href="/start">
                    <Button size="sm" className="rounded-full gap-2">
                      Start my move
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: image + blockers */}
              <div className="flex min-w-0 flex-col gap-3 lg:w-[300px] lg:shrink-0">
                <CityHeroImagePanel city={city} country={country} imageSrc={cityHeroImage} />
                <BlockerCard
                  text={country.main_legal_blocker}
                  variant="legal"
                />
                <BlockerCard
                  text={city.main_lifestyle_blocker}
                  variant="lifestyle"
                />
              </div>
            </div>
          </section>

          {/* Two-zone: structured fit (left) + reality layer (right) */}
          <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[2fr_3fr] lg:items-start">
            {/* Left: structured city fit */}
            <div className="flex min-w-0 flex-col gap-5">
              <FitSection city={city} />
              <GlanceSection city={city} />
              <RealityPreviewSection city={city} />
            </div>

            {/* Right: reality from people who moved */}
            {realityReport ? (
              <CityRealityLayer report={realityReport} />
            ) : (
              <div className="city-reality-surface min-w-0 overflow-hidden rounded-[28px] p-6">
                <p className="city-section-kicker text-amber-800">Reality layer</p>
                <p className="mt-2 break-words font-serif text-2xl font-medium text-stone-900">Reality from people who moved</p>
                <p className="mt-3 break-words text-sm text-[var(--city-muted-fg)]">Reality signals for this city are being curated.</p>
              </div>
            )}
          </div>

          <TrackPageEvent
            eventName="city_reality_viewed"
            payload={{
              cityId: city.id,
              countryId: country.id,
              hasRealityReport: Boolean(realityReport),
            }}
          />
          <RelocationVideoStories stories={relocationVideoStories} />

          {/* Legal paths */}
          <section>
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <div>
                <p className="city-section-kicker">Legal framework</p>
                <h2 className="mt-1 break-words font-serif text-2xl font-medium tracking-tight text-stone-900">
                  Legal paths for {country.name}
                </h2>
              </div>
            </div>

            <div className="mb-4 rounded-2xl border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-sm leading-relaxed text-amber-900">
              Fit assessments only — not legal advice. Requirements vary and must be verified before applying.
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
              {paths.slice(0, 2).map((path) => (
                <LegalPathCard key={path.id} path={path} />
              ))}
            </div>

            {paths.length > 2 && (
              <ShowMore label={`Show ${paths.length - 2} more path${paths.length - 2 > 1 ? "s" : ""}`}>
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  {paths.slice(2).map((path) => (
                    <LegalPathCard key={path.id} path={path} />
                  ))}
                </div>
              </ShowMore>
            )}
          </section>

          {/* Footer note */}
          <footer className="border-t border-[var(--city-border)] pt-6 pb-2">
            <p className="text-[11px] leading-relaxed text-[var(--city-muted-fg)]">
              Soft Landing — relocation intelligence for independent movers.{" "}
              Content is curated for fit assessment, not as professional legal or financial advice.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
