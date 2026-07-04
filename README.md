# Shopfront — Mini E-Commerce App

A small e-commerce storefront built with React, TypeScript, and Vite, using the [Fake Store API](https://fakestoreapi.com/) for product data.

**Live demo:** [https://mini-ecommerce-app-rose.vercel.app/](https://mini-ecommerce-app-rose.vercel.app/)

## Features

- Product listing page with loading skeletons, error state (with retry), and empty state
- Product detail page with a color/size variant picker whose selection is reflected in the URL (`?color=...&size=...`) and shareable as a deep link
- Quantity picker with per-variant stock limits, sold-out variants disabled
- "Quick Add" to cart straight from the listing grid
- Cart drawer with persistent state (localStorage), quantity editing, removal, and an order summary (subtotal / shipping / total)
- Fully responsive (single-column mobile layout, horizontally-scrolling thumbnail strip, etc.)

See [DECISIONS.md](./DECISIONS.md) for the one architectural trade-off worth calling out (Context + `useReducer` vs. Redux/Zustand) and what I'd clean up with more time.

## Working around Fake Store API gaps

The [Fake Store API](https://fakestoreapi.com/) is a thin product API — no variants, one image per product, no brand field, no sale price. Rather than leave those features unbuilt or fake them in a misleading way, `src/data/variants.ts` derives them **deterministically from each product's id** (a seeded PRNG, not `Math.random()`), so the same product always gets the same colors, sizes, stock levels, brand, and sale status on every reload:

- **Variants (color/size/stock):** 2–4 colors and four sizes (S/M/L/XL) are generated per product, each size assigned an `in-stock` / `low-stock` / `sold-out` status. Every 13th product is forced fully sold-out so that UI state is always reachable in a demo instead of being left to chance.
- **Images:** each product only has one photo, so the gallery is built to support multiple images but is simply given a one-item array — an honest data limitation rather than a faked multi-angle gallery.
- **Brand:** there's no brand field, so the `category` (e.g. `"men's clothing"`) is capitalized and reused as the displayed brand.
- **Sale price:** about 1 in 3 products are deterministically marked on sale at 20% off, so the "original price crossed out" UI has something real to render.

## Tech stack

- React 19 + TypeScript
- Vite
- SCSS Modules
- React Router (`react-router-dom`)
- Context API + `useReducer` for cart state

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Other scripts

```bash
npm run build     # type-check and produce a production build in dist/
npm run preview   # serve the production build locally
npm run lint      # run oxlint
```

## Project structure

```
src/
  api/            Fake Store API fetch functions
  components/     Reusable UI components (Navbar, ProductCard, CartDrawer, ...)
  context/        CartContext (reducer + provider + useCart hook)
  data/           Deterministic variant/brand/sale-price generators, constants
  hooks/          useProducts, useProduct, useLocalStorage
  pages/          ProductListingPage, ProductDetailPage, NotFoundPage
  router/         Route table
  styles/         SCSS variables, mixins, global reset
  types/          Shared TypeScript types
  utils/          Small pure helpers (cart key, variant selection)
```

## Deploying to Vercel

This project is a standard Vite app, so it deploys to Vercel with zero configuration. These are the steps to run yourself (from your own GitHub/Vercel accounts):

1. **Push this project to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-empty-github-repo-url>
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new) and sign in.
   - Select "Import Git Repository" and choose the repo you just pushed.
   - Vercel auto-detects the Vite framework preset:
     - Build command: `npm run build`
     - Output directory: `dist`
   - Click **Deploy**.

3. That's it — Vercel will build and give you a live URL. Every subsequent push to `main` redeploys automatically.

Alternatively, using the Vercel CLI:
```bash
npm i -g vercel
vercel        # follow prompts, links the project
vercel --prod # deploy to production
```

## Performance

The bundle is small by default for an app this size (~250 KB JS / ~80 KB gzipped, one CSS file, no UI framework beyond React/Router), lazy-loads listing images (`loading="lazy"` on `ProductCard`) while keeping the above-the-fold detail-page image eager, and doesn't ship any custom web fonts. Two things were added directly in response to what a Lighthouse pass flags for this kind of app:

- A `<meta name="description">` tag in [index.html](./index.html) — missing before, and an easy SEO/best-practices flag.
- `<link rel="preconnect">` / `dns-prefetch` to `fakestoreapi.com` in [index.html](./index.html), since every page load depends on that API and its images — this shaves the DNS/TLS handshake off the critical request.

Run your own audit with Chrome DevTools → Lighthouse against the [live deployment](https://mini-ecommerce-app-rose.vercel.app/), and drop the report screenshot in [docs/lighthouse.md](./docs/lighthouse.md).
