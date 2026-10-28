# Content Guide — how to manage site content

## Layout

```
data/
  src/                    ← EDIT HERE (source of truth)
    shikigami/{no}.json   one file per shikigami: profile, bio, skills, images, stats{min,max}
    souls/{no}.json       one file per soul (combo bonuses, art, image)
    characters/{no}.json  one file per onmyoji / champion (stats2 + skills embedded)
    bondlings/{no}.json   one file per bondling
    status-icons.json     the global status-name → icon glossary map (one file)
    _order.json           bundle order per category (only matters for display order)
  shikigami.json          GENERATED — what the site fetches (do not hand-edit)
  souls.json              GENERATED
  onmyoji.json            GENERATED
  bondlings.json          GENERATED
  stats.json              GENERATED (min/max arrays built from each shikigami's stats)
  status-icons.json       GENERATED (copy of src)
```

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
