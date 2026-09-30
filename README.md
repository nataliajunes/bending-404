# Bending Spoons — 404

A physics-driven 404 / landing page built with [Next.js](https://nextjs.org) and [Matter.js](https://brm.io/matter-js/). Identical copies of the Bending Spoons logo fall from the top of the screen, collide, and pile up under gravity — draggable with the mouse — against a black backdrop styled to match [bendingspoons.com](https://bendingspoons.com).

**Live:** [bending-404.vercel.app](https://bending-404.vercel.app)

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

- `app/page.tsx` — the Matter.js landing page
- `app/not-found.tsx` — a themed 404 page with a separate hover-repel spoon cluster
- `components/MatterSpoons.tsx` — the Matter.js engine, renderer, and spoon-body spawning
- `components/SpoonCluster.tsx` — pointer-reactive SVG cluster used on the 404 page
- `public/spoon.svg` — the spoon artwork used as the sprite texture for every physics body
