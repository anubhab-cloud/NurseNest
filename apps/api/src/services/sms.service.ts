import twilio from "twilio";
import { env } from "../config/env.js";

let client: ReturnType<typeof twilio> | null = null;

function getTwilio() {
  if (!env.twilioAccountSid || !env.twilioAuthToken) return null;
  if (!client) client = twilio(env.twilioAccountSid, env.twilioAuthToken);
  return client;
}

export async function sendCriticalSms(to: string, message: string): Promise<boolean> {
  const tw = getTwilio();
  if (!tw || !env.twilioPhoneNumber) {
    return false;
  }
  await tw.messages.create({ body: message, from: env.twilioPhoneNumber, to });
  return true;
}
