# RaceFrame Design Guidelines

## Philosophy

**"The Finish Line Feeling"** — Every interaction should evoke the rush of crossing the finish line.

| Principle | Meaning |
|-----------|---------|
| Bold over safe | Choose impact over neutrality |
| Space creates focus | Generous whitespace, one thing at a time |
| Motion celebrates action | Animations reward user actions |
| Achievement is the hero | The poster, the stats, the moment |

---

## Color System

### Brand Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-primary` | `#ff4d00` | CTAs, active states, energy accents |
| `--brand-primary-dark` | `#e64500` | Hover/pressed states |
| `--brand-secondary` | `#1a1a2e` | Primary text, dark backgrounds |
| `--accent-gold` | `#ffd700` | Achievement highlights, secondary accents |
| `--accent-gold-dark` | `#e6c200` | Gold hover states |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#10b981` | Confirmations, start markers |
| `--warning` | `#f59e0b` | Cautions, alerts |
| `--error` | `#ef4444` | Errors, destructive actions |

### Surface Gradients

```css
--surface-warm: linear-gradient(135deg, #fffbf5 0%, #fff7ed 50%, #fef3e2 100%);
--surface-hero: linear-gradient(180deg, #fffbf5 0%, #fff 100%);
```

### Route Colors

`orange` `blue` `cyan` `yellow` `pink` `black` `white` `red` + custom picker

---

## Typography

### Font Stack

| Role | Font | Weights |
|------|------|---------|
| Headings | Barlow Condensed | 600, 700 |
| Body | Plus Jakarta Sans | 400, 500, 600 |

### Type Scale

| Element | Mobile | Desktop | Line Height |
|---------|--------|---------|-------------|
| H1 (hero) | 48px | 72-96px | 1.0 |
| H2 | 32px | 48px | 1.1 |
| H3 | 24px | 32px | 1.2 |
| Body | 16px | 16-18px | 1.5 |
| Small | 14px | 14px | 1.4 |

### Rules

- **Headings**: Uppercase for impact, tight letter-spacing (-0.02em)
- **Stats/Numbers**: Barlow Condensed, wide letter-spacing (0.05-0.15em)
- **Body**: Normal tracking, comfortable reading

---

## Spacing

### Base Unit: 8px

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon gaps, tight elements |
| `sm` | 8px | Related items grouping |
| `md` | 16px | Default component spacing |
| `lg` | 24px | Section gaps |
| `xl` | 32px | Major content sections |
| `2xl` | 48px | Hero element spacing |
| `3xl` | 64px | Landing page sections |

### Containers

| Context | Max Width | Padding (mobile/tablet/desktop) |
|---------|-----------|--------------------------------|
| Content | 1280px | 16px / 24px / 32px |
| Full bleed | 1440px | 16px / 24px / 32px |

---

## Components

### Buttons

| Variant | Style | Hover |
|---------|-------|-------|
| Primary | Orange bg, white text | Darken bg, scale(1.02) |
| Secondary | Transparent, orange border | Light orange bg |
| Ghost | No border, transparent | Subtle gray bg |

**All buttons**: 44px min height, 12px 24px padding, 8px border-radius

### Inputs

```css
/* Default */
border: 1px solid #d1d5db;
padding: 12px 16px;
border-radius: 8px;

/* Focus */
border: 2px solid var(--brand-primary);
box-shadow: 0 0 0 3px rgba(255, 77, 0, 0.2);
```

### Cards

- Border-radius: 12px (large), 8px (small)
- Shadow: `0 1px 3px rgba(0,0,0,0.1)` at rest
- Shadow hover: `0 4px 12px rgba(0,0,0,0.15)`
- Padding: 24px default

---

## Motion

### Timing

| Speed | Duration | Use Case |
|-------|----------|----------|
| Fast | 150ms | Hovers, toggles, micro-feedback |
| Normal | 300ms | Page transitions, modals |
| Slow | 500-600ms | Staggered reveals, celebrations |

### Easing

| Curve | Value | Use Case |
|-------|-------|----------|
| Default | `ease-out` | Most transitions |
| Bouncy | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful feedback |
| Smooth | `cubic-bezier(0.4, 0, 0.2, 1)` | Subtle movements |

### Patterns

**Stagger reveals** (page load):
```css
.animate-stagger-1 { animation: staggerFadeUp 0.6s ease-out 0.1s both; }
.animate-stagger-2 { animation: staggerFadeUp 0.6s ease-out 0.2s both; }
/* ...continue with 0.1s increments */
```

**Scale feedback**:
- Hover: `scale(1.02)`
- Press: `scale(0.98)`

**Fade + slide** (entry):
```css
@keyframes staggerFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Reduced Motion

Always wrap animations:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## Decorative Elements

| Element | Usage | Restraint |
|---------|-------|-----------|
| Gradient orbs | Landing page depth | Max 2-3 per view |
| Route path animation | File upload background | Single instance |
| Border glow | Upload zone highlight | Subtle pulse only |
| Shimmer | Loading states | During async only |

**Rule**: Decoratives support focus, never compete with content.

---

## Responsive

### Breakpoints

| Name | Range | Usage |
|------|-------|-------|
| Mobile | < 768px | Single column, stacked |
| Tablet | 768px - 1023px | Flexible, hybrid |
| Desktop | >= 1024px | Full layouts |

### Mobile Adaptations

- **Touch targets**: 44px minimum (buttons, links, interactive)
- **Typography**: Scale down 20-30% from desktop
- **Layouts**: Stack vertically, hide secondary info
- **Editor sidebar**: Becomes bottom sheet or full-screen modal
- **Poster preview**: Full-width with toggle for editor

### Desktop Behaviors

- **Editor**: Side-by-side preview + controls
- **Hover states**: More elaborate (scale, shadows)
- **Tooltips**: Show on hover (hide on mobile)

---

## Accessibility

### Color Contrast

| Context | Minimum Ratio |
|---------|---------------|
| Body text | 4.5:1 |
| Large text (24px+) | 3:1 |
| UI components | 3:1 |

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}
```

### Required Patterns

| Pattern | Implementation |
|---------|----------------|
| Skip link | First focusable element, jumps to `#main-content` |
| Icon buttons | Always include `aria-label` |
| Errors | Use `role="alert"` |
| Status updates | Use `aria-live="polite"` |
| Radio groups | Use `role="radiogroup"` + `role="radio"` |
| Dropdowns | Use `aria-haspopup`, `aria-expanded` |

### Screen Reader

```css
.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0, 0, 0, 0); border: 0;
}
```

---

## Quick Reference

### When adding a new screen

1. Use `--surface-warm` or white background
2. Max-width container with responsive padding
3. Stagger entry animations (0.1s increments)
4. H1 in Barlow Condensed, uppercase
5. Primary CTA in orange, 44px+ height

### When adding a component

1. Check existing patterns in `src/lib/components/`
2. Use 8px spacing grid
3. Add hover + focus states
4. Include `aria-label` if icon-only
5. Test at 320px and 1440px widths

### When changing text

1. Headings: Barlow Condensed, uppercase optional
2. Body: Plus Jakarta Sans, 16px base
3. Keep line length under 65 characters
4. Use semantic hierarchy (H1 > H2 > H3)
