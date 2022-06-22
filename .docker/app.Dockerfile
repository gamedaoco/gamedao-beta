# ===========================================================

FROM node:lts as builder

# RUN apk update && apk add --no-cache curl git gnupg python3 make g++

WORKDIR /app
COPY . .
RUN time yarn install --prefer-offline --frozen-lockfile

# ENV YARN_CACHE_FOLDER=/tmp/yarn_cache
# RUN --mount=type=cache,target=/tmp/yarn_cache yarn install --prefer-offline --frozen-lockfile

RUN time yarn build

# ===========================================================

FROM nginx:stable-alpine as app

COPY --from=builder /app/.docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/.docker/env.sh .
# COPY --from=builder /app/.docker/.env .

# static build
COPY --from=builder /app/build /usr/share/nginx/html

RUN apk add --no-cache bash;
RUN chmod +x /env.sh

WORKDIR /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
