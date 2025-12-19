# RaceFrame

<div align="center">
  <img src="static/favicon.svg" alt="RaceFrame Logo" width="80" height="80" />
  <p>A free web app that generates printable race portrait posters from GPX files.</p>

  [![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte&logoColor=white)](https://svelte.dev)
  [![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white)](https://kit.svelte.dev)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![Cloudflare Pages](https://img.shields.io/badge/Deployed_to-Cloudflare_Pages-F38020?logo=cloudflare-pages&logoColor=white)](https://raceframe.pages.dev)
</div>

---

Upload your race data, customize the design, and download a high-resolution image ready for printing. All processing happens in the browser—your data never leaves your device.

**Live:** [raceframe.pages.dev](https://raceframe.pages.dev)

## Features

- **Privacy First:** Completely client-side — no data uploaded to servers.
- **Universal GPX Support:** Parse GPX files from Strava, Garmin, Polar, or any GPS device.
- **High Resolution:** Export print-ready PNG at 300 DPI (4x scale).
- **Customizable:** Adjust text, themes, route colors, and include a custom QR code for the activity.
- **Interactive Map:** Leaflet-powered route visualization with CartoDB themes.

## Tech Stack

- **Framework:** [SvelteKit 2](https://kit.svelte.dev) + [Svelte 5](https://svelte.dev) (Runes)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com)
- **Maps:** [Leaflet](https://leafletjs.com) with CartoDB tiles
- **GPX Parsing:** [@tmcw/togeojson](https://github.com/tmcw/togeojson)
- **Export:** [modern-screenshot](https://github.com/we-bridge/modern-screenshot)
- **QR Codes:** [qr-code-styling](https://github.com/SumiMakito/qr-code-styling)
- **Analytics:** [PostHog](https://posthog.com) (Privacy-conscious)

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
