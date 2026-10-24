import { Resend } from "resend";
import { env } from "../config/env.js";
import { AppError } from "@nursenest/utils";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!env.resendApiKey) return null;
  if (!resend) resend = new Resend(env.resendApiKey);
  return resend;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const client = getResend();
  if (!client) {
    throw new AppError("Password reset email is not configured. Please contact your care administrator.", 503);
  }
  if (!env.emailFrom) throw new AppError("Email sender is not configured.", 503);
  const result = await client.emails.send({
    from: env.emailFrom,
    to,
    subject,
    html,
  });
  if (result.error) throw new AppError("Email delivery failed. Please try again later.", 502);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendEmail(
    to,
    "Reset your NurseNest password",
    `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  );
}
