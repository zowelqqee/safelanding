"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useAuth } from "@/hooks/useAuth";

export function LandingHeaderActions() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/explore"
          className="text-sm text-[var(--city-muted-fg)] hover:text-stone-900 hidden sm:block"
        >
          Explore
        </Link>
        <Link href="/start">
          <Button size="sm">Start my move</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/explore"
        className="text-sm text-[var(--city-muted-fg)] hover:text-stone-900 hidden sm:block"
      >
        Explore
      </Link>
      <Link href="/start">
        <Button size="sm">Continue</Button>
      </Link>
      <SignOutButton variant="ghost" size="sm" className="text-muted-foreground" />
    </div>
  );
}
