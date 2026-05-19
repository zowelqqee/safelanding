"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMoveProfile } from "@/lib/profile/profileService";
import type { MoveProfile } from "@/types";
import { BooleanChoice, ChoiceGrid, RoadmapFormShell } from "./roadmap-form-shell";

const URGENCY_OPTIONS = [
  { value: "flexible", label: "Flexible" },
  { value: "within_3_months", label: "Within 3 months" },
  { value: "within_6_months", label: "Within 6 months" },
  { value: "this_year", label: "This year" },
  { value: "not_sure", label: "Not sure yet" },
];

interface TimelineFormProps {
  profile: MoveProfile;
}

export function TimelineForm({ profile }: TimelineFormProps) {
  const router = useRouter();
  const [targetMoveMonth, setTargetMoveMonth] = useState(profile.target_move_month ?? "");
  const [urgencyLevel, setUrgencyLevel] = useState(profile.urgency_level ?? "");
  const [mustArriveBefore, setMustArriveBefore] = useState(profile.must_arrive_before ?? "");
  const [flexibleDates, setFlexibleDates] = useState<boolean | null>(
    profile.flexible_dates ?? null
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = targetMoveMonth.trim().length > 0 && urgencyLevel.trim().length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setSaving(true);

    const updated = await updateMoveProfile({
      target_move_month: targetMoveMonth.trim(),
      urgency_level: urgencyLevel,
      must_arrive_before: mustArriveBefore.trim() || null,
      flexible_dates: flexibleDates,
      timeline_confirmed: true,
    });

    setSaving(false);

    if (!updated) {
      setError("We couldn't save your timeline. Please try again.");
      return;
    }

    router.replace("/app/roadmap");
    router.refresh();
  }

  return (
    <RoadmapFormShell
      title="Add timeline"
      description="Set your target move window so the roadmap can pace the next steps around real timing."
      onBack={() => router.push("/app/roadmap")}
      onSubmit={handleSubmit}
      submitLabel="Save"
      savingLabel="Saving..."
      saving={saving}
      canSubmit={canSubmit}
      error={error}
    >
      <div className="space-y-1.5">
        <Label htmlFor="target-move-month">Target move month</Label>
        <Input
          id="target-move-month"
          type="month"
          value={targetMoveMonth}
          onChange={(e) => setTargetMoveMonth(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Urgency level</Label>
        <ChoiceGrid
          value={urgencyLevel}
          onChange={setUrgencyLevel}
          options={URGENCY_OPTIONS}
          columns="grid-cols-1 sm:grid-cols-2"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="must-arrive-before">Must arrive before</Label>
        <Input
          id="must-arrive-before"
          type="date"
          value={mustArriveBefore}
          onChange={(e) => setMustArriveBefore(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Are your dates flexible?</Label>
        <BooleanChoice
          value={flexibleDates}
          onChange={setFlexibleDates}
          trueLabel="Flexible"
          falseLabel="Fixed"
          nullLabel="Not sure"
        />
      </div>
    </RoadmapFormShell>
  );
}
