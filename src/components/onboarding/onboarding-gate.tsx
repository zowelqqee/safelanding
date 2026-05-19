"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Save, LogIn, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { OnboardingFlow } from "./onboarding-flow";

type GateView = "gate" | "preview";

export function OnboardingGate() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<GateView>("gate");
  const router = useRouter();

  // Still checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Authenticated: show full onboarding with persistence
  if (user) {
    return <OnboardingFlow isPreview={false} />;
  }

  // Not authenticated, chose preview: show onboarding without persistence
  if (view === "preview") {
    return <OnboardingFlow isPreview={true} />;
  }

  // Gate screen
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Create your free move profile</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
              Save your relocation progress, shortlist, legal path, and future roadmap.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="h-12 gap-2 text-base"
            onClick={() => router.push("/auth/sign-up")}
          >
            <Save className="h-4 w-4" />
            Create profile
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-12 gap-2 text-base"
            onClick={() => router.push("/auth/sign-in")}
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-2"
            onClick={() => setView("preview")}
          >
            <EyeOff className="h-3.5 w-3.5" />
            Continue preview without saving
          </Button>
        </div>
      </div>
    </div>
  );
}
