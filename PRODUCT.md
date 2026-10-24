# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Players and fans of the mobile game Onmyoji (NetEase). They browse to look up a shikigami's base stats and skills, check a soul set's 2/4-set effects and drop locations, or review bondlings of the onmyoji roster — usually mid-game or while planning builds, on desktop or phone, often offline or in a network-restricted setting.

## Product Purpose

A self-contained encyclopedia of Onmyoji game data. It presents collected game knowledge — shikigami roster (279 entries with stats, skills, biographies), souls (70 sets with effects and drop locations), bondlings (8), and onmyoji/champions (7) — in readable detail cards. Success: a visitor finds an entry, reads its complete data quickly, and trusts its completeness.

## Positioning

Fully offline mirror with original design: all game data and images are collected from the wiki into local JSON/assets, so the encyclopedia needs no network, no framework, and never sends the visitor outbound to the wiki source.

## Operating Context

Served as static files (any static server; `python -m http.server 8123` during development). Data loads at runtime via `fetch` of local JSON. No build step. All five pages share one JS entry (`js/app.js`) and one stylesheet (`css/style.css`, query-versioned against caching).

## Capabilities and Constraints

- Pages: index hub, shikigami grid (#hash detail), souls grid (#hash detail), bonding (bondlings only), characters (Onmyoji/Champion tabs only). Nav order fixed: Home · Shikigami · Souls · Bonding · Characters.
- 279-card grids must stay smooth; interactions already verified: rarity chips, search, sort, hash-routed modals, stat-table tabs.
- Hard constraints: zero outbound wiki/nocookie links in the UI; plain-text CC attribution in footers only; plain HTML/CSS/JS only (no framework); no external fonts or CDN resources; everything self-contained under `assets/`.
- Artwork files are WEBP served with `.png` extensions (Fandom CDN artifacts) — browsers render them by sniffing; do not re-encode.

## Brand Commitments

Original Heian-inspired visual identity (night indigo ground, vermillion and gold accents) — **pinned by the user for this redesign: "Evolved Heian night"**; the identity remains, surfaces and cards are rebuilt modern. Expressive but never obnoxious motion, respecting `prefers-reduced-motion`.

## Evidence on Hand

- `data/*.json` — complete datasets as itemized in Purpose; field coverage documented in README.md.
- `assets/art/` (273 large shikigami arts), `assets/souls/` (70 arts + icons), `assets/skills/` (274 sheets, 919 icons), `assets/onmyoji/`, `assets/bondlings/` portraits, `assets/img/` base portraits.
- Missing and not to be fabricated: Sakuya (no. 609) large art (CDN file deleted — small icon exists).

## Product Principles

1. Data completeness is the product; presentation never hides or truncates it.
2. Self-contained above all: no external requests, ever.
3. Scanability first: rarity, stats, and states are readable at card size; detail lives one click deep.
4. The period aesthetic (Heian court: ink, gold, vermillion) expresses the game's identity without cosplaying wiki markup.

## Accessibility & Inclusion

Keyboard-operable controls and modals; visible focus states; `prefers-reduced-motion` honored; contrast ≥ 4.5:1 for body text.
