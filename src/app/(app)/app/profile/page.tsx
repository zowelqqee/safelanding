import Link from "next/link";
import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  Route,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getCityById } from "@/lib/data/cities";
import { getCountryById } from "@/lib/data/countries";
import { getLegalPathById } from "@/lib/data/legal-paths";
import { getCurrentUserWithMoveProfile } from "@/lib/profile/profileServer";
import { matchCountries } from "@/lib/scoring/country-matcher";
import { buildCountryMatchInputFromMoveProfile } from "@/lib/scoring/move-profile-match";
import {
  generateRoadmap,
  getMovePreparationLabel,
} from "@/lib/roadmap/roadmapGenerator";

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border bg-card">{children}</div>;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="border-b px-4 py-3">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b px-4 py-3 last:border-b-0">
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1 text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[220px] text-right text-sm font-medium leading-relaxed break-words">
        {value}
      </span>
    </div>
  );
}

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUserWithMoveProfile();

  const email = user?.email ?? "—";
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? null;
  const countryLabel = profile?.selected_country_id
    ? getCountryById(profile.selected_country_id)?.name ?? profile.selected_country_id
    : "—";
  const cityLabel = profile?.selected_city_id
    ? getCityById(profile.selected_city_id)?.name ?? profile.selected_city_id
    : "—";
  const pathLabel = profile?.selected_legal_path_id
    ? getLegalPathById(profile.selected_legal_path_id)?.name ?? profile.selected_legal_path_id
    : "—";
  const roadmap = profile ? generateRoadmap(profile) : null;
  const countryMatch = profile?.selected_country_id
    ? matchCountries(buildCountryMatchInputFromMoveProfile(profile)).find(
        (match) => match.countryId === profile.selected_country_id
      ) ?? null
    : null;
  const currentLevel =
    roadmap?.levels.find((level) => level.id === roadmap.currentLevelId) ?? null;
  const savedCountryLabels = profile?.saved_country_ids.map(
    (id) => getCountryById(id)?.name ?? id
  ) ?? [];
  const savedCityLabels = profile?.saved_city_ids.map(
    (id) => getCityById(id)?.name ?? id
  ) ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your account, selections, and current move preparation snapshot.
        </p>
      </div>

      <SectionCard>
        <SectionHeader title="Account" />
        <Row icon={User} label="Name" value={displayName ?? "Not set"} />
        <Row icon={Mail} label="Email" value={email} />
      </SectionCard>

      {profile ? (
        <>
          <SectionCard>
            <SectionHeader title="Move summary" />
            <Row icon={MapPin} label="City" value={cityLabel} />
            <Row icon={Globe} label="Country" value={countryLabel} />
            <Row icon={Route} label="Legal path" value={pathLabel} />
            <Row
              icon={TrendingUp}
              label="Lifestyle fit"
              value={countryMatch ? `${countryMatch.lifestyleFit}%` : "—"}
            />
            <Row
              icon={TrendingUp}
              label="Legal fit"
              value={countryMatch ? `${countryMatch.legalFit}%` : "—"}
            />
            <Row
              icon={TrendingUp}
              label="Move preparation"
              value={`${roadmap?.readinessPercent ?? 0}% · ${getMovePreparationLabel(
                roadmap?.readinessPercent ?? 0,
                Boolean(profile?.selected_legal_path_id)
              )}`}
            />
            <Row
              icon={ArrowRight}
              label="Current roadmap stage"
              value={currentLevel?.title ?? "—"}
            />
            <div className="border-t px-4 py-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/app/move-brief" className="inline-flex">
                  <Button variant="outline" className="gap-2">
                    View Move Brief
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/app/partner-review" className="inline-flex">
                  <Button className="gap-2">
                    Request partner review
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader title="Profile state" />
            <Row
              icon={User}
              label="Onboarding completed"
              value={profile.onboarding_completed ? "Yes" : "No"}
            />
            <Row icon={Route} label="Active step" value={profile.active_step} />
            <Row
              icon={Globe}
              label="Saved countries"
              value={savedCountryLabels.length > 0 ? savedCountryLabels.join(", ") : "—"}
            />
            <Row
              icon={MapPin}
              label="Saved cities"
              value={savedCityLabels.length > 0 ? savedCityLabels.join(", ") : "—"}
            />
          </SectionCard>
        </>
      ) : (
        <SectionCard>
          <SectionHeader title="Move summary" />
          <div className="space-y-4 px-4 py-5">
            <p className="text-sm leading-relaxed text-muted-foreground">
              You&apos;re signed in, but you haven&apos;t created a move profile yet.
              Start onboarding to generate your roadmap.
            </p>
            <Link href="/start" className="inline-flex">
              <Button className="gap-2">
                Start your move
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </SectionCard>
      )}

      <SectionCard>
        <SectionHeader title="Settings" />
        <div className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Language</span>
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground">
              English
            </span>
          </div>
        </div>
        <div className="px-4 py-3">
          <SignOutButton />
        </div>
      </SectionCard>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Soft Landing v0.1
      </p>
    </div>
  );
}
