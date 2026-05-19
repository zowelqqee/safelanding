"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMoveProfile } from "@/lib/profile/profileService";
import type { MoveGoal, MoveProfile } from "@/types";

const GOAL_OPTIONS: Array<{ value: MoveGoal; label: string }> = [
  { value: "remote_work", label: "Move for remote work" },
  { value: "study", label: "Move for study" },
  { value: "explore_first", label: "Explore first, decide later" },
  { value: "find_job", label: "Find a job abroad" },
  { value: "family", label: "Move with family/partner" },
  { value: "not_sure", label: "Not sure yet" },
];

interface PersonalDetailsFormProps {
  profile: MoveProfile;
}

export function PersonalDetailsForm({ profile }: PersonalDetailsFormProps) {
  const router = useRouter();
  const [citizenship, setCitizenship] = useState(profile.citizenship ?? "");
  const [currentCountry, setCurrentCountry] = useState(profile.current_country ?? "");
  const [residenceCountry, setResidenceCountry] = useState(profile.residence_country ?? "");
  const [preferredLanguage, setPreferredLanguage] = useState(profile.preferred_language ?? "en");
  const [moveGoal, setMoveGoal] = useState(profile.move_goal ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit =
    citizenship.trim().length > 0 &&
    currentCountry.trim().length > 0 &&
    residenceCountry.trim().length > 0 &&
    preferredLanguage.trim().length > 0 &&
    moveGoal.trim().length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setSaving(true);

    const updated = await updateMoveProfile({
      citizenship: citizenship.trim(),
      current_country: currentCountry.trim(),
      residence_country: residenceCountry.trim(),
      preferred_language: preferredLanguage,
      move_goal: moveGoal,
      personal_details_confirmed: true,
    });

    setSaving(false);

    if (!updated) {
      setError("We couldn't save your details. Please try again.");
      return;
    }

    router.replace("/app/roadmap");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 md:py-8">
      <div className="rounded-[28px] border bg-card shadow-sm">
        <div className="border-b px-5 py-5">
          <button
            type="button"
            onClick={() => router.push("/app/roadmap")}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to roadmap
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Confirm personal details
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Review the core profile details your roadmap will use going forward.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
          <div className="space-y-1.5">
            <Label htmlFor="citizenship">Citizenship</Label>
            <Input
              id="citizenship"
              value={citizenship}
              onChange={(e) => setCitizenship(e.target.value)}
              placeholder="e.g. Germany"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="current-country">Current country</Label>
            <Input
              id="current-country"
              value={currentCountry}
              onChange={(e) => setCurrentCountry(e.target.value)}
              placeholder="Where you live now"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="residence-country">Residence country</Label>
            <Input
              id="residence-country"
              value={residenceCountry}
              onChange={(e) => setResidenceCountry(e.target.value)}
              placeholder="Your legal residence country"
            />
          </div>

          <div className="space-y-2">
            <Label>Preferred language</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["en", "ru"] as const).map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setPreferredLanguage(language)}
                  className={`h-11 rounded-xl border text-sm font-medium transition-colors ${
                    preferredLanguage === language
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {language === "en" ? "English" : "Русский"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="move-goal">Move goal</Label>
            <select
              id="move-goal"
              value={moveGoal}
              onChange={(e) => setMoveGoal(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="" disabled>
                Select your main goal
              </option>
              {GOAL_OPTIONS.map((goal) => (
                <option key={goal.value} value={goal.value}>
                  {goal.label}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={!canSubmit || saving}
              className="h-12 gap-2 text-base"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/app/roadmap")}
              className="h-11 text-muted-foreground"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
