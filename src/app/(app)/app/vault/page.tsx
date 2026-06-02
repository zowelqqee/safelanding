import Link from "next/link";
import { ArrowRight, FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";
import { getServerLanguage } from "@/lib/i18n/server";

export default async function VaultPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="city-card rounded-[28px] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]">
            <FileStack className="h-6 w-6 text-stone-600" />
          </div>
          <h1 className="mt-5 font-serif text-2xl font-medium text-stone-900">
            Your document workspace
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--city-muted-fg)]">
            Start your move first to build your document workspace alongside your roadmap.
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
  const currentLevelTitle = roadmap.levels.find((l) => l.id === roadmap.currentLevelId)?.title ?? "planning";

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
      <div className="space-y-0.5">
        <p className="city-section-kicker mb-1">Document layer</p>
        <h1 className="font-serif text-2xl font-medium text-stone-900">Documents</h1>
        <p className="text-sm text-[var(--city-muted-fg)]">
          Your document workspace for this move.
        </p>
      </div>

      <div className="city-card rounded-[22px] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--city-border)] bg-[var(--city-warm-muted)]">
            <FileStack className="h-5 w-5 text-stone-600" />
          </div>
          <div>
            <p className="city-section-kicker mb-0.5">Current stage</p>
            <p className="text-sm font-semibold text-stone-900">{currentLevelTitle}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-[var(--city-muted-fg)]">
          Your document workspace will grow alongside your roadmap. As your move profile
          fills in, this section will surface the passport, proof, insurance,
          certificates, translations, and forms relevant to your chosen path.
        </p>

        <div className="mt-4">
          <Link href="/app/partner-review">
            <Button variant="outline" className="gap-2 rounded-full border-[var(--city-border)] text-stone-700">
              Request advisor review
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
