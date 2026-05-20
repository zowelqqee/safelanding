import { ChevronDown } from "lucide-react";

import type {
  CityRealityReport,
  CityRealitySignalSentiment,
  CityRealitySignalTopic,
  CityRealitySnapshotSignal,
  CityRealityStorySignal,
} from "@/types";

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
      return { label: "Regret", className: "border-slate-200 bg-slate-50 text-slate-700" };
    case "advice":
      return { label: "Advice", className: "border-teal-200 bg-teal-50 text-teal-700" };
  }
}

function sentimentMeta(sentiment: CityRealitySignalSentiment) {
  switch (sentiment) {
    case "positive":
      return { label: "Positive", dotClassName: "bg-emerald-500", textClassName: "text-emerald-700" };
    case "mixed":
      return { label: "Mixed", dotClassName: "bg-amber-500", textClassName: "text-amber-700" };
    case "negative":
      return { label: "Negative", dotClassName: "bg-rose-500", textClassName: "text-rose-700" };
  }
}

function ShowMore({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <details className="group mt-4">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
        {label}
        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

export function RealitySnapshotCard({
  title,
  description,
}: CityRealitySnapshotSignal) {
  return (
    <div className="rounded-[24px] border border-amber-200/80 bg-white/90 p-4 shadow-[0_1px_1px_rgba(15,23,42,0.03)]">
      <p className="text-sm font-semibold tracking-tight text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
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
    <article className="rounded-[24px] border border-amber-200/70 bg-white/95 p-4 shadow-[0_1px_1px_rgba(15,23,42,0.03)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${topicChip.className}`}>
          {topicChip.label}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${sentimentChip.textClassName}`}>
          <span className={`h-2 w-2 rounded-full ${sentimentChip.dotClassName}`} />
          {sentimentChip.label}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground">&ldquo;{quote}&rdquo;</p>
      {summary ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p> : null}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 block rounded-2xl border border-amber-100 bg-[#fcfaf6] px-3 py-3 transition-colors hover:bg-[#f8f2e6]"
      >
        <span className="text-xs font-medium text-primary">
          {sourceLabel}
          {sourceAgeLabel ? ` · ${sourceAgeLabel}` : ""}
        </span>
        <span className="mt-1 block break-all text-[11px] leading-relaxed text-muted-foreground">
          {sourceDisplayUrl}
        </span>
      </a>
    </article>
  );
}

export function PatternSummaryCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-amber-200/70 bg-white/95 p-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdviceBeforeMoveCard({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="rounded-[24px] border border-amber-200/70 bg-white/95 p-4">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="text-sm leading-relaxed text-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function groupSignalsByTopic(signals: CityRealityStorySignal[]) {
  const topicOrder: CityRealitySignalTopic[] = [
    "housing",
    "language",
    "bureaucracy",
    "money",
    "community",
    "first_90_days",
    "regret",
    "advice",
  ];

  return topicOrder
    .map((topic) => ({
      topic,
      items: signals.filter((signal) => signal.topic === topic),
    }))
    .filter((group) => group.items.length > 0);
}

export function CityRealityLayer({
  report,
}: {
  report: CityRealityReport;
}) {
  const featuredStorySignals = report.storySignals.slice(0, 4);
  const extraStorySignals = report.storySignals.slice(4);
  const groupedExtraSignals = groupSignalsByTopic(extraStorySignals);

  return (
    <section className="rounded-[30px] border border-amber-200/80 bg-[#f7f1e7] p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-800">Reality layer</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            Reality from people who moved
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{report.summary}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-[#fff8ec] px-4 py-3 text-sm leading-relaxed text-amber-900 sm:max-w-xs">
          {report.disclaimer}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-base font-semibold tracking-tight text-foreground">Reality snapshot</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {report.snapshotSignals.slice(0, 3).map((item) => (
            <RealitySnapshotCard
              key={item.title}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-foreground">What people say</h3>
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Public signals
          </span>
        </div>

        {featuredStorySignals.length > 0 ? (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {featuredStorySignals.map((item) => (
              <RealitySignalCard key={`${item.sourceUrl}-${item.quote}`} {...item} />
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-[24px] border border-dashed border-amber-300 bg-white/80 px-4 py-4 text-sm leading-relaxed text-muted-foreground">
            Public story signals for this city are being curated.
          </div>
        )}

        {extraStorySignals.length > 0 ? (
          <ShowMore label="Show more real stories">
            <div className="space-y-5">
              {groupedExtraSignals.map((group) => (
                <div key={group.topic}>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${topicMeta(group.topic).className}`}>
                      {topicMeta(group.topic).label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {group.items.length} more signal{group.items.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {group.items.map((item) => (
                      <RealitySignalCard key={`${item.sourceUrl}-${item.quote}`} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ShowMore>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Pattern summary</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <PatternSummaryCard title="People love" items={report.patternSummary.peopleLove} />
            <PatternSummaryCard title="People struggle with" items={report.patternSummary.peopleStruggleWith} />
            <PatternSummaryCard title="People underestimate" items={report.patternSummary.peopleUnderestimate} />
            <PatternSummaryCard title="First 90 days" items={report.patternSummary.first90Days} />
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">Advice before you move</h3>
          <div className="mt-3">
            <AdviceBeforeMoveCard items={report.adviceBeforeMove} />
          </div>
        </div>
      </div>
    </section>
  );
}
