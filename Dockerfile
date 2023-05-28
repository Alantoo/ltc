FROM node:12.21 as backend-env

#RUN apt-get update &&\
#    apt-get install python3.10

WORKDIR /build

COPY ./packages/backend/package*.json ./

RUN npm ci

COPY ./packages/backend ./
RUN mv .env.production .env

RUN npm run build

FROM node:18.15 as admin-env

WORKDIR /build

COPY ./packages/admin/package*.json ./

RUN npm ci

COPY ./packages/admin ./
RUN mv .env.production .env

RUN npm run build

#FROM node:18.15 as frontend-env
#
#WORKDIR /build
#
#COPY ./packages/frontend/package*.json ./
#
#RUN npm ci
#
#COPY ./packages/frontend ./
#RUN mv .env.production .env
#
#RUN npm run build

FROM node:12.21-alpine

WORKDIR /app
COPY --from=backend-env /build/dist/main.js /app/main.js
#COPY --from=admin-env /build/dist /app/admin
#COPY --from=frontend-env /build/dist /app/client

ENV PORT 8282

EXPOSE 8282

CMD ["node", "/app/main.js"]
