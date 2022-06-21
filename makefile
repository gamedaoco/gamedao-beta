build:
	yarn build

dev:
	yarn dev

docker-build:
	docker build -t gamedao/app:local -f .docker/app.Dockerfile .

docker-run:
	docker-compose -f .docker/docker-compose.yml up
