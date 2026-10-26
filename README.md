# Brev.ly API — URL Shortener Backend

A REST API for a URL shortener. You can create short links, list and delete them, and redirect short URLs to their original destination while counting visits. The full list of links can also be exported to a CSV report, which is streamed to Cloudflare R2. Built with Fastify, Drizzle ORM and PostgreSQL, with Zod validation and OpenAPI docs.

## Features

- **Create link** (`POST /links`): validates the original URL, enforces 2–30 characters for the short URL and rejects duplicates.
- **List links** (`GET /links`).
- **Delete link** (`DELETE /links/:id`).
- **Redirect** (`GET /:shortUrl`): increments the link's redirect counter, then sends an HTTP redirect. With `?ref=app` it returns `{ url }` as JSON so a frontend can handle the redirect itself.
- **CSV export** (`GET /export-csv`): reads the links table through a Postgres cursor, pipes the rows into `csv-stringify` and uploads the result to Cloudflare R2 (S3-compatible) with `@aws-sdk/lib-storage`. It returns the public URL of the file.
- **Validation and docs**: request and response schemas use Zod via `fastify-type-provider-zod`. Swagger UI is served at `/docs`.
- Errors are handled with an Either pattern (`makeLeft` / `makeRight`), and validation errors return `400`.

## Tech Stack

Node.js · TypeScript · Fastify 5 · Zod · Drizzle ORM + drizzle-kit · PostgreSQL (`postgres.js`) · AWS SDK v3 S3 client (Cloudflare R2) · csv-stringify · UUIDv7 · tsup · tsx · Biome · Docker Compose

## Getting Started

**Requirements:** Node.js 20+, npm and Docker.

```bash
npm install
cp .env.example .env        # set DATABASE_URL and the Cloudflare R2 credentials
docker compose up -d        # PostgreSQL on localhost:5432 (user/password: docker)
npm run db:migrate          # apply Drizzle migrations
npm run dev                 # http://localhost:3333/docs
```

| Script | Description |
|---|---|
| `dev` | Run the server in watch mode with `.env` loaded |
| `build` / `start` | Bundle with tsup and run `dist/infra/http/server.js` |
| `db:generate` / `db:migrate` / `db:studio` | Drizzle Kit commands |

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | HTTP port (default 3333) |
| `NODE_ENV` | `development`, `production` or `test` |
| `APP_URL` | Base URL used to build and look up short URLs |
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://...`) |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY` | R2 credentials |
| `CLOUDFLARE_BUCKET`, `CLOUDFLARE_PUBLIC_URL` | Bucket and public base URL for the exported CSVs |

## Data Model

`encurted_links`: `id` (UUIDv7), `original_url`, `short_url`, `redirect_count`, `created_at`, `updated_at`.

## Project Structure

```
src/
  app/functions/     # use cases: create, list, delete, redirect count, export CSV
  infra/
    db/              # Drizzle client, schemas, migrations
    http/            # Fastify server and routes, Swagger transform
    shared/either.ts # Either helpers
  storage/           # R2 client and streaming upload
  env.ts             # Zod-validated environment
docker-compose.yml   # local PostgreSQL
```

The matching web client is [brevly-front](https://github.com/RicardoHigino/brevly-front).
