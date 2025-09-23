# ---------- Base ----------
FROM node:18-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---------- Deps (cài FULL deps để build: có devDeps như tailwind/postcss) ----------
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Builder (build Next) ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# ---------- Runner (runtime, dùng next start, KHÔNG cần standalone) ----------
FROM node:18-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# user không root (tuỳ chọn)
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# chỉ cài prod deps để chạy
COPY package*.json ./
RUN npm ci --omit=dev

# copy public + toàn bộ build .next từ stage builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# package.json cần có: "start": "next start"
CMD ["npm","run","start"]
