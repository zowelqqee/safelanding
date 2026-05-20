import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Internal Metrics — Soft Landing",
};

const ADMIN_EMAIL = "zowel.fx@gmail.com";

const EVENT_NAMES = [
  "onboarding_completed",
  "country_selected",
  "city_selected",
  "legal_path_selected",
  "city_reality_viewed",
  "video_story_clicked",
  "move_brief_viewed",
  "partner_review_requested",
] as const;

export default async function InternalMetricsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email !== ADMIN_EMAIL) {
    notFound();
  }

  const admin = createAdminClient();

  if (!admin) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="city-card rounded-[28px] p-6">
          <p className="city-section-kicker">Internal metrics</p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-stone-900">
            Metrics unavailable
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--city-muted-fg)]">
            Set SUPABASE_SERVICE_ROLE_KEY on the server to read aggregate metrics safely.
          </p>
        </section>
      </main>
    );
  }

  const [
    totalMoveProfiles,
    totalAppEvents,
    eventRows,
    totalFeedbackRows,
    feedbackRows,
  ] = await Promise.all([
    getTableCount(admin, "move_profiles"),
    getTableCount(admin, "app_events"),
    admin.from("app_events").select("event_name").in("event_name", [...EVENT_NAMES]),
    getTableCount(admin, "user_feedback"),
    admin.from("user_feedback").select("usefulness"),
  ]);

  const eventCounts = Object.fromEntries(EVENT_NAMES.map((eventName) => [eventName, 0]));
  for (const row of eventRows.data ?? []) {
    if (row.event_name in eventCounts) {
      eventCounts[row.event_name as keyof typeof eventCounts] += 1;
    }
  }

  const usefulnessCounts: Record<string, number> = {};
  for (const row of feedbackRows.data ?? []) {
    const key = row.usefulness || "Unknown";
    usefulnessCounts[key] = (usefulnessCounts[key] ?? 0) + 1;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="space-y-6">
        <section className="city-card rounded-[28px] p-6">
          <p className="city-section-kicker">Internal metrics</p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-stone-900">
            MVP testing dashboard
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--city-muted-fg)]">
            Admin-only aggregate view. No public read access is exposed by RLS.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Total move_profiles" value={totalMoveProfiles} />
          <MetricCard label="Total app_events" value={totalAppEvents} />
          <MetricCard label="Total feedback rows" value={totalFeedbackRows} />
        </section>

        <section className="city-card overflow-hidden rounded-[24px]">
          <div className="border-b border-[var(--city-border)] px-5 py-4">
            <h2 className="text-base font-semibold tracking-tight text-stone-900">Event counts</h2>
          </div>
          <div className="grid gap-3 px-5 py-5 md:grid-cols-2">
            {EVENT_NAMES.map((eventName) => (
              <MetricCard key={eventName} label={eventName} value={eventCounts[eventName]} />
            ))}
          </div>
        </section>

        <section className="city-card overflow-hidden rounded-[24px]">
          <div className="border-b border-[var(--city-border)] px-5 py-4">
            <h2 className="text-base font-semibold tracking-tight text-stone-900">
              Feedback usefulness breakdown
            </h2>
          </div>
          <div className="grid gap-3 px-5 py-5 md:grid-cols-3">
            {Object.entries(usefulnessCounts).length > 0 ? (
              Object.entries(usefulnessCounts).map(([label, value]) => (
                <MetricCard key={label} label={label} value={value} />
              ))
            ) : (
              <p className="text-sm text-[var(--city-muted-fg)]">No feedback yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

async function getTableCount(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  tableName: string
) {
  const { count, error } = await admin
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) {
    console.warn(`[Soft Landing] metrics count failed for ${tableName}:`, error);
    return 0;
  }

  return count ?? 0;
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[var(--city-border)] bg-[var(--city-card)] px-4 py-4">
      <p className="city-section-kicker">{label}</p>
      <p className="mt-2 font-serif text-3xl font-medium text-stone-900">{value}</p>
    </div>
  );
}
