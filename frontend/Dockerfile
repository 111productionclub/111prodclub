FROM node:22-alpine AS base
RUN npm install -g pnpm@12.14.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* вшивается в сборку, поэтому передаётся при build, а не при запуске
ARG NEXT_PUBLIC_SHOP_ENABLED
ENV NEXT_PUBLIC_SHOP_ENABLED=$NEXT_PUBLIC_SHOP_ENABLED
RUN pnpm build

FROM base AS run
ENV NODE_ENV=production
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
