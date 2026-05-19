"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMoveProfile } from "@/lib/profile/profileService";
import type { MoveProfile } from "@/types";
import { BooleanChoice, ChoiceGrid, RoadmapFormShell } from "./roadmap-form-shell";

const WORK_STATUS_OPTIONS = [
  { value: "remote_employee", label: "Remote employee" },
  { value: "freelancer", label: "Freelancer" },
  { value: "founder", label: "Founder" },
  { value: "job_seeker", label: "Job seeker" },
  { value: "employed_local_offer", label: "Local job offer" },
  { value: "not_working", label: "Not working" },
  { value: "not_sure", label: "Not sure yet" },
];

const STUDY_STATUS_OPTIONS = [
  { value: "not_studying", label: "Not studying" },
  { value: "applying_to_university", label: "Applying to university" },
  { value: "admitted", label: "Already admitted" },
  { value: "language_school", label: "Language school" },
  { value: "short_course", label: "Short course" },
  { value: "not_sure", label: "Not sure yet" },
];

interface WorkStudyFormProps {
  profile: MoveProfile;
}

export function WorkStudyForm({ profile }: WorkStudyFormProps) {
  const router = useRouter();
  const [workStatusDetail, setWorkStatusDetail] = useState(profile.work_status_detail ?? "");
  const [studyStatusDetail, setStudyStatusDetail] = useState(profile.study_status_detail ?? "");
  const [hasJobOffer, setHasJobOffer] = useState<boolean | null>(profile.has_job_offer ?? null);
  const [hasSchoolAdmission, setHasSchoolAdmission] = useState<boolean | null>(
    profile.has_school_admission ?? null
  );
  const [employerOrSchoolName, setEmployerOrSchoolName] = useState(
    profile.employer_or_school_name ?? ""
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit =
    workStatusDetail.trim().length > 0 && studyStatusDetail.trim().length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setError("");
    setSaving(true);

    const updated = await updateMoveProfile({
      work_status_detail: workStatusDetail,
      study_status_detail: studyStatusDetail,
      has_job_offer: hasJobOffer,
      has_school_admission: hasSchoolAdmission,
      employer_or_school_name: employerOrSchoolName.trim() || null,
      work_study_confirmed: true,
    });

    setSaving(false);

    if (!updated) {
      setError("We couldn't save your work and study details. Please try again.");
      return;
    }

    router.replace("/app/roadmap");
    router.refresh();
  }

  return (
    <RoadmapFormShell
      title="Add work/study details"
      description="Capture the employment or study facts that shape which legal path is realistic."
      onBack={() => router.push("/app/roadmap")}
      onSubmit={handleSubmit}
      submitLabel="Save work/study details"
      savingLabel="Saving details..."
      saving={saving}
      canSubmit={canSubmit}
      error={error}
    >
      <div className="space-y-2">
        <Label>Work status</Label>
        <ChoiceGrid
          value={workStatusDetail}
          onChange={setWorkStatusDetail}
          options={WORK_STATUS_OPTIONS}
          columns="grid-cols-1 sm:grid-cols-2"
        />
      </div>

      <div className="space-y-2">
        <Label>Study status</Label>
        <ChoiceGrid
          value={studyStatusDetail}
          onChange={setStudyStatusDetail}
          options={STUDY_STATUS_OPTIONS}
          columns="grid-cols-1 sm:grid-cols-2"
        />
      </div>

      <div className="space-y-2">
        <Label>Do you already have a job offer?</Label>
        <BooleanChoice value={hasJobOffer} onChange={setHasJobOffer} />
      </div>

      <div className="space-y-2">
        <Label>Do you already have school admission?</Label>
        <BooleanChoice
          value={hasSchoolAdmission}
          onChange={setHasSchoolAdmission}
          trueLabel="Admitted"
          falseLabel="No"
          nullLabel="Not sure"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="employer-or-school-name">Employer or school name</Label>
        <Input
          id="employer-or-school-name"
          value={employerOrSchoolName}
          onChange={(e) => setEmployerOrSchoolName(e.target.value)}
          placeholder="Optional"
        />
      </div>
    </RoadmapFormShell>
  );
}
