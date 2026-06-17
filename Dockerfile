# Context is the monorepo root
FROM oven/bun:1 AS builder

WORKDIR /app

# 1. Copy root metadata configuration
COPY package.json bun.lock turbo.json ./

# 2. Copy the package.json for ALL workspace directories to satisfy the lockfile map
COPY packages/database/package.json ./packages/database/
COPY services/identity-service/package.json ./services/identity-service/
COPY services/fintech-service/package.json ./services/fintech-service/
COPY services/parking-service/package.json ./services/parking-service/
COPY apps/web-admin/package.json ./apps/web-admin/
COPY apps/web-user/package.json ./apps/web-user/

# 3. Install dependencies globally across the workspace tree
RUN bun install --frozen-lockfile

# 4. Copy the actual source folders needed for this specific build context
COPY packages/database ./packages/database
COPY services/parking-service ./services/parking-service

# 5. Generate Prisma client and build service payload
RUN cd packages/database && bun run generate
RUN cd services/parking-service && bun run build

# Final lightweight stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy the monorepo node_modules (which includes installed prisma binaries)
COPY --from=builder /app/node_modules ./node_modules

# Copy the shared database package (contains the generated Prisma client)
COPY --from=builder /app/packages/database ./packages/database

# Copy the built service artifacts
COPY --from=builder /app/services/parking-service/package.json ./services/parking-service/package.json
COPY --from=builder /app/services/parking-service/dist ./services/parking-service/dist

WORKDIR /app/services/parking-service

# Expose standard port for fastify applications
EXPOSE 3000

# Start the built application
CMD ["bun", "run", "./dist/index.js"]
