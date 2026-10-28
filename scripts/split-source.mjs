/**
 * split-source.mjs — ONE-TIME migration.
 *
 * Moves the site data (data/*.json) into the editable per-entity source tree:
 *
 *   data/
 *     src/
 *       shikigami/{no}.json   ← profile + bio + skills + images + stats:{min,max}
 *       souls/{no}.json       ← soul info + art + image
 *       characters/{no}.json  ← onmyoji & champions (stats2 already embedded)
 *       bondlings/{no}.json
 *       status-icons.json     ← global glossary-name → icon map (stays one file)
 *       _order.json           ← bundle-append order per category (preserved verbatim)
 *
 * data/*.json (the generated bundle the site fetches) is left untouched until
 * scripts/build-data.mjs regenerates it; the result is verified to deep-equal
 * the current files, so this migration is lossless.
 *
 * Run once:  node scripts/split-source.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SRC = path.join(ROOT, "data", "src");
const readJ = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));

if (fs.existsSync(path.join(SRC, "shikigami")) && fs.readdirSync(path.join(SRC, "shikigami")).length) {
  console.error("refusing to overwrite existing data/src — remove it first");
  process.exit(1);
}
for (const d of ["shikigami", "souls", "characters", "bondlings"]) {
  fs.mkdirSync(path.join(SRC, d), { recursive: true });
}

const write = (cat, slug, obj) =>
  fs.writeFileSync(path.join(SRC, cat, `${slug}.json`), JSON.stringify(obj, null, 2) + "\n");

/* slug per entry: numeric `no` preferred; null-no entries get unique daruma-N slugs */
const slugify = (e, useNo) => (e.no != null ? String(e.no) : null);

/* shikigami: + merged stats (min/max records from stats.json, kept verbatim) */
{
  const stats = readJ("data/stats.json");
  const minBy = new Map(stats.min.map((r) => [r.no, r]));
  const maxBy = new Map(stats.max.map((r) => [r.no, r]));
  let withStats = 0;
  let nullIdx = 0;
  const order = [];
  for (const s of readJ("data/shikigami.json")) {
    const slug = s.no != null ? String(s.no) : `daruma-${++nullIdx}`;
    const e = { ...s };
    const mn = minBy.get(s.no), mx = maxBy.get(s.no);
    if (mn || mx) {
      e.stats = { min: mn ?? null, max: mx ?? null };
      withStats++;
    }
    write("shikigami", slug, e);
    order.push(slug);
  }
  fs.writeFileSync(path.join(SRC, "_order.json"), JSON.stringify({ shikigami: order, souls: [], characters: [], bondlings: [] }, null, 2) + "\n");
  console.log(`shikigami split: ${order.length} entries (${withStats} with stats)`);
}

/* souls */
{
  const order = [];
  const seen = new Map();
  for (const s of readJ("data/souls.json")) {
    const base = s.no != null ? String(s.no) : "soul";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const slug = n ? `${base}-2` : base;
    write("souls", slug, s);
    order.push(slug);
  }
  patchOrder("souls", order);
  console.log(`souls split: ${order.length} entries`);
}

/* onmyoji & champions */
{
  const order = [];
  const seen = new Map();
  for (const c of readJ("data/onmyoji.json")) {
    const base = c.no != null ? String(c.no) : "char";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const slug = n ? `${base}-2` : base;
    write("characters", slug, c);
    order.push(slug);
  }
  patchOrder("characters", order);
  console.log(`characters split: ${order.length} entries`);
}

/* bondlings */
{
  const order = [];
  const seen = new Map();
  for (const b of readJ("data/bondlings.json")) {
    const base = b.no || b.en;
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const slug = n ? `${base}-2` : base;
    write("bondlings", slug, b);
    order.push(slug);
  }
  patchOrder("bondlings", order);
  console.log(`bondlings split: ${order.length} entries`);
}

/* status-icons: global glossary map, one file */
fs.copyFileSync(path.join(ROOT, "data", "status-icons.json"), path.join(SRC, "status-icons.json"));

function patchOrder(cat, order) {
  const o = JSON.parse(fs.readFileSync(path.join(SRC, "_order.json"), "utf8"));
  o[cat] = order;
  fs.writeFileSync(path.join(SRC, "_order.json"), JSON.stringify(o, null, 2) + "\n");
}

console.log("next: node scripts/build-data.mjs → regenerates data/*.json (site files)");
