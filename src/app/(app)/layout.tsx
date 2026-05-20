import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppBottomNav } from "./bottom-nav";
import { SiteHeader } from "@/components/site/site-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const userEmail = user.email ?? "";

  return (
    <div className="city-page-wrap flex flex-col min-h-screen">
      <SiteHeader variant="app" action="none" userEmail={userEmail} />

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <AppBottomNav />
    </div>
  );
}
