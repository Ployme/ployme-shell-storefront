# ployme-shell-storefront

## Project Purpose

A reference storefront implementation for Ployme, an AI-powered software factory. This hand-crafted, polished commerce shell serves as both a standalone demo and in-context reference material for the Ployme engine. The vertical is an olive oil importer — chosen to demonstrate that the shell generalises across product domains. Everything runs client-side or against mocked data; there is no real backend.

## Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui (New York style, installed into repo)
- Radix primitives (via shadcn)
- lucide-react (icons)
- next/font (typography)
- Deployed to Vercel (later)

## How to Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Session Log

1. **Session 1** — Foundation scaffolded: Next.js app, shadcn/ui, route stubs, project config.
2. **Session 2** — Brand and design tokens: Oliveto palette, Fraunces + Instrument Sans fonts, (shop) route group, header/footer chrome, admin sidebar layout.
3. **Session 3** — Data layer: domain types, 18-product catalogue, collections, cart context, JSON-backed product/order stores.
4. **Session 4** — Page content and layouts. *(planned)*
5. **Session 5** — Admin forms and CRUD logic. *(planned)*
6. **Session 6** — Vercel deployment and polish. *(planned)*

## Out of Scope This Weekend

- No real backend or API server
- No real payment processing
- No real authentication or authorization
- No database — all data is mocked in-memory or in JSON files
