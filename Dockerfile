FROM node:20.12.2-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate
RUN pnpm install --prod

COPY . ./
# build js & remove devDependencies from node_modules
RUN npm run build


FROM node:20.12.2-alpine

ENV PORT=4242
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.env /app/.env
COPY --from=build /app/tsconfig.json /app/tsconfig.json

# Migrations compiled while npm run build was call
# TODO: add migrations executable and run seeders

COPY --from=build /app/package.json /app/package.json

EXPOSE 4242
CMD [ "npm","run","start" ]
