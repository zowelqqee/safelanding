import { ChevronDown } from "lucide-react";

import type {
  CityRealityReport,
  CityRealitySignalSentiment,
  CityRealitySignalTopic,
  CityRealitySnapshotSignal,
  CityRealityStorySignal,
} from "@/types";

// ─── Topic + sentiment meta ───────────────────────────────────────────────────

function topicMeta(topic: CityRealitySignalTopic) {
  switch (topic) {
    case "housing":
      return { label: "Housing", className: "border-rose-200 bg-rose-50 text-rose-700" };
    case "language":
      return { label: "Language", className: "border-sky-200 bg-sky-50 text-sky-700" };
    case "bureaucracy":
      return { label: "Bureaucracy", className: "border-amber-200 bg-amber-50 text-amber-800" };
    case "money":
      return { label: "Money", className: "border-orange-200 bg-orange-50 text-orange-700" };
    case "community":
      return { label: "Community", className: "border-emerald-200 bg-emerald-50 text-emerald-700" };
    case "first_90_days":
      return { label: "First 90 days", className: "border-violet-200 bg-violet-50 text-violet-700" };
    case "regret":
      return { label: "Regret", className: "border-slate-200 bg-slate-100 text-slate-700" };
    case "advice":
      return { label: "Advice", className: "border-teal-200 bg-teal-50 text-teal-700" };
  }
}

function sentimentMeta(sentiment: CityRealitySignalSentiment) {
  switch (sentiment) {
    case "positive":
      return { label: "Positive", dotClass: "bg-emerald-500", textClass: "text-emerald-700" };
    case "mixed":
      return { label: "Mixed", dotClass: "bg-amber-500", textClass: "text-amber-700" };
    case "negative":
      return { label: "Negative", dotClass: "bg-rose-500", textClass: "text-rose-700" };
  }
}

function groupSignalsByTopic(signals: CityRealityStorySignal[]) {
  const topicOrder: CityRealitySignalTopic[] = [
    "housing", "language", "bureaucracy", "money",
    "community", "first_90_days", "regret", "advice",
  ];

  return topicOrder
    .map((topic) => ({ topic, items: signals.filter((s) => s.topic === topic) }))
    .filter((g) => g.items.length > 0);
}

// ─── Card components ──────────────────────────────────────────────────────────

function ShowMore({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <details className="group mt-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] px-4 py-2 text-xs font-medium text-[var(--city-muted-fg)] transition-colors hover:bg-amber-100/60">
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function RealitySnapshotCard({ title, description }: CityRealitySnapshotSignal) {
  return (
    <div className="rounded-[18px] border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] p-4">
      <p className="text-sm font-semibold leading-snug tracking-tight text-stone-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">{description}</p>
    </div>
  );
}

export function RealitySignalCard({
  quote,
  sourceLabel,
  sourceUrl,
  sourceAgeLabel,
  topic,
  sentiment,
  summary,
}: CityRealityStorySignal) {
  const sourceDisplayUrl = sourceUrl.replace(/^https?:\/\/(www\.)?/, "");
  const topicChip = topicMeta(topic);
  const sentimentChip = sentimentMeta(sentiment);

  return (
    <article className="flex flex-col rounded-[18px] border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${topicChip.className}`}>
          {topicChip.label}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${sentimentChip.textClass}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${sentimentChip.dotClass}`} />
          {sentimentChip.label}
        </span>
      </div>

      <blockquote className="mt-3 flex-1">
        <p className="text-sm leading-relaxed text-stone-800">&ldquo;{quote}&rdquo;</p>
      </blockquote>

      {summary && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">{summary}</p>
      )}

      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex min-w-0 flex-col gap-1.5 rounded-xl border border-amber-200/60 bg-amber-50/50 px-3 py-2.5 transition-colors hover:bg-amber-100/60"
      >
        <span className="min-w-0 text-xs font-semibold text-stone-700">
          {sourceLabel}
          {sourceAgeLabel && (
            <span className="ml-2 inline-block font-normal text-[var(--city-muted-fg)]">· {sourceAgeLabel}</span>
          )}
        </span>
        <span className="block min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[var(--city-muted-fg)]">
          {sourceDisplayUrl}
        </span>
      </a>
    </article>
  );
}

const patternCardMeta = {
  peopleLove: {
    kicker: "People love",
    accentDot: "bg-emerald-500",
    accentBorder: "border-l-emerald-400",
    kickerClass: "text-emerald-700",
  },
  peopleStruggleWith: {
    kicker: "People struggle with",
    accentDot: "bg-rose-500",
    accentBorder: "border-l-rose-400",
    kickerClass: "text-rose-700",
  },
  peopleUnderestimate: {
    kicker: "People underestimate",
    accentDot: "bg-amber-500",
    accentBorder: "border-l-amber-400",
    kickerClass: "text-amber-700",
  },
  first90Days: {
    kicker: "First 90 days",
    accentDot: "bg-violet-500",
    accentBorder: "border-l-violet-400",
    kickerClass: "text-violet-700",
  },
} as const;

export function PatternSummaryCard({
  variant,
  items,
}: {
  variant: keyof typeof patternCardMeta;
  items: string[];
}) {
  const meta = patternCardMeta[variant];

  return (
    <div className={`rounded-[18px] border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] border-l-4 ${meta.accentBorder} p-4`}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${meta.kickerClass}`}>{meta.kicker}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${meta.accentDot}`} />
            <span className="text-sm leading-snug text-stone-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdviceBeforeMoveCard({ items }: { items: string[] }) {
  return (
    <div className="rounded-[18px] border border-amber-300/60 bg-[#fffbf2] p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">Before you move</p>
      <ol className="mt-4 space-y-4">
        {items.map((item, i) => (
          <li key={item} className="flex items-start gap-3">
            <span className="shrink-0 text-[10px] font-bold text-amber-600 mt-0.5 w-5">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="text-sm leading-relaxed text-stone-800">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CityRealityLayer({ report }: { report: CityRealityReport }) {
  const featuredSignals = report.storySignals.slice(0, 4);
  const extraSignals = report.storySignals.slice(4);
  const groupedExtra = groupSignalsByTopic(extraSignals);

  return (
    <section className="city-reality-surface rounded-[28px] p-5 sm:p-6">
      {/* Section header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">Reality layer</p>
          <h2 className="mt-2 font-serif text-2xl font-medium leading-tight tracking-tight text-stone-900 sm:text-3xl">
            Reality from people who moved
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--city-muted-fg)]">{report.summary}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] px-4 py-3 text-xs leading-relaxed text-amber-900 sm:max-w-[220px]">
          {report.disclaimer}
        </div>
      </div>

      {/* Reality snapshot */}
      <div className="mt-6">
        <p className="city-section-kicker text-amber-900/70">Reality snapshot</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {report.snapshotSignals.slice(0, 3).map((item) => (
            <RealitySnapshotCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>
      </div>

      {/* What people say */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="city-section-kicker text-amber-900/70">What people say</p>
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--city-muted-fg)]">Public signals</span>
        </div>

        {featuredSignals.length > 0 ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {featuredSignals.map((item) => (
              <RealitySignalCard key={`${item.sourceUrl}-${item.quote.slice(0, 20)}`} {...item} />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-[18px] border border-dashed border-[var(--city-reality-border)] bg-[var(--city-reality-card)]/70 px-4 py-5 text-sm text-[var(--city-muted-fg)]">
            Public story signals for this city are being curated.
          </div>
        )}

        {extraSignals.length > 0 && (
          <ShowMore label={`Show ${extraSignals.length} more signal${extraSignals.length > 1 ? "s" : ""}`}>
            <div className="space-y-5">
              {groupedExtra.map((group) => (
                <div key={group.topic}>
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${topicMeta(group.topic).className}`}>
                      {topicMeta(group.topic).label}
                    </span>
                    <span className="text-xs text-[var(--city-muted-fg)]">
                      {group.items.length} signal{group.items.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <RealitySignalCard key={`${item.sourceUrl}-${item.quote.slice(0, 20)}`} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ShowMore>
        )}
      </div>

      {/* Pattern summary + advice */}
      <div className="mt-6">
        <p className="city-section-kicker text-amber-900/70">Pattern summary</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <PatternSummaryCard variant="peopleLove" items={report.patternSummary.peopleLove} />
          <PatternSummaryCard variant="peopleStruggleWith" items={report.patternSummary.peopleStruggleWith} />
          <PatternSummaryCard variant="peopleUnderestimate" items={report.patternSummary.peopleUnderestimate} />
          <PatternSummaryCard variant="first90Days" items={report.patternSummary.first90Days} />
        </div>
      </div>

      {report.adviceBeforeMove.length > 0 && (
        <div className="mt-5">
          <p className="city-section-kicker mb-3 text-amber-900/70">Advice before you move</p>
          <AdviceBeforeMoveCard items={report.adviceBeforeMove} />
        </div>
      )}
    </section>
  );
}
