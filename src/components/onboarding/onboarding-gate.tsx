"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MapPin, LogIn, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/site/site-header";
import { OnboardingFlow } from "./onboarding-flow";

type GateView = "gate" | "preview";

export function OnboardingGate() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<GateView>("gate");
  const router = useRouter();

  let content: ReactNode;

  if (loading) {
    content = (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Loading your move profile...
        </p>
      </div>
    );
  } else if (user) {
    content = <OnboardingFlow isPreview={false} />;
  } else if (view === "preview") {
    content = <OnboardingFlow isPreview={true} />;
  } else {
    content = (
      <div className="flex flex-1 flex-col items-center justify-center px-4 bg-background">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--city-warm-muted)] border border-[var(--city-border)] flex items-center justify-center">
              <MapPin className="h-6 w-6 text-stone-600" />
            </div>
            <div className="space-y-1.5">
              <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">Find where you fit</h1>
              <p className="text-sm text-[var(--city-muted-fg)] leading-relaxed max-w-xs mx-auto">
                Answer a few questions. Get a ranked country shortlist, city match, and legal path — tailored to your profile.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              className="h-12 gap-2 text-base rounded-full"
              onClick={() => setView("preview")}
            >
              Start — no account needed
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[var(--city-border)]" />
              <span className="text-xs text-[var(--city-muted-fg)]">or save your progress</span>
              <div className="flex-1 h-px bg-[var(--city-border)]" />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 rounded-full border-[var(--city-border)] text-stone-700"
              onClick={() => router.push("/auth/sign-up")}
            >
              Create free account
            </Button>

            <button
              className="text-xs text-[var(--city-muted-fg)] hover:text-stone-700 transition-colors flex items-center justify-center gap-1"
              onClick={() => router.push("/auth/sign-in")}
            >
              <LogIn className="h-3 w-3" />
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" action="none" />
      {content}
    </div>
  );
}
