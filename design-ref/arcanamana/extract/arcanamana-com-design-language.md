# Design Language: Arcanamana | Unveil the Mysteries of Your Day

> Extracted from `https://arcanamana.com` on October 24, 2026
> 1893 elements analyzed across 3 pages

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#a67811` | rgb(166, 120, 17) | hsl(41, 81%, 36%) | 82 |
| Secondary | `#f5efe4` | rgb(245, 239, 228) | hsl(39, 46%, 93%) | 186 |

### Tonal Ramps

Generated in OKLCH from each role colour, so the steps are perceptually even. The site's own colour keeps its position in the ladder.

| Role | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| primary | `#fff1bf` | `#ffe5ae` | `#f8d395` | `#e3b971` | `#c59742` | **`#a67811`** | `#8e6300` | `#754e00` | `#613f00` | `#503200` | `#2e1a00` |
| secondary | **`#f5efe4`** | `#ede9e2` | `#ddd9d0` | `#c5c0b7` | `#a49f95` | `#878177` | `#706b62` | `#5a564e` | `#4a463f` | `#3c3832` | `#211e1a` |

### Semantic Pairs

| Role | Background | Foreground | Contrast | Level |
|------|------------|------------|----------|-------|
| `surface.page` | `#131415` | `#f5efe4` | 16.12:1 | AAA |
| `action.primary` | `#a67811` | `#000000` | 5.32:1 | AA |
| `action.secondary` | `#f5efe4` | `#000000` | 18.35:1 | AAA |

### Dominance

Share of painted background area — what the page looks like, as opposed to what it declares most often.

- `#131415` — 93%
- `#a67811` — 7%
- `#f5efe4` — 0%

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#000000` | hsl(0, 0%, 0%) | 3076 |
| `#131415` | hsl(210, 5%, 8%) | 10 |

### Background Colors

Used on large-area elements: `#131415`

### Text Colors

Text color palette: `#000000`, `#0000ee`, `#f5efe4`

### Gradients

```css
background-image: linear-gradient(90deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#000000` | text, border | 3076 |
| `#0000ee` | text, border | 610 |
| `#f5efe4` | background, text, border | 186 |
| `#a67811` | background | 82 |
| `#131415` | background | 10 |

## Typography

### Font Families

- **Geist Mono** — used for mono (43 elements)

### Type System

- **Scale ratio** — 1.125 (major second), anchored at 14px · 100% of sizes sit on the ladder
- **Measure** — ~23 characters per line (narrow, low confidence from 1 sample)
- **Fluid type** — none; sizes are fixed per breakpoint

### Named Scale

| Role | Size | Weight | Line Height | Tracking |
|------|------|--------|-------------|----------|
| `display` | 16px / 1rem | 400 | normal | normal |
| `body` | 14px / 0.875rem | 400 | 24px | normal |
| `body-sm` | 12px / 0.75rem | 400 | normal | normal |

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 16px | 1rem | 400 | normal | normal | html, head, meta, title |
| 14px | 0.875rem | 400 | 24px | normal | p, span |
| 12px | 0.75rem | 400 | normal | normal | body, script, div, svg |

### Body Text

```css
body { font-size: 14px; font-weight: 400; line-height: 24px; }
```

### Font Weights in Use

`400` (1893x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-2 | 2px | 0.125rem |
| spacing-24 | 24px | 1.5rem |
| spacing-32 | 32px | 2rem |
| spacing-40 | 40px | 2.5rem |
| spacing-52 | 52px | 3.25rem |
| spacing-80 | 80px | 5rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 6px | 54 |
| lg | 16px | 55 |
| full | 28px | 18 |

## Elevation

1 levels from 1 raw shadows · neutral tint

**xs** — blur 4px, y 2px, used 55×
```css
box-shadow: rgba(0, 0, 0, 0.25) 0px 2px 4px 0px;
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| md | 809px | max-width |
| md | 810px | min-width |
| xl | 1279px | max-width |

## Transitions & Animations

### Common Transitions

```css
transition: all;
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Links (30 instances)

```css
.links {
  color: rgb(0, 0, 238);
  font-size: 12px;
  font-weight: 400;
}
```

## Layout System

**0 grid containers** and **234 flex containers** detected.

### The System

- **Gap scale** — 2px · 4px · 8px · 10px · 13px · 16px · 24px

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 44x |
| row/nowrap | 190x |

**Gap values:** `2px`, `4px`, `8px`, `10px`, `13px`, `16px`, `17px`, `24px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 0 passing, 0 failing color pairs

## Design System Score

**Overall: 93/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 100/100 |
| Typography Consistency | 100/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 50/100 |

**Strengths:** Tight, disciplined color palette, Consistent typography system, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance

**Issues:**
- 10 !important rules — prefer specificity over overrides
- 79% of CSS is unused — consider purging
- 894 duplicate CSS declarations

## Gradients

**1 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | 90deg | 2 | brand |

```css
background: linear-gradient(90deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%);
```

## Z-Index Map

**7 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 999,999 | div, div, div |
| sticky | 13,13 | div.f.r.a.m.e.r.-.G.7.g.d.b. .f.r.a.m.e.r.-.1.a.9.c.b.k.i. .f.r.a.m.e.r.-.p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e. .f.r.a.m.e.r.-.v.-.1.a.9.c.b.k.i, div.f.r.a.m.e.r.-.G.7.g.d.b. .f.r.a.m.e.r.-.1.a.9.c.b.k.i. .f.r.a.m.e.r.-.p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e. .f.r.a.m.e.r.-.v.-.1.a.9.c.b.k.i, div.f.r.a.m.e.r.-.G.7.g.d.b. .f.r.a.m.e.r.-.1.a.9.c.b.k.i. .f.r.a.m.e.r.-.p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e. .f.r.a.m.e.r.-.v.-.1.a.9.c.b.k.i |
| base | 0,5 | div.f.r.a.m.e.r.-.1.a.g.5.5.p.b, div.f.r.a.m.e.r.-.1.j.0.o.z.k.k, div.f.r.a.m.e.r.-.1.s.6.8.2.c.q. .h.i.d.d.e.n.-.k.l.r.q.j.g |

## SVG Icons

**4 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| xs | 2 |
| sm | 1 |
| xl | 1 |

**Icon colors:** `rgb(0, 0, 0)`, `#F5EFE4`, `black`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Bellefair | cdn | 400 | normal |
| Geist Mono | cdn | 400, 600, 700 | normal |
| Collidge Regular | self-hosted | 400, normal | normal |
| Inter | self-hosted | 600, 700, 900 | normal, italic |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 90 | objectFit: cover, borderRadius: 0px, shape: square |

**Aspect ratios:** 9:16 (90x)

## Page Intent

**Type:** `landing` (confidence 0.45)
**Description:** Get clarity and guidance through tarot cards. Draw a card to uncover insights and inspiration, and possibly explanations for life’s journey; or learn what each tarot cards are saying. Perfect for begi

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.412 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 28px |
| backdrop-filter in use | no |
| Gradients | 1 |

## Imagery Style

**Label:** `mixed` (confidence 0)
**Counts:** total 90, svg 0, icon 0, screenshot-like 0, photo-like 0
**Dominant aspect:** portrait
**Radius profile on images:** square

## Component Library

**Detected:** `vuetify` (confidence 0.9)

Evidence:
- 37 v-* classes

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Geist Mono` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
