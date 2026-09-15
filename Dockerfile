FROM node:20-slim AS base

# Install dependencies
FROM base AS dependencies

WORKDIR /usr/app

COPY package.json .

RUN npm install --omit=dev
RUN cp -R node_modules /usr/app/prod_node_modules

FROM dependencies AS builder

COPY . .

# Run tsc build
RUN npm install typescript@7.0.2 -g
RUN npm run build

# Only keep what's necessary to run
FROM base AS runner

WORKDIR /usr/app

COPY --from=builder /usr/app/.env ./dist/.env
COPY --from=builder /usr/app/dist ./dist
COPY --from=dependencies /usr/app/prod_node_modules node_modules

COPY . .

CMD ["npm", "start"]