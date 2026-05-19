import { redirect } from "next/navigation";
import { PersonalDetailsForm } from "@/components/roadmap/personal-details-form";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";

export default async function PersonalDetailsPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    redirect("/start");
  }

  if (!profile.selected_legal_path_id) {
    redirect("/app/roadmap");
  }

  return <PersonalDetailsForm profile={profile} />;
}
