"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";

interface Props {
  email: string;
}

export function HeaderUser({ email }: Props) {
  return (
    <div className="ml-auto flex items-center gap-3">
      <span className="text-xs text-muted-foreground hidden lg:block truncate max-w-[200px]">
        {email}
      </span>
      <SignOutButton
        variant="ghost"
        size="sm"
        className="text-muted-foreground"
      />
    </div>
  );
}
