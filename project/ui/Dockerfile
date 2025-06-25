# За основу взят Dockerfile с данного репозитория:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
# FROM node:24-alpine AS base
#
# FROM base AS deps
# RUN apk add --no-cache libc6-compat
# WORKDIR /ui
# COPY package*.json ./
# RUN npm ci
#
# FROM base AS builder
# WORKDIR /ui
# COPY --from=deps /ui/node_modules ./node_modules
# COPY . .
# RUN npm run build
#
# FROM base AS runner
# WORKDIR /ui
# ENV NODE_ENV=production
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# COPY --from=builder /ui/public ./public
# # COPY --from=builder --chown=nextjs:nodejs /ui/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /ui/.next/static ./.next/static
#
# USER nextjs
# EXPOSE 3000
# ENV PORT=3000
# ENV HOSTNAME="0.0.0.0"
# CMD ["npm", "run", "dev"]