# Aucobot API — monorepo image for Railway (Docker)
# Build: docker build -t aucobot-api .
# Run:   docker run --env-file .env -p 8387:8387 aucobot-api

FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate \
  && apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- deps: install workspace (lockfile needs all package manifests) ---
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/llm-services/package.json ./packages/llm-services/
COPY packages/mcp-core/package.json ./packages/mcp-core/
COPY packages/social-providers/package.json ./packages/social-providers/

RUN pnpm install --frozen-lockfile

# --- build: compile @aucobot/api and workspace deps ---
FROM deps AS build

COPY tsconfig.json turbo.json ./
COPY apps/api ./apps/api
COPY packages/database ./packages/database
COPY packages/shared ./packages/shared
COPY packages/llm-services ./packages/llm-services
COPY packages/social-providers ./packages/social-providers
COPY packages/mcp-core ./packages/mcp-core

ENV DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public"

RUN pnpm db:generate \
  && pnpm turbo run build --filter=@aucobot/api

# --- runner: production image ---
FROM base AS runner

ARG IMAGE_VERSION=dev
LABEL org.opencontainers.image.version=$IMAGE_VERSION

ENV NODE_ENV=production
ENV NODE_PATH="/app/node_modules/.pnpm/node_modules"
ENV PATH="/app/node_modules/.pnpm/node_modules/.bin:${PATH}"

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/llm-services/package.json ./packages/llm-services/
COPY packages/mcp-core/package.json ./packages/mcp-core/
COPY packages/social-providers/package.json ./packages/social-providers/

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/packages/database/dist ./packages/database/dist
COPY --from=build /app/packages/database/prisma ./packages/database/prisma
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/llm-services/dist ./packages/llm-services/dist
COPY --from=build /app/packages/mcp-core/dist ./packages/mcp-core/dist
COPY --from=build /app/packages/social-providers/dist ./packages/social-providers/dist

COPY docker/api-entrypoint.sh /app/docker/api-entrypoint.sh
RUN sed -i 's/\r$//' /app/docker/api-entrypoint.sh && chmod +x /app/docker/api-entrypoint.sh

EXPOSE 8387

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.API_PORT||process.env.PORT||8387)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Railway sets PORT; app.config maps PORT → API_PORT when API_PORT is unset
CMD ["/app/docker/api-entrypoint.sh"]
