# NurseNest

Full-stack home nursing care platform — Turborepo monorepo with Next.js 14, Fastify, Prisma, PostgreSQL, Redis, and Socket.io.

## Stack

- **Web:** Next.js 14 App Router, Tailwind, shadcn-style UI, React Query, Zustand, NextAuth v5
- **API:** Fastify, JWT (httpOnly cookies), Socket.io + Redis adapter
- **DB:** PostgreSQL + Prisma
- **Cache / refresh tokens / pub-sub:** Redis
- **Payments:** Razorpay · **Email:** Resend · **SMS:** Twilio · **Files:** Cloudflare R2

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (optional, recommended)

## Quick start (local)

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres + Redis
docker compose up postgres redis -d

# 3. Configure API env
cp apps/api/.env.example apps/api/.env

# 4. Migrate & seed
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 5. Configure web env
cp apps/web/.env.example apps/web/.env.local

# 6. Run dev (API :3001, Web :3000)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed accounts

| Role    | Email                 | Password      |
|---------|-----------------------|---------------|
| Admin   | admin@nursenest.in    | Password123!  |
| Patient | patient@nursenest.in  | Password123!  |
| Nurse   | nurse@nursenest.in    | Password123!  |

## Docker Compose (full stack)

```bash
docker compose up --build
```

Services: `postgres:5432`, `redis:6379`, `api:3001`, `web:3000`.

Run migrations inside the API container after first boot:

```bash
docker compose exec api sh -c "cd /app && pnpm db:migrate && pnpm db:seed"
```

## Project structure

```
nursenest/
├── apps/
│   ├── api/          Fastify + Socket.io
│   └── web/          Next.js frontend
├── packages/
│   ├── db/           Prisma schema & client
│   ├── types/        Shared TypeScript types
│   └── utils/        Errors, Zod, Razorpay, R2
├── docker-compose.yml
└── turbo.json
```

## API

Base URL: `http://localhost:3001/api/v1`

Auth cookies: `nursenest_access` (15m), `nursenest_refresh` (30d, stored in Redis as `refresh:{userId}:{tokenId}`).

Web proxies `/api/v1/*` to the API via Next.js rewrites for same-origin cookies.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `pnpm dev`     | Start all apps (Turbo)   |
| `pnpm build`   | Build all packages       |
| `pnpm db:seed` | Seed sample data         |
| `pnpm db:studio` | Prisma Studio          |

## Environment

See `apps/api/.env.example` and `apps/web/.env.example` for required variables.

## License

Private — NurseNest © 2025
