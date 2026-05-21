import { Resend } from "resend";
import { env } from "../config/env.js";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!env.resendApiKey) return null;
  if (!resend) resend = new Resend(env.resendApiKey);
  return resend;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const client = getResend();
  if (!client) {
    console.info(`[email stub] to=${to} subject=${subject}`);
    return;
  }
  await client.emails.send({
    from: "NurseNest <noreply@nursenest.in>",
    to,
    subject,
    html,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendEmail(
    to,
    "Reset your NurseNest password",
    `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  );
}
