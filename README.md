# Bending Spoons — 404 concept

A concept 404 page for [bendingspoons.com](https://bendingspoons.com), built with [Next.js](https://nextjs.org) and [Matter.js](https://brm.io/matter-js/). Identical copies of the Bending Spoons logo fall from the top of the screen, collide, and pile up under gravity — draggable with the mouse — against a black backdrop styled to match the real site's typography and accent colour.

**Live:** [bending-404.vercel.app](https://bending-404.vercel.app) — this opens directly on the concept page.

> **Unofficial fan concept.** This is not affiliated with, endorsed by, or built for Bending Spoons — it's a personal project made using their logo and brand styling as a thank-you / portfolio piece. All rights to the Bending Spoons name and mark belong to Bending Spoons.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Matter.js](https://brm.io/matter-js/) for the physics simulation

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it.

## Structure

- `app/page.tsx` — the main concept page (`/`): the Matter.js spoon pile with "Page not found" copy
- `app/not-found.tsx` — an alternate 404 treatment, shown when an undefined route is visited (e.g. `/anything`); uses a separate pointer-reactive spoon cluster instead of physics
- `components/MatterSpoons.tsx` — the Matter.js engine, renderer, and spoon-body spawning used on the main page
- `components/SpoonCluster.tsx` — the hover-repel SVG cluster used on `not-found.tsx`
- `public/spoon.svg` — the spoon artwork used as the sprite texture for every physics body
