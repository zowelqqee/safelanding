import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppBottomNav } from "./bottom-nav";
import { HeaderUser } from "./header-user";

const NAV_ITEMS = [
  { href: "/app/roadmap", label: "Roadmap" },
  { href: "/app/tasks", label: "Tasks" },
  { href: "/app/vault", label: "Vault" },
  { href: "/app/explore", label: "Explore" },
  { href: "/app/profile", label: "Profile" },
] as const;

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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Desktop top nav — hidden on mobile */}
      <header className="hidden md:flex items-center border-b border-border bg-card px-6 h-14 shrink-0">
        <Link
          href="/"
          className="font-semibold text-primary text-base tracking-tight mr-8 transition-opacity hover:opacity-80"
        >
          Soft Landing
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <HeaderUser email={userEmail} />
      </header>

      {/* Content — pb-20 on mobile so bottom nav doesn't overlap */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* Mobile bottom nav — hidden on desktop */}
      <AppBottomNav />
    </div>
  );
}
