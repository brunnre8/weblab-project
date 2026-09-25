FROM docker.io/node:24-slim AS frontend-builder

WORKDIR /app/frontend
COPY . ./
RUN npm ci
RUN npm run build -- --configuration production

FROM docker.io/caddy:2.11-alpine
COPY Caddyfile.container /etc/caddy/Caddyfile
COPY --from=frontend-builder /app/frontend/dist/weblab-project/browser /srv/
