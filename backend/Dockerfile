FROM docker.io/node:24-slim

WORKDIR /app/backend

COPY . ./
RUN npm ci

ENV NODE_ENV=production
EXPOSE 4444

CMD ["node", "server.ts"]

