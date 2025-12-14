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
| Export | modern-screenshot | Fast rasterization, Web Worker support |
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

## Current Features (v1.x)

### GPX Processing
- Parse GPX files to extract coordinates, distance, time, pace
- Handle files with multiple tracks/segments

### Poster Editor
- Live preview scaled to viewport
- Map rendering with route overlay and start/finish markers
- Editable fields: runner name, race name, time, date, distance, bib number, city
- Optional QR code

### Themes & Customization
- 3 themes: Light, Dark, Midnight
- Route color picker
- Unit toggle (km/miles)
- QR code styling (dot style, gradient)

### Export
- PNG export at 2x and 4x resolution (300 DPI for print)
- PDF export with bleed margins for professional printing
- Filename includes race name and date

---

## Next Iteration: Layout System for Medal Display

### Problem

Runners often want to display their race poster alongside their finisher medal in a DIY frame. The current fixed portrait layout doesn't accommodate this use case.

### Solution

Introduce a **Layout** selector that offers different poster arrangements optimized for medal display frames.

### Layout Options

#### 1. Classic (Current)
Standard portrait poster, no medal zone. For traditional framing or digital display.

```
┌────────────────────────────────────┐
│           RACE NAME                │
│           1 December 2025          │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │           MAP                │  │
│  │        + ROUTE               │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│  ─────────────────────────────────  │
│        RUNNER NAME  #12345         │
│    42.2        3:45'22"     5'20"  │
│     KM           TIME       /KM    │
└────────────────────────────────────┘
```

#### 2. Medal Right
Landscape orientation. Two-column layout (50/50 split).

```
┌─────────────────────────┬─────────────────────────┐
│      RACE NAME          │  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄   │
│      1 December 2025    │      Medal zone         │
│  ┌───────────────────┐  │       (top 50%)         │
│  │                   │  │  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄   │
│  │       MAP         │  ├─────────────────────────┤
│  │                   │  │  RUNNER NAME  #12345    │
│  │                   │  │  42.2 km • 3:45:22      │
│  └───────────────────┘  │  5'20"/km               │
└─────────────────────────┴─────────────────────────┘
   Column 1: Race identity    Column 2: Achievement
              ← Full frame exported →
```

#### 3. Medal Left
Landscape orientation. Two-column layout (50/50 split), mirrored.

```
┌─────────────────────────┬─────────────────────────┐
│  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄   │      RACE NAME          │
│      Medal zone         │      1 December 2025    │
│       (top 50%)         │  ┌───────────────────┐  │
│  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄   │  │                   │  │
├─────────────────────────┤  │       MAP         │  │
│  RUNNER NAME  #12345    │  │                   │  │
│  42.2 km • 3:45:22      │  │                   │  │
│  5'20"/km               │  └───────────────────┘  │
└─────────────────────────┴─────────────────────────┘
   Column 1: Achievement    Column 2: Race identity
              ← Full frame exported →
```

#### 4. Medal Top
Portrait orientation. Medal zone on top (30% of frame height), content below.

```
┌────────────────────────────────────┐  ↑
│  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄  │  │
│           Medal zone               │  │ Full frame exported
│  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄  │  │
├────────────────────────────────────┤  │
│           RACE NAME                │  │
│  ┌──────────────────────────────┐  │  │
│  │           MAP                │  │  │
│  └──────────────────────────────┘  │  │
│   RUNNER NAME    42.2km • 3:45:22  │  │
└────────────────────────────────────┘  ↓
    Medal zone (top) + Content area
```

### Content Arrangement

**Classic (Portrait):**
- Vertical stack: Title → Date → Map → Divider → Stats

**Medal Top (Portrait):**
- Medal zone (top 30%) → Title → Date → Map → Stats

**Medal Right / Medal Left (Landscape):**
- Two equal columns (50/50 split)
- **Race identity column:** Title + Date + Map (stacked vertically)
- **Achievement column:** Medal zone (top 50%) + Stats (bottom 50%)
- Medal Right: Race identity on left, Achievement on right
- Medal Left: Achievement on left, Race identity on right

### Aspect Ratios

The aspect ratio defines the **full frame** dimensions (content area + medal zone combined). This replaces the previous fixed pixel sizes.

**Portrait layouts (Classic, Medal Top):**
| Ratio | Common Print Sizes | Default |
|-------|-------------------|---------|
| 2:3 | 4×6", 8×12", A4-ish | ✓ |
| 4:5 | 8×10", 16×20" | |

**Landscape layouts (Medal Right, Medal Left):**
| Ratio | Common Print Sizes | Default |
|-------|-------------------|---------|
| 3:2 | 6×4", 12×8" | ✓ |
| 5:4 | 10×8", 20×16" | |

**Medal zone proportions:**
- Medal Right / Medal Left: 50% of column height (within the 50% achievement column)
- Medal Top: 30% of frame height
- (May become user-configurable in future iterations)

**Export scales:**
- 2x — Screen/sharing quality
- 4x — Print quality (300 DPI at ~5-7")
- 8x — Large format print

### Preview vs Export

- **Preview:** Shows full frame including medal zone with placeholder visual (dashed border, subtle medal icon) to help users visualize where their physical medal will hang.
- **Export:** Full frame with the **same dimensions** as the preview. The medal zone is included but rendered as empty background (no placeholder visual). The physical medal will be placed over this empty area when framed.

### UI Changes

New editor controls (replaces current "Frame Size" selector):
```
Layout:        [Classic] [Medal Right] [Medal Left] [Medal Top]
Aspect Ratio:  [2:3] [4:5]      ← for portrait layouts (Classic, Medal Top)
               [3:2] [5:4]      ← for landscape layouts (Medal Right, Medal Left)
Export Scale:  [2x] [4x] [8x]
```

The aspect ratio options automatically change based on the selected layout orientation.

---

## Poster Specifications

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

### Route Colors

Orange (#FC5200), Yellow (#FFD700), Cyan (#00CED1), Pink (#FF69B4), Green (#32CD32), White (#FFFFFF)

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
