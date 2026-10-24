# Restyle Plan — Onmyoji Codex → ArcanaMana style

> Source: `arcanamana/arcanamana-design-reference.md` (+ raw extraction/REA in that folder).
> Target: the Onmyoji Codex site (6 HTML pages, `css/style.css` v6, `js/app.js`, 5 data JSONs).
> The **data layer is untouched** — REA confirmed app.js only consumes 5 same-origin JSONs, so the
> restyle is a pure presentation-language swap rendered by the same components.

## Design concept shift

| | Today (Onmyoji) | Target (ArcanaMana) |
| --- | --- | --- |
| Concept | "The Lacquered Archive" — warm indigo lacquer, engraved serif, ornament-as-seal | "The Black Gallery" — neutral charcoal editorial wall, heavy display sans, type-as-texture |
| Ground | `#0e0913` indigo + radial vermillion/gold washes | `#131415` flat neutral, **no washes, no gradients** |
| Text voice | Mincho serif, ceremonial | Supreme cream sans display + mono 12/14px body |
| Cards | 1:1 ema plaques, 12px radius, rarity hairlines, sheen sweep | **9:16 portrait tarot cards, 0 radius, thin gold plate frame, scattered offset wall** |
| Accent | vermillion seal + shrine gold | single gold `#a67811`, frames only (~7% painted area) |

## 1. Tokens → replace `:root` block in `css/style.css`

```css
:root {
  /* ground — neutral charcoal, no tint */
  --bg: #131415;            /* page */
  --bg-soft: #131415;
  --surface: #17181a;       /* faint lift only; hierarchy is frequency, not tone steps */
  --surface-2: #1d1e21;
  --border: #2a2b2e;        /* default hairline */
  --border-soft: #1f2023;
  --border-gold: #a67811;   /* the ONLY loud border */

  /* ink */
  --text: #f5efe4;          /* cream (16.12:1 on ground) */
  --muted: #a49f95;         /* = cream ramp 400 */
  --faint: #878177;

  /* seals */
  --gold: #a67811;          /* replaces vermillion as the action color */
  --gold-hi: #c59742;       /* hover/lift */
  --gold-soft: #fff1bf;     /* headline accents on dark */

  /* rarity — demote to small marks (keep rgb triplet pattern, retuned to ArcanaMana gold) */
  --gold-rgb: 166 120 17;
  --verm-rgb: 166 120 17;   /* vermillion retires; SP rides the gold family */
  --sp-rgb: 224 85 76;      /* keep ONLY if you still want SP distinctive */
  --ssr-rgb: 212 175 55;
  --sr-rgb: 155 111 212;
  --r-rgb: 93 159 212;
  --n-rgb: 139 139 143;

  /* shape */
  --radius: 16px;           /* panels/modal */
  --radius-sm: 6px;         /* buttons/inputs/cards chrome */
  --radius-pill: 28px;      /* chips */
  --radius-img: 0px;        /* ALL card art — square, always */

  /* elevation — one shadow only */
  --shadow: none;           /* floors are flat squares */
  --shadow-soft: rgba(0, 0, 0, 0.25) 0px 2px 4px 0px;  /* hover/raised only */

  /* type */
  --font-sans: "Inter", system-ui, sans-serif;          /* display, 900 for wordmark */
  --font-mono: "Geist Mono", ui-monospace, monospace;   /* body 12-14px, uppercase labels */
}
```

Remove: the two body radial-gradient washes, `--vermillion*`, the sheen/shimmer tokens.

## 2. Typography rebuild

- Body/UI: **Geist Mono 400**, sizes 16 / 14 / 12 with 24px line-height — mono becomes the identity face
  (Onmyoji's equivalent of the Mincho "everywhere" voice).
- Hero/section display: **Inter 700–900**, cream; hero wordmark = section title scaled to full-bleed
  (`clamp(3rem, 14vw, 12rem)`, tracking tight −0.02em, uppercase), allowed to crop at viewport edges.
- Kill: Marcellus, all Mincho stacks, `letter-spacing: 0.04em` serif spacing (mono needs none).
- Self-host Inter 700/900 + Geist Mono (or system-ui fallback chain) under the site's offline rule.

## 3. Card system (the signature change)

1. **Aspect ratio 1:1 → 9:16** — grid `auto-fill minmax(150px, 1fr)` → masonry:
   `columns` fallback: `column-count: auto; column-width: 170px; column-gap: 16px` with
   per-item vertical offset defaulting to alternating `margin-top` steps (0 / 40 / 80px) —
   recreates the scattered wall without JS.
2. **Square corners:** images `border-radius: 0; object-fit: cover;` (art is currently
   contain-on-plate; the portrait crop replaces the rarity-washed radial plate entirely).
3. **Gold plate frame:** replace the rarity hairline with a 1px `--border-gold` frame inset
   (`outline`/`box-shadow: 0 0 0 1px`), plus the decorative double-line corner ticks like the tarot
   plates (pure CSS borders, no SVG needed).
4. **Caption:** swap the Mincho name row for `--font-mono` 10–11px uppercase tracking 0.18em
   in `--gold-hi`; name goes *above*, rarity below — small marks, tiny counts.
5. **Rarity stays, demoted:** the full-hairline rarity rule is retired. Rarity carries through the
   caption mark + a 2px rarity tick at the card's top edge only (SSR keeps gilt, etc.). SP can keep
   vermillion — it is the one place the red family survives.
6. **Hover:** no lift, no sheen sweep. Hover = frame brightens `--gold-hi` + image `filter:
   brightness(1.08)`; focus-visible = 2px gold ring stays (a11y rule).

## 4. Components

| Component | Change |
| --- | --- |
| Nav | sticky bar, `#131415cc` + blur optional (ArcanaMana uses none — candidate to drop), mono 12px links, active = gold text, no underline bar |
| Buttons | 6px radius, mono 12px uppercase; primary = gold fill `#a67811` black text (5.32:1); ghost = hairline + cream (18.35:1 fill if inverted) |
| Chips/filters | 28px pill, hairline, gold selected fill (black text) |
| Search input | 6px, mono, square, hairline; focus = gold border, no halo |
| Modal | 16px radius flat panel, single soft shadow instead of the standing modal shadow; keep staged entrance ≤300ms |
| Icons | keep inline-SVG rule, but retint `currentColor` — ArcanaMana icons are solid/filled, not outlined |
| Shadows | delete `--shadow` standing modal usage; the one hover shadow only |

## 5. Motion

- Keep `.js-fx` + `prefers-reduced-motion` discipline and the IntersectionObserver reveals.
- **Remove**: sheen sweep (hover + idle), vermillion/gold radial washes, press-inset depth.
- Standardize `transition: all .18s` (mono rhythm); no keyframes needed — ArcanaMana has none.

## 6. What to keep from Onmyoji (do not sacrifice)

- WCAG discipline (both sites are 100%) — re-verify cream/gold-on-black pairs after the swap.
- The offline/no-network rule, `tokens/onmyoji.json` → fork it as `tokens/arcanamana-style.json`.
- Data contract: `app.js` + 5 JSONs untouched; only class-level CSS + markup accents change.
- The `img-err` ornament rule (retint it gold).

## 7. Score expectations

- Measured extraction already puts this language at 93/100 with **100s in every discipline except
  CSS tokenization (50 — a Framer artifact)**. Since Onmyoji already tokenizes at 100, affording the
  same neutrality discipline should land ≥ Onmyoji's current 91 without losing it.
- Known risks: mono body at 12px is small — keep body ≥14px for AA comfortable reading; the
  9:16 crop demands art that survives cropping (currently plates are contain-fit; decide
  crop-anchor per art set).

## 8. Suggested execution order

1. Fork tokens + fonts (§1–2) on a branch — everything else keys off `:root`.
2. Cards (§3) — the highest-visible change; ship `.lead` anchor card as the first test.
3. Components (§4) — nav/buttons/chips/modal.
4. Motion cleanup (§5) + purge dead CSS (Onmyoji already has 63% unused CSS; this is the moment to drop the Marcellus/Mincho woff2s).
5. Re-run `npx designlang http://127.0.0.1:8431 ...` against the restyled site and diff against
   `arcanamana-com-design-language.md` to confirm the language transferred.
