import { Resend } from "resend";
import { getCountryById } from "@/lib/data/countries";
import { getCityById } from "@/lib/data/cities";
import { getLegalPathById } from "@/lib/data/legal-paths";

type NotificationInput = {
  email: string;
  message: string | null;
  countryId: string | null;
  cityId: string | null;
  legalPathId: string | null;
  submittedAt: string;
};

export async function sendAdvisorReviewNotification(
  input: NotificationInput
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.FOUNDER_NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail) {
    console.warn(
      "[Soft Landing] Advisor review notification skipped: RESEND_API_KEY or FOUNDER_NOTIFICATION_EMAIL not set"
    );
    return;
  }

  const country = input.countryId ? getCountryById(input.countryId) : null;
  const city = input.cityId ? getCityById(input.cityId) : null;
  const legalPath = input.legalPathId ? getLegalPathById(input.legalPathId) : null;

  const lines = [
    `Email: ${input.email}`,
    `Country: ${country?.name ?? input.countryId ?? "—"}`,
    `City: ${city?.name ?? input.cityId ?? "—"}`,
    `Legal Path: ${legalPath?.name ?? input.legalPathId ?? "—"}`,
    `Notes: ${input.message?.trim() || "—"}`,
    ``,
    `Submitted At: ${input.submittedAt}`,
  ];

  const text = lines.join("\n");

  const html = `<pre style="font-family:monospace;font-size:14px;line-height:1.6">${lines
    .map((l) => escapeHtml(l))
    .join("<br>")}</pre>`;

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: toEmail,
    subject: "New Advisor Review Request",
    text,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
