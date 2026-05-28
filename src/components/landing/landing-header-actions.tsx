"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { useAuth } from "@/hooks/useAuth";

type LandingHeaderActionsProps = {
  languageCopy: {
    openApp: string;
    signIn: string;
    signOut: string;
    signingOut: string;
    startMyMove: string;
  };
};

export function LandingHeaderActions({
  languageCopy,
}: LandingHeaderActionsProps) {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/sign-in" className="text-sm text-[var(--city-muted-fg)] hover:text-stone-900 hidden sm:block">
          {languageCopy.signIn}
        </Link>
        <Link href="/start">
          <Button size="sm">{languageCopy.startMyMove}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/app/roadmap">
        <Button size="sm">{languageCopy.openApp}</Button>
      </Link>
      <SignOutButton
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
        label={languageCopy.signOut}
        pendingLabel={languageCopy.signingOut}
      />
    </div>
  );
}
