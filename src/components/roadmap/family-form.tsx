"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMoveProfile } from "@/lib/profile/profileService";
import type { MoveProfile } from "@/types";
import { ChoiceGrid, RoadmapFormShell } from "./roadmap-form-shell";

const MOVING_WITH_OPTIONS = [
  { value: "alone", label: "Alone" },
  { value: "partner", label: "Partner" },
  { value: "family", label: "Family" },
  { value: "children", label: "Children" },
  { value: "not_sure", label: "Not sure yet" },
];

interface FamilyFormProps {
  profile: MoveProfile;
}

export function FamilyForm({ profile }: FamilyFormProps) {
  const router = useRouter();
  const [movingWith, setMovingWith] = useState(profile.moving_with ?? "");
  const [dependentsCount, setDependentsCount] = useState(
    profile.dependents_count !== null ? String(profile.dependents_count) : ""
  );
  const [familyNotes, setFamilyNotes] = useState(profile.family_notes ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = movingWith.trim().length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    const trimmedDependents = dependentsCount.trim();
    const hasInvalidDependents =
      trimmedDependents.length > 0 && !/^\d+$/.test(trimmedDependents);

    if (hasInvalidDependents) {
      setError("Please enter a valid number of dependents.");
      return;
    }

    const parsedDependents =
      trimmedDependents.length > 0 ? Number.parseInt(trimmedDependents, 10) : null;

    setError("");
    setSaving(true);

    const updated = await updateMoveProfile({
      moving_with: movingWith,
      dependents_count: parsedDependents,
      family_notes: familyNotes.trim() || null,
      family_confirmed: true,
      active_step: "prepare_documents",
    });

    setSaving(false);

    if (!updated) {
      setError("We couldn't save your family details. Please try again.");
      return;
    }

    router.replace("/app/roadmap");
    router.refresh();
  }

  return (
    <RoadmapFormShell
      title="Add family/partner info"
      description="Capture who may be moving with you so later document and risk checks can stay accurate."
      onBack={() => router.push("/app/roadmap")}
      onSubmit={handleSubmit}
      submitLabel="Save"
      savingLabel="Saving..."
      saving={saving}
      canSubmit={canSubmit}
      error={error}
    >
      <div className="space-y-2">
        <Label>Who are you moving with?</Label>
        <ChoiceGrid
          value={movingWith}
          onChange={setMovingWith}
          options={MOVING_WITH_OPTIONS}
          columns="grid-cols-1 sm:grid-cols-2"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dependents-count">Dependents count</Label>
        <Input
          id="dependents-count"
          type="number"
          min="0"
          inputMode="numeric"
          value={dependentsCount}
          onChange={(e) => setDependentsCount(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="family-notes">Family notes</Label>
        <Textarea
          id="family-notes"
          value={familyNotes}
          onChange={(e) => setFamilyNotes(e.target.value)}
          placeholder="Anything important about your partner, children, or dependents?"
          className="min-h-28"
        />
      </div>
    </RoadmapFormShell>
  );
}
