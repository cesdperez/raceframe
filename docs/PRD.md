# RaceFrame — Product Requirements Document

## Overview

A free, static web application that generates printable race portrait posters from GPX files. Users upload their race data, customize the design, and download a high-resolution image ready for DIY printing and framing.

**Live:** https://raceframe.pages.dev

## Problem Statement

Existing race poster services charge €15-75+ and offer limited personalization. Runners want a free way to create beautiful, personalized race memorabilia featuring their actual GPS route, finish time, and personal details.

## Solution

A client-side web app that:
1. Parses user-uploaded GPX files to extract route and metadata
2. Renders the route on styled map tiles
3. Allows customization of text, colors, and themes
4. Exports print-ready files

**Key differentiator:** Completely free, works with any GPX source (Strava, Garmin, Polar, etc.), no account required, no data stored.

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | SvelteKit 2 + Svelte 5 | Reactive UI, runes-based state, static export |
| Language | TypeScript | Type safety for GPX parsing |
| Styling | Tailwind CSS 4 | Rapid UI development |
| Maps | Leaflet + CartoDB tiles | Free, no API key required |
| GPX Parsing | @tmcw/togeojson | Maintained, ESM, handles GPX/KML/TCX |
| Export | modern-screenshot | Fast rasterization |
| QR Codes | qr-code-styling | Customizable QR code generation |
| Analytics | PostHog | Privacy-conscious analytics |
| Hosting | Cloudflare Pages | Free static hosting with edge CDN |

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. UPLOAD          2. CUSTOMIZE         3. EXPORT              │
│  ─────────          ───────────          ────────               │
│  Drop GPX file  →   Edit details    →    Download PNG           │
│                     Select theme                                │
│                     Choose layout                               │
│                     Preview live                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

### GPX Processing
- Parse GPX files to extract coordinates, distance, time, pace, elevation gain
- Handle files with multiple tracks/segments

### Poster Editor
- Live preview scaled to viewport
- Map rendering with route overlay and start/finish markers
- Editable fields: runner name, race name, time, date, distance, bib number
- Optional QR code linking to activity

### Layouts

**Classic (Portrait)**
Standard vertical poster for traditional framing or digital display.

```
┌────────────────────────────────────┐
│           RACE NAME                │
│           1 December 2025          │
│  ┌──────────────────────────────┐  │
│  │           MAP                │  │
│  │        + ROUTE               │  │
│  └──────────────────────────────┘  │
│  ─────────────────────────────────  │
│        RUNNER NAME  #12345         │
│    42.2        3:45'22"     5'20"  │
│     KM           TIME       /KM    │
└────────────────────────────────────┘
```

**Medal Right (Landscape)**
Two-column layout with medal zone for displaying finisher medals.

```
┌─────────────────────────┬─────────────────────────┐
│      RACE NAME          │       Medal zone        │
│      1 December 2025    │       (for medal)       │
│  ┌───────────────────┐  ├─────────────────────────┤
│  │       MAP         │  │  RUNNER NAME  #12345    │
│  │                   │  │  42.2 km • 3:45:22      │
│  └───────────────────┘  │  5'20"/km               │
└─────────────────────────┴─────────────────────────┘
```

### Aspect Ratios

**Portrait layouts (Classic):**
| Ratio | Common Print Sizes |
|-------|-------------------|
| 2:3 | 4×6", 8×12" |
| 4:5 | 8×10", 16×20" |
| 5:7 | 5×7", 10×14" |
| ISO-A | A4, A3, A2 |

**Landscape layouts (Medal Right):**
| Ratio | Common Print Sizes |
|-------|-------------------|
| 3:2 | 6×4", 12×8" |
| 5:4 | 10×8", 20×16" |
| 7:5 | 7×5", 14×10" |
| ISO-A | A4, A3, A2 |

### Themes & Customization

**Design Presets:**
- Paper, Noir, Blueprint, Orbital, Watercolor, Terrain

**Map Styles:**
- Light Clean (CartoDB Positron)
- Dark Clean (CartoDB Dark Matter)
- Alidade Smooth / Dark / Satellite (Stadia)
- Outdoors (Stadia)
- Toner / Toner Lite / Toner Dark (Stadia/Stamen)
- Terrain (Stadia/Stamen)
- Watercolor (Stadia/Stamen)
- OSM Bright (Stadia)

**Map Filters:**
- None, Grayscale, Sepia, Navy, Teal

**Other Options:**
- 8 route colors + custom color picker
- Custom background and text colors
- Unit toggle (km/miles)
- Optional QR code with 4 dot styles (rounded, dots, classy, square) and gradient option

### Demo Mode
- Try the editor without uploading a GPX file
- Pre-loaded with Valencia Marathon sample data
- Restricted to CARTO map styles only
- Export functionality disabled
- All editing features available

### Export
- PNG export at 2x scale (~150 DPI for web) or 4x scale (300 DPI for print)
- Filename includes race name and date
- Fonts embedded in export for consistent rendering

---

## Poster Specifications

### Typography

| Element | Font | Weight |
|---------|------|--------|
| Race name | Oswald | 600 |
| Date | Oswald | 400 |
| Runner name | Oswald | 500 |
| Stats values | Oswald | 500 |
| Stats labels | Inter | 400 |

### Design Presets

| Preset | Map Style | Map Filter | Background | Text | Route |
|--------|-----------|------------|------------|------|-------|
| Paper | Positron | None | #ffffff | #1a1a1a | Orange |
| Noir | Dark Matter | None | #18181b | #fafafa | Orange |
| Blueprint | Toner Lite | Navy | #0f2b4a | #e0e7ef | Cyan |
| Orbital | Alidade Satellite | None | #163a2e | #ffffff | Yellow |
| Watercolor | Watercolor | Sepia | #f5f5dc | #3d2914 | Orange |
| Terrain | Terrain | None | #e8e4d9 | #2d3b2d | Orange |

### Map Styles

| Style | Provider | Brightness |
|-------|----------|------------|
| Light Clean | CartoDB Positron | Light |
| Dark Clean | CartoDB Dark Matter | Dark |
| Alidade Smooth | Stadia | Light |
| Alidade Smooth Dark | Stadia | Dark |
| Alidade Satellite | Stadia | Dark |
| Outdoors | Stadia | Light |
| Toner | Stadia/Stamen | Light |
| Toner Lite | Stadia/Stamen | Light |
| Toner Dark | Stadia/Stamen | Dark |
| Terrain | Stadia/Stamen | Light |
| Watercolor | Stadia/Stamen | Light |
| OSM Bright | Stadia | Light |

### Route Colors

Orange (#fc5200), Blue (#3b82f6), Cyan (#00ced1), Yellow (#ffd700), Pink (#ff69b4), Black (#000000), White (#ffffff), Red (#ef4444)

---

## Technical Notes

### Performance Targets
- Page load: < 3 seconds
- Map render: < 2 seconds
- Export: < 5 seconds
- GPX files up to 10MB

### Browser Support
Chrome, Firefox, Safari, Edge (latest versions), mobile browsers

---

## Non-Goals

- User accounts / authentication
- Server-side processing
- Storing user data
- Payment / print fulfillment
- Mobile native apps
