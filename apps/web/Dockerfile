FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* turbo.json tsconfig.base.json ./
COPY packages/types ./packages/types
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile || pnpm install

FROM deps AS build
COPY apps/web ./apps/web
COPY packages/types ./packages/types
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @nursenest/web build

FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app/apps/web
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./.next/static
COPY --from=build /app/apps/web/public ./public
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
