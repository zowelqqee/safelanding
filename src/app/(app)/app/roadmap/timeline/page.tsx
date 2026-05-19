import { redirect } from "next/navigation";
import { TimelineForm } from "@/components/roadmap/timeline-form";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";

export default async function TimelinePage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    redirect("/start");
  }

  if (!profile.selected_legal_path_id) {
    redirect("/app/roadmap");
  }

  if (!profile.personal_details_confirmed && !profile.timeline_confirmed) {
    redirect("/app/roadmap");
  }

  return <TimelineForm profile={profile} />;
}
