# HWH Designs — Kitchen & BIC Configurator

A mobile-first, 6-step kitchen and built-in cupboard configurator for HWH Designs.

## Features

- **Interactive grid** — drag and drop cabinet units onto a scaled wall grid (up to 12m wide)
- **6 guided steps** — Layout, Materials, Finishes, Preview, Quote, Floor Plan & Cutting Spec
- **Dynamic pricing** — live quote calculation with labour multipliers (trade secret, not client-visible)
- **Floor plan** — top-down architectural plan view with door swing arcs
- **Cutting spec** — full panel schedule and consolidated cut list per job
- **Appliances** — display-only placement (washing machine, dryer, dishwasher, fridges)
- **Countertop options** — Formica (6 colours) and Quartz (6 colours)

## Tech Stack

- React 18 + Vite
- Tailwind CSS (via CDN utility classes)
- Framer Motion (transitions)
- Lucide React (icons)

## Getting Started

```bash
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

Output is in `dist/` — deploy to any static host (Netlify, Vercel, GitHub Pages).

## Deploying to GitHub Pages

1. Push to GitHub
2. In repo Settings > Pages, set source to **GitHub Actions**
3. Add the workflow file at `.github/workflows/deploy.yml` (included)
4. Push — site deploys automatically on every push to `main`

## Pricing Updates

Edit prices in `src/App.jsx` inside the `PM` constant object and `LABOUR_MULT`.
A companion Excel catalog (`hwh-pricing-catalog.xlsx`) is provided for offline editing.
After editing the catalog, re-ingest to Claude to apply changes to the configurator.

## File Structure

```
src/
  App.jsx        — full configurator (single-file React app)
  main.jsx       — React entry point
index.html       — HTML shell
vite.config.js   — Vite config
package.json     — dependencies
```

## Notes

- All prices in ZAR, excl. VAT
- Labour multipliers (3.5x melamine, 6x solid wood) are embedded in pricing logic and never displayed to clients
- Appliances are display-only and do not affect any cost calculations
