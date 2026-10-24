# NurseNest

Home-nursing scheduling and care records, built with **Next.js 15, Fastify, TypeScript and PostgreSQL**. This is the active `apps/web` + `apps/api` implementation. The older `homecare/` Express/Mongo application is retained as historical source only; do not run or deploy it alongside the active app.

## Working features

- Public service catalog and credential-reviewed nurse directory.
- Patient registration, profile, future appointment booking, cancellation until two hours before the visit, visit notes, vitals, invoices and booking-specific messages.
- Nurse onboarding with administrator credential review, availability, assigned schedules, notes, vital recording and invoice/earnings history.
- Administrator user access controls, nurse review, appointment assignment/status controls, aggregate analytics and a contact-message inbox.
- Completed-visit reviews with real aggregated ratings.
- Razorpay order creation, server-side capture verification and signed payment webhooks when configured. **No simulated checkout or paid invoices.**
- PostgreSQL-backed refresh/recovery tokens and chat. Single-use password reset tokens; Resend delivery when configured.
- Socket room authorization, role/ownership checks, input validation, rate limiting, redacted request logs and explicit errors when optional providers are unavailable.
- Responsive light/dark interface with empty, loading and failure states.

## Local setup

Use Node.js 22 or newer and pnpm 10.26.1. Configure the keys documented in `.env.example` through your hosting environment or local secret manager. This app does not automatically load a root `.env` file; inject environment variables into both processes.

```sh
pnpm install
pnpm db:generate
pnpm --filter @nursenest/db migrate:deploy
pnpm db:seed
```

The seed inserts the service catalog only. It never creates accounts, known passwords, clinical records or fake reviews. Prices are stored in **paise**; review the catalog and pricing before live use.

Run the API and web app in separate terminals:

```sh
# API, default port 8080
pnpm --filter @nursenest/api dev
# Web: select a different port; WEB_ORIGIN must match this origin in development
PORT=3000 pnpm --filter @nursenest/web dev
```

If you are running within the imported Replit workspace, the configured artifact workflows already run these services and assign their ports. Root-level commands there should use the workspace package filters.

Register your account through the site, then have the deployment operator grant the initial admin role:

```sh
pnpm --filter @nursenest/db promote-admin -- your-registered-email
```

This command requires database operator access and does not create an account or password. Sign out and back in after a role change. Nurses register normally but cannot become available or accept new visits until an administrator reviews their credentials.

## Production build and run

```sh
pnpm --filter @nursenest/db generate
pnpm --filter @nursenest/api typecheck
pnpm --filter @nursenest/api build
pnpm --filter @nursenest/web build
```

Run the compiled API with `pnpm --filter @nursenest/api start` and Next with `pnpm --filter @nursenest/web start`. Bind each service to a distinct `PORT`, set `NODE_ENV=production`, and set `WEB_ORIGIN` to the exact HTTPS website origin. `SESSION_SECRET` and `DATABASE_URL` are mandatory. Keep `INTERNAL_API_URL` on a private network; do not expose the backend directly without a trusted proxy.

Route `/api/v1/*` through Next.js to the internal API; this forwards the signed-in user's server-issued bearer token. `/api/auth/*` belongs to NextAuth. Route `/socket.io/*` directly to Fastify with WebSocket support. The readiness endpoint is `/api/healthz` and checks the database. The Replit artifact configuration already defines these routes.

Run `prisma migrate deploy` as a separate release step against a backed-up **production** database, not inside the app startup command. Never use `prisma db push --accept-data-loss` or development migrations on production.

### Existing databases

The original repository had an SQLite Prisma datasource but PostgreSQL migration SQL. This version uses PostgreSQL consistently. The supplied migrations support a fresh PostgreSQL database or the original PostgreSQL migration history. The hardening migration preserves existing PostgreSQL array values while converting them to the existing CSV application interface.

**Do not point these migrations at an existing SQLite file or a database initialized with `db push`.** Back up existing data, export/import SQLite records and baseline an already-provisioned PostgreSQL schema with an operator-reviewed migration plan. No existing SQLite patient database has been copied or converted automatically.

### Provider setup and launch checklist

1. Supply your HTTPS origin, strong session secret and production PostgreSQL connection. Confirm database backups, retention and operator access.
2. Review the seeded prices and service availability, real business contact details, service area, nurse credentials and care procedures. No nurses, ratings or testimonials are invented.
3. Configure Resend and a verified `EMAIL_FROM` for password recovery. Without these, recovery returns a clear 503.
4. For online payments, configure the Razorpay key pair plus webhook secret, and subscribe to `payment.captured` at `https://YOUR-ORIGIN/api/v1/webhooks/razorpay`. The signed webhook reconciles a capture even if checkout closes before returning. Configure auto-capture in Razorpay. Validate test-mode payments before using live keys. Cancellation is not an automatic refund; refunds and disputes require an operator procedure.
5. Clinical uploads are explicitly disabled in production. **Do not enable a public document bucket for patient records.** Private download authorization, retention and bucket policy must be completed before enabling clinical attachments; the current UI uses text notes/messages, not document attachments. The R2 presigning endpoint is development-only.
6. Twilio is optional supplementary SMS only. Saved vitals and in-app alerts do not depend on SMS availability. NurseNest is not an emergency dispatch service or a diagnostic tool.
7. Use a single API instance initially. Multi-instance operation requires Redis, WebSocket sticky routing and shared rate-limit configuration before scaling. Session tokens and messages remain in PostgreSQL.
8. Replace the clearly marked operator fields in Privacy and Terms and get healthcare/privacy/legal review appropriate to the operating jurisdiction. No compliance certification is claimed.
9. Confirm HTTPS, login/recovery, all three roles, cancellation policy, contact response ownership, payment reconciliation and mobile behavior in staging before admitting patients.

## Verification

```sh
pnpm --filter @nursenest/api typecheck
pnpm --filter @nursenest/web typecheck
pnpm --filter @nursenest/api test:smoke
```

The API smoke checks require an isolated **development or CI database** with the catalog seeded. They create uniquely named temporary accounts and bookings, exercise ownership/state validation and remove only their own records. They refuse `NODE_ENV=production`. Never run them against live patient data.

The `homecare/` archive and generated build outputs are not part of the active release. Keep secrets and patient data out of Git.
