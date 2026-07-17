# fetchwave — yt-dlp Next.js Frontend

Next.js 15 SSR app for downloading video/audio/thumbnails from 200+ platforms via yt-dlp. Deployable to Vercel.

## Stack

- **Next.js 15** (App Router, SSR/SSG)
- **Tailwind CSS v4** with shadcn/ui primitives
- **Framer Motion** animations
- **Recharts** dashboard visualizations
- **TypeScript** throughout

## Architecture

```
yt-dlp-next/          ← Next.js frontend (this repo)
ytback/               ← Express API backend (deploy separately)
```

The frontend proxies API calls to the ytback backend via `app/api/proxy/[...path]`.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Deploy to Vercel

```bash
npx vercel --prod
```

Set `NEXT_PUBLIC_API_URL` to your ytback deployment URL.

## Pages

| Route | Type | Description |
|---|---|---|
| `/` | SSG | Landing page with Hero, platforms, pricing, CTA |
| `/dashboard` | CSR | User dashboard (overview, API keys, downloads, billing, settings) |
| `/sign-in`, `/sign-up` | SSG | Authentication pages |
| `/api` | SSG | API documentation |
| `/pricing` | SSG | Pricing plans + FAQ |
| `/privacy`, `/api-disclaimer` | SSG | Legal pages |
| `/api/proxy/[...path]` | SSR | Proxy to ytback backend |
