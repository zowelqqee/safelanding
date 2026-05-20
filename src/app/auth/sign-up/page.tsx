"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/site/site-header";
import { signUpWithEmail } from "@/lib/auth/authService";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const { error: authError } = await signUpWithEmail(email, password);
    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    router.push("/start");
    router.refresh();
  }

  return (
    <div className="city-page-wrap min-h-screen flex flex-col">
      <SiteHeader variant="public" action="sign-up" />

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="city-card rounded-[28px] p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl border border-[var(--city-border)] bg-[var(--city-warm-muted)] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-stone-700" />
              </div>
              <div>
                <p className="city-section-kicker mb-1">Soft Landing</p>
                <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-900">Create your profile</h1>
                <p className="text-sm text-[var(--city-muted-fg)] mt-1.5">
                  Save your relocation progress, shortlist, and legal path.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-stone-800">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="border-[var(--city-border)] bg-[var(--city-card)] focus-visible:ring-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-stone-800">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="border-[var(--city-border)] bg-[var(--city-card)] focus-visible:ring-stone-400"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-sm font-medium text-stone-800">Confirm password</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className="border-[var(--city-border)] bg-[var(--city-card)] focus-visible:ring-stone-400"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full h-11 gap-2 rounded-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Create profile
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--city-muted-fg)]">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-stone-900 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
