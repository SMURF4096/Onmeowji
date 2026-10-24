# design-ref/ — Onmyoji Codex Style & Design Reference

Generated 2026-10-24 using two installed OpenCode skills:

| Skill | Repo | What it did here |
| --- | --- | --- |
| `extract-design` | github.com/Manavarya09/design-extract | Served the site locally, crawled 7 pages (4,315 elements) with headless Chrome, produced 50+ files: measured design language, tokens, previews, screenshots, WCAG scoring |
| `reverse-engineer-anything` (REA) | github.com/morluto/rea | Ran static JS application analysis on the shipped `js/` tree to trace the design system's runtime wiring (Evidence-preserving, SHA-256 anchored) |

## Start here

- **`design-system.md`** — the synthesized style & design reference of the current site (final deliverable; sections 1–12 = v6, **section 13 addendum = v7 "The Black Gallery" restyle**)
- **`extract/127-0-0-1-preview.html`** — open in a browser for the visual report
- **`extract/127-0-0-1-design-language.md`** — full measured design language for AI/LLM reuse

## Restyle target: ArcanaMana (`arcanamana/`)

Reference site `https://arcanamana.com/` extracted the same way (designlang over 3 routes
+ REA over its shipped Framer chunk tree + screenshot verification):

- **`restyle-plan.md`** — actionable token-by-token plan to restyle Onmyoji Codex into the ArcanaMana language
- **`arcanamana/arcanamana-design-reference.md`** — the ArcanaMana design reference
- **`arcanamana/extract/`** — designlang raw outputs for arcanamana.com
- **`arcanamana/rea-site-analysis.json`** — REA Evidence of the Framer runtime

## Result: the restyle was applied (`restyle-check/`)

The full restyle shipped in `css/style.css` v7 ("The Black Gallery") + `css/fonts.css` v7
(Inter + Geist Mono self-hosted) + all 6 HTML pages. Data layer untouched.

- **`restyle-check/http-127-0-0-1-design-language.md`** — post-restyle measured language: **91/100 (A), WCAG 100%**, fonts "Inter, Geist Mono", 106 CSS custom properties, 4 self-hosted fonts
- **`restyle-check/live-wall.png`** / **`restyle-check/live-shikigami.png`** — live browser captures: gold-framed 9:16 tarot plates, staggered wall rhythm, mono captions (279-card roster too)
- **`restyle-check/screenshots/`** — designlang component captures (card walls blank here — headless IntersectionObserver limitation, see `design-system.md` §13)

## Layout

```
design-ref/
├── design-system.md          ← synthesized reference (§1–12: v6 pre-restyle · §13 addendum: v7 applied)
├── restyle-plan.md           ← the executed token-by-token plan
├── restyle-check/            ← post-restyle verification (designlang re-run + live browser captures)
├── extract/                  ← designlang output (the "8 outputs" + extras)
│   ├── 127-0-0-1-design-language.md     AI-optimized markdown
│   ├── 127-0-0-1-preview.html           visual HTML report
│   ├── 127-0-0-1-design-tokens.json     W3C design tokens
│   ├── 127-0-0-1-tailwind.config.js     Tailwind theme (+ -tailwind-v4.css)
│   ├── 127-0-0-1-variables.css          CSS custom properties
│   ├── 127-0-0-1-theme.js               React/CSS-in-JS theme
│   ├── 127-0-0-1-shadcn-theme.css       shadcn/ui theme
│   ├── 127-0-0-1-figma-variables.json   Figma import
│   ├── 127-0-0-1-motion.*               motion tokens & framework exports
│   ├── 127-0-0-1-tokens-routes/         per-route token deltas
│   └── screenshots/                     nav / hero / button / card / full-page PNGs
├── rea/
│   ├── rea-js-design-trace.md   ← summary of REA findings
│   └── js-analysis.json         ← full REA Evidence record (7.9 MB)
└── arcanamana/                ← ArcanaMana reference + restyle-plan source of truth
    ├── arcanamana-design-reference.md
    ├── extract/                 ← designlang raw outputs for arcanamana.com
    └── rea-site-analysis.json
```

## Headline numbers

- Design extraction score **91/100 (A)** · WCAG contrast **100%** (0 failing pairs)
- Palette: 21 unique live colors, 10 gradients, 4 radius values (100% consistent), 5 shadow tokens
- Type: 2 self-hosted fonts (Marcellus 400 · Zen Old Mincho 500/700), scale ratio 1.067, fully offline
- Runtime: single vanilla module (`app.js`, 43 KB) feeding 5 same-origin JSON data files; no embedded Electron/IPC surface

## Reproduce

```sh
python3 -m http.server 8431 --bind 127.0.0.1 &
npx designlang http://127.0.0.1:8431 --out design-ref/extract --depth 3 --screenshots
npx -y rea-agents@latest analyze-javascript-application "$(pwd)/js" --json > design-ref/rea/js-analysis.json
```
