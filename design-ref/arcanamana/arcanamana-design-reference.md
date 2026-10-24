# ArcanaMana — Design Reference

> Reference site: `https://arcanamana.com/` · extracted 2026-10-24
> Produced with `extract-design` (designlang: 3 routes, 1,893 elements) + `reverse-engineer-anything`
> (REA: 12 JS modules, 24,731 AST nodes, 310 findings) + screenshot verification.
> Full raw outputs: `extract/` (designlang) · `rea-site-analysis.json` (REA Evidence).

## 0. What the site actually is

- **Framer-built site** (REA-confirmed: `framerusercontent.com/sites/…` runtime chunks, lazy-loaded
  route components `/`, `/draw`, `/all-cards`, plus a Google Analytics endpoint). No app-owned API —
  all content ships inside the Framer bundle.
- Page intent: tarot-card landing ("Draw a card…"), routes: home, card draw, card index.
- **Caveat:** because Framer hydrates client-side, parts of the static-extraction (blue default links
  `#0000ee`, `#000000` text ×3076, "Vuetify" detection) are pre-hydration artifacts. The screenshot
  verified design below is the source of truth where extraction and render disagree.

## 1. The Look (verified from the full-page screenshot)

**Concept: an editorial dark gallery of tarot cards.**

- **Ground:** near-black `#131415` (93% painted area — pure neutral charcoal, no color cast, no glow washes).
- **Hero:** a gigantic cream wordmark "ARCANAMA" spanning the full viewport, cut off at the edges —
  type as texture. Heavy geometric sans (Inter-black-like), lowercase-height cream `#f5efe4`.
- **Cards:** portrait **9:16 tarot cards** in a scattered masonry wall — columns of cards with
  deliberate vertical offsets, never aligned rows. Images `object-fit: cover`, **square corners (0 radius)**.
- **Gold is the frame, not the fill:** thin gold hairlines + fine line ornament frames around every
  card (like gilded plate engraving). Accent gold `#a67811` paints only ~7% of area.
- **Captions:** tiny uppercase tracking-wide labels under/on each card ("THE MAGICIAN") in gold/cream.
- **Material: flat.** One soft shadow (`rgba(0,0,0,.25) 0 2px 4px`), no backdrop blur, 1 gradient total.

## 2. Tokens (measured)

### Color

| Role | Value | Notes |
| --- | --- | --- |
| page ground | `#131415` | 93% dominance |
| primary accent (gold) | `#a67811` → OKLCH ramp `#fff1bf…#2e1a00` | frames, seals, small accents |
| secondary (cream) | `#f5efe4` → warm ramp `#f5efe4…#211e1a` | text + wordmark |
| semantic pairs | cream on `#131415` = 16.12:1 AAA · gold fill = 5.32:1 AA |

### Typography

- Families: **Inter** (600/700/900, self-hosted) for display/wordmark; **Geist Mono** (400/600/700, CDN)
  for labels/body; Bellefair + Collidge as decorative carriers.
- Static HTML scale: 16px display / 14px body (lh 24) / 12px small — all weight 400 pre-hydration;
  the *rendered* hero wordmark is a 900-weight display treatment at viewport scale.
- Scale ratio 1.125 (major second); no fluid type — sizes fixed per breakpoint.

### Spacing & shape

- Base unit **2px**; measured spacings 2 / 24 / 32 / 40 / 52 / 80px; flex gaps 2–24px.
- **Radii: 6px (controls) / 16px (panels) / 28px (chips & small circles); images always 0.**
- Flex-first layout: 234 flex containers, 0 grids. Breakpoints 810px / 1279px.
- Z-index: 3 clean layers (base 0–5, sticky 13, dropdown 999).

## 3. Motion & components

- Motion is quiet: `transition: all` (Framer-generated), no keyframe animations detected, one
  gradient. Fit-to-motion: not expressive — the design carries itself with type + imagery.
- Detected component patterns are minimal (links at 12px mono); buttons/cards/nav are Framer
  structures worth imitating, not CSS to copy.
- Design-system score by designlang: **93/100 (A)** — 100s in color/typography/spacing/shadow/radius/a11y discipline;
  weaknesses: 10 `!important` rules, Framer CSS bloat (79% unused, 894 duplicate declarations).

## 4. REA trace summary (design-relevant wiring)

- 12 parsed EC modules of a 13-chunk shipped tree (`index.html` + `framerusercontent` `.mjs` chunks);
  1 skipped non-JS file; SHA-256 anchored Evidence in `rea-site-analysis.json`.
- Findings are Framer runtime internals (module graphs, lazy `./<hash>.mjs` route chunks) + the
  analytics endpoint `https://www.googletagmanager.com/gtag/js?id=G-SLPS9WL4DK`.
- **Zero app-owned design tokens in JS** — the design system lives in Framer-generated CSS, i.e. it is
  fully reproducible with plain CSS tokens (variables.css / tokens.json in `extract/`).

## 5. Ready-to-use artifacts in this folder

| File | Purpose |
| --- | --- |
| `extract/arcanamana-com-design-language.md` | AI-optimized full design language |
| `extract/arcanamana-com-preview.html` | visual report (swatches, type, shadows, a11y) |
| `extract/arcanamana-com-design-tokens.json` / `-variables.css` | W3C tokens / CSS custom properties |
| `extract/arcanamana-com-tailwind.config.js` / `-tailwind-v4.css` / `-shadcn-theme.css` | framework themes |
| `extract/arcanamana-com-theme.js` / `-figma-variables.json` | React + Figma handoff |
| `extract/arcanamana-com-motion.css` (+ framer/gsap/waapi variants) | motion exports |
| `extract/arcanamana-com-tokens-routes/*.json` | per-route token deltas (/, /draw, /all-cards) |
| `extract/screenshots/full-page.png` | verified look of the design |
| `rea-site-analysis.json` | full REA Evidence |
