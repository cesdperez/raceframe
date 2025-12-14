# RaceFrame — Product Requirements Document

## Overview

A free, static web application that generates printable race portrait posters from GPX files. Users upload their race data, customize the design, and download a high-resolution image ready for DIY printing and framing.

**Live:** https://cesdperez.github.io/raceframe

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
| Hosting | GitHub Pages | Free static hosting |

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

**Landscape layouts (Medal Right):**
| Ratio | Common Print Sizes |
|-------|-------------------|
| 3:2 | 6×4", 12×8" |
| 5:4 | 10×8", 20×16" |

### Themes & Customization
- 3 themes: Light, Dark, Navy
- 5 preset route colors + custom color picker
- Custom background and text colors
- Unit toggle (km/miles)
- QR code styling (dot style, gradient)

### Export
- PNG export at 2x (screen) and 4x (print at 300 DPI) resolution
- Filename includes race name and date

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

### Themes

| Theme | Background | Text | Map Tiles |
|-------|------------|------|-----------|
| Light | #FFFFFF | #1a1a1a | CartoDB Positron |
| Dark | #18181b | #fafafa | CartoDB Dark Matter |
| Navy | #0f172a | #f8fafc | CartoDB Dark Matter |

### Route Colors

Orange (#FC5200), Blue (#3b82f6), Cyan (#00CED1), Yellow (#FFD700), Pink (#FF69B4)

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
