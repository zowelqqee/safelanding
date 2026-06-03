import { OnboardingGate } from "@/components/onboarding/onboarding-gate";
import { getServerLanguage } from "@/lib/i18n/server";

export const metadata = {
  title: "Start your move — Soft Landing",
};

export default async function StartPage() {
  const language = await getServerLanguage();

  return <OnboardingGate initialLanguage={language} />;
}
