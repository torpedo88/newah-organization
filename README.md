# newah-organization

Website for the **Newah Organization of America — Northern California Chapter**: org
information, events calendar with registration, and member signup.

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Backend | Supabase (Postgres, Auth, Storage) |
| Hosting | Vercel |
| Package manager | pnpm |

## Getting started

Requires **Node 22** (see `.nvmrc`) and pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # fill in your Supabase project values
pnpm dev
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Local dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript, no emit |

## Environment variables

See `.env.example`. Never commit `.env.local` or any real key.

## Deployments

_Recorded after the first production deploy._

## Project management

This project uses the PAUL framework. See `.paul/` for the roadmap, phase plans, and
current state.

## Printed QR codes

Physical QR codes point at `https://newah-organization.vercel.app/register`.
**Do not rename, delete or transfer the Vercel project** — it changes that hostname
and kills every printed code. See [docs/PRINTED-QR.md](docs/PRINTED-QR.md).
