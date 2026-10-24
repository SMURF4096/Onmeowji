---
name: Onmyoji Codex
description: A self-contained Heian-night encyclopedia — lacquered surfaces, gilded hairlines, rarity-carried color
colors:
  lacquer-night: "#0e0913"
  lacquer-soft: "#151022"
  inked-surface: "#1b1526"
  raised-surface: "#251c33"
  ink-primary: "#efe7dd"
  ink-secondary: "#ab9f97"
  ink-tertiary: "#8b808f"
  vermillion-seal: "#b03027"
  vermillion-lift: "#d95546"
  shrine-gold: "#c9a227"
  gilt-soft: "#e5cf7a"
  cream: "#f8ecdd"
  ssr-gilt: "#d4af37"
  sr-violet: "#9b6fd4"
  r-blue: "#5d9fd4"
  n-grey: "#8b8b8f"
typography:
  display:
    fontFamily: "Marcellus, Zen Old Mincho, serif"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "0.04em"
  name:
    fontFamily: "Zen Old Mincho, Yu Mincho, Hiragino Mincho ProN, serif"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.04em"
  body:
    fontFamily: "Zen Old Mincho, Yu Mincho, Hiragino Mincho ProN, serif"
    fontWeight: 500
    lineHeight: 1.6
  data:
    fontFamily: "system-ui, Segoe UI, Roboto, Helvetica Neue, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "12px"
  pill: "999px"
spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.vermillion-seal}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  card:
    backgroundColor: "{colors.inked-surface}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.pill}"
    padding: "6px 15px"
  menu-surface:
    backgroundColor: "{colors.raised-surface}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.sm}"
---

# Design System: Onmyoji Codex

## Overview

**Creative North Star: "The Lacquered Archive"**

The codex is a dark Heian display case: game data set into night-lacquer surfaces with gilded edges, where each shikigami is an ema plaque and color itself means rarity. Density is high (279 entries must scan instantly), ornament is scarce and always load-bearing — a gold hairline says SSR before any text does. The world contributes type, palette, density, and one signature move (the gilded shimmer sweep); it never supplies the layout, the navigation model, or the controls.

Motion is expressive choreography: staggered IntersectionObserver reveals, rarity-conditioned sheen, staged modal entrances — all gated behind `prefers-reduced-motion` and one delegated observer, never per-frame JS.

**Key Characteristics:**
- Rarity is the color system: SSR gold, SP vermillion, SR violet, R blue, N grey — full-hairline tints, never one-side bars.
- Deep, warm neutrals carry the ground; vermillion and gold are seals, not palettes.
- Marcellus for Latin display, Mincho for names and prose, system sans for data tables and controls.
- Every surface answers hover, focus-visible, active, disabled, loading, and error states.

## Colors

A near-black indigo ground with warm tinted surfaces; vermillion and gold are the only loud voices.

### Primary
- **Vermillion Seal** (#b03027): the brand accent — primary buttons, the active chip fill, stat-table headers, the 陰 logo seal. Rare enough that its appearance always means "action" or "label."
- **Vermillion Lift** (#d95546): hover and headline-accent state of the seal read on the dark ground.
- **Shrine Gold** (#c9a227): the *essential control* color — focus-visible rings, numbers (.num), active sort values, field borders on focus. Contrast on the page ground is 8.13:1.

### Secondary
- **SSR Gilt** (#d4af37): SSR card hairlines and badges.
- **SR Violet** (#9b6fd4) / **R Blue** (#5d9fd4) / **N Grey** (#8b8b8f): rarity families, used identically (hairline + badge).
- **SP** inherits the vermillion family (‑rgb tokens) — SP *is* the seal color applied to cards.

### Neutral
- **Lacquer Night** (#0e0913): page ground with two faint radial washes (vermillion 10%, gold 6%).
- **Raised Surface** (#251c33): modals, sort menus, table headers over the card surface.
- **Ink Primary / Secondary / Tertiary** (#efe7dd / #ab9f97 / #8b808f): body, secondary copy, incidental data. All AA or better against every surface.

### Named Rules
**The Full Hairline Rule.** Rarity uses a complete 1px border at 30% tint brightening to 80% on hover — never a one-sided colored bar.
**The Seal Rule.** Vermillion appears as a *fill* on at most one interaction point per viewport (primary CTA, active chip). Gold never fills; it traces.

## Typography

**Display Font:** Marcellus (fallback: Zen Old Mincho, serif) — carved Roman caps for the Latin face of the Heian world.
**Name/Body Font:** Zen Old Mincho (fallback: Yu Mincho, Hiragino Mincho ProN) — webfont latin subsets only; CJK falls through to system Mincho so the site stays fully offline.
**Data Font:** system sans stack — chips, tables, counts, listbox options, with `font-variant-numeric: tabular-nums`.

**Character:** A carved-roman over a mincho body: ceremony with legibility. Numbers are ornaments only in display positions; tables use plain sans.

### Hierarchy
- **Display** (Marcellus 400, clamp(2.4rem, 6vw, 4rem), 1.12): hero headline only, with a .accent span in vermillion-lift.
- **Headline** (Marcellus 400, 1.8rem): section heads + the modal name (1.6rem).
- **Title** (Mincho 700, 0.9–1rem): card names, skill names.
- **Body** (Mincho 500, 0.93rem, 1.6): prose, intros, skill descriptions (white-space: pre-line so wiki `<br>` data survives as line breaks).
- **Label** (mincho 500 uppercase, 0.85rem, 0.2em tracking): modal section labels ("INTRODUCTION", "SKILLS") in gilt-soft.
- **Data** (sans 0.76–0.85rem): combo previews, stat tables, count notes — tabular-nums throughout.

### Named Rules
**The Twice-Sized Rule.** Display is ≥2.5× body size; section heads never shrink to bold-body.

## Layout

Single shared `.wrap` container (max 1240px, clamp(1rem, 4vw, 3rem) inline padding), mobile-first: base styles are the phone layout and a single `min-width: 720px` layer restores desktop (vertical writing-mode hero, row modal head, soul-row effects column, sticky offsets). Grids are `auto-fill minmax(150px, 1fr)` card walls; the featured wall gets one full-width anchor card (`.lead`, art left / name right on desktop). Sticky toolbar at `top: 56px` under the sticky nav. Section rhythm is 48px block padding; headings sit above with more space above than below.

## Elevation & Depth

Depth is tonal layering first: page → card → raised surfaces, plus 1px hairlines. Shadows exist but only as *response*: the modal carries the one standing shadow (`0 12px 32px rgb(0 0 0 / .5), 0 2px 8px`); cards and buttons gain offset+blur shadows only on hover/lift. Hero art gets a drop-shadow, never the container.

### Shadow Vocabulary
- **modal** (box-shadow: var(--shadow)): standing depth for the dialog.
- **lift** (hover only): cards translateY(-6px) + rarity-tinted 24px halo at 12%.
- **press** (inset, 6px black at 35%): active state on buttons.

### Named Rules
**The Hairline-First Rule.** If separation can be a 1px border and a tone step, it is; a shadow must answer a state.

## Shapes

Radius families: 12px on cards, modals, raised surfaces (.md); 8px on buttons, inputs, soul-rows, thumbs; 999px pills on badges and chips. Borders are always complete hairlines; the modal edge is a plain full border — the old gradient top strip was removed. The sheen element is a skewed gradient lane (skewX(-18deg)) that composes hero-only, clipped by the card's overflow.

## Components

### Buttons
- **Shape:** 8px radius, sans-less serif lettering.
- **Primary:** vermillion gradient (vermillion-seal → verm-lo), cream text (5.47:1), 0 4px 18px seal-tinted shadow; hover lifts 2px and brightens the halo.
- **Ghost:** transparent, hairline border, text ink; hover tints gilt-soft.
- **States:** hover / focus-visible (2px gold ring, 2px offset) / active (inset press) / disabled (45% opacity, no-drop) / loading (rate: label stays visible 5.47:1, spinner lane follows).

### Chips
- Style: pill, transparent, hairline, secondary ink, sans uppercase 0.12em tracking.
- Selected: vermillion fill, cream text, no border.

### Cards (ema plaques)
- Corner: 12px, overflow hidden (sheen lane clips).
- Background: inked-surface gradient (raised → surface at 165deg).
- Border: full 1px rarity hairline (30% → 80% on hover).
- Padding: 10px 10px 14px; images aspect-ratio 1 with a rarity-washed radial plate.
- Signature: SSR/SP sheen sweep on hover + slow idle sweep (staggered per card via --sheen-st).
- Error state: img-err swaps to an initial-letter ornament in the rarity tint.
- Keyboard: role=button, focus-visible gold ring, Enter/Space delegated activation.

### Inputs / Search
- Surface fill, 8px radius, drawn SVG search icon left; hover border tertiary, focus border gold + 3px gold halo ring; placeholder secondary.

### Sort listbox (menu)
- Trigger button (8px, surface fill, chevron rotates when expanded, aria-expanded); absolute raised panel (12px radius, modal shadow) with gold-tinted option hover and gold selected ink. Full keyboard parity: Enter/Space/ArrowDown open + focus selected, arrows/Home/End rove, Escape closes, click-outside closes.

### Modal
- 760px cap, raised gradient, 12px, standing shadow; entrance: backdrop fade + panel rise (320ms), hero art rises with a 100ms delay, sections stagger (120–300ms); 40px tap-size close with drawn X icon; Escape closes.

### Navigation
- Sticky lacquer bar with blur; active link: gilt-soft text + 2px vermillion underline; horizontally scrollable on phones.

## Do's and Don'ts

### Do:
- **Do** compose translucent accents from `rgb(var(--<color>-rgb) / a)` triplet tokens — the CSS `:root` is the style layer; `tokens/onmyoji.json` is the token source for gates.
- **Do** keep every animation under `.js-fx` opt-in and inside the `prefers-reduced-motion` fallback (content visible instantly, motion off).
- **Do** size art with natural aspect (heroFit) — art files are WebP-as-png with transparent margins; never re-encode or fake-crop.

### Don't:
- **Don't** add emoji, pictographs, or unicode glyphs as icons — all icons are inline drawn SVGs (search, close, chevron, arrow).
- **Don't** ship a native `<select>` or a one-sided colored border anywhere.
- **Don't** load anything from a network (fonts, images, scripts); attribution stays plain-text in the footer.
- **Don't** fabricate missing art (Sakuya no.609 has none on the CDN); use the img-err initial ornament.
