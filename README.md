# Statmon

Turn a person's GitHub (and later, Pinterest) profile into a Pokemon-style stat card.

## Structure (monorepo, npm workspaces)
```
statmon/
  backend/     Fastify + TypeScript API — pulls GitHub/Pinterest data, maps to card stats
  frontend/    Next.js app — form + card display, calls the backend API
```

## Setup
```bash
npm install          # installs both workspaces from root
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

npm run dev:backend   # starts Fastify on :4000
npm run dev:frontend  # starts Next.js on :3000
```

## Branching workflow (two of us on one repo)
- `main` is always deployable — never push directly to it.
- Branch per feature: `git checkout -b feature/your-thing`
- Suggested split: one of us mainly in `/backend`, the other in `/frontend`, to avoid stepping on each other's files.
- Push your branch, open a PR, get a review before merging:
  ```bash
  git push -u origin feature/your-thing
  ```
- Pull `main` before starting new work each day:
  ```bash
  git checkout main
  git pull origin main
  ```
- Merge conflicts are most likely if we both touch the same file — communicate before editing shared files like `package.json` at the root.

## Endpoints (backend, so far)
- `GET /api/github/:username` — public GitHub stats mapped to card stats
- `GET /api/pinterest/auth` — starts Pinterest OAuth
- `GET /api/pinterest/auth/callback` — OAuth callback
- `GET /api/pinterest/me` — connected user's Pinterest stats
- `POST /api/card/generate` — (stub) renders stats into a card image
