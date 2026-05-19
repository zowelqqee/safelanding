import Link from "next/link";
import { ArrowRight, FileStack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";
import { generateRoadmap } from "@/lib/roadmap/roadmapGenerator";

export default async function VaultPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="rounded-[28px] border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FileStack className="h-6 w-6 text-primary" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">
            Document vault coming next
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Start your move first. We&apos;ll unlock the vault after your roadmap has the basics in place.
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
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Vault</h1>
        <p className="text-sm text-muted-foreground">
          Document vault coming next
        </p>
      </div>

      <div className="rounded-[26px] border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-primary">
          <FileStack className="h-3.5 w-3.5" />
          Coming next
        </div>
        <h2 className="mt-3 text-lg font-semibold tracking-tight">
          We&apos;ll unlock documents after your move profile is complete.
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Right now your roadmap is focused on <span className="font-medium text-foreground">{roadmap.levels.find((level) => level.id === roadmap.currentLevelId)?.title ?? "planning"}</span>.
          Once that stage is stronger, this tab will guide you through the passport,
          proof, insurance, certificates, translations, and forms you need.
        </p>
      </div>
    </div>
  );
}
