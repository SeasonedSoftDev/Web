<p align="center">
  <a href="https://patientsinfluence.com/" target="blank"><img src="docs/logo.png" width="200" alt="Patients Influence Logo" style="border-radius: 100px" /></a>
</p>

<div align="center" style="margin: 50px 0">
<h1 align="center" style="color: #428cc9; font-family: Poppins, Sans-serif; font-size: 30px; line-height: 38px">Patients Influence</h1>

</div>

## Getting Started

This is a backend API built with Nest.js for [Patients Influence](https://patientsinfluence.com/) platform. It includes environments for development, production, and testing, each of which uses Docker scripts.

### Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) to run the application in a containerized environment
- [Node.js](https://nodejs.org/en) installed on your machine (version 18 or later)

If you are new to Node.js, you may want to start with the [official Node.js documentation](https://nodejs.org/en/docs). If you are not familiar with Docker, you can refer to the [Docker documentation](https://docs.docker.com/) for more information.

Additional tools:

- [Git](https://git-scm.com/) installed on your machine
- [NestJS](https://nestjs.com/) installed globally (version 9 or later; you can install it by running `npm install -g @nestjs/cli`)
- [PostgreSQL](https://www.postgresql.org/) to store the application data

### Installation

To get started with this project, follow these steps:

1. Install dependencies: `npm install`.
2. Set up the environment variables as described in the [Environments](#environments) section.
3. Start the server: `npm run start`.


### Development

In env file, change password and database
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres?schema=public

To run the project in development mode, run:

```
npm run start:dev
```

The development environment uses the `.env.dev` file to configure environment variables and runs the project in watch mode.


### Production

To run the project in production mode, run:

```
npm run start:prod
```

or:

```
npm start
```

The production environment uses the `.env.prod` file to configure environment variables.

**Note:** When running `npm start` command the application expects the `.env` file to configure environment variables, or it pulls them from the context where the application is running, eg. terminal session.

### Test

See more in the []() section.
To run the project in test mode, run:

```
npm run start:dev
```

The test environment uses the `.env.test` file to configure environment variables.

## Running tests

To run the tests, run:

```
npm run test
```

This command runs the Jest test suite and uses `.env.test` file to configure environment variables.

You can also run the tests in watch mode with the following command:

```
npm run test:watch
```

To generate test coverage reports, use the following command:

```
npm run test:cov
```

## Docker Scripts

The project includes Docker scripts for each environment. To use Docker, you must have Docker installed on your machine.

### Development

To start the development environment with Docker, use the following command:

```
npm run docker:dev:up
```

To stop the development environment, use the following command:

```
npm run docker:dev:down
```

### Production

To start the production environment with Docker, use the following command:

```
npm run docker:prod:up
```

To stop the production environment, use the following command:

```
npm run docker:prod:down
```

### Test

To start the testing environment with Docker, use the following command:

```
npm run docker:test:up
```

To stop the testing environment, use the following command:

```
npm run docker:test:down
```

To remove the testing database container, use the following command:

```
npm run docker:test:db:remove
```

To restart the testing database container and apply any pending migrations, use the following command:

```
npm run docker:test:db:restart
```

## Prisma

[Prisma Migration docs](https://www.prisma.io/docs/guides/migrate#in-this-section)

### Dos and Don'ts

| In Environment |                                  Do |           Do Not            |
| :------------- | ----------------------------------: | :-------------------------: |
| Local          |            push, generate, dev-seed |             \*              |
| Development    |     migrate dev, generate, dev-seed |             \*              |
| Stage          | migrate deploy, prod-seed, generate | push, migrate dev, dev-seed |
| Production     |            migrate deploy, generate | push, migrate dev, dev-seed |

The project uses Prisma as an ORM. To generate Prisma Client, migration SQL, apply Migrations or prototype the changes in schema.prisma, use the following commands:

---

### Local

In a local environment use:

```
npm run prisma:dev:push
```

to quickly prototype and iterate on schema design
without the need to deploy these changes to other environments.<br/>
This will:

- Apply the changes in your schema.prisma without generating migrations SQL.
- Generate Prisma Client
- Require the _--accept-data-loss_ if changes could result in data loss

```
npm run prisma:dev:generate
```

to generate the Prisma Client that reflects the schema.prisma definition that you can then use in the source code.

---

### Development

```
npm run prisma:dev:generate
```

Run:

```
npm run prisma:dev:migrate
```

to:

- Generate migration SQL
- Apply it using a shadow database
- Generate Prisma Client
  <br/>**This will generate the necessary Migration SQL that will be applied in production environment**

```
npm run prisma:dev:migrate:create
```

to:

- Generate migration SQL
  [Customizing migration files](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate/customizing-migrations)

---

### Production

- Consider: Modifying the Migration SQL in development to prevent data loss (e.g. you can customize a migration to mitigate data loss that would be caused by a breaking change)

```
npm run prisma:prod:migrate
```

this will:

- Apply the migrations generated in development

---

### Test

```
npm run prisma:generate:test
```

To open the Prisma Studio UI, use the following commands:

```
npm run prisma:dev:studio
```

**Note:** Prisma Studio UI is available only in a local development environment. Use it for preview of DB models and simple queries such as create and delete a record.

## API Documentation

The documentation is generated using [Swagger](https://swagger.io/). You can access the Swagger UI by visiting `http://localhost:3000/api-docs`, or on the deployed application domain at `/api-docs` route.

If the application is still running locally but on a different port, go to `http://localhost:<port>/api-docs`, where a variable `<port>` is the port number.
