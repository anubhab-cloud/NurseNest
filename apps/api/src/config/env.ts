import { createHmac } from "node:crypto";

const value = (key: string, fallback = "") => process.env[key] || fallback;
const production = value("NODE_ENV") === "production";
function secret(name: string, purpose: string): string {
  if (process.env[name]) return process.env[name]!;
  const session = process.env["SESSION_SECRET"];
  if (session) return createHmac("sha256", session).update(`nursenest:${purpose}`).digest("hex");
  if (production) throw new Error(`${name} or SESSION_SECRET is required.`);
  return `local-development-only-nursenest-${purpose}-not-for-production`;
}
export const env = {
  nodeEnv: value("NODE_ENV", "development"),
  port: Number(value("PORT", "8080")),
  host: value("HOST", "0.0.0.0"),
  databaseUrl: value("DATABASE_URL"),
  redisUrl: value("REDIS_URL"),
  webOrigin: value("WEB_ORIGIN", production ? "" : "http://localhost:25568"),
  jwtAccessSecret: secret("JWT_ACCESS_SECRET", "access"),
  jwtRefreshSecret: secret("JWT_REFRESH_SECRET", "refresh"),
  cookieDomain: value("COOKIE_DOMAIN"),
  razorpayKeyId: value("RAZORPAY_KEY_ID"),
  razorpayKeySecret: value("RAZORPAY_KEY_SECRET"),
  razorpayWebhookSecret: value("RAZORPAY_WEBHOOK_SECRET"),
  twilioAccountSid: value("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: value("TWILIO_AUTH_TOKEN"),
  twilioPhoneNumber: value("TWILIO_PHONE_NUMBER"),
  resendApiKey: value("RESEND_API_KEY"),
  emailFrom: value("EMAIL_FROM"),
  r2AccessKey: value("CLOUDFLARE_R2_ACCESS_KEY"),
  r2SecretKey: value("CLOUDFLARE_R2_SECRET_KEY"),
  r2Bucket: value("CLOUDFLARE_R2_BUCKET"),
  r2Endpoint: value("CLOUDFLARE_R2_ENDPOINT"),
  r2PublicUrl: value("CLOUDFLARE_R2_PUBLIC_URL"),
  sentryDsn: value("SENTRY_DSN"),
  isProduction: production,
};
export function assertProductionSecrets(): void {
  if (!Number.isInteger(env.port) || env.port <= 0) throw new Error("Invalid PORT.");
  if (production) {
    if (!env.databaseUrl) throw new Error("DATABASE_URL is required.");
    if (!env.webOrigin || new URL(env.webOrigin).protocol !== "https:") throw new Error("WEB_ORIGIN must be your HTTPS production origin.");
    if (env.jwtAccessSecret.length < 32 || env.jwtRefreshSecret.length < 32) throw new Error("JWT secrets must be at least 32 characters.");
    if (env.jwtAccessSecret === env.jwtRefreshSecret) throw new Error("Access and refresh secrets must differ.");
    if ((env.razorpayKeyId || env.razorpayKeySecret) && !(env.razorpayKeyId && env.razorpayKeySecret && env.razorpayWebhookSecret)) throw new Error("Configure the full Razorpay key pair and webhook secret before enabling payments.");
  }
}
