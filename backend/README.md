# Pokemon Cards — Backend

Generates Pokemon-style cards from a person's GitHub (and, once connected, Pinterest) data.

## Stack
- Node.js + Fastify (TypeScript)
- Satori + resvg for card image rendering
- Postgres for storage, Redis for caching

## Setup
```bash
npm install
cp .env.example .env   # fill in your own tokens
npm run dev
```

## Structure
```
src/
  routes/       # HTTP endpoints
  services/     # GitHub/Pinterest API calls + stat mapping logic
  auth/         # OAuth flows (Pinterest)
  db/           # DB schema + client
  cache/        # Redis client
```

## Endpoints (so far)
- `GET /api/github/:username` — public GitHub stats, mapped to card stats
- `GET /api/pinterest/auth` — kicks off Pinterest OAuth
- `GET /api/pinterest/auth/callback` — Pinterest OAuth callback
- `GET /api/pinterest/me` — connected user's Pinterest stats
- `POST /api/card/generate` — (stub) renders stats into a card image

## Branching workflow
- `main` is always deployable. Don't push to it directly.
- Branch per feature: `git checkout -b feature/your-thing`
- Push and open a PR, request review before merging.
- Pull `main` before starting new work each day.
