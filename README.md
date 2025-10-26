 # you-tube

Modern YouTube-clone web app built with Next.js (app router), TypeScript, Tailwind and a handful of production-ready services.

This README summarizes the project's purpose, core technologies, how to run locally, key folders, and required environment configuration.

## Key highlights

- Framework: Next.js (app router) — Next 15
- Language: TypeScript
- Styling: Tailwind CSS
- Auth: Clerk (@clerk/nextjs)
- API: tRPC
- ORM: Drizzle (drizzle-kit + drizzle-orm)
- Storage / Video: Mux + @mux/mux-uploader-react, Uploadthing
- Database: Postgres/Neon (via DATABASE_URL)
- Cache / Rate limiting: Upstash Redis

## Table of contents

- What this repo contains
- Quick start (run locally)
- Environment variables
- Scripts
- Project layout (important folders)
- Notes & troubleshooting
- Contributing

## What this repo contains

This is a full-stack Next.js app using the App Router under `src/app`. The codebase contains UI components, API routes (tRPC), Drizzle schemas, and integrations for uploads and video playback.

Notable packages (from package.json):

- @clerk/nextjs — authentication
- @trpc/* — typed backend/frontend RPC
- drizzle-orm / drizzle-kit — DB layer
- @mux/mux-node & mux-player-react — video encoding & playback
- @uploadthing/react / uploadthing — file upload helpers
- @neondatabase/serverless — adapter for Neon
- @upstash/redis, @upstash/ratelimit — Redis + rate limiting
- tailwindcss, sonner, radix-ui — styling & UI primitives

## Quick start (local development)

Prerequisites

- bun (recommended by repo scripts) or Node.js + npm/yarn
- environment variables set in `.env.local` (see below)
- optionally ngrok for webhook tunnels if you need webhooks locally

Install dependencies

```bash
bun install
```

Run the dev server

```bash
# runs next dev
bun run dev

# or run the helper that attempts to run a webhook tunnel + dev server
bun run dev:all
```

Build & start (production)

```bash
bun run build
bun run start
```

Open http://localhost:3000 after the dev server starts.

## Environment variables

Create a `.env.local` in the repo root and add the values required by your services. The project references these (non-exhaustive list):

- DATABASE_URL — Postgres / Neon connection string used by Drizzle
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — Clerk (client)
- CLERK_SECRET_KEY — Clerk (server)
- CLERK_SIGNING_SECRET — Clerk webhook signing secret
- UPSTASH_REDIS_REST_URL — Upstash Redis URL
- UPSTASH_REDIS_REST_TOKEN — Upstash Redis token
- MUX_TOKEN_ID — Mux token id
- MUX_TOKEN_SECRET — Mux token secret
- MUX_WEBHOOK_SECRET — Mux webhook secret
- UPLOADTHING_TOKEN or UPLOADTHING_SECRET — Uploadthing auth
- NEXT_PUBLIC_APP_URL — Public app URL (defaults to http://localhost:3000)

Tip: Some services also require configuring webhooks (Clerk / Mux). For local webhook testing you can use ngrok and update `scripts.dev:webhook` or set the webhook URL in the service dashboard.

## Scripts (from package.json)

- `dev` — start Next.js dev server (next dev)
- `dev:all` — runs `dev:webhook` and `dev` concurrently (uses `concurrently`)
- `dev:webhook` — currently runs an ngrok command with a hardcoded URL; update before use
- `build` — next build
- `start` — next start (production)
- `lint` — next lint

Inspect `package.json` for the exact definitions.

## Project layout (top-level of `src/`)

- `src/app/` — Next app router pages/layouts (app entrypoints and routes)
- `src/components/` — shared UI components and primitives
- `src/db/` — Drizzle schema & DB helpers
- `src/modules/` — domain modules (auth, videos, comments, playlists, etc.)
- `src/lib/` — helper libraries (mux helpers, qstash, redis, upload helpers)
- `src/trpc/` — tRPC client/server initialization and routers

Example: `src/app/layout.tsx` wires up `ClerkProvider`, the tRPC provider, and global styles.

## Notes & troubleshooting

- The repository uses Next 15 and experimental App Router conventions — files under `src/app` are the primary routes/layouts.
- `drizzle.config.ts` expects `DATABASE_URL` in `.env.local`; run `drizzle-kit` if you need migrations.
- `dev:webhook` script has a hardcoded ngrok URL; replace it with a dynamic ngrok command or remove it if you prefer manual tunneling.
- If you get CORS or image remote errors, check `next.config.ts` which whitelists certain host patterns for Next Image.

Common quick fixes

- Lint/type issues: run `bun run lint` and check `tsc` diagnostics locally.
- If uploads fail, verify Uploadthing and Mux env vars and check network rules.

## Contributing

Contributions are welcome. A suggested workflow:

1. Fork the repo
2. Create a feature branch and open a PR with a clear description
3. Add tests for new behavior where applicable

If you want me to also add a small .env.example or contributor guide, tell me which services you want included and I will generate it.

## License

This repository does not contain an explicit license file. Add `LICENSE` if you intend to open-source it.

---

If you'd like, I can also:

- add a `.env.example` with common keys (no secrets)
- add a short CONTRIBUTING.md
- add a developer checklist for setting up Mux / Uploadthing / Clerk locally

Tell me which of the above you'd like next.
