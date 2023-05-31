FROM node:12.21 as backend-env

#RUN apt-get update &&\
#    apt-get install python3.10

WORKDIR /build

COPY ./packages/backend/package*.json ./

RUN npm ci

COPY ./packages/backend ./
RUN mv .env.production .env

RUN npm run build

FROM node:12.21 as admin-env

WORKDIR /build

COPY ./packages/admin/package*.json ./

RUN npm ci

COPY ./packages/admin ./
RUN mv .env.production .env

RUN npm run build

FROM node:18.15 as frontend-env

WORKDIR /build

COPY ./packages/frontend/package*.json ./

RUN npm ci

COPY ./packages/frontend ./
RUN mv .env.production .env

RUN npm run build
FROM node:12.21 as backend-node_modules-env

WORKDIR /build

COPY ./packages/backend/package*.json ./

RUN npm ci --only=production

FROM node:12.21-alpine

COPY --from=backend-env /build/dist /app
WORKDIR /app
COPY --from=backend-node_modules-env /build/node_modules /app/node_modules
COPY --from=admin-env /build/build /app/admin
COPY --from=frontend-env /build/build /app/client

ENV PORT 8282

EXPOSE 8282

CMD ["node", "/app/main.js"]
