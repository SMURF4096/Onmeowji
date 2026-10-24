# REA — JavaScript Design Trace (Onmyoji Codex)

Tool: `rea-agents` (`analyze-javascript-application`), run against the site's shipped `js/` tree.
Full Evidence: `js-analysis.json` (7.9 MB, evidence id / digest inside).

## Target identity

| Fact | Value |
| --- | --- |
| Format | directory (`js/`) |
| Root artifact SHA-256 | `8b3afc367d303f2b6173a6132e3accd21273534d0927f18752f63944d9d575c8` |
| Parsed JavaScript files | 1 (`app.js`, 43,297 bytes, source range 1–882) |
| AST nodes visited | 7,034 |
| Findings | 5 |
| Parse failures / skipped files | 0 / 0 |
| Integrity contradictions | 0 |

## Observed network endpoints (static `fetch`, `app.js` lines 22–26)

All five endpoints are `base + "<file>"` — relative to the site root (partial literal, resolution:

| Line | Endpoint |
| --- | --- |
| 22 | `shikigami.json` |
| 23 | `souls.json` |
| 24 | `stats.json` |
| 25 | `onmyoji.json` |
| 26 | `bondlings.json` |

## What this establishes for the design reference

- **Data-driven, offline rendering.** Every dynamic surface is fed by five local JSON files fetched from the site's own origin. No third-party or CDN endpoints appear in the JavaScript — evidence for DESIGN.md's "don't load anything from a network" rule.
- **No embedded runtime.** 0 browser windows, preload entrypoints, `contextBridge` APIs, IPC operations, utility processes, or native addon bindings — this is a plain static web page with vanilla DOM rendering, so the CSS variable layer in `css/style.css` *is* the design system implementation, unmediated.
- **Single source module.** One `app.js` source module owns rendering, so design behaviors (staggered reveals, rarity hairlines, modal choreography) are all traceable to one file rather than a bundle graph.

## Limitations (from the Evidence record)

- CommonJS/ESM binding relationships recovered from inert syntax only; the bundle was never executed.
- Static endpoints prove the fetch sites exist at those source ranges (exact), not that data loads successfully at runtime.
- Dynamic or obfuscated paths can remain unresolved (here: the `base` prefix stays symbolic).

*Observed facts above are cited from the JSON Evidence; nothing was executed to obtain them.*
