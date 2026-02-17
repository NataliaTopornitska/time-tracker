# Database layer (PostgreSQL + ORM)

This folder is prepared for PostgreSQL with an ORM (e.g. Prisma or Drizzle).

- Add your ORM schema here (e.g. `schema.prisma` or `schema.ts`).
- Implement `PostgresProjectRepository`, `PostgresTaskNameRepository`, `PostgresTimeEntryRepository` in `../repositories/` that use the ORM and the existing persistence models in `../persistence/models/` for mapping.
- Wire the Postgres repositories in API route handlers or a DI container instead of the in-memory implementations when deploying with a database.
