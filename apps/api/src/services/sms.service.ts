import twilio from "twilio";
import { env } from "../config/env.js";

let client: ReturnType<typeof twilio> | null = null;

function getTwilio() {
  if (!env.twilioAccountSid || !env.twilioAuthToken) return null;
  if (!client) client = twilio(env.twilioAccountSid, env.twilioAuthToken);
  return client;
}

export async function sendCriticalSms(to: string, message: string): Promise<void> {
  const tw = getTwilio();
  if (!tw || !env.twilioPhoneNumber) {
    console.info(`[sms stub] to=${to} message=${message}`);
    return;
  }
  await tw.messages.create({ body: message, from: env.twilioPhoneNumber, to });
}
