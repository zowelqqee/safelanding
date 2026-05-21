import Image from "next/image";
import { ChevronDown, PlayCircle } from "lucide-react";

import { TrackedVideoLink } from "@/components/analytics/tracked-video-link";
import { getExistingPublicImageSrc } from "@/lib/server/public-image";
import type { UiLanguage } from "@/lib/i18n/onboarding";
import type {
  RelocationVideoPersonType,
  RelocationVideoSentiment,
  RelocationVideoStory,
  RelocationVideoTopic,
} from "@/types";

const relocationVideoCopy = {
  en: {
    topicLabels: {
      housing: "Housing",
      cost: "Cost",
      documents: "Documents",
      language: "Language",
      work: "Work",
      community: "Community",
      first_90_days: "First 90 days",
      mistakes: "Mistakes",
      regret: "Regret",
      adaptation: "Adaptation",
      general: "Moving",
    } satisfies Record<RelocationVideoTopic, string>,
    sentimentLabels: {
      positive: "Positive",
      mixed: "Mixed",
      negative: "Challenging",
    } satisfies Record<RelocationVideoSentiment, string>,
    watchOnYoutube: "Watch on YouTube",
    openSource: "Open source",
    keyTakeaway: "Key takeaway",
    emptyMessage: "Relocation videos for this city are still being curated.",
    title: "Videos from people who already moved",
    description:
      "First-hand experiences from people who went through the move and share what turned out to be harder, more expensive, or better than expected.",
    disclaimer:
      "Only personal relocation and lived-experience stories. No tourist guides, city tours, or sightseeing roundups.",
    showMore: (count: number) => `Show ${count} more`,
  },
  ru: {
    topicLabels: {
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
    } satisfies Record<RelocationVideoTopic, string>,
    sentimentLabels: {
      positive: "позитивный",
      mixed: "смешанный",
      negative: "сложный",
    } satisfies Record<RelocationVideoSentiment, string>,
    watchOnYoutube: "Смотреть на YouTube",
    openSource: "Открыть источник",
    keyTakeaway: "Главное",
    emptyMessage: "Видео от переехавших для этого города ещё подбираются.",
    title: "Видео от тех, кто уже переехал",
    description:
      "Живой опыт людей, которые прошли переезд и рассказывают, что оказалось сложнее, дороже или лучше, чем ожидали.",
    disclaimer:
      "Только личный relocation/lived-experience. Без туристических гидов, city tours и подборок достопримечательностей.",
    showMore: (count: number) => `Показать ещё ${count}`,
  },
} satisfies Record<
  UiLanguage,
  {
    topicLabels: Record<RelocationVideoTopic, string>;
    sentimentLabels: Record<RelocationVideoSentiment, string>;
    watchOnYoutube: string;
    openSource: string;
    keyTakeaway: string;
    emptyMessage: string;
    title: string;
    description: string;
    disclaimer: string;
    showMore: (count: number) => string;
  }
>;

const sentimentStyles: Record<
  RelocationVideoSentiment,
  { dotClass: string; textClass: string }
> = {
  positive: {
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
  },
  mixed: {
    dotClass: "bg-amber-500",
    textClass: "text-amber-700",
  },
  negative: {
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
      <summary className="inline-flex max-w-full cursor-pointer list-none items-center gap-2 rounded-full border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] px-4 py-2 text-xs font-medium text-[var(--city-muted-fg)] transition-colors hover:bg-amber-100/60">
        <span className="min-w-0 truncate">{label}</span>
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function VideoStoryCard({
  story,
  language,
}: {
  story: RelocationVideoStory;
  language: UiLanguage;
}) {
  const copy = relocationVideoCopy[language];
  const sentiment = sentimentStyles[story.sentiment];
  const thumbnailSrc = getExistingPublicImageSrc(story.thumbnailUrl);
  const movementLabel = [
    personTypeLabels[story.personType],
    story.movedFrom ? `${story.movedFrom} to ${story.movedTo}` : story.movedTo,
    story.livedThereFor ? `${story.livedThereFor} there` : null,
  ].filter(Boolean);
  const linkLabel = story.platform === "youtube" ? copy.watchOnYoutube : copy.openSource;

  return (
    <article className="flex h-full min-w-0 flex-col rounded-[20px] border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] p-4 shadow-[0_1px_0_rgba(80,60,20,0.04)]">
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
          {copy.topicLabels[story.topic]}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${sentiment.textClass}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${sentiment.dotClass}`} />
          {copy.sentimentLabels[story.sentiment]}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--city-reality-border)] bg-[#fff7e6] text-amber-800">
          <PlayCircle className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="break-words text-base font-semibold leading-snug tracking-tight text-stone-900">
            {story.title}
          </h3>
          <p className="mt-1 text-xs font-medium text-[var(--city-muted-fg)]">
            {story.channelName}
          </p>
        </div>
      </div>

      <p className="mt-3 break-words text-[11px] uppercase tracking-[0.12em] text-[var(--city-muted-fg)]">
        {movementLabel.join(" · ")}
      </p>

      <div className="mt-4 rounded-2xl border border-amber-200/70 bg-amber-50/50 px-3 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-800">
          {copy.keyTakeaway}
        </p>
        <p className="mt-1.5 break-words text-sm leading-relaxed text-stone-900">{story.keyTakeaway}</p>
      </div>

      <p className="mt-3 flex-1 break-words text-sm leading-relaxed text-[var(--city-muted-fg)]">
        {story.summary}
      </p>

      <TrackedVideoLink
        href={story.videoUrl}
        label={linkLabel}
        storyId={story.id}
        cityId={story.cityId}
        countryId={story.countryId}
        topic={story.topic}
      />
    </article>
  );
}

export function RelocationVideoStories({
  stories,
  language = "en",
  emptyMessage,
}: {
  stories: RelocationVideoStory[];
  language?: UiLanguage;
  emptyMessage?: string;
}) {
  const copy = relocationVideoCopy[language];
  const verifiedStories = stories.filter((story) => story.verified);
  const featuredStories = verifiedStories.slice(0, 4);
  const extraStories = verifiedStories.slice(4);
  const resolvedEmptyMessage = emptyMessage ?? copy.emptyMessage;

  return (
    <section className="city-reality-surface min-w-0 overflow-hidden rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">
            relocation video layer
          </p>
          <h2 className="mt-2 font-serif text-2xl font-medium leading-tight tracking-tight text-stone-900 sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-3 break-words text-sm leading-relaxed text-[var(--city-muted-fg)]">
            {copy.description}
          </p>
        </div>
        <div className="min-w-0 rounded-2xl border border-[var(--city-reality-border)] bg-[var(--city-reality-card)] px-4 py-3 text-xs leading-relaxed text-amber-900 sm:max-w-[240px] sm:shrink-0">
          {copy.disclaimer}
        </div>
      </div>

      {featuredStories.length > 0 ? (
        <>
          <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-2">
            {featuredStories.map((story) => (
              <VideoStoryCard key={story.id} story={story} language={language} />
            ))}
          </div>

          {extraStories.length > 0 && (
            <ShowMore label={copy.showMore(extraStories.length)}>
              <div className="grid min-w-0 gap-3 md:grid-cols-2">
                {extraStories.map((story) => (
                  <VideoStoryCard key={story.id} story={story} language={language} />
                ))}
              </div>
            </ShowMore>
          )}
        </>
      ) : (
        <div className="mt-5 rounded-[20px] border border-dashed border-[var(--city-reality-border)] bg-[var(--city-reality-card)]/80 px-4 py-5 text-sm leading-relaxed text-[var(--city-muted-fg)]">
          {resolvedEmptyMessage}
        </div>
      )}
    </section>
  );
}
