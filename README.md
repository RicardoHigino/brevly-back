# Brev.ly Backend

An API designed for a URL shortener application, built with Node.js, PostgreSQL, and Drizzle ORM.

## Features

- Create and manage short links
- Prevent creation of links with invalid or duplicate slugs
- Delete links
- Retrieve the original URL from a short link
- List all registered URLs
- Increment the access count for each link
- Download a CSV report of all created links

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL database
- pnpm

### Installation

```bash
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure the required environment variables:

```bash
cp .env.example .env
```

## Running PostgreSQL with Docker

You can quickly start a PostgreSQL database for local development using Docker Compose:

```bash
docker-compose up -d
```

This command will start a PostgreSQL container using the `bitnami/postgresql` image, as defined in `docker-compose.yml`. The default credentials are:

- **User:** docker
- **Password:** docker
- **Database:** brev_ly

Make sure your `.env` file matches these settings to allow the backend to connect to the database.

To stop and remove the containers, run:

```bash
docker-compose down
```

### Database Migration

Run the migrations to set up the database schema:

```bash
pnpm run migrate
```

### Running the Application

```bash
pnpm run dev
```

### Building for Production

```bash
pnpm run build
```

## Useful Tips

- Ensure your PostgreSQL database is running and accessible.
- Adjust environment variables in `.env` as needed for your setup.
- For the best experience, use the latest LTS version of Node.js.
- If you encounter issues, check the application logs and ensure all dependencies are installed.
