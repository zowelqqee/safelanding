import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoadmapScreen } from "@/components/roadmap/roadmap-screen";
import { TrackPageEvent } from "@/components/analytics/track-page-event";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";

export default async function RoadmapPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-10">
        <div className="w-full rounded-[28px] border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            Build your roadmap
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Start onboarding to choose your destination and legal path. We&apos;ll
            generate a personal move roadmap from your profile.
          </p>
          <Link href="/start" className="mt-6 inline-flex">
            <Button size="lg" className="gap-2">
              Start your move
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const roadmap = generateRoadmap(profile);

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
