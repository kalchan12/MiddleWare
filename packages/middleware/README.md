# Middleware API

Express + PostgreSQL API server for monorepo usage.

## Endpoints
- `GET /users` — fetch all users
- `POST /users` — add a new user
- `GET /analytics` — dummy analytics data

## Setup
1. Copy `.env` and set your Postgres credentials.
2. Run `pnpm install` in the repo root.
3. Run `pnpm --filter middleware dev` to start the server.
