# Use official Node.js LTS image
FROM node:18-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------- Install deps (FULL: cả dev) để build ----------
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
# CÀI ĐẦY ĐỦ deps (KHÔNG dùng --only=production ở giai đoạn build)
RUN npm ci

# ---------- Build ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Đảm bảo biến môi trường build
ENV NODE_ENV=production
RUN npm run build

# ---------- Runtime (standalone) ----------
FROM node:18-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Tạo user không root (tuỳ chọn)
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy public + standalone output
COPY --from=builder /app/public ./public
# Nếu bạn dùng output: 'standalone' trong next.config, Next tạo server.js & .next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
