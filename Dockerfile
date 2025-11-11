# Stage 1: Dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Install dependencies needed for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Install Playwright browsers
RUN npx playwright install --with-deps chromium

# Stage 2: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies needed for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED 1

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install runtime dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libxshmfence1 \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libc6 \
    libexpat1 \
    libgcc1 \
    libglib2.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcb-dri3-0 \
    libxext6 \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user with proper home directory
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --home /home/nextjs nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json

# Copy node_modules required for scripts and Playwright
COPY --from=deps /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=deps /app/node_modules/mysql2 ./node_modules/mysql2
COPY --from=deps /app/node_modules/playwright ./node_modules/playwright
COPY --from=deps /app/node_modules/playwright-core ./node_modules/playwright-core

# Copy Playwright browsers to nextjs user's home
RUN mkdir -p /home/nextjs/.cache
COPY --from=deps /root/.cache/ms-playwright /home/nextjs/.cache/ms-playwright

# Set correct permissions
RUN chown -R nextjs:nodejs /app
RUN chown -R nextjs:nodejs /home/nextjs

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]