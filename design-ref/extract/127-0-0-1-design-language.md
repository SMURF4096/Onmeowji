# Design Language: Onmyoji Codex

> Extracted from `http://127.0.0.1:8431` on October 24, 2026
> 4315 elements analyzed across 7 pages

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#c9a227` | rgb(201, 162, 39) | hsl(46, 68%, 47%) | 233 |
| Secondary | `#e0554c` | rgb(224, 85, 76) | hsl(4, 70%, 59%) | 184 |
| Accent | `#d4af37` | rgb(212, 175, 55) | hsl(46, 65%, 52%) | 317 |

### Tonal Ramps

Generated in OKLCH from each role colour, so the steps are perceptually even. The site's own colour keeps its position in the ladder.

| Role | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| primary | `#fff4b6` | `#ffe8a3` | `#f4d688` | `#debd61` | **`#c9a227`** | `#a27c00` | `#8a6600` | `#715100` | `#5e4200` | `#4d3400` | `#2c1c00` |
| secondary | `#ffdbcf` | `#ffccc0` | `#ffb7aa` | `#ff988b` | `#f76f64` | **`#e0554c`** | `#b93732` | `#9a2522` | `#821817` | `#6c0e0e` | `#410103` |
| accent | `#fff4b5` | `#ffe8a3` | `#f2d788` | **`#d4af37`** | `#bf9c26` | `#a17d00` | `#896700` | `#705200` | `#5d4200` | `#4c3500` | `#2c1c00` |
| neutral | `#fcf4ef` | `#f0e8e2` | `#e0d7d1` | `#c9beb7` | **`#ab9f97`** | `#8b7f78` | `#746a63` | `#5e554e` | `#4d453f` | `#3e3732` | `#231e1a` |

### Semantic Pairs

| Role | Background | Foreground | Contrast | Level |
|------|------------|------------|----------|-------|
| `surface.page` | `#0e0913` | `#ffffff` | 19.68:1 | AAA |
| `surface.raised` | `#c9a227` | `#000000` | 8.68:1 | AAA * |
| `action.primary` | `#c9a227` | `#000000` | 8.68:1 | AAA * |
| `action.secondary` | `#e0554c` | `#000000` | 5.57:1 | AA * |
| `action.accent` | `#d4af37` | `#000000` | 9.99:1 | AAA * |

\* No colour the site already uses for text reaches 4.5:1 on that surface — the foreground shown is black or white, substituted in.

### Dominance

Share of painted background area — what the page looks like, as opposed to what it declares most often.

- `#0e0913` — 97%
- `#c9a227` — 1%
- `#d4af37` — 0%
- `#1b1526` — 0%
- `#9b6fd4` — 0%
- `#000000` — 0%

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#ab9f97` | hsl(24, 11%, 63%) | 1097 |
| `#8b808f` | hsl(284, 6%, 53%) | 836 |
| `#cfc5bb` | hsl(30, 17%, 77%) | 280 |
| `#ffffff` | hsl(0, 0%, 100%) | 132 |
| `#b3b3b7` | hsl(240, 3%, 71%) | 35 |
| `#40304f` | hsl(271, 24%, 25%) | 34 |
| `#0e0913` | hsl(270, 36%, 5%) | 22 |
| `#000000` | hsl(0, 0%, 0%) | 4 |

### Background Colors

Used on large-area elements: `#0e0913`, `#c9a227`

### Text Colors

Text color palette: `#ffffff`, `#efe7dd`, `#f6e9d8`, `#ab9f97`, `#e5cf7a`, `#f8ecdc`, `#8b808f`, `#d95546`, `#f1958d`, `#b3b3b7`

### Gradients

```css
background-image: radial-gradient(1200px 600px at 85% -12%, rgba(176, 48, 39, 0.07), rgba(0, 0, 0, 0) 78%), radial-gradient(900px 500px at -12% 22%, rgba(201, 162, 39, 0.05), rgba(0, 0, 0, 0) 78%), none;
```

```css
background-image: linear-gradient(135deg, rgb(176, 48, 39), rgb(125, 31, 24));
```

```css
background-image: linear-gradient(135deg, rgb(176, 48, 39), rgb(138, 36, 28));
```

```css
background-image: linear-gradient(160deg, rgb(37, 28, 51), rgb(27, 21, 38));
```

```css
background-image: linear-gradient(165deg, rgb(37, 28, 51), rgb(27, 21, 38));
```

```css
background-image: linear-gradient(105deg, rgba(0, 0, 0, 0) 40%, rgba(233, 207, 122, 0.2) 50%, rgba(0, 0, 0, 0) 60%);
```

```css
background-image: radial-gradient(120px 90px at 50% 45%, rgba(201, 162, 39, 0.12), rgba(0, 0, 0, 0) 78%);
```

```css
background-image: linear-gradient(105deg, rgba(0, 0, 0, 0) 40%, rgba(224, 85, 76, 0.22) 50%, rgba(0, 0, 0, 0) 60%);
```

```css
background-image: linear-gradient(100deg, rgb(27, 21, 38) 30%, rgb(37, 28, 51) 50%, rgb(27, 21, 38) 70%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#efe7dd` | text, border | 4989 |
| `#ab9f97` | text, border | 1097 |
| `#8b808f` | text, border, background | 836 |
| `#e5cf7a` | text, border | 358 |
| `#d4af37` | border, background | 317 |
| `#cfc5bb` | text, border | 280 |
| `#c9a227` | background, border | 233 |
| `#9b6fd4` | border, background | 204 |
| `#e0554c` | text, border, background | 184 |
| `#ffffff` | text, border | 132 |
| `#5d9fd4` | border, background | 117 |
| `#2c2138` | border, background | 88 |
| `#c9adf0` | text | 68 |
| `#f1958d` | text | 50 |
| `#a4cdf5` | text | 39 |
| `#b3b3b7` | text | 35 |
| `#40304f` | border | 34 |
| `#0e0913` | background | 22 |
| `#1b1526` | background | 8 |
| `#b03027` | border | 7 |
| `#000000` | background | 4 |

## Typography

### Font Families

- **Zen Old Mincho** — used for all (1427 elements)
- **Marcellus** — used for all (384 elements)

### Type System

- **Scale ratio** — 1.067 (minor second), anchored at 9.92px · 100% of sizes sit on the ladder
- **Measure** — ~102 characters per line (wide)
- **Fluid type** — 2 clamp/viewport font sizes, 24px → 64px

### Named Scale

| Role | Size | Weight | Line Height | Tracking |
|------|------|--------|-------------|----------|
| `h1` | 64px / 4rem | 700 | 71.68px | 2.56px |
| `title-1` | 38.4px / 2.4rem | 400 | 61.44px | 21.12px |
| `title-2` | 35.2px / 2.2rem | 400 | 38.72px | normal |
| `h2` | 28.8px / 1.8rem | 700 | 46.08px | 2.88px |
| `title-3` | 27.2px / 1.7rem | 400 | 36.72px | 1.632px |
| `h3` | 22.4px / 1.4rem | 700 | 35.84px | normal |
| `title-4` | 20.8px / 1.3rem | 400 | 33.28px | 1.248px |
| `title-5` | 18.4px / 1.15rem | 400 | 29.44px | 2.208px |
| `title-6` | 16.8px / 1.05rem | 700 | 26.88px | 2.208px |
| `title-7` | 16.32px / 1.02rem | 400 | 26.112px | 0.816px |
| `body` | 16px / 1rem | 400 | normal | normal |
| `body-sm` | 15.2px / 0.95rem | 400 | 24.32px | 1.216px |
| `micro` | 14.4px / 0.9rem | 400 | 19.44px | 0.576px |
| `sm-3` | 14.08px / 0.88rem | 400 | normal | 0.8448px |
| `sm-4` | 13.6px / 0.85rem | 400 | 21.76px | normal |

### Fluid Declarations

```css
.hero h1 { font-size: clamp(2.4rem, 6vw, 4rem); }
.hero-mono { font-size: clamp(1.5rem, 3.4vw, 2.4rem); }
```

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 64px | 4rem | 700 | 71.68px | 2.56px | h1, span |
| 38.4px | 2.4rem | 400 | 61.44px | 21.12px | div |
| 35.2px | 2.2rem | 400 | 38.72px | normal | div |
| 28.8px | 1.8rem | 700 | 46.08px | 2.88px | h2 |
| 27.2px | 1.7rem | 400 | 36.72px | 1.632px | div, strong |
| 22.4px | 1.4rem | 700 | 35.84px | normal | h3 |
| 20.8px | 1.3rem | 400 | 33.28px | 1.248px | time |
| 18.4px | 1.15rem | 400 | 29.44px | 2.208px | a, span |
| 16.8px | 1.05rem | 700 | 26.88px | 2.208px | span, p |
| 16.32px | 1.02rem | 400 | 26.112px | 0.816px | div |
| 16px | 1rem | 400 | normal | normal | html, head, meta, title |
| 15.2px | 0.95rem | 400 | 24.32px | 1.216px | a, input, p, img |
| 14.4px | 0.9rem | 400 | 19.44px | 0.576px | div, strong, p |
| 14.08px | 0.88rem | 400 | normal | 0.8448px | button, span, svg, path |
| 13.6px | 0.85rem | 400 | 21.76px | normal | div, a, svg, path |

### Heading Scale

```css
h1 { font-size: 64px; font-weight: 700; line-height: 71.68px; }
h2 { font-size: 28.8px; font-weight: 700; line-height: 46.08px; }
h3 { font-size: 22.4px; font-weight: 700; line-height: 35.84px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: normal; }
```

### Font Weights in Use

`400` (3529x), `700` (776x), `600` (10x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-0 | 0px | 0rem |
| spacing-2 | 2px | 0.125rem |
| spacing-13 | 13px | 0.8125rem |
| spacing-24 | 24px | 1.5rem |
| spacing-26 | 26px | 1.625rem |
| spacing-29 | 29px | 1.8125rem |
| spacing-35 | 35px | 2.1875rem |
| spacing-38 | 38px | 2.375rem |
| spacing-48 | 48px | 3rem |
| spacing-56 | 56px | 3.5rem |
| spacing-64 | 64px | 4rem |
| spacing-81 | 81px | 5.0625rem |
| spacing-88 | 88px | 5.5rem |
| spacing-154 | 154px | 9.625rem |
| spacing-439 | 439px | 27.4375rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| md | 6px | 4 |
| lg | 12px | 322 |
| full | 50px | 46 |
| full | 999px | 394 |

## Elevation

3 levels from 5 raw shadows · colored tint

**xs** — blur 10px, y 2px, used 7× · tinted (hue 4°)
```css
box-shadow: rgba(176, 48, 39, 0.45) 0px 2px 10px 0px;
```

**sm** — blur 18px, y 4px, used 2× · tinted (hue 4°)
```css
box-shadow: rgba(176, 48, 39, 0.4) 0px 4px 18px 0px;
```

**md** — blur 32px, y 12px, used 1× · 2 layers
```css
box-shadow: rgba(0, 0, 0, 0.5) 0px 12px 32px 0px, rgba(0, 0, 0, 0.4) 0px 2px 8px 0px;
```

## Inset Shadows

```css
box-shadow: rgba(201, 162, 39, 0.4) 0px 0px 0px 1px inset;
```

## CSS Custom Properties

### Colors

```css
--bg: #0e0913;
--bg-soft: #151022;
--border: #40304f;
--border-soft: #2c2138;
--muted: #ab9f97;
--border-hi: #54406b;
```

### Spacing

```css
--seal-size: 34px;
```

### Typography

```css
--text: #efe7dd;
--font-serif: "Zen Old Mincho", "Yu Mincho", "Hiragino Mincho ProN", "Noto Serif JP", serif;
--font-latin: "Marcellus", "Zen Old Mincho", serif;
--font-ui: system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
```

### Shadows

```css
--shadow: 0 12px 32px rgb(0 0 0 / 0.5), 0 2px 8px rgb(0 0 0 / 0.4);
--shadow-soft: 0 6px 18px rgb(0 0 0 / 0.35);
```

### Radii

```css
--radius: 12px;
--radius-sm: 8px;
--radius-pill: 999px;
```

### Other

```css
--surface: #1b1526;
--surface-2: #251c33;
--faint: #8b808f;
--vermillion: #b03027;
--vermillion-hi: #d95546;
--gold: #c9a227;
--gold-soft: #e5cf7a;
--gold-rgb: 201 162 39;
--verm-rgb: 176 48 39;
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
--ink-2: #d4cabf;
--ink-3: #cfc5bb;
--td-ink: #cbc0b5;
--th-ink: #e8ddca;
--cream: #f8ecdc;
--cream-hi: #fff4e8;
--seal-ink: #f6e9d8;
--verm-lo: #8a241c;
--verm-deep: #7d1f18;
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
--t-breath: 7s;
--t-idle: 8s;
--t-idle-dly: 2.5s;
--wrap-max: 1240px;
--modal-w: 760px;
--modal-w-wide: 940px;
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

**Durations:** `0.15s`, `0.32s`, `0.6s`, `0.045s`, `0.09s`, `0.135s`, `0.18s`, `0.225s`, `0.27s`, `0.315s`, `0.36s`, `0.405s`, `0.45s`, `0.495s`

### Common Transitions

```css
transition: all;
transition: color 0.15s cubic-bezier(0.65, 0, 0.35, 1), border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1);
transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1), color 0.15s cubic-bezier(0.65, 0, 0.35, 1), background-color 0.15s cubic-bezier(0.65, 0, 0.35, 1);
transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1);
transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.045s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.045s, border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1);
transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.09s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.09s, border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1);
transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.135s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.135s, border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1);
transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.18s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.18s, border-color 0.15s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1);
transition: transform 0.15s cubic-bezier(0.22, 1, 0.36, 1);
transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.32s cubic-bezier(0.65, 0, 0.35, 1), box-shadow 0.32s cubic-bezier(0.65, 0, 0.35, 1);
```

### Keyframe Animations

**mono-breath**
```css
@keyframes mono-breath {
  100% { opacity: 0.85; }
}
```

**btn-spin**
```css
@keyframes btn-spin {
  100% { transform: rotate(360deg); }
}
```

**sheen-sweep**
```css
@keyframes sheen-sweep {
  0% { transform: skewX(-18deg) translateX(-80%); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: skewX(-18deg) translateX(340%); opacity: 0; }
}
```

**sheen-idle**
```css
@keyframes sheen-idle {
  0%, 12% { transform: skewX(-18deg) translateX(-80%); opacity: 0.4; }
  8% { opacity: 1; }
  24%, 100% { transform: skewX(-18deg) translateX(340%); opacity: 0; }
}
```

**menu-in**
```css
@keyframes menu-in {
  0% { opacity: 0; }
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

### Buttons (402 instances)

```css
.buttons {
  background-color: rgb(27, 21, 38);
  color: rgb(239, 231, 221);
  font-size: 16px;
  font-weight: 400;
  padding-top: 10px;
  padding-right: 10px;
  border-radius: 12px;
}
```

### Cards (317 instances)

```css
.cards {
  border-radius: 12px;
  padding-top: 10px;
  padding-right: 10px;
}
```

### Inputs (4 instances)

```css
.inputs {
  background-color: rgb(27, 21, 38);
  color: rgb(239, 231, 221);
  border-color: rgb(64, 48, 79);
  border-radius: 8px;
  font-size: 15.2px;
  padding-top: 8.8px;
  padding-right: 14.4px;
}
```

### Links (56 instances)

```css
.links {
  color: rgb(171, 159, 151);
  font-size: 15.2px;
  font-weight: 400;
}
```

### Navigation (15 instances)

```css
.navigation {
  background-color: rgba(14, 9, 19, 0.82);
  color: rgb(239, 231, 221);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 48px;
  position: static;
}
```

### Footer (7 instances)

```css
.footer {
  color: rgb(139, 128, 143);
  padding-top: 35.2px;
  padding-bottom: 48px;
  font-size: 13.6px;
}
```

### Modals (4 instances)

```css
.modals {
  background-color: rgba(8, 5, 10, 0.72);
  border-radius: 0px;
  padding-top: 19.2px;
  padding-right: 19.2px;
}
```

### Dropdowns (3 instances)

```css
.dropdowns {
  background-color: rgb(27, 21, 38);
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 12px 32px 0px, rgba(0, 0, 0, 0.4) 0px 2px 8px 0px;
  border-color: rgb(64, 48, 79);
  padding-top: 0px;
}
```

### Tables (1 instances)

```css
.tables {
  border-color: rgb(64, 48, 79);
  cell-style: [object Object];
}
```

### Badges (402 instances)

```css
.badges {
  background-color: rgba(212, 175, 55, 0.08);
  color: rgb(229, 207, 122);
  font-size: 10.56px;
  font-weight: 700;
  padding-top: 2px;
  padding-right: 8px;
  border-radius: 999px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(248, 236, 220);
  padding: 10.4px 24px 10.4px 24px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  font-size: 15.2px;
  font-weight: 400;
```

### Card — 5 instances, 1 variant

**Variant 1** (5 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(239, 231, 221);
  padding: 17.6px 20.8px 17.6px 20.8px;
  border-radius: 12px;
  border: 1px solid rgb(44, 33, 56);
  font-size: 16px;
  font-weight: 400;
```

### Button — 8 instances, 1 variant

**Variant 1** (8 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(239, 231, 221);
  padding: 20px 16px 20px 16px;
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  font-size: 16px;
  font-weight: 400;
```

## Layout System

**95 grid containers** and **904 flex containers** detected.

### The System

- **Content column** — 1240px wide, 48px gutters (4% edge density)
  - Width ladder: 680px · 1240px
- **Column system** — 7 columns
- **Section rhythm** — 56px vertical padding (ladder: 20px · 35px · 48px · 56px · 64px)
- **Gap scale** — 2.4px · 4.8px · 6px · 8px · 11.2px · 12.8px · 14px · 16px
- **Fluid layout** — 12 clamp/viewport declarations

```css
.nav { padding: 0.8rem clamp(1rem, 4vw, 3rem); }
.wrap { padding: 0px clamp(1rem, 4vw, 3rem); }
.modal { width: min(var(--modal-w), 94vw); }
.modal.modal-wide { width: min(var(--modal-w-wide), 96vw); }
.nav { padding: 0.8rem clamp(1rem, 4vw, 3rem); }
.wrap { padding: 0px clamp(1rem, 4vw, 3rem); }
```

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1240px | 48px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 4-column | 70x |
| 2-column | 11x |
| 1-column | 7x |
| 7-column | 5x |
| 6-column | 2x |

### Grid Templates

```css
grid-template-columns: 151.422px 151.422px 151.438px 151.422px 151.438px 151.422px 151.438px;
gap: 14px;
grid-template-columns: 151.422px 151.422px 151.438px 151.422px 151.438px 151.422px 151.438px;
gap: 14px;
grid-template-columns: 151.422px 151.422px 151.438px 151.422px 151.438px 151.422px 151.438px;
gap: 14px;
grid-template-columns: 151.422px 151.422px 151.438px 151.422px 151.438px 151.422px 151.438px;
gap: 14px;
grid-template-columns: 300px 90.7969px;
gap: 0px 32px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 415x |
| row/wrap | 36x |
| column/nowrap | 453x |

**Gap values:** `0px 32px`, `2.4px 9.6px`, `3px`, `4.8px`, `6px`, `6.4px`, `8px`, `8.8px`, `11.2px`, `12.8px`, `14px`, `14.4px`, `16px`, `19.2px`, `28.8px`, `40px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 1 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#ab9f97` | `#1b1526` | 6.89:1 | AA |

## Design System Score

**Overall: 91/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 92/100 |
| Typography Consistency | 90/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 100/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Consistent typography system, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 23 distinct font sizes — consider a tighter type scale
- 63% of CSS is unused — consider purging
- 482 duplicate CSS declarations

## Gradients

**10 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| radial | — | 3 | bold |
| radial | — | 3 | bold |
| linear | 135deg | 2 | brand |
| linear | 135deg | 2 | brand |
| linear | 160deg | 2 | brand |
| linear | 165deg | 2 | brand |
| linear | 105deg | 3 | bold |
| radial | — | 3 | bold |
| linear | 105deg | 3 | bold |
| linear | 100deg | 3 | bold |

```css
background: radial-gradient(1200px 600px at 85% -12%, rgba(176, 48, 39, 0.07), rgba(0, 0, 0, 0) 78%);
background: radial-gradient(900px 500px at -12% 22%, rgba(201, 162, 39, 0.05), rgba(0, 0, 0, 0) 78%);
background: linear-gradient(135deg, rgb(176, 48, 39), rgb(125, 31, 24));
background: linear-gradient(135deg, rgb(176, 48, 39), rgb(138, 36, 28));
background: linear-gradient(160deg, rgb(37, 28, 51), rgb(27, 21, 38));
```

## Z-Index Map

**4 unique z-index values** across 2 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 100,100 | div.m.o.d.a.l.-.b.a.c.k.d.r.o.p, div.m.o.d.a.l.-.b.a.c.k.d.r.o.p, div.m.o.d.a.l.-.b.a.c.k.d.r.o.p |
| sticky | 40,60 | div.t.o.o.l.b.a.r, div.t.o.o.l.b.a.r, div.t.o.o.l.b.a.r |

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

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 7 | objectFit: contain, borderRadius: 8px, shape: rounded |
| general | 1 | objectFit: contain, borderRadius: 8px, shape: rounded |

**Aspect ratios:** 1:1 (8x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `instant` | `45ms` | 45 |
| `xs` | `90ms` | 90 |
| `sm` | `180ms` | 180 |
| `md` | `270ms` | 270 |
| `lg` | `405ms` | 405 |

### Easing Families

- **custom** (766 uses) — `cubic-bezier(0.65, 0, 0.35, 1)`
- **ease-out** (712 uses) — `cubic-bezier(0.22, 1, 0.36, 1)`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `menu-in` | fade | opacity | 1 |
| `shimmer` | custom | background-position | 5 |

## Component Anatomy

### button — 10 instances

**Slots:** label
**Variants:** primary · ghost

| variant | count | sample label |
|---|---|---|
| default | 8 | Sakuya
咲耶
SSR
No.609 |
| primary | 1 | Browse Shikigami |
| ghost | 1 | Soul Catalog |

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

> Heian Nights, Inked in Vermillion
> Collection
> Newly Awakened
> Heian Nights, Inked in Vermillion
> Collection
> Newly Awakened

## Page Intent

**Type:** `landing` (confidence 0.75)
**Description:** A fan-built codex for the Onmyoji game: shikigami roster, souls and stats. Data from the Onmyoji Wiki (CC BY-NC-SA).

## Section Roles

Reading order (top→bottom): nav → nav → content → hero → content → content → footer

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | nav | — | 0.9 |
| 1 | nav | — | 0.9 |
| 2 | content | Heian Nights, Inked in Vermillion | 0.3 |
| 3 | hero | Heian Nights, Inked in Vermillion | 0.85 |
| 4 | content | Collection | 0.3 |
| 5 | content | Newly Awakened | 0.3 |
| 6 | footer | — | 0.95 |

## Material Language

**Label:** `material-you` (confidence 0.45)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.367 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 999px |
| backdrop-filter in use | no |
| Gradients | 10 |

## Imagery Style

**Label:** `photography` (confidence 0.021)
**Counts:** total 8, svg 0, icon 0, screenshot-like 0, photo-like 0
**Dominant aspect:** square-ish
**Radius profile on images:** soft

## Component Screenshots

5 retina crops written to `screenshots/`. Index: `*-screenshots.json`.

| Cluster | Variant | Size (px) | File |
|---------|---------|-----------|------|
| button--primary | 0 | 201 × 47 | `screenshots/button-primary-0.png` |
| button--ghost | 0 | 159 × 47 | `screenshots/button-ghost-0.png` |
| card--default | 0 | 216 × 148 | `screenshots/card-default-0.png` |
| card--default | 1 | 216 × 148 | `screenshots/card-default-1.png` |
| card--default | 2 | 216 × 148 | `screenshots/card-default-2.png` |

Full-page: `screenshots/full-page.png`

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Zen Old Mincho` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
