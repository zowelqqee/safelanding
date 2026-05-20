import Image from "next/image";
import { ChevronDown, ExternalLink, PlayCircle } from "lucide-react";

import { getExistingPublicImageSrc } from "@/lib/server/public-image";
import type {
  RelocationVideoPersonType,
  RelocationVideoSentiment,
  RelocationVideoStory,
  RelocationVideoTopic,
} from "@/types";

const topicLabels: Record<RelocationVideoTopic, string> = {
  housing: "жильё",
  cost: "деньги",
  documents: "документы",
  language: "язык",
  work: "работа",
  community: "сообщество",
  first_90_days: "первые 90 дней",
  mistakes: "ошибки",
  regret: "сомнения",
  adaptation: "адаптация",
  general: "переезд",
};

const sentimentMeta: Record<
  RelocationVideoSentiment,
  { label: string; dotClass: string; textClass: string }
> = {
  positive: {
    label: "позитивный",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
  },
  mixed: {
    label: "смешанный",
    dotClass: "bg-amber-500",
    textClass: "text-amber-700",
  },
  negative: {
    label: "сложный",
    dotClass: "bg-rose-500",
    textClass: "text-rose-700",
  },
};

const personTypeLabels: Record<RelocationVideoPersonType, string> = {
  remote_worker: "remote worker",
  student: "student",
  family: "family",
  founder: "founder",
  employee: "employee",
  freelancer: "freelancer",
  unknown: "relocation story",
};

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

function VideoStoryCard({ story }: { story: RelocationVideoStory }) {
  const sentiment = sentimentMeta[story.sentiment];
  const thumbnailSrc = getExistingPublicImageSrc(story.thumbnailUrl);
  const movementLabel = [
    personTypeLabels[story.personType],
    story.movedFrom ? `${story.movedFrom} to ${story.movedTo}` : story.movedTo,
    story.livedThereFor ? `${story.livedThereFor} there` : null,
  ].filter(Boolean);
  const linkLabel = story.platform === "youtube" ? "Смотреть на YouTube" : "Открыть источник";

  return (
    <article className="flex h-full flex-col rounded-[20px] border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] p-4 shadow-[0_1px_0_rgba(80,60,20,0.04)]">
      <div className="relative mb-4 h-32 overflow-hidden rounded-2xl border border-[var(--city-reality-border)] bg-[#f7efe0]">
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={`${story.title} thumbnail`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(194,124,43,0.18),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(74,124,89,0.12),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(240,228,200,0.68))]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-800/20 bg-white/70 text-amber-800 backdrop-blur-sm">
                <PlayCircle className="h-5 w-5" />
              </div>
            </div>
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3 rounded-full border border-white/60 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-700 backdrop-blur-sm">
          <span>{story.platform}</span>
          <span className="min-w-0 truncate">{story.channelName}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
          {topicLabels[story.topic]}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${sentiment.textClass}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${sentiment.dotClass}`} />
          {sentiment.label}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--city-reality-border)] bg-[#fff7e6] text-amber-800">
          <PlayCircle className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug tracking-tight text-stone-900">
            {story.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-[var(--city-muted-fg)]">
            {story.channelName}
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-[var(--city-muted-fg)]">
        {movementLabel.join(" · ")}
      </p>

      <div className="mt-4 rounded-2xl border border-amber-200/70 bg-amber-50/50 px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
          Главное
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-stone-900">{story.keyTakeaway}</p>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--city-muted-fg)]">
        {story.summary}
      </p>

      <a
        href={story.videoUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-500 hover:bg-stone-50"
      >
        {linkLabel}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}

export function RelocationVideoStories({
  stories,
  emptyMessage = "Видео от переехавших для этого города ещё подбираются.",
}: {
  stories: RelocationVideoStory[];
  emptyMessage?: string;
}) {
  const verifiedStories = stories.filter((story) => story.verified);
  const featuredStories = verifiedStories.slice(0, 4);
  const extraStories = verifiedStories.slice(4);

  return (
    <section className="city-reality-surface rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">
            relocation video layer
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium leading-tight tracking-tight text-stone-900 sm:text-3xl">
            Видео от тех, кто уже переехал
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--city-muted-fg)]">
            Живой опыт людей, которые прошли переезд и рассказывают, что оказалось сложнее,
            дороже или лучше, чем ожидали.
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] px-4 py-3 text-xs leading-relaxed text-amber-900 sm:max-w-[240px]">
          Только личный relocation/lived-experience. Без туристических гидов, city tours и
          подборок достопримечательностей.
        </div>
      </div>

      {featuredStories.length > 0 ? (
        <>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {featuredStories.map((story) => (
              <VideoStoryCard key={story.id} story={story} />
            ))}
          </div>

          {extraStories.length > 0 && (
            <ShowMore label={`Показать ещё ${extraStories.length}`}>
              <div className="grid gap-3 md:grid-cols-2">
                {extraStories.map((story) => (
                  <VideoStoryCard key={story.id} story={story} />
                ))}
              </div>
            </ShowMore>
          )}
        </>
      ) : (
        <div className="mt-5 rounded-[20px] border border-dashed border-[var(--city-reality-border)] bg-[var(--city-reality-card)]/80 px-4 py-5 text-sm leading-relaxed text-[var(--city-muted-fg)]">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}
