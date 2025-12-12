# RaceFrame — Product Requirements Document

## Overview

A free, static web application that generates printable race portrait posters from GPX files. Users upload their race data, customize the design, and download a high-resolution image ready for DIY printing and framing.

**Target URL:** `https://cesdperez.github.io/raceframe`

## Problem Statement

Existing race poster services (RUNPOSTER, Print My Run) charge €15-75+ and offer limited personalization. Runners want a free way to create beautiful, personalized race memorabilia featuring their actual GPS route, finish time, and personal details.

## Solution

A client-side web app that:
1. Parses user-uploaded GPX files to extract route and metadata
2. Renders the route on styled map tiles
3. Allows customization of text, colors, and themes
4. Exports print-ready PNG/PDF files

**Key differentiator:** Completely free, works with any GPX source (Strava, Garmin, Polar, etc.), no account required, no data stored.

---

## Tech Stack

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Framework | SvelteKit | ^2.0 | Reactive UI, easy static export |
| UI Library | Svelte | ^5.0 | Runes-based reactivity, stable since Oct 2025 |
| Language | TypeScript | ^5.0 | Type safety for GPX parsing |
| Styling | Tailwind CSS | ^4.1 | Rapid UI development, latest JIT engine |
| Maps | Leaflet | ^1.9.4 | Free, no API key, stable (2.0 still alpha) |
| Map Tiles | CartoDB Basemaps | — | Free, no API key required |
| GPX Parsing | @tmcw/togeojson | ^7.1.2 | Maintained fork, ESM, handles GPX/KML/TCX |
| Export | modern-screenshot | ^4.6.7 | Faster than html2canvas, Web Worker support |
| Hosting | GitHub Pages | — | Free static hosting |
| Build | Vite | ^6.0 | Fast builds (via SvelteKit) |
| Package Manager | pnpm | ^9.0 | Fast installs, efficient disk usage |

### Development Commands

```bash
pnpm create svelte@latest .   # Initialize SvelteKit project
pnpm install                   # Install dependencies
pnpm dev                       # Start dev server
pnpm build                     # Build for production
pnpm preview                   # Preview production build
```

### Dependency Versions (as of Dec 2025)

```json
{
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0",
    "@sveltejs/kit": "^2.0",
    "svelte": "^5.0",
    "typescript": "^5.0",
    "tailwindcss": "^4.1",
    "vite": "^6.0"
  },
  "dependencies": {
    "leaflet": "^1.9.4",
    "@tmcw/togeojson": "^7.1.2",
    "modern-screenshot": "^4.6.7"
  }
}
```

### Alternatives Considered

| Category | Chosen | Alternative | Why Not |
|----------|--------|-------------|---------|
| Maps | Leaflet | MapLibre GL JS | MapLibre is faster with WebGL + vector tiles, but adds complexity. Leaflet is simpler and sufficient for static poster rendering. Consider MapLibre for v2 if performance issues arise. |
| Export | modern-screenshot | html2canvas | modern-screenshot is actively maintained, smaller, supports Web Workers for better perf. html2canvas hasn't had major updates. |
| GPX | @tmcw/togeojson | gpxparser | togeojson is actively maintained (last release May 2025), ESM-native, handles multiple formats. gpxparser last updated 2021. |
| CSS | Tailwind | Plain CSS | Tailwind speeds up UI development significantly; v4.1 has improved performance. |

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. UPLOAD          2. CUSTOMIZE         3. EXPORT              │
│  ─────────          ───────────          ────────               │
│  Drop GPX file  →   Edit details    →    Download PNG           │
│                     Select theme                                │
│                     Preview live                                │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Steps

1. **Landing** — Brief explanation + drag-and-drop GPX upload area
2. **Editor** — Live preview with customization panel
3. **Export** — Download button, size options, print instructions

---

## Features

### MVP (v1.0)

#### GPX Processing
- [x] Parse GPX file to extract coordinates
- [x] Calculate total distance from coordinates
- [x] Extract date/time from GPX metadata
- [x] Calculate elapsed time and average pace
- [x] Handle GPX files with multiple tracks/segments

#### Poster Editor
- [x] Live preview of poster (scaled to fit viewport)
- [x] Map rendering with route overlay
- [x] Start/finish markers on route

#### Input Fields (with live preview updates)

| Field | Type | Required | Source |
|-------|------|----------|--------|
| GPX File | File upload | Yes | User upload |
| Runner Name | Text | Yes | Manual input |
| Race Name | Text | Yes | Manual input |
| Finish Time | Text (HH:MM'SS") | Yes | Auto from GPX, editable |
| Date | Date | Yes | Auto from GPX, editable |
| Distance | Number + unit | Yes | Auto from GPX, editable |
| Bib Number | Text | No | Manual input |
| City | Text | No | Manual input |
| QR Code URL | URL | No | Manual input |

#### Themes & Customization
- [x] Theme selector (Light, Dark, Midnight, Forest)
- [x] Route color picker (Orange, Yellow, Cyan, Pink, Green, White)
- [x] Unit toggle (km / miles)

#### Export
- [x] PNG export at 2x resolution
- [x] PNG export at 4x resolution (300 DPI for print)
- [x] Filename includes race name and date

### Future Enhancements (v2.0+)

- [x] PDF export with bleed margins for professional printing
- [x] More themes and custom color pickers
- [ ] Elevation profile visualization
- [ ] Multiple poster aspect ratios (A4, A3, square, etc.)
- [ ] QR code rendered on poster
- [ ] Social sharing (generate preview image)
- [ ] Preset race routes (for users without GPX)
- [ ] Local storage to save work-in-progress
- [ ] PWA support for offline use

---

## Poster Specifications

### Layout (Portrait orientation)

```
┌────────────────────────────────────┐
│           RACE NAME                │  ← Oswald font, uppercase
│           1 December 2025          │  ← Date, smaller
│                                    │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │                              │  │
│  │           MAP                │  │  ← ~60% of poster height
│  │        + ROUTE               │  │
│  │                              │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────────────────────────────  │  ← Divider line
│        RUNNER NAME  #12345         │  ← Name + optional bib
│                                    │
│    42.2        3:45'22"     5'20"  │  ← Stats row
│     KM           TIME       /KM    │
│                                    │
│          [QR CODE]                 │  ← Optional, bottom center
└────────────────────────────────────┘
```

### Dimensions

| Size Name | Pixels (4x/300DPI) | Print Size |
|-----------|-------------------|------------|
| Default | 1600 x 2240 | ~13.5 x 19 cm |
| A4 | 2480 x 3508 | 21 x 29.7 cm |
| A3 | 3508 x 4961 | 29.7 x 42 cm |

MVP will support single default size; additional sizes in v2.

### Typography

| Element | Font | Weight | Size (base) |
|---------|------|--------|-------------|
| Race name | Oswald | 600 | 28px |
| Date | Oswald | 400 | 14px |
| Runner name | Oswald | 500 | 18px |
| Stats values | Oswald | 500 | 22px |
| Stats labels | Inter | 400 | 10px |

### Themes

| Theme | Background | Text | Map Tiles |
|-------|------------|------|-----------|
| Light | #FFFFFF | #1a1a1a | CartoDB Positron |
| Dark | #1a1a2e | #FFFFFF | CartoDB Dark Matter |
| Midnight | #0f0f1a | #e0e0e0 | CartoDB Dark Matter |
| Forest | #1a2e1a | #e8f5e8 | CartoDB Dark Matter |

### Route Colors

- Orange: #FC5200 (Strava orange)
- Yellow: #FFD700
- Cyan: #00CED1
- Pink: #FF69B4
- Green: #32CD32
- White: #FFFFFF

---

## Technical Requirements

### GPX Parsing

Use `@tmcw/togeojson` to convert GPX to GeoJSON, then extract what we need:

```typescript
import { gpx } from '@tmcw/togeojson';

// Parse GPX file
const gpxDoc = new DOMParser().parseFromString(gpxString, 'text/xml');
const geoJson = gpx(gpxDoc);

// Extract coordinates from GeoJSON LineString
const coordinates = geoJson.features[0].geometry.coordinates;
```

```typescript
interface GPXData {
  coordinates: [number, number][]; // [lat, lng][]
  totalDistance: number;          // in meters
  startTime: Date | null;
  endTime: Date | null;
  elapsedTime: number | null;     // in seconds
  elevationGain: number | null;   // in meters
  name: string | null;            // activity name from GPX
}
```

### Map Rendering

- Use Leaflet with CartoDB raster tiles (no API key needed)
- Disable all map interactions (zoom, pan, drag)
- Auto-fit bounds to route with padding
- Route rendered as polyline with configurable color
- Circle markers for start/finish points

### Export

- Use `modern-screenshot` for rasterization (faster than html2canvas, Web Worker support)
- Ensure map tiles are fully loaded before export
- Support CORS for tile loading
- Target resolutions:
  - Standard: 2x scale (~150 DPI)
  - High-res: 4x scale (~300 DPI)

```typescript
import { domToPng } from 'modern-screenshot';

const dataUrl = await domToPng(posterElement, {
  scale: 4, // 300 DPI
  quality: 1,
});
```

### Performance

- All processing client-side (no server)
- GPX parsing should handle files up to 10MB
- Map should render within 2 seconds
- Export should complete within 5 seconds

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (responsive design)

---

## Project Structure

```
raceframe/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── FileUpload.svelte
│   │   │   ├── PosterPreview.svelte
│   │   │   ├── PosterMap.svelte
│   │   │   ├── EditorPanel.svelte
│   │   │   └── ExportButton.svelte
│   │   ├── utils/
│   │   │   ├── gpx.ts           # GPX parsing with @tmcw/togeojson
│   │   │   ├── geo.ts           # Distance calculations, coordinate utils
│   │   │   ├── format.ts        # Time/distance formatting
│   │   │   └── export.ts        # PNG export with modern-screenshot
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── stores/
│   │       └── poster.ts
│   ├── routes/
│   │   └── +page.svelte
│   └── app.html
├── static/
│   └── fonts/
├── PRD.md
├── package.json
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Deployment

### GitHub Pages Setup

1. Repository: `cesdperez/raceframe`
2. Build command: `pnpm build`
3. Output directory: `build/`
4. SvelteKit adapter: `@sveltejs/adapter-static`
5. Base path config: `/raceframe` for GitHub Pages subdirectory

### CI/CD

GitHub Actions workflow to:
1. Run on push to `main`
2. Setup pnpm + Node.js
3. Install dependencies (`pnpm install`)
4. Build static site (`pnpm build`)
5. Deploy to GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Success Metrics

- Page loads in < 3 seconds
- Export works on first try (no errors)
- Exported image is print-quality (no pixelation at 300 DPI)
- Works without any user account or data collection

---

## Non-Goals (Out of Scope)

- User accounts / authentication
- Server-side processing
- Storing user data
- Payment processing
- Print fulfillment / shipping
- Mobile native apps

---

## Open Questions

1. Should we add a "How to print" guide with recommended print services?
2. Do we want analytics (privacy-respecting, like Plausible)?
3. Should we support drag-and-drop from Strava/Garmin URLs (would require scraping)?

---

## References

- [Svelte 5 Documentation](https://svelte.dev/docs)
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [SvelteKit Static Adapter](https://svelte.dev/docs/kit/adapter-static)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Leaflet Documentation](https://leafletjs.com/)
- [CartoDB Basemaps](https://carto.com/basemaps/)
- [@tmcw/togeojson](https://github.com/placemark/togeojson)
- [modern-screenshot](https://github.com/qq15725/modern-screenshot)
- [GPX Schema](https://www.topografix.com/gpx.asp)
- [GitHub Pages](https://pages.github.com/)
