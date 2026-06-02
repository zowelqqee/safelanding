import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoadmapScreen } from "@/components/roadmap/roadmap-screen";
import { TrackPageEvent } from "@/components/analytics/track-page-event";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";
import { getServerLanguage } from "@/lib/i18n/server";

export default async function RoadmapPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-10">
        <div className="city-card w-full rounded-[28px] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]">
            <Compass className="h-6 w-6 text-stone-600" />
          </div>
          <h1 className="mt-5 font-serif text-2xl font-medium text-stone-900">
            Your roadmap starts here
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">
            Complete onboarding to choose your destination and legal path. Your personal roadmap is generated from your answers.
          </p>
          <Link href="/start" className="mt-6 inline-flex">
            <Button size="lg" className="gap-2 rounded-full">
              Start your move
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const language = await getServerLanguage(profile.preferred_language);
  const roadmap = generateRoadmap(profile, language);

  return (
    <>
      <TrackPageEvent
        eventName="roadmap_opened"
        payload={{
          moveProfileId: profile.id,
          countryId: profile.selected_country_id,
          cityId: profile.selected_city_id,
          legalPathId: profile.selected_legal_path_id,
        }}
      />
      <RoadmapScreen roadmap={roadmap} />
    </>
  );
}
