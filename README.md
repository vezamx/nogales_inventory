### REPOSITORIO QUEDÓ DEPRECADO, SU VERSIÓN NUEVA SERÁ [nogales_inventory_api](https://github.com/vezamx/nogales_inventory_api)


# Casa nogales Inventory API

## Description

Microservicio de inventario para casa nogales.

Servicio que controla todos los insumos, usuarios y control de autorización de transacciones

## Correr el proyecto

Localmente el proyecto lo puedes correr de diferentes formas, docker o mediante terminal

## Pre requisitos

Antes de construir o iniciar la aplicación mediante terminal necesitamos configurar las variables de entorno, para ello copiaremos el archivo .env.local y setearemos las variables que correspondan

```bash
$ cp .env.example .env
```

En caso de que no conozcas el valor para alguna env solicitalo en [discord](https://discord.gg/TdBCEjw3zH).

## Docker

```bash
$ docker-compose up -d

# Solo mongo, minimo necesario para correr la aplicación.

$ docker-compose up -d mongo
```

## Instalación

```bash
$ pnpm install
```

## Iniciar la aplicación

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Testing

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
