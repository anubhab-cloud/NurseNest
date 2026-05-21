function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "3001")),
  host: optional("HOST", "0.0.0.0"),
  databaseUrl: optional("DATABASE_URL"),
  redisUrl: optional("REDIS_URL", "redis://localhost:6379"),
  webOrigin: optional("WEB_ORIGIN", "http://localhost:3000"),
  jwtAccessSecret: optional("JWT_ACCESS_SECRET", "dev-access-secret-change-in-production-32"),
  jwtRefreshSecret: optional("JWT_REFRESH_SECRET", "dev-refresh-secret-change-in-production-32"),
  cookieDomain: optional("COOKIE_DOMAIN", "localhost"),
  razorpayKeyId: optional("RAZORPAY_KEY_ID"),
  razorpayKeySecret: optional("RAZORPAY_KEY_SECRET"),
  twilioAccountSid: optional("TWILIO_ACCOUNT_SID"),
  twilioAuthToken: optional("TWILIO_AUTH_TOKEN"),
  twilioPhoneNumber: optional("TWILIO_PHONE_NUMBER"),
  resendApiKey: optional("RESEND_API_KEY"),
  r2AccessKey: optional("CLOUDFLARE_R2_ACCESS_KEY"),
  r2SecretKey: optional("CLOUDFLARE_R2_SECRET_KEY"),
  r2Bucket: optional("CLOUDFLARE_R2_BUCKET"),
  r2Endpoint: optional("CLOUDFLARE_R2_ENDPOINT"),
  r2PublicUrl: optional("CLOUDFLARE_R2_PUBLIC_URL"),
  sentryDsn: optional("SENTRY_DSN"),
  isProduction: optional("NODE_ENV") === "production",
};

export function assertProductionSecrets(): void {
  if (env.isProduction) {
    required("JWT_ACCESS_SECRET");
    required("JWT_REFRESH_SECRET");
    required("DATABASE_URL");
  }
}
