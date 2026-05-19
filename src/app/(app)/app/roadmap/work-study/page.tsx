import { redirect } from "next/navigation";
import { WorkStudyForm } from "@/components/roadmap/work-study-form";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";

export default async function WorkStudyPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    redirect("/start");
  }

  if (!profile.selected_legal_path_id) {
    redirect("/app/roadmap");
  }

  if (!profile.timeline_confirmed && !profile.work_study_confirmed) {
    redirect("/app/roadmap");
  }

  return <WorkStudyForm profile={profile} />;
}
