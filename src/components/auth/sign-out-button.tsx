"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/authService";

type ButtonProps = ComponentProps<typeof Button>;

interface SignOutButtonProps {
  className?: string;
  label?: string;
  pendingLabel?: string;
  redirectTo?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
}

export function SignOutButton({
  className,
  label = "Sign out",
  pendingLabel = "Signing out...",
  redirectTo = "/",
  size = "sm",
  variant = "ghost",
}: SignOutButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    try {
      setIsPending(true);
      await signOut();
      if (typeof window !== "undefined") {
        localStorage.removeItem("sl_onboarding");
      }
      router.replace(redirectTo);
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleSignOut}
      disabled={isPending}
      className={className}
    >
      <LogOut className="h-4 w-4" />
      {isPending ? pendingLabel : label}
    </Button>
  );
}
