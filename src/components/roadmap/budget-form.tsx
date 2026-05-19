"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateMoveProfile } from "@/lib/profile/profileService";
import type { MoveProfile } from "@/types";
import { ChoiceGrid, RoadmapFormShell } from "./roadmap-form-shell";

const MONTHLY_BUDGET_OPTIONS = [
  { value: "under_1500", label: "Under 1,500" },
  { value: "1500_2500", label: "1,500 to 2,500" },
  { value: "2500_4000", label: "2,500 to 4,000" },
  { value: "4000_6000", label: "4,000 to 6,000" },
  { value: "6000_plus", label: "6,000+" },
];

const EMERGENCY_FUND_OPTIONS = [
  { value: "under_3000", label: "Under 3,000" },
  { value: "3000_7000", label: "3,000 to 7,000" },
  { value: "7000_15000", label: "7,000 to 15,000" },
  { value: "15000_30000", label: "15,000 to 30,000" },
  { value: "30000_plus", label: "30,000+" },
];

interface BudgetFormProps {
  profile: MoveProfile;
}

export function BudgetForm({ profile }: BudgetFormProps) {
  const router = useRouter();
  const [expectedMonthlyBudgetRange, setExpectedMonthlyBudgetRange] = useState(
    profile.expected_monthly_budget_range ?? ""
  );
  const [emergencyFundRange, setEmergencyFundRange] = useState(
    profile.emergency_fund_range ?? ""
  );
  const [budgetNotes, setBudgetNotes] = useState(profile.budget_notes ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit =
    expectedMonthlyBudgetRange.trim().length > 0 &&
    emergencyFundRange.trim().length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setSaving(true);

    const updated = await updateMoveProfile({
      expected_monthly_budget_range: expectedMonthlyBudgetRange,
      emergency_fund_range: emergencyFundRange,
      budget_notes: budgetNotes.trim() || null,
      budget_confirmed: true,
    });

    setSaving(false);

    if (!updated) {
      setError("We couldn't save your budget reality. Please try again.");
      return;
    }

    router.replace("/app/roadmap");
    router.refresh();
  }

  return (
    <RoadmapFormShell
      title="Add budget reality"
      description="Make the plan realistic by capturing your monthly budget and emergency runway."
      onBack={() => router.push("/app/roadmap")}
      onSubmit={handleSubmit}
      submitLabel="Save budget reality"
      savingLabel="Saving budget..."
      saving={saving}
      canSubmit={canSubmit}
      error={error}
    >
      <div className="space-y-2">
        <Label>Expected monthly budget range</Label>
        <ChoiceGrid
          value={expectedMonthlyBudgetRange}
          onChange={setExpectedMonthlyBudgetRange}
          options={MONTHLY_BUDGET_OPTIONS}
          columns="grid-cols-1 sm:grid-cols-2"
        />
      </div>

      <div className="space-y-2">
        <Label>Emergency fund range</Label>
        <ChoiceGrid
          value={emergencyFundRange}
          onChange={setEmergencyFundRange}
          options={EMERGENCY_FUND_OPTIONS}
          columns="grid-cols-1 sm:grid-cols-2"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="budget-notes">Budget notes</Label>
        <Textarea
          id="budget-notes"
          value={budgetNotes}
          onChange={(e) => setBudgetNotes(e.target.value)}
          placeholder="Anything that makes your budget more realistic?"
          className="min-h-28"
        />
      </div>
    </RoadmapFormShell>
  );
}
