# Design Language: Onmyoji Codex

> Extracted from `http://127.0.0.1:8431` on October 24, 2026
> 176 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#a67811` | rgb(166, 120, 17) | hsl(41, 81%, 36%) | 12 |
| Secondary | `#d4af37` | rgb(212, 175, 55) | hsl(46, 65%, 52%) | 14 |
| Accent | `#e0554c` | rgb(224, 85, 76) | hsl(4, 70%, 59%) | 2 |

### Tonal Ramps

Generated in OKLCH from each role colour, so the steps are perceptually even. The site's own colour keeps its position in the ladder.

| Role | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| primary | `#fff1bf` | `#ffe5ae` | `#f8d395` | `#e3b971` | `#c59742` | **`#a67811`** | `#8e6300` | `#754e00` | `#613f00` | `#503200` | `#2e1a00` |
| secondary | `#fff4b5` | `#ffe8a3` | `#f2d788` | **`#d4af37`** | `#bf9c26` | `#a17d00` | `#896700` | `#705200` | `#5d4200` | `#4c3500` | `#2c1c00` |
| accent | `#ffdbcf` | `#ffccc0` | `#ffb7aa` | `#ff988b` | `#f76f64` | **`#e0554c`** | `#b93732` | `#9a2522` | `#821817` | `#6c0e0e` | `#410103` |
| neutral | `#f9f5ee` | `#eee9e2` | `#ddd8d0` | `#c5bfb6` | `#a59f95` | **`#878177`** | `#716b62` | `#5b564e` | `#4a463f` | `#3c3832` | `#211e1a` |

### Semantic Pairs

| Role | Background | Foreground | Contrast | Level |
|------|------------|------------|----------|-------|
| `surface.page` | `#131415` | `#ffffff` | 18.44:1 | AAA |
| `surface.raised` | `#a67811` | `#131415` | 4.67:1 | AA |
| `action.primary` | `#a67811` | `#131415` | 4.67:1 | AA |
| `action.secondary` | `#d4af37` | `#131415` | 8.77:1 | AAA |
| `action.accent` | `#e0554c` | `#131415` | 4.89:1 | AA |

### Dominance

Share of painted background area — what the page looks like, as opposed to what it declares most often.

- `#17181a` — 91%
- `#1d1e21` — 8%
- `#a67811` — 1%
- `#d4af37` — 0%
- `#e0554c` — 0%

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#878177` | hsl(37, 6%, 50%) | 71 |
| `#a49f95` | hsl(40, 8%, 61%) | 34 |
| `#ffffff` | hsl(0, 0%, 100%) | 20 |
| `#17181a` | hsl(220, 6%, 10%) | 18 |
| `#1d1e21` | hsl(225, 6%, 12%) | 13 |
| `#2a2b2e` | hsl(225, 5%, 17%) | 1 |
| `#050506` | hsl(240, 9%, 2%) | 1 |

### Background Colors

Used on large-area elements: `#131415`, `#a67811`, `#17181a`, `#1d1e21`

### Text Colors

Text color palette: `#ffffff`, `#f5efe4`, `#131415`, `#a49f95`, `#fff1bf`, `#878177`, `#c59742`, `#f1958d`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#f5efe4` | text, border | 159 |
| `#878177` | text, border | 71 |
| `#a49f95` | text, border | 34 |
| `#fff1bf` | text, border | 33 |
| `#ffffff` | text, border | 20 |
| `#17181a` | background, text, border | 18 |
| `#d4af37` | background, border | 14 |
| `#1d1e21` | border, background | 13 |
| `#a67811` | background, border | 12 |
| `#c59742` | text, border | 6 |
| `#e0554c` | background, border | 2 |
| `#2a2b2e` | border | 1 |
| `#f1958d` | text | 1 |
| `#050506` | background | 1 |

## Typography

### Font Families

- **Inter** — used for all (10 elements)
- **Geist Mono** — used for mono (76 elements)

### Type System

- **Scale ratio** — 1.125 (major second), anchored at 13.6px · 95% of sizes sit on the ladder
- **Measure** — ~74 characters per line (comfortable, low confidence from 1 sample)
- **Fluid type** — 2 clamp/viewport font sizes, 16px → 120px

### Named Scale

| Role | Size | Weight | Line Height | Tracking |
|------|------|--------|-------------|----------|
| `h1` | 115.2px / 7.2rem | 900 | 109.44px | -2.304px |
| `title-1` | 35.2px / 2.2rem | 700 | 38.72px | normal |
| `h2` | 25.6px / 1.6rem | 900 | 43.52px | -0.256px |
| `title-2` | 22.4px / 1.4rem | 900 | 31.36px | -0.224px |
| `title-3` | 17.6px / 1.1rem | 400 | 29.92px | 1.056px |
| `title-4` | 16.8px / 1.05rem | 700 | 28.56px | 1.92px |
| `title-5` | 16px / 1rem | 400 | normal | normal |
| `title-6` | 15.2px / 0.95rem | 400 | 25.84px | normal |
| `body` | 14.4px / 0.9rem | 400 | 24.48px | normal |
| `body-sm` | 13.6px / 0.85rem | 400 | 23.12px | normal |
| `micro` | 13.12px / 0.82rem | 400 | 22.304px | normal |
| `sm-3` | 12.48px / 0.78rem | 400 | 21.216px | 1.7472px |
| `sm-4` | 12px / 0.75rem | 400 | 20.4px | normal |
| `sm-5` | 11.52px / 0.72rem | 400 | 19.584px | 1.6128px |
| `sm-6` | 11.2px / 0.7rem | 400 | 19.04px | normal |

### Fluid Declarations

```css
.hero h1 { font-size: clamp(2.6rem, 9vw, 7.5rem); }
.hero-mono { font-size: clamp(1rem, 2vw, 1.3rem); }
```

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 115.2px | 7.2rem | 900 | 109.44px | -2.304px | h1, span |
| 35.2px | 2.2rem | 700 | 38.72px | normal | div |
| 25.6px | 1.6rem | 900 | 43.52px | -0.256px | h2 |
| 22.4px | 1.4rem | 900 | 31.36px | -0.224px | strong |
| 17.6px | 1.1rem | 400 | 29.92px | 1.056px | time |
| 16.8px | 1.05rem | 700 | 28.56px | 1.92px | span |
| 16px | 1rem | 400 | normal | normal | html, head, meta, title |
| 15.2px | 0.95rem | 400 | 25.84px | normal | span |
| 14.4px | 0.9rem | 400 | 24.48px | normal | body, header, nav, div |
| 13.6px | 0.85rem | 400 | 23.12px | normal | div |
| 13.12px | 0.82rem | 400 | 22.304px | normal | p |
| 12.48px | 0.78rem | 400 | 21.216px | 1.7472px | a |
| 12px | 0.75rem | 400 | 20.4px | normal | footer, div, span, code |
| 11.52px | 0.72rem | 400 | 19.584px | 1.6128px | a, svg, path |
| 11.2px | 0.7rem | 400 | 19.04px | normal | div, span, b, a |

### Heading Scale

```css
h1 { font-size: 115.2px; font-weight: 900; line-height: 109.44px; }
h2 { font-size: 25.6px; font-weight: 900; line-height: 43.52px; }
```

### Body Text

```css
body { font-size: 14.4px; font-weight: 400; line-height: 24.48px; }
```

### Font Weights in Use

`400` (143x), `600` (22x), `700` (6x), `900` (5x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-2 | 2px | 0.125rem |
| spacing-24 | 24px | 1.5rem |
| spacing-29 | 29px | 1.8125rem |
| spacing-35 | 35px | 2.1875rem |
| spacing-40 | 40px | 2.5rem |
| spacing-44 | 44px | 2.75rem |
| spacing-48 | 48px | 3rem |
| spacing-56 | 56px | 3.5rem |
| spacing-64 | 64px | 4rem |
| spacing-88 | 88px | 5.5rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| sm | 4px | 1 |
| full | 28px | 8 |

## CSS Custom Properties

### Colors

```css
--bg: #131415;
--bg-soft: #17181a;
--border: #2a2b2e;
--border-soft: #1f2023;
--border-hi: #3a3b3f;
--muted: #a49f95;
```

### Spacing

```css
--seal-size: 34px;
```

### Typography

```css
--text: #f5efe4;
--font-serif: "Geist Mono", ui-monospace, "Cascadia Mono", "Menlo", monospace;
--font-latin: "Inter", system-ui, "Segoe UI", sans-serif;
--font-ui: "Geist Mono", ui-monospace, "Cascadia Mono", "Menlo", monospace;
```

### Shadows

```css
--shadow: 0 4px 12px rgb(0 0 0 / 0.35);
--shadow-soft: rgba(0, 0, 0, 0.25) 0px 2px 4px 0px;
```

### Radii

```css
--radius: 16px;
--radius-sm: 6px;
--radius-pill: 28px;
```

### Other

```css
--surface: #17181a;
--surface-2: #1d1e21;
--faint: #878177;
--vermillion: #a67811;
--vermillion-hi: #c59742;
--gold: #a67811;
--gold-soft: #fff1bf;
--gold-hi: #c59742;
--gold-rgb: 166 120 17;
--verm-rgb: 166 120 17;
--sp-rgb: 224 85 76;
--ssr-rgb: 212 175 55;
--sr-rgb: 155 111 212;
--r-rgb: 93 159 212;
--n-rgb: 139 139 143;
--rar-rgb: var(--gold-rgb);
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--dur-1: 150ms;
--dur-2: 320ms;
--dur-3: 600ms;
--s2: 2px;
--s3: 3px;
--s4: 4px;
--s6: 6px;
--s7: 7px;
--s8: 8px;
--s10: 10px;
--s12: 12px;
--s14: 14px;
--s16: 16px;
--s18: 18px;
--s20: 20px;
--s24: 24px;
--s26: 26px;
--ink-2: #ddd9d0;
--ink-3: #c5c0b5;
--td-ink: #c5c0b5;
--th-ink: #f5efe4;
--cream: #f5efe4;
--cream-hi: #ffffff;
--seal-ink: #131415;
--verm-lo: #8a5c0b;
--verm-deep: #754e00;
--sr-ink: #c9adf0;
--r-ink: #a4cdf5;
--sp-ink: #f1958d;
--n-ink: #b3b3b7;
--dur-spin: 0.7s;
--sweep: 0.9s;
--dur-rise: 0.5s;
--dur-sec: 0.45s;
--stg-0: 0.1s;
--stg-1: 0.12s;
--stg-2: 0.18s;
--stg-3: 0.24s;
--stg-4: 0.3s;
--t-shimmer: 1.4s;
--wrap-max: 1240px;
--modal-w: 760px;
--modal-w-wide: 800px;
--search-max: 380px;
--search-basis: 240px;
--tap: 40px;
--soul-ico: 46px;
--skill-ico: 52px;
--buff-ico: 30px;
--buff-ico-sm: 18px;
--buff-ico-xs: 22px;
--skill-col: 58px;
--type-w: 72px;
--toolbar-top: 56px;
--avatar: 120px;
--avatar-lg: 132px;
--grid-min: 150px;
--skel-h: 210px;
--lead-min: 180px;
--lead-mid: 220px;
--lead-lg: 300px;
--lead-vw: 26vw;
--lead-hi: 280px;
--lead-min-m: 180px;
--lead-mid-m: 40vw;
--lead-hi-m: 280px;
--lead-cap: 320px;
```

### Dependencies

```css
0: --gold-rgb;
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| xs | 360px | min-width |
| 560px | 560px | max-width |
| sm | 620px | max-width |
| md | 720px | min-width |

## Transitions & Animations

**Easing functions:** `cubic-bezier(0.65, 0, 0.35, 1)`, `cubic-bezier(0.22, 1, 0.36, 1)`

**Durations:** `0.15s`, `0.32s`

### Common Transitions

```css
transition: all;
transition: color 0.15s cubic-bezier(0.65, 0, 0.35, 1), border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1);
transition: border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), color 0.15s cubic-bezier(0.65, 0, 0.35, 1), background-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1);
transition: border-color 0.32s cubic-bezier(0.65, 0, 0.35, 1);
transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1);
transition: border-color 0.32s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1), transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
transition: filter 0.32s cubic-bezier(0.65, 0, 0.35, 1), transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
transition: color 0.15s cubic-bezier(0.65, 0, 0.35, 1);
```

### Keyframe Animations

**btn-spin**
```css
@keyframes btn-spin {
  100% { transform: rotate(360deg); }
}
```

**rise-in**
```css
@keyframes rise-in {
  0% { opacity: 0; transform: translateY(var(--s14)); }
}
```

**nav-in**
```css
@keyframes nav-in {
  0% { opacity: 0; transform: translateY(calc(var(--s10) * -1)); }
}
```

**menu-in**
```css
@keyframes menu-in {
  0% { opacity: 0; transform: translateY(calc(var(--s6) * -1)); }
}
```

**bd-in**
```css
@keyframes bd-in {
  0% { opacity: 0; }
}
```

**md-in**
```css
@keyframes md-in {
  0% { opacity: 0; transform: translateY(var(--s16)) scale(0.97); }
}
```

**hero-rise**
```css
@keyframes hero-rise {
  0% { opacity: 0; transform: translateY(var(--s14)) scale(0.98); }
}
```

**sec-in**
```css
@keyframes sec-in {
  0% { opacity: 0; transform: translateY(var(--s10)); }
}
```

**shimmer**
```css
@keyframes shimmer {
  100% { background-position: -200% 0px; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (10 instances)

```css
.buttons {
  background-color: rgb(23, 24, 26);
  color: rgb(245, 239, 228);
  font-size: 14.4px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

### Cards (13 instances)

```css
.cards {
  background-color: rgb(23, 24, 26);
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (11 instances)

```css
.links {
  color: rgb(164, 159, 149);
  font-size: 12.48px;
  font-weight: 400;
}
```

### Navigation (2 instances)

```css
.navigation {
  background-color: rgba(19, 20, 21, 0.88);
  color: rgb(245, 239, 228);
  padding-top: 12.8px;
  padding-bottom: 12.8px;
  padding-left: 48px;
  padding-right: 48px;
  position: sticky;
}
```

### Footer (1 instances)

```css
.footer {
  color: rgb(135, 129, 119);
  padding-top: 35.2px;
  padding-bottom: 48px;
  font-size: 12px;
}
```

### Modals (1 instances)

```css
.modals {
  background-color: rgba(5, 5, 6, 0.7);
  border-radius: 0px;
  padding-top: 19.2px;
  padding-right: 19.2px;
}
```

### Badges (13 instances)

```css
.badges {
  background-color: rgba(212, 175, 55, 0.08);
  color: rgb(255, 241, 191);
  font-size: 9.6px;
  font-weight: 600;
  padding-top: 2px;
  padding-right: 8px;
  border-radius: 28px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 2 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgb(166, 120, 17);
  color: rgb(19, 20, 21);
  padding: 10.4px 24px 10.4px 24px;
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0);
  font-size: 11.52px;
  font-weight: 400;
```

**Variant 2** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(245, 239, 228);
  padding: 10.4px 24px 10.4px 24px;
  border-radius: 6px;
  border: 1px solid rgb(42, 43, 46);
  font-size: 11.52px;
  font-weight: 400;
```

### Card — 5 instances, 1 variant

**Variant 1** (5 instances)

```css
  background: rgb(23, 24, 26);
  color: rgb(245, 239, 228);
  padding: 17.6px 20.8px 17.6px 20.8px;
  border-radius: 6px;
  border: 1px solid rgb(31, 32, 35);
  font-size: 14.4px;
  font-weight: 400;
```

### Button — 8 instances, 1 variant

**Variant 1** (8 instances)

```css
  background: rgb(23, 24, 26);
  color: rgb(245, 239, 228);
  padding: 20px 16px 20px 16px;
  border-radius: 0px;
  border: 1px solid rgba(166, 120, 17, 0.4);
  font-size: 14.4px;
  font-weight: 400;
```

## Layout System

**5 grid containers** and **32 flex containers** detected.

### The System

- **Content column** — 1240px wide, 48px gutters (4% edge density)
- **Column system** — 6 columns
- **Section rhythm** — 56px vertical padding (ladder: 20px · 35px · 48px · 56px · 64px)
- **Gap scale** — 2.4px · 6px · 8px · 11.2px · 16px · 19.2px · 28.8px · 40px
- **Fluid layout** — 4 clamp/viewport declarations

```css
.nav { padding: 0.8rem clamp(1rem, 4vw, 3rem); }
.wrap { padding: 0px clamp(1rem, 4vw, 3rem); }
.modal { width: min(var(--modal-w), 94vw); }
.modal.modal-wide { width: min(var(--modal-w-wide), 96vw); }
```

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1240px | 48px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 2-column | 2x |
| 6-column | 2x |
| 1-column | 1x |

### Grid Templates

```css
grid-template-columns: 177.328px 177.328px 177.328px 177.344px 177.328px 177.328px;
gap: 16px;
grid-template-columns: 53.5625px 1050.44px;
gap: 40px;
grid-template-columns: 300px 116.656px;
gap: 0px 32px;
grid-template-columns: 216px 216px 216px 216px 216px 0px;
gap: 16px;
grid-template-columns: 34px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 14x |
| row/wrap | 10x |
| column/nowrap | 8x |

**Gap values:** `0px 32px`, `2.4px 9.6px`, `6px`, `8px`, `8.8px`, `11.2px`, `16px`, `19.2px`, `28.8px`, `40px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 2 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#131415` | `#a67811` | 4.67:1 | AA |

## Design System Score

**Overall: 91/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 92/100 |
| Typography Consistency | 82/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 85/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 65% of CSS is unused — consider purging
- 552 duplicate CSS declarations

## Z-Index Map

**2 unique z-index values** across 2 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 100,100 | div.m.o.d.a.l.-.b.a.c.k.d.r.o.p |
| sticky | 50,50 | header.n.a.v |

## SVG Icons

**1 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| xs | 1 |

**Icon colors:** `currentColor`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Marcellus | self-hosted | 400 | normal |
| Zen Old Mincho | self-hosted | 500, 700 | normal |
| Inter | self-hosted | 100 900 | normal |
| Geist Mono | self-hosted | 100 900 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| general | 8 | objectFit: contain, borderRadius: 0px, shape: square |

**Aspect ratios:** 9:16 (7x), 1:1 (1x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `150ms` | 150 |
| `md` | `320ms` | 320 |

### Easing Families

- **custom** (37 uses) — `cubic-bezier(0.65, 0, 0.35, 1)`
- **ease-out** (17 uses) — `cubic-bezier(0.22, 1, 0.36, 1)`

## Component Anatomy

### button — 10 instances

**Slots:** label
**Variants:** primary · ghost

| variant | count | sample label |
|---|---|---|
| default | 8 | SAKUYA
咲耶
SSR
No.609 |
| primary | 1 | BROWSE SHIKIGAMI |
| ghost | 1 | SOUL CATALOG |

### card — 5 instances


## Brand Voice

**Tone:** neutral · **Pronoun:** third-person · **Headings:** Title Case (tight)

### Top CTA Verbs

- **browse** (1)
- **soul** (1)
- **sakuya** (1)
- **iwanaga** (1)
- **sp** (1)
- **yan** (1)
- **luo** (1)
- **fuzoukozen** (1)

### Button Copy Patterns

- "browse shikigami" (1×)
- "soul catalog" (1×)
- "sakuya
咲耶
ssr
no.609" (1×)
- "iwanaga hime
岩長姫
ssr
no.608" (1×)
- "sp hououka
百羽凤凰火
ssr
no.607" (1×)
- "yan he
言和
ssr
no.606" (1×)
- "luo tianyi
洛天依
ssr
no.605" (1×)
- "fuzoukozen
不相狐禅
ssr
no.604" (1×)
- "bishamonten
毗沙门天
ssr
no.603" (1×)
- "tenkamei suzuhiko hime
天火命铃彦姬
sp
no.602" (1×)

### Sample Headings

> HEIAN NIGHTS, INKED IN VERMILLION
> COLLECTION
> NEWLY AWAKENED
> HEIAN NIGHTS, INKED IN VERMILLION
> COLLECTION
> NEWLY AWAKENED

## Page Intent

**Type:** `landing` (confidence 0.75)
**Description:** A fan-built codex for the Onmyoji game: shikigami roster, souls and stats. Data from the Onmyoji Wiki (CC BY-NC-SA).

## Section Roles

Reading order (top→bottom): nav → nav → content → hero → content → content → footer

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.9 |
| 1 | nav | — | 0.9 |
| 2 | content | HEIAN NIGHTS, INKED IN VERMILLION | 0.3 |
| 3 | hero | HEIAN NIGHTS, INKED IN VERMILLION | 0.85 |
| 4 | content | COLLECTION | 0.3 |
| 5 | content | NEWLY AWAKENED | 0.3 |
| 6 | footer | — | 0.95 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.314 |
| Shadow profile | none |
| Avg shadow blur | 0px |
| Max radius | 28px |
| backdrop-filter in use | no |
| Gradients | 0 |

## Imagery Style

**Label:** `photography` (confidence 0.167)
**Counts:** total 8, svg 0, icon 0, screenshot-like 0, photo-like 0
**Dominant aspect:** portrait
**Radius profile on images:** square

## Component Screenshots

2 retina crops written to `screenshots/`. Index: `*-screenshots.json`.

| Cluster | Variant | Size (px) | File |
|---------|---------|-----------|------|
| button--primary | 0 | 188 × 42 | `screenshots/button-primary-0.png` |
| button--ghost | 0 | 153 × 42 | `screenshots/button-ghost-0.png` |

Full-page: `screenshots/full-page.png`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
