FROM node:12.21-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY ./ ./

ENV PORT 8282

EXPOSE 8282

CMD ["node", "./dist/main.js"]
