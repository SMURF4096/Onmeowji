# Content Guide — how to manage site content

## Layout

```
data/
  src/                    ← EDIT HERE (source of truth)
    shikigami/{no}.json   one file per shikigami: profile, bio, skills,
                          images, level-1/max stats AND any status-icon
                          overrides for its skills — everything for that
                          one character in one place
    souls/{no}.json       one file per soul (combo bonuses, art, image)
    characters/{no}.json  one file per onmyoji / champion (stats2 + skills embedded)
    bondlings/{no}.json   one file per bondling
    status-icons.json     shared status glossary used by many entries
                          (statuses like "Ghost Rider" appear on dozens of
                          entries — fix once here, applies everywhere)
    _order.json           bundle order per category (only matters for display order)
  shikigami.json          GENERATED — what the site fetches (do not hand-edit)
  souls.json              GENERATED
  onmyoji.json            GENERATED
  bondlings.json          GENERATED
  stats.json              GENERATED (min/max arrays built from each shikigami's stats)
  status-icons.json       GENERATED (glossary with per-entry overrides folded in)
```

## Revising one shikigami = opening exactly one file

`data/src/shikigami/{no}.json` contains everything about that character:

- `en / cn / jp / gl / rarity / cv / method / wiki` — identity fields
- `imageUrl / localImage / rarityIcon` — portrait image
- `skills[]` — each skill's name, type, onibi, cooldown, description, line, upgrades, icon path
- `bio[]` — the evolution/level reward entries
- `stats.min / stats.max` — level-1 and max base stats (the stat page is generated from these)
- `statusIcons` — *optional* overrides for statuses used by this character's skills

### Overriding a status icon for one character

If a skill references a status whose icon is wrong *for this character only*,
put the override inside the character's own file and build:

```json
"statusIcons": {
  "sleep": "assets/status/Debuff29.webp",
  "watchful eye": "assets/status/Buff111.webp"
}
```

- Names are matched case-insensitively (keys are lowercased during the build).
- The build folds these over the shared glossary and strips the field from the
  generated bundle — the field stays in the source file, so your revision
  lives with the character.
- A warning is printed if the icon file doesn't exist on disk.
- Use the shared `data/src/status-icons.json` only when the fix should apply
  to *every* entry that displays that status (they're shared; most statuses
  appear on dozens of characters).

The site's pages keep fetching `data/*.json` exactly as before, so page code
doesn't change when you edit sources — you just rebuild.

## Workflows

### Add a new shikigami (one command, then review)

```bash
node scripts/add-entry.mjs shikigami --no=284 --name="Momo no Sei"
# or let the wiki pre-fill everything (fields + skills + images):
node scripts/add-entry.mjs shikigami --no=284 --wiki="Momo no Sei"
```

The script creates `data/src/shikigami/284.json` (and with `--wiki` downloads
their portrait / skin art / skill icons into `assets/…`, saving under **your**
number even when the wiki's internal number differs). Then:

```bash
node scripts/build-data.mjs
```

Other categories use the same shape: `souls --no=64 --name="X"`,
`characters --no=O8 --name="X" --role=champion`, `bondlings --no=OB09 --name="X"`.

### Edit / update an entity

Either hand-edit its single JSON file, or use the local admin UI:

```bash
node tools/admin-server.mjs     # → http://127.0.0.1:8432
```

- Categories on top; searchable list on the left; full form editor on the right.
- Arrays (skills, bios, upgrades) get add / remove / move-up buttons; "+ add"
  clones the last item so you get the same fields.
- Image paths show a live preview thumbnail.
- `Ctrl/Cmd+S` saves. **Build site data** saves + runs the build; the console
  box shows the build output.
- New / Delete buttons are in the left sidebar (New shells out to
  `scripts/add-entry.mjs`, so the wiki fetch is available there too).

Then refresh the site page (`python3 -m http.server 8431 --bind 127.0.0.1` serves the site).

### Removing an entity

Delete its `data/src/<category>/<id>.json` (admin UI: – Delete), then
`node scripts/build-data.mjs`. If it has dedicated files under `assets/`,
clean those up only when nothing else uses them.

### Status icons (glossary)

Adds/removes are just keys in `data/src/status-icons.json`
(name → { file, url, jp }). The icons live in `assets/status/`.

## Notes & gotchas

- **Never edit `data/*.json` at the root directly** — a rebuild overwrites it.
  When in doubt: `node scripts/build-data.mjs --check` tells you whether the
  bundle is in sync; plain failures mean an edit drifted from the sources.
- The `no: null` daruma placeholders are kept as
  `data/src/shikigami/daruma-1..5.json` (they had no number in the source data).
- Keep extensions truthful — every image is saved under its real format
  (`.webp` content = `.webp` name). `scripts/add-entry.mjs` sniffs magic bytes,
  so downloaded names are already correct.
- After changing images, remember cache-busting: bump `DATA_V` in `js/app.js`
  (e.g. `v31` → `v32`) and the `?v=` tags in the HTML pages so visitors see
  the new data.
