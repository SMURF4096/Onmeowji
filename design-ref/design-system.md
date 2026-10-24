# Design Reference — Onmyoji Codex ("Onmoyji Auto Content")

> Style & design reference, assembled 2026-10-24 from three independent sources:
>
> 1. **Declared system** — `/DESIGN.md`, `/tokens/onmyoji.json`, `/css/style.css` (v6 "Evolved Heian Night"), `/css/fonts.css`
> 2. **Live extraction** — `extract-design` skill (`designlang` ran against the locally served site; 7 pages, 4,315 elements) → `extract/`
> 3. **Runtime trace** — `reverse-engineer-anything` skill (REA static analysis of shipped `js/app.js`) → `rea/`
>
> Cross-check: measured browser output agrees with the declared tokens; no contradictions found.

## 1. Design Concept

**Creative North Star: "The Lacquered Archive."**

A dark Heian display case: game data set into night-lacquer surfaces with gilded edges, where each
shikigami is an *ema* plaque. **Color itself means rarity.** Density is high (279 entries must scan
instantly); ornament is scarce and always load-bearing — a gold hairline says SSR before text does.

The world contributes type, palette, density, and one signature move (the gilded shimmer sweep).
It never dictates layout, navigation, or controls.

### Measured confirmation (designlang)
- **Dominance:** `#0e0913` paints **97%** of background area — the lacquer ground is real, not decorative.
- Loud colors are scarce in painted area: shrine gold 1%, gilt ~0% — "seals, not palettes" holds in practice.
- **Live design extraction score 91/100 (A)** — Shadow consistency 100, Radius consistency 100,
  WCAG 100%, CSS tokenization 100.

## 2. Color System

### Ground & surfaces (warm indigo night)

| Token | Hex | Use |
| --- | --- | --- |
| `lacquer-night` / `--bg` | `#0e0913` | page ground + two faint radial washes (vermillion 7%, gold 5%) |
| `lacquer-soft` / `--bg-soft` | `#151022` | secondary ground |
| `inked-surface` / `--surface` | `#1b1526` | cards |
| `raised-surface` / `--surface-2` | `#251c33` | modals, menus, table headers |
| `border` | `#40304f` | default hairline |
| `border-soft` | `#2c2138` | subtle hairline |

### Ink (text)

| Token | Hex | Role |
| --- | --- | --- |
| `ink-primary` | `#efe7dd` | body (highest usage in inventory: 4,989) |
| `ink-secondary` | `#ab9f97` | secondary copy (1,097) |
| `ink-tertiary` | `#8b808f` | incidental data (836) |
| `cream` | `#f8ecdc` | text on vermillion actions |
| `gilt-soft` | `#e5cf7a` | links, gold labels, focus values (358) |

### Seals (action + rarity families)

| Token | Hex | Role |
| --- | --- | --- |
| `vermillion-seal` | `#b03027` | brand accent — primary CTA fill, active chip, stat headers, 陰 logo seal |
| `vermillion-lift` | `#d95546` | hover / headline accent |
| `shrine-gold` | `#c9a227` | *essential control* color: focus rings, `.num`, active sort, field focus borders (8.13:1 on ground) |
| `ssr-gilt` | `#d4af37` | SSR hairline + badge |
| `sr-violet` | `#9b6fd4` | SR hairline + badge |
| `r-blue` | `#5d9fd4` | R hairline + badge |
| `n-grey` | `#8b8b8f` | N hairline + badge |
| SP | inherits vermillion | SP *is* the seal color applied to cards (`--sp-rgb`) |

Every translucent accent composes from RGB triplet tokens: `rgb(var(--gold-rgb) / a)`,
`rgb(var(--verm-rgb) / a)`, `rgb(var(--ssr-rgb) / a)` … with a per-card `--rar-rgb` override.

### Named rules

- **Full Hairline Rule** — rarity is a *complete* 1px border, 30% tint brightening to 80% on hover. Never a one-sided colored bar.
- **Seal Rule** — vermillion fills at most one interaction point per viewport (primary CTA or active chip). **Gold never fills; it traces.**
- **Accessibility (measured):** 100% WCAG score, 0 failing color pairs; sampled pair `#ab9f97` on `#1b1526` = 6.89:1 AA/AAA-grade. Primary-on-page contrast reaches AAA (19,68:1 white-equivalent scale).

## 3. Typography

| Face | Weights | Source | Domain |
| --- | --- | --- | --- |
| **Marcellus** | 400 | self-hosted woff2 (latin + latin-ext) | Latin display only |
| **Zen Old Mincho** | 500, 700 | self-hosted woff2 (latin subsets; CJK falls to system Yu Mincho / Hiragino Mincho) | names, prose, everything serif |
| **System sans** | 400 | system-ui stack | data: chips, tables, counts — `tabular-nums` throughout |

### Hierarchy

- **Display** — Marcellus 400, `clamp(2.4rem, 6vw, 4rem)`, lh 1.12, hero only; `.accent` span in vermillion-lift.
- **Headline** — Marcellus 400, 1.8rem; modal name 1.6rem.
- **Title** — Mincho 700, 0.9–1rem (card, skill names).
- **Body** — Mincho 500, 0.93rem / 1.6 (white-space: pre-line so wiki `<br>` survives).
- **Label** — Mincho 500 caps, 0.85rem, 0.2em tracking, gilt-soft ("INTRODUCTION", "SKILLS").
- **Data** — system sans 0.76–0.85rem, `tabular-nums`.

Named rules: **Twice-Sized Rule** — display ≥ 2.5× body; section heads never shrink to bold-body.
The site is **fully offline**: no network fonts, ever.

## 4. Layout

- Single shared `.wrap` container: max **1240px**, `clamp(1rem, 4vw, 3rem)` inline padding.
- **Mobile-first**: base styles are the phone layout; a single `min-width: 720px` layer restores desktop
  (vertical writing-mode hero, row modal head, soul-row effects column, sticky offsets).
- Four breakpoints measured (720px is the primary layer); 95 grids + 904 flex containers, but templates
  repeat — card walls are `auto-fill minmax(150px, 1fr)`; the featured wall takes one full-width anchor card (`.lead`, art left / name right on desktop).
- Sticky toolbar at `top: 56px` under the sticky nav; section rhythm 48px; headings have more space above than below.
- Z-index is a strict 4-layer map: sticky (nav 50, toolbar 40–60) › modal backdrop (100) › bell.

## 5. Elevation & Depth

Depth is **tonal layering first**: page → card → raised, plus 1px hairlines. Shadows exist only as *response*.

| Shadow | Token | Use |
| --- | --- | --- |
| modal | `--shadow: 0 12px 32px rgb(0 0 0 / .5), 0 2px 8px / .4` | the one standing shadow (dialog) |
| lift | hover-only | cards `translateY(-6px)` + rarity-tinted 24px halo at 12% |
| press | inset 6px black at 35% | active state on buttons |

Named rule: **Hairline-First** — if separation can be a 1px border + a tone step, it is; a shadow must answer a state.

## 6. Shapes

- Radius families (measured: exactly **4 unique values**, 100% consistency): **12px** cards/modals/menus,
  **8px** buttons/inputs/soul-rows/thumbs, **999px** pills for badges/chips, plus the seal's 7px.
- Borders are always complete hairlines; modal edge is a plain full border (old gradient top strip was removed).
- Sheen lane: skewed gradient `skewX(-18deg)`, hero-only, clipped by card `overflow: hidden`.

## 7. Components

### Buttons (2 variants, measured 100% radius consistency)
- **Primary:** vermillion gradient (seal → deep), cream text (5.47:1), seal-tinted shadow; hover lifts 2px.
- **Ghost:** transparent, hairline border, ink text; hover tints gilt-soft.
- **States (all required):** hover / focus-visible (2px gold ring, 2px offset) / active (inset press) / disabled (45% opacity) / loading (label stays 5.47:1, spinner lane).

### Chips
Pill, transparent, hairline, secondary ink, sans 0.12em tracking. Selected: vermillion fill, cream text, no border.

### Cards (ema plaques) — 317 card instances measured
- 12px radius, `overflow: hidden`; background inked-surface gradient (raised → surface at 165deg).
- Full 1px rarity hairline (30% → 80% on hover); padding 10/10/14; art aspect-ratio 1:1,
  `object-fit: contain`, 8px radius, rarity-washed radial plate.
- **Signature:** SSR/SP gilded shimmer sweep on hover + slow idle sweep, staggered per card via `--sheen-st`.
- Error state: `img-err` swaps to an initial-letter ornament in the rarity tint (never fabricated art).
- Keyboard: `role=button`, gold focus ring, delegated Enter/Space activation.

### Search input
Surface fill, 8px, drawn SVG icon; hover border tertiary, focus **gold border + 3px gold halo ring**.

### Sort listbox
Custom menu (never a native `<select>`): trigger with rotating chevron, absolute raised panel (12px, modal shadow), gold-tinted option hover. Full keyboard parity: open/rove/Escape/click-outside.

### Modal
760px cap (wide 940px), raised gradient, standing shadow; entrance: backdrop fade + panel rise (320ms), hero art +100ms, sections stagger 120–300ms; 40px tap-size close; Escape closes.

### Navigation
Sticky lacquer bar with blur; active link: gilt-soft text + 2px vermillion underline; horizontally scrollable on phones with edge-fade affordance.

## 8. Motion

- **Feel: expressive choreography, response-only.** Staggered IntersectionObserver reveals,
  rarity-conditioned sheen, staged modal entrances — all opt-in under `.js-fx` and gated by `prefers-reduced-motion` (content visible instantly, motion off) inside one delegated observer. Never per-frame JS.
- Core tokens: `--dur-1: 150ms`, `--dur-2: 320ms`, `--dur-3: 600ms`; spin 0.7s, sweep 0.9s, shimmer 1.4s.
- Easing pairs (measured 766 + 712 uses): `cubic-bezier(.65,0,.35,1)` (in-out) and `cubic-bezier(.22,1,.36,1)` (out).
- Animation export: `extract/127-0-0-1-motion.css` + Framer/GSAP/WAAPI/Tailwind variants.

## 9. Data & Runtime Contract (from REA)

Observed via `npx rea-agents analyze-javascript-application` on the shipped `js/` tree
(full Evidence: `rea/js-analysis.json`):

- **Exactly one source module** — `js/app.js` (43,297 bytes, 882 lines, SHA-256 `3f0fd45e…`), 7,034 AST nodes, 0 parse failures.
- **All content is data-driven** from five static `fetch` endpoints resolved `base + "<file>"` at app.js lines 22–26:
  `shikigami.json`, `souls.json`, `stats.json`, `onmyoji.json`, `bondlings.json` — same-origin, matching the "nothing from a network" rule.
- **No embedded runtime**: 0 preload entrypoints, 0 `contextBridge` APIs, 0 IPC, 0 native addons — a vanilla static page. The CSS variable layer *is* the design system implementation; there is no CSS-in-JS layer to keep in sync.

STA impediments (none observed): no bundler/webpack runtime, no third-party CDN calls in JS.

## 10. Do's and Don'ts

**Do**
- Compose translucent accents from `rgb(var(--<color>-rgb) / a)` triplet tokens; `:root` in `style.css` is the style layer, `tokens/onmyoji.json` is the token source.
- Keep every animation opt-in via `.js-fx` with a `prefers-reduced-motion` fallback.
- Size art at natural aspect (`heroFit`); art is WebP-as-png with transparent margins — never re-encode or fake-crop.

**Don't**
- Don't add emoji/pictographs/unicode glyphs as icons — icons are inline drawn SVGs (search, close, chevron, arrow) in `currentColor`.
- Don't ship a native `<select>` or a one-sided colored border anywhere.
- Don't load anything from a network; attribution stays plain-text in the footer.
- Don't fabricate missing art (e.g., Sakuya no.609); use the `img-err` ornament.

## 11. Known Issues (measured, from live extraction)

1. **23 distinct font sizes** — consider tightening the type scale (score 90/100).
2. **63% of CSS unused** by the sampled pages — consider purging if this ships as-is.
3. **482 duplicate CSS declarations** across pages.

## 12. Ready-to-use artifacts in this folder

| File | Purpose |
| --- | --- |
| `extract/127-0-0-1-design-language.md` | AI-optimized full design language (2,300+ lines measured) |
| `extract/127-0-0-1-preview.html` | Visual report: swatches, type scale, shadows, a11y |
| `extract/127-0-0-1-design-tokens.json` | W3C Design Tokens format |
| `extract/127-0-0-1-variables.css` | CSS custom properties |
| `extract/127-0-0-1-tailwind.config.js` / `-tailwind-v4.css` | Tailwind themes |
| `extract/127-0-0-1-shadcn-theme.css` | shadcn/ui theme |
| `extract/127-0-0-1-theme.js` | React/CSS-in-JS theme object |
| `extract/127-0-0-1-figma-variables.json` | Figma variables import |
| `extract/127-0-0-1-motion.*` | Motion tokens (+ Framer/GSAP/WAAPI/Tailwind) |
| `extract/screenshots/*.png` | nav, hero, buttons, cards, full-page captures |
| `extract/127-0-0-1-tokens-routes/*.json` | per-page token deltas (6 routes) |
| `rea/rea-js-design-trace.md` | REA runtime/design wiring summary |
| `rea/js-analysis.json` | full REA Evidence (7.9 MB) |

---

## 13. Addendum — design system v7 "The Black Gallery" (ArcanaMana restyle, 2026-10-24)

**Sections 1–12 above document v6 "Evolved Heian Night" and are historical as of this addendum.**
The site was restyled into the ArcanaMana language extracted from `https://arcanamana.com/` — see
`arcanamana/arcanamana-design-reference.md` for the reference and `restyle-plan.md` for the executed
plan. Implementation: `css/style.css` fully rewritten to v7; `css/fonts.css` extended (v7); all class
names and the data layer (`js/app.js` + 5 JSONs) unchanged.

### What changed

| Axis | v6 (Lacquered Archive) | v7 (Black Gallery) |
| --- | --- | --- |
| Ground | `#0e0913` warm indigo + radial vermillion/gold washes | `#131415` flat neutral charcoal, **zero washes/gradients** |
| Surfaces | `#171214` / `#231b1d` | `#17181a` / `#1d1e21` |
| Border hairline | `#3e3239` | `#2a2b2e` |
| Text | warm parchment | cream `#f5efe4` (16.12:1 on ground), muted `#a49f95` |
| Accent | vermillion `#e64a3c` + shrine gold | a single gold family — `--vermillion` **retired into gold** (`#a67811`, hover `#c59742`, soft `#fff1bf`); SP keeps its own red `--sp-rgb: 224 85 76` |
| Type voice | Mincho serif everywhere; Marcellus accents | **Geist Mono** is the voice (body 0.9rem, uppercase 0.62–0.78rem labels); **Inter** (variable 100–900) is the display face for h1/h2/numerals; both self-hosted (OFL) in `assets/fonts/` |
| Cards | 1:1 ema plaques, 12px radius, contain-fit, full-hairline rarity, sheen sweep | **9:16 portrait plates**, `radius: 0`, `object-fit: cover`, gold plate frame `rgb(--gold-rgb / 0.4)`; rarity demoted to a hover-revealed 2px top tick + badge; sheen `display:none` |
| Wall rhythm | even rows | desktop stagger offsets via `nth-child(3n+2/3)` `margin-top` (lead card excluded) |
| Buttons | serif labels | mono uppercase 0.72rem; primary = flat gold fill `#a67811` with dark `#131415` text (5.32:1), hover `#c59742` |
| Elevation | standing modal shadow, press insets | `--shadow: 0 4px 12px rgb(0 0 0 / 0.35)` (menus + modal only), `--shadow-soft` = the single hover shadow; no `backdrop-filter` (modal backdrop is `rgb(5 5 6 / 0.7)`) |
| theme-color meta | `#0e0913` | `#131415` |

### Cache-bust state

`css/fonts.css?v=7`, `css/style.css?v=19`, `js/app.js` unchanged (`?v=21`).

### Verification (`restyle-check/`)

- `designlang` re-run: **91/100 (A)**, **WCAG 100%**, fonts measured "Inter, Geist Mono",
  106 custom properties, self-hosted font files.
- Live browser checks (IntersectionObserver reveal + stagger choreography all firing):
  - `restyle-check/live-wall.png` — featured wall: gold-framed 9:16 plates, staggered rhythm, mono captions
  - `restyle-check/live-shikigami.png` — 279-card roster wall
  - Detail modal verified: flat `rgb(23,24,26)` surface, gold border `rgba(166,120,17,0.45)`
- All 6 pages returned 200 and render with the new language; 2 post-restyle designlang issues remain
  (same honest-unknown category as pre-restyle), CSS tokenization 100 preserved.
- Note: card walls in `restyle-check/screenshots/*` appear blank because headless/throttled tabs in
  this environment do not fire IntersectionObserver (verified working in focused live tabs —
  `ioFired: true`, 8/8 images). Use the `live-*.png` captures as ground truth.

### Motion layer addendum (style v21, same day)

- **Load entrance:** nav rises in; hero children (`hero-mono → h1 → sub → cta`) rise with a
  0 / 0.1s / 0.24s / 0.3s stagger (`rise-in`, `backwards` fill).
- **Scroll-driven entrance:** `.sec-head` rises as it enters the viewport via
  `animation-timeline: view()` inside `@supports` — browsers without the scroll timeline
  never hide it, so no fallback class is needed; no JS.
- **Hover micro-motion:** card plates lift `translateY(-3px)` + art `scale(1.03)`;
  both disabled under `prefers-reduced-motion`.
- Fix shipped with this pass: `characters.html` nav was missing the Calendar link
  (present on all other pages).
