import { redirect } from "next/navigation";
import { FamilyForm } from "@/components/roadmap/family-form";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";

export default async function FamilyPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    redirect("/start");
  }

  if (!profile.selected_legal_path_id) {
    redirect("/app/roadmap");
  }

  if (!profile.budget_confirmed && !profile.family_confirmed) {
    redirect("/app/roadmap");
  }

  return <FamilyForm profile={profile} />;
}
