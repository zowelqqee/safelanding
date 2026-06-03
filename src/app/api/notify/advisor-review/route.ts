import { NextResponse } from "next/server";
import { sendAdvisorReviewNotification } from "@/lib/email/sendAdvisorReviewNotification";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { email, message, countryId, cityId, legalPathId } = body as Record<
    string,
    unknown
  >;

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    await sendAdvisorReviewNotification({
      email: email.trim(),
      message: typeof message === "string" ? message : null,
      countryId: typeof countryId === "string" ? countryId : null,
      cityId: typeof cityId === "string" ? cityId : null,
      legalPathId: typeof legalPathId === "string" ? legalPathId : null,
      submittedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Soft Landing] Advisor review notification failed:", error);
  }

  return NextResponse.json({ ok: true });
}
