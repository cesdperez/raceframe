# RaceFrame

A free web app that generates printable race portrait posters from GPX files. Upload your race data, customize the design, and download a high-resolution image ready for printing.

**Live:** https://cesdperez.github.io/raceframe

## Features

- Parse GPX files from Strava, Garmin, Polar, or any GPS device
- Customize text, themes, and route colors
- Export print-ready PNG at 300 DPI
- Completely client-side — no data uploaded to servers

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Testing

```bash
pnpm test:run      # Unit tests (Vitest)
pnpm test:e2e      # E2E tests (Playwright)
pnpm test:all      # Run all tests
```

## Tech Stack

- SvelteKit 2 + Svelte 5
- TypeScript
- Tailwind CSS 4
- Leaflet (maps)
- @tmcw/togeojson (GPX parsing)
- modern-screenshot (PNG export)
