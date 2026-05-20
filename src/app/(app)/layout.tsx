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
    <div className="city-page-wrap flex flex-col min-h-screen">
      {/* Desktop top nav */}
      <header className="hidden md:flex items-center border-b border-[var(--city-border)] bg-[var(--city-card)] px-6 h-14 shrink-0">
        <Link
          href="/"
          className="font-semibold text-stone-900 text-base tracking-tight mr-8 transition-opacity hover:opacity-70"
        >
          Soft Landing
        </Link>
        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-full text-sm font-medium text-[var(--city-muted-fg)] hover:text-stone-900 hover:bg-[var(--city-warm-muted)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <HeaderUser email={userEmail} />
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <AppBottomNav />
    </div>
  );
}
