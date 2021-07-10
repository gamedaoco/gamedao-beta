# ===========================================================

FROM node:alpine as builder
RUN apk update && apk add --no-cache curl git gnupg python3 make g++

WORKDIR /app
COPY . .

RUN yarn && NODE_ENV=production yarn build
CMD ["ls", "-al", "build"]

# ===========================================================

FROM nginx:stable-alpine as app

WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY .env .
COPY ./docker/env.sh .

RUN apk add --no-cache bash; chmod +x env.sh

EXPOSE 80

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
