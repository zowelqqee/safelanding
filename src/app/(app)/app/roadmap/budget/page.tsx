import { redirect } from "next/navigation";
import { BudgetForm } from "@/components/roadmap/budget-form";
import { getCurrentMoveProfileServer } from "@/lib/profile/profileServer";

export default async function BudgetPage() {
  const profile = await getCurrentMoveProfileServer();

  if (!profile) {
    redirect("/start");
  }

  if (!profile.selected_legal_path_id) {
    redirect("/app/roadmap");
  }

  if (!profile.work_study_confirmed && !profile.budget_confirmed) {
    redirect("/app/roadmap");
  }

  return <BudgetForm profile={profile} />;
}
