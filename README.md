# Onmyoji Codex — style site scaffold

A fan-built, plain HTML/CSS/JS website presenting content data collected from the
[Onmyoji Fandom Wiki](https://onmyoji.fandom.com/wiki/Onmyoji_Wiki) via its MediaWiki API.

## Run it

JSON is fetched at runtime, so the site needs a static server:

```bash
# from this folder — any of these:
npx serve .
python -m http.server 8000
```

Then open `http://localhost:8000`. Pages: `index.html`, `shikigami.html`, `souls.html`.

## Collection pipeline

`tools/collect.mjs` (Node 18+) recollects everything and rewrites `data/*.json`:

```bash
node tools/collect.mjs
```

Sources scraped (all public wikitext/read endpoints):

| Wiki page | Data |
|---|---|
| `Shikigami/List/All` | roster: No., EN/CN/JP/GL names, rarity, portrait |
| `Shikigami/Attributes` | base stats MIN + MAX (ATK/HP/DEF/SPD/Crit/Crit DMG/Eff Hit/Eff Res) |
| `Soul/List/Released` | soul sets: No., names, type, icon |
| Each `Shikigami*` page | `ShikigamiBox` infobox fields (CV, intro, method) |
| `imageinfo` batches | CDN URLs for portraits/soul icons |

Then mirror the images referenced by the JSON into `assets/`:

```bash
node tools/fetch-images.mjs
```

The wiki CDN returns 404 for browser-style hotlinks that send a `Referer` (at least for
recently uploaded files), so the site serves mirrored copies from `assets/` instead of
hotlinking. rerun both scripts any time the wiki updates.

Add the self-contained detail layer (growth stats, full skill sheets, soul set effects):

```bash
node tools/collect-details.mjs
```

Sources scraped (all public wikitext/read endpoints):

| Wiki page | Data |
|---|---|
| `Shikigami/List/All` | roster: No., EN/CN/JP/GL names, rarity, portrait |
| Each `Shikigami*` page | `ShikigamiBox` infobox fields (CV, intro, method) |
| Each `<Name>/Main` page | `StatBox` growth stats (grades d→a, Lv1/awakened/max) + `SkillBox` skills (type, onibi, cooldown, voice line, description, Lv2–5 upgrades) + `BioUnlock` biography rewards |
| `Soul/List/Released` | soul sets: No., names, type, icon |
| Each soul page | `MitamaBox`: 2-set / 4-set effects, drop locations, server versions |
| `imageinfo` batches | CDN URLs used for the local mirror |

Last run: **279 shikigami (89 SSR / 68 SR / 48 SP / 39 R / 35 N), 70 souls, 336 legacy stat rows, 274 growth stat tables, 274 skill sheets, 272 biographies, 70/70 souls with set effects, 344 portraits + 919 skill icons mirrored (~3 MB total).**

### Characters (Onmyoji / Champions / Bondlings)

```bash
node tools/collect-onmyoji.mjs
```

Writes `data/onmyoji.json` (4 Onmyoji O1–O4 + 3 Champions O5–O7) and `data/bondlings.json` (8 bondlings).

| Wiki page | Data |
|---|---|
| `Category:Onmyoji` member pages | `OnmyojiBox`: No., EN/CN/JP names, unlock chapter, CV, intro; `pageimages` lead portrait |
| `<Name>/Main` | `StatBox/Onmyo` (Lv1/Max stats) + `OnmyoujiSkillBox` skills (type, cooldown, description, Lv2–5 upgrades, icon) |
| `Bondlings/List` | table: image file, EN/CN/JP name, area (Heian-kyo / Ominous Land), type (ATK/DEF/HP) |
| `<Name> (Bondling)` pages | bonding effect text + skin gallery files |

Last run: **7 characters (Seimei, Kagura, Hiromasa, Yao Bikuni onmyoji; Yorimitsu, Michitsuna, Michinaga champions), 8 bondlings, 7 portraits, 73 images mirrored.**

`characters.html` shows the Onmyoji and Champions; `bonding.html` (nav: **Bonding**) shows the
bondlings on their own page. Both open hash-routed detail modals (`characters.html#O1`,
`bonding.html#OB02`).

### Large artwork (shikigami + souls)

```bash
node tools/collect-artwork.mjs
```

Downloads the big display artwork referenced by the wiki pages and records each file in
the JSON as `s.art` (rendered as the 200 px hero image in the shikigami/soul detail
modals, with automatic fallback to the small card icon when absent):

| Source | Data |
|---|---|
| Shikigami pages | `<no>skin1.png` — default 580×580 full artwork → `assets/art/` |
| Soul pages | the single `M<n>.png` large soul artwork → `assets/souls/` (note: the M-number is the game's own index, not the soul list number) |

Last run: **274/274 default shikigami artworks (one unit's gallery file was deleted from the wiki CDN and gracefully falls back to its card icon) + 70/70 soul artworks.**

## Design

The visual theme is an original Heian-game–inspired design system in `css/style.css`:
night-indigo base, vermillion seal accent (`#b03027`), gold (`#c9a227`), Noto/Zen Mincho
serif type, rarity color coding, and detail views with growth stats, skill sheets,
biographies and soul set bonuses. It is informed by the wiki's mood, not copied from
its markup. Detail views are hash-routed (`shikigami.html#205`) so a specific entry
can be opened directly, and **no element on the site links outward** — the wiki is
referenced only as plain-text attribution in the page footers.

## Licensing

- Wiki text/data: **CC BY-NC-SA 4.0** — attribution required, non-commercial.
- Images mirrored into `assets/` are © NetEase Games (source: Onmyoji Wiki CDN);
  keep the attribution lines in the page footers if you republish.
- CSS/JS/HTML in this repo: yours to adapt.
