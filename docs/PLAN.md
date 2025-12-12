# RaceFrame — Implementation Plan

This document outlines the phased implementation approach for RaceFrame. Each phase delivers a working, tested increment.

---

## [DONE] Phase 1: Project Foundation

**Goal:** Set up the project infrastructure with a deployable skeleton.

### Tasks

1. Initialize SvelteKit project with TypeScript
   - Use `pnpm create svelte@latest` with TypeScript option
   - Configure `@sveltejs/adapter-static` for GitHub Pages
   - Set base path to `/raceframe`

2. Configure Tailwind CSS v4
   - Install and configure Tailwind
   - Set up base styles and color variables from PRD themes

3. Set up fonts
   - Add Oswald (Google Fonts) for headings/stats
   - Add Inter (Google Fonts) for labels

4. Create basic page structure
   - Landing page with placeholder content
   - Basic responsive layout

5. Configure CI/CD
   - GitHub Actions workflow for build and deploy
   - Deploy empty shell to GitHub Pages

### Tests

- Build succeeds without errors
- Static export generates valid HTML
- GitHub Pages deployment works

### Deliverable

A deployed, empty SvelteKit app at `https://cesdperez.github.io/raceframe` with Tailwind styling and fonts configured.

---

## [DONE] Phase 2: GPX Processing

**Goal:** Parse GPX files and extract route data with full test coverage.

### Tasks

1. Create GPX parsing module (`src/lib/utils/gpx.ts`)
   - Install `@tmcw/togeojson`
   - Parse GPX XML to GeoJSON
   - Extract coordinates array
   - Handle multiple tracks/segments

2. Create geo utilities (`src/lib/utils/geo.ts`)
   - Calculate total distance using Haversine formula
   - Extract start/end times from GPX metadata
   - Calculate elapsed time
   - Calculate average pace

3. Create formatting utilities (`src/lib/utils/format.ts`)
   - Format time as `HH:MM'SS"`
   - Format distance with unit (km/miles)
   - Format pace per km/mile
   - Format date

4. Define TypeScript types (`src/lib/types/index.ts`)
   - `GPXData` interface
   - `PosterData` interface
   - Theme and color types

### Tests

- Parse valid GPX file and extract coordinates
- Calculate correct distance for known route
- Handle GPX with missing metadata gracefully
- Handle malformed GPX with appropriate error
- Format time/distance/pace correctly
- Handle edge cases (zero distance, no timestamps)

### Deliverable

A tested GPX processing module that converts GPX files to structured data ready for display.

---

## [DONE] Phase 3: File Upload & State Management

**Goal:** Allow users to upload GPX files and manage application state.

### Tasks

1. Create Svelte store (`src/lib/stores/poster.ts`)
   - Reactive state for poster data using Svelte 5 runes
   - Store GPX data, user inputs, theme, colors
   - Derived values for formatted display

2. Create FileUpload component (`src/lib/components/FileUpload.svelte`)
   - Drag-and-drop zone
   - File input fallback
   - File type validation (.gpx only)
   - Loading state during parsing
   - Error display for invalid files

3. Wire up landing page
   - Display FileUpload component
   - On successful upload, populate store with parsed data
   - Transition to editor view

### Tests

- FileUpload accepts .gpx files
- FileUpload rejects non-GPX files
- Store updates correctly when GPX is parsed
- Drag-and-drop works
- Error messages display for invalid files

### Deliverable

A working file upload that parses GPX and stores the data, with visual feedback for success/failure states.

---

## [DONE] Phase 4: Map Rendering

**Goal:** Display the route on an interactive map within the poster preview.

### Tasks

1. Install and configure Leaflet
   - Install `leaflet` and types
   - Handle SSR (Leaflet requires browser APIs)

2. Create PosterMap component (`src/lib/components/PosterMap.svelte`)
   - Initialize Leaflet map
   - Use CartoDB tiles (Positron for light, Dark Matter for dark themes)
   - Disable all interactions (zoom, pan, drag)
   - Auto-fit bounds to route with padding

3. Render route on map
   - Draw polyline from coordinates
   - Apply route color from settings
   - Add circle markers for start (green) and finish (red)

4. Handle tile loading
   - Wait for tiles to load before marking map as ready
   - Loading indicator while tiles load

### Tests

- Map renders without errors
- Route polyline appears on map
- Map bounds fit the route
- Theme change updates tile layer
- Route color change updates polyline

### Deliverable

A map component that displays the GPX route with correct styling, ready to be embedded in the poster.

---

## Phase 5: Poster Layout & Preview

**Goal:** Create the full poster layout with live preview.

### Tasks

1. Create PosterPreview component (`src/lib/components/PosterPreview.svelte`)
   - Fixed aspect ratio container (1600x2240 base)
   - Scale to fit viewport while maintaining ratio
   - Background color from theme

2. Implement poster sections
   - Header: Race name, date
   - Map area: PosterMap component (~60% height)
   - Divider line
   - Runner info: Name, bib number
   - Stats row: Distance, time, pace

3. Apply typography
   - Oswald for race name, runner name, stats values
   - Inter for labels
   - Correct font weights and sizes from PRD

4. Theme system implementation
   - Light, Dark, Midnight, Forest themes
   - CSS custom properties for theme colors
   - Theme context/store

### Tests

- Poster renders with all sections visible
- Text scales proportionally with poster
- Theme changes apply correctly
- All data from store displays in correct positions

### Deliverable

A complete poster preview that displays all race data with correct layout and typography.

---

## Phase 6: Editor Panel

**Goal:** Allow users to customize all poster content and styling.

### Tasks

1. Create EditorPanel component (`src/lib/components/EditorPanel.svelte`)
   - Sidebar layout (desktop) / bottom sheet (mobile)
   - Organized input sections

2. Implement input fields
   - Runner name (text)
   - Race name (text)
   - Finish time (text, pre-filled from GPX)
   - Date (date picker, pre-filled from GPX)
   - Distance (number + unit, pre-filled from GPX)
   - Bib number (optional text)
   - City (optional text)

3. Implement style controls
   - Theme selector (radio/buttons)
   - Route color picker (color swatches)
   - Unit toggle (km/miles)

4. Wire inputs to store
   - Two-way binding with poster store
   - Live preview updates on change

### Tests

- All inputs update the store
- Preview updates immediately on input change
- Theme selector changes poster theme
- Color picker changes route color
- Unit toggle converts distance and pace

### Deliverable

A fully functional editor that allows customization of all poster elements with live preview.

---

## Phase 7: Export Functionality

**Goal:** Export the poster as a high-resolution PNG.

### Tasks

1. Create export utilities (`src/lib/utils/export.ts`)
   - Install `modern-screenshot`
   - Function to capture poster at 2x scale
   - Function to capture poster at 4x scale (300 DPI)
   - Generate filename from race name and date

2. Create ExportButton component (`src/lib/components/ExportButton.svelte`)
   - Button with resolution options (2x, 4x)
   - Loading state during export
   - Trigger download of PNG

3. Handle export edge cases
   - Wait for map tiles to fully load
   - Handle CORS for tile images
   - Show error if export fails

### Tests

- Export produces valid PNG file
- Exported image has correct dimensions
- Filename includes race name and date
- Loading state shows during export
- Error handling for failed exports

### Deliverable

Working export functionality that produces print-ready PNG files at multiple resolutions.

---

## Phase 8: Polish & Production Readiness

**Goal:** Final polish, error handling, and production deployment.

### Tasks

1. Error handling
   - Global error boundary
   - User-friendly error messages
   - Graceful degradation

2. Loading states
   - Skeleton loaders for components
   - Progress indicators where appropriate

3. Responsive design
   - Mobile-friendly editor layout
   - Touch-friendly controls
   - Responsive poster preview

4. Accessibility
   - Keyboard navigation
   - ARIA labels
   - Color contrast compliance

5. Performance optimization
   - Lazy load Leaflet
   - Optimize bundle size
   - Preload fonts

6. Final deployment
   - Verify GitHub Pages deployment
   - Test on multiple browsers
   - Test on mobile devices

### Tests

- Application works on Chrome, Firefox, Safari, Edge
- Mobile layout is usable
- No console errors in production
- Lighthouse score > 90

### Deliverable

Production-ready application deployed to GitHub Pages, working across all modern browsers and devices.

---

## Testing Strategy

### Unit Tests
- GPX parsing logic
- Geo calculations (distance, pace)
- Formatting functions
- Store mutations

### Component Tests
- FileUpload interactions
- EditorPanel input handling
- Theme switching
- Export button states

### Integration Tests
- Full flow: upload → edit → export
- Different GPX file formats
- Error scenarios

### Manual Testing Checklist
- [ ] Upload various GPX files (Strava, Garmin, Polar exports)
- [ ] Test all theme combinations
- [ ] Test all route colors
- [ ] Export at both resolutions
- [ ] Print exported PNG at actual size
- [ ] Test on mobile devices

---

## Timeline Overview

| Phase | Focus | Dependencies |
|-------|-------|--------------|
| 1 | Project Foundation | None |
| 2 | GPX Processing | Phase 1 |
| 3 | File Upload & State | Phase 2 |
| 4 | Map Rendering | Phase 3 |
| 5 | Poster Layout | Phase 4 |
| 6 | Editor Panel | Phase 5 |
| 7 | Export | Phase 5, 6 |
| 8 | Polish | All phases |

Each phase builds on the previous, with clear deliverables that can be demonstrated and tested independently.
