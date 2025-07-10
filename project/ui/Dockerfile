# За основу взята структура Dockerfile с Habr: https://habr.com/ru/articles/661263/
FROM node:24-alpine AS dependencies
WORKDIR /project/ui
COPY *.json ./
RUN npm install --frozen-lockfile

FROM node:24-alpine AS builder
WORKDIR /project/ui
COPY . .
COPY --from=dependencies /project/ui/node_modules ./node_modules
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /project/ui
ENV NODE_ENV production

COPY --from=builder /project/ui/public ./public
COPY --from=builder /project/ui/package.json ./package.json
COPY --from=builder /project/ui/.next ./.next
COPY --from=builder /project/ui/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]