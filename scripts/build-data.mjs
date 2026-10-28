/**
 * build-data.mjs — regenerate the site's data bundle from the editable source
 * tree data/src/. The site fetches (js/app.js loadAll) keep reading:
 *
 *   data/shikigami.json   data/souls.json   data/stats.json
 *   data/onmyoji.json     data/bondlings.json   data/status-icons.json
 *
 * Run after any edit:  node scripts/build-data.mjs
 * With --check it only verifies the bundle is up-to-date (CI-style), generating
 * to a temp dir and deep-diffing instead of writing.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const checkOnly = process.argv.includes("--check");
const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SRC = path.join(ROOT, "data", "src");
const DATA = path.join(ROOT, "data");
const TMP = path.join("/tmp/opencode", checkOnly ? "bundle-check-" + Date.now() : "bundle-out");
fs.mkdirSync(TMP, { recursive: true });

const read = (cat) => {
  const dir = path.join(SRC, cat);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const orderPath = path.join(SRC, "_order.json");
  const order = fs.existsSync(orderPath) ? (JSON.parse(fs.readFileSync(orderPath, "utf8"))[cat] ?? []) : [];
  /* manifest order first (original bundle order), unlisted files appended sorted */
  const ordered = [];
  for (const slug of order) {
    const f = `${slug}.json`;
    if (files.includes(f)) { ordered.push(f); }
  }
  for (const f of files.filter((x) => !ordered.includes(x)).sort(cmpNum)) ordered.push(f);
  return ordered.map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
};
const cmpNum = (a, b) => {
  const na = /^(\d+)/.exec(a), nb = /^(\d+)/.exec(b);
  if (na && nb) {
    const d = Number(na[1]) - Number(nb[1]);
    if (d) return d;
  }
  return a.localeCompare(b, undefined, { numeric: true });
};
const write = (name, obj) => fs.writeFileSync(path.join(TMP, name), JSON.stringify(obj, null, 2) + "\n");

/* shikigami + stats.json */
const shik = read("shikigami");
const bundleShik = [];
const min = [], max = [];
for (const s of shik) {
  const { stats, ...rest } = s;
  if (stats?.min) min.push(stats.min);
  if (stats?.max) max.push(stats.max);
  bundleShik.push(rest);
}
write("shikigami.json", bundleShik);
write("stats.json", { min, max });

/* status-icon overrides:
   any entry can carry `statusIcons: { "<status name>": "assets/status/X.webp" }` —
   build folds it over the shared glossary (data/src/status-icons.json) and strips
   the field from the generated bundle, so revising a shikigami's icons happens
   inside that shikigami's file while the shared 300-status map stays single-edit. */
const iconBase = JSON.parse(fs.readFileSync(path.join(SRC, "status-icons.json"), "utf8"));
const overrideLog = [], missingFiles = [];
const stripOverrides = (entries, cat) => {
  for (const e of entries) {
    if (!e?.statusIcons || typeof e.statusIcons !== "object") continue;
    for (const [name, v] of Object.entries(e.statusIcons)) {
      const file = typeof v === "string" ? { file: path.basename(v), url: v, jp: "" } : { file: v.file, url: v.url ?? v.file, jp: v.jp ?? "" };
      if (!fs.existsSync(path.join(ROOT, file.url))) missingFiles.push(`${cat} ${e.no ?? e.en}: ${name} → ${file.url}`);
      iconBase[name.toLowerCase().trim()] = file;
      overrideLog.push(`${e.en ?? e.no}: ${name} → ${file.file}`);
    }
    delete e.statusIcons;
  }
};
const soulsB = read("souls"), charsB = read("characters"), bondsB = read("bondlings");
stripOverrides(shik, "shikigami");
stripOverrides(soulsB, "souls");
stripOverrides(charsB, "characters");
stripOverrides(bondsB, "bondlings");

write("souls.json", soulsB);
write("onmyoji.json", charsB);
write("bondlings.json", bondsB);

write("status-icons.json", iconBase);
if (overrideLog.length) console.log(`status-icon overrides folded: ${overrideLog.length}\n  ${overrideLog.join("\n  ")}`);
if (missingFiles.length) console.log(`WARNING — overridden icons missing on disk:\n  ${missingFiles.join("\n  ")}`);

/* deploy or verify */
const SITE_FILES = ["shikigami.json", "stats.json", "souls.json", "onmyoji.json", "bondlings.json", "status-icons.json"];
if (checkOnly) {
  let bad = 0;
  for (const f of SITE_FILES) {
    const cur = fs.readFileSync(path.join(DATA, f));
    const gen = fs.readFileSync(path.join(TMP, f));
    if (!crypto.timingSafeEqual(crypto.createHash("md5").update(cur).digest(), crypto.createHash("md5").update(gen).digest())) {
      bad++;
      console.log("OUT OF DATE:", f);
    }
  }
  fs.rmSync(TMP, { recursive: true, force: true });
  if (bad) { console.error(`\n${bad}/${SITE_FILES.length} bundle files out of date — run: node scripts/build-data.mjs`); process.exit(1); }
  console.log("bundle up-to-date ✓");
} else {
  for (const f of SITE_FILES) fs.copyFileSync(path.join(TMP, f), path.join(DATA, f));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`built ${SITE_FILES.length} bundle files → data/*.json`);
}
