---
name: nursenest
description: Guide for developing the NurseNest homecare monorepo. Use when working on nursenest/, apps/api, apps/web, packages/db, auth, bookings, vitals, or Socket.io features.
---

# NurseNest Development Skill

Read [reference.md](reference.md) for routes, env vars, and architecture decisions.

## Monorepo layout

- `apps/api` — Fastify `/api/v1`, owns JWT cookies, Socket.io
- `apps/web` — Next.js 14, proxies `/api/v1` to API, NextAuth v5 Credentials
- `packages/db` — Prisma only; all DB access via repositories in API
- `packages/types` — `ApiResponse<T>`, DTOs, `EventMap` for sockets
- `packages/utils` — `AppError`, Zod helpers, Razorpay, R2 presign

## Non-negotiables

1. API response shape: `{ success: true, data }` | `{ success: false, error }`
2. No `any`; TypeScript strict
3. Repository layer for DB — never Prisma in route handlers
4. Refresh tokens: Redis key `refresh:{userId}:{tokenId}`, 30d TTL
5. Nurse patient access: bookings with status CONFIRMED | IN_PROGRESS | COMPLETED only
6. Chat UI is stub only — do not implement real messaging in v1
7. Files via R2 presigned URLs only — never stream uploads through API body

## Common tasks

### Add API endpoint

1. Zod schema in `apps/api/src/schemas/`
2. Repository method in `apps/api/src/repositories/`
3. Route in `apps/api/src/routes/` registered in `app.ts` under `/api/v1`
4. DTO + types in `packages/types` if shared with web
5. Web: `apiFetch` in client component or `apiFetchServer` for RSC

### Auth flow

- Login: browser `POST /api/v1/auth/login` (cookies) then `signIn('credentials')`
- Protected API: `authenticate` + `requireRoles` preHandlers
- Dashboard: `middleware.ts` role checks

### Real-time

- Emit via `notification.service.ts` helpers
- Redis channels: `vitals:{patientId}`, `location:{nurseId}`, `booking:{bookingId}`
- Client joins rooms: `patient:{id}`, `booking:{id}`, `user:{id}`

## Dev commands

```bash
pnpm install
docker compose up postgres redis -d
pnpm db:generate && pnpm db:migrate && pnpm db:seed
pnpm dev
```

## Before PR

- `pnpm build` passes
- No TODO placeholders
- Match existing patterns in neighboring files
