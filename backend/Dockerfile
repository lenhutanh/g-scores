FROM node:20-alpine AS base
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN pnpm install --prod=false

COPY . .

RUN pnpm db:generate
RUN pnpm build

FROM node:20-alpine AS runner
RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/src/generated ./src/generated
COPY --from=base /app/data ./data

EXPOSE 3000

CMD ["pnpm", "start:prod"]
