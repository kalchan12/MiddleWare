                          
| No. | Name                 | ID                |
|-----|---------------------|--------------------|
| 1   | Dimtsekal Chala     |  UGE/24170/13      |
| 2   | Yerosen Addisu      | UGE/24157/13       |
| 3   | Tigist Dereje       |  UGE/24140/13      |
| 4   | Seble Kifle         | UGE/24137/13       |
| 5   | Eyerus Million      |  UGE/24075/13      |
| 6   | Mihiret Sisay       |  UGE/24152/13      |

# Middleware-Integration Monorepo
This Project is about creating Middleware for our CSE Uni Project
## Structure
- `/apps/web` — Frontend app (placeholder)
- `/apps/admin` — Optional second frontend (placeholder)
- `/packages/middleware` — Express + PostgreSQL API (TypeScript)
- `/packages/config` — Shared ESLint + TypeScript config
- `/packages/ui` — Shared UI components (optional, placeholder)

## Getting Started
1. Copy `.env` in `packages/middleware` and set your Postgres credentials.
2. Run `pnpm install` in the repo root.
3. Run `pnpm --filter middleware dev` to start the API server.

## API Endpoints
- `GET /users` — fetch all users
- `POST /users` — add a new user
- `GET /analytics` — dummy analytics data
