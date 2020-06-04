FROM node:12.16.3-alpine3.11 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .

RUN yarn run build

FROM node:12.16.3-alpine3.11 AS preproduction-stage

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --production
COPY . .
COPY --from=build-stage /usr/src/app/dist ./dist

FROM node:12.16.3-alpine3.11 AS production-stage

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY --from=preproduction-stage /usr/src/app/dist ./dist
COPY --from=preproduction-stage /usr/src/app/node_modules ./node_modules
COPY --from=preproduction-stage /usr/src/app/package.json ./package.json

CMD ["node", "dist/apps/example-app/main"]