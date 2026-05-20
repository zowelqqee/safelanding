"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/trackEvent";

export function TrackedVideoLink({
  href,
  label,
  storyId,
  cityId,
  countryId,
  topic,
}: {
  href: string;
  label: string;
  storyId: string;
  cityId?: string;
  countryId: string;
  topic: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        void trackEvent("video_story_clicked", {
          storyId,
          cityId: cityId ?? null,
          countryId,
          topic,
        });
      }}
      className="mt-4 inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 transition-colors hover:border-stone-500 hover:bg-stone-50"
    >
      <span className="min-w-0 truncate">{label}</span>
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
