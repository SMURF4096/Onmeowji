/**
 * add-entry.mjs — scaffold a new entity (and optionally fetch it from the wiki).
 *
 *   node scripts/add-entry.mjs shikigami --no=284 --name="Momo no Sei"
 *   node scripts/add-entry.mjs shikigami --no=284 --name="Momo no Sei" --wiki="Momo no Sei"
 *   node scripts/add-entry.mjs shikigami --no=284 --wiki="Momo no Sei"        (name from wiki page)
 *   node scripts/add-entry.mjs souls       --no=64 --name="New Soul"
 *   node scripts/add-entry.mjs characters  --no=O8 --name="New Onmyoji" --role=champion
 *   node scripts/add-entry.mjs bondlings   --no=OB09 --name="New Bondling"
 *
 * With --wiki it also:
 *   - downloads matching images (portrait / art / skill icons) with true-typed extensions
 *     into assets/, and sets the entry's image paths to them
 *   - parses the page's {{SkillBox}} templates to prefill skills (name/description/
 *     line/cooldown/onibi/upgrades/type) when present
 *
 * Finish by editing the created data/src/<cat>/<id>.json and running
 * node scripts/build-data.mjs (or Save → Build in tools/admin.html).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const API = "https://onmyoji.fandom.com/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- cli ---------- */
const args = Object.fromEntries(process.argv.slice(3).map((a) => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/);
  return m ? [m[1], m[2] ?? true] : [null, a];
}));
const cat = process.argv[2];
const VALID = ["shikigami", "souls", "characters", "bondlings"];
if (!VALID.includes(cat)) { console.error(`category must be one of: ${VALID.join(", ")}\nusage: node scripts/add-entry.mjs <category> --no=<no> [--name=<en name>] [--wiki=<page title>]`); process.exit(1); }

/* ---------- scaffolds (key order matches the existing bundle so diffs stay clean) ---------- */
function scaffold(c) {
  const no = args.no ?? "";
  const name = args.name ?? "";
  const n = String(no);
  if (cat === "shikigami") return {
    no: n || null, en: name, cn: "", jp: "", gl: "", rarity: args.rarity ?? "SSR",
    image: `File:${n || "NEW"}.png`,
    wiki: `https://onmyoji.fandom.com/wiki/${encodeURIComponent(name).replaceAll("%20", "_")}`,
    cv: "", intro: "", method: "",
    imageUrl: `assets/shikigami/${n || "NEW"}.webp`, rarityIcon: `assets/icons/${args.rarity ?? "SSR"}.webp`,
    localImage: `assets/shikigami/${n || "NEW"}.webp`,
    stats2: null, skills: [], bio: [],
    stats: { min: null, max: null },
  };
  if (cat === "souls") return {
    no: n || null, en: name, cn: "", jp: "", type: args.type ?? "MITAMA",
    image: `File:Soul${n}.png`, wiki: "https://onmyoji.fandom.com/wiki/Souls",
    imageUrl: `assets/souls/Soul${n}.webp`, localImage: `assets/souls/Soul${n}.webp`,
    combo2: "", combo4: "", location: "", version: "", art: "",
  };
  if (cat === "characters") return {
    no: n, role: args.role ?? "onmyoji", page: args.role === "champion" ? "champion" : "onmyoji",
    en: name, cn: "", jp: "", gl: "", unlock: "", cv: "", intro: "",
    image: `assets/onmyoji/${n}.webp`, imageUrl: `assets/onmyoji/${n}.webp`,
    stats2: { base: Object.fromEntries(["atk", "hp", "def", "spd", "crit", "cdmg", "effhit", "effres"].map((k) => [k, { lv1: null, lv2: null, max: null }])), grow: null },
    skills: [],
  };
  return { no: n, page: "", en: name, cn: "", jp: "", area: "", type: "", image: `File:${n}.png`, imageUrl: `assets/bondlings/${n}.webp`, skins: [], skill: { name: "", icon: "", description: "" } };
}

/* ---------- source write ---------- */
const SRC = path.join(ROOT, "data", "src", cat);
fs.mkdirSync(SRC, { recursive: true });
const slug = String(args.no ?? (cat === "shikigami" ? `daruma-${fs.readdirSync(SRC).filter((f) => f.startsWith("daruma-")).length + 1}` : "new"));
const out = path.join(SRC, `${slug}.json`);
if (fs.existsSync(out)) { console.error(`already exists: ${path.relative(ROOT, out)} — edit it, or pick another --no`); process.exit(1); }

let entry = scaffold(cat);
if (args.wiki) {
  const title = String(args.wiki);
  entry = await fetchEntry(entry, title, slug);
}

fs.writeFileSync(out, JSON.stringify(entry, null, 2) + "\n");
orderAppend(entry.no != null ? String(entry.no) : slug);
console.log(`created ${path.relative(ROOT, out)}`);
console.log("next:");
console.log(`  1. edit data/src/${cat}/${slug}.json (or: node tools/admin-server.mjs → admin UI)`);
console.log("  2. node scripts/build-data.mjs");

/* ---------- wiki fetch ---------- */
async function apiGet(params) {
  const url = `${API}?${new URLSearchParams({ ...params, format: "json", formatversion: "2", origin: "*" })}`;
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA } });
      if (r.ok) return await r.json();
    } catch { /* retry */ }
    await sleep(700 * (a + 1));
  }
  return null;
}
async function getWikitext(title) {
  let j = await apiGet({ action: "query", titles: title, prop: "revisions", rvprop: "content", rvslots: "main" });
  const p = j?.query?.pages?.[0];
  return p?.revisions?.[0]?.slots?.main?.content ?? null;
}

async function fetchEntry(e, title, slug) {
  const safe = title.trim().replace(/ /g, "_");
  let wt = await getWikitext(safe);
  if (wt && /^#REDIRECT/.test(wt)) wt = await getWikitext((wt.match(/\[\[([^\]|]+)/) ?? [])[1] ?? safe);
  if (!wt) console.log(`wiki page not found: ${title} — scaffolded empty, fill manually`);
  else {
    /* skills live on the <page>/Main transclusion; fall back to the main page */
    let skillWt = await getWikitext(safe + "/Main");
    if (!skillWt || /\{\{SkillBox/.test(skillWt) === false) skillWt = /\{\{SkillBox/.test(wt) ? wt : skillWt;

    /* basic infobox fields */
    const field = (re) => { const m = wt.match(re); return m ? clean(m[1]) : undefined; };
    const trySet = (v, k) => { if (v && !e[k]) e[k] = v; };
    trySet(field(/\|\s*(?:EN name|Name)\s*=\s*([^\n|]+)/i), "en");
    trySet(field(/\|\s*(?:name_cn|CN|CN name|名称)\s*=\s*([^\n|]+)/i), "cn");
    trySet(field(/\|\s*(?:name_jp|JP|JP name|日本語)\s*=\s*([^\n|]+)/i), "jp");
    trySet(field(/\|\s*(?:name_gl|gl)\s*=\s*([^\n|]+)/i), "gl");
    trySet(field(/\|\s*Rarity\s*=\s*([^\n|]+)/i), "rarity");
    trySet(field(/\|\s*(?:cv|声优)\s*=\s*([^\n|]+)/i), "cv");
    trySet(field(/\|\s*intro\s*=\s*([\s\S]*?)(?=\n\|)/i), "intro");
    trySet(field(/\|\s*(?:method|Acquisition)\s*=\s*([\s\S]*?)(?=\n\|[A-Za-z_]+\s*=|\n\}\})/i), "method");
    e.wiki = `https://onmyoji.fandom.com/wiki/${safe}`;
    if (e.en) { e.image = `File:${e.en.replaceAll(" ", "_")}.png`; }
    else e.en = title.replaceAll("_", " ");

    /* skills from SkillBox templates */
    const boxes = parseSkillBoxes(skillWt ?? "");
    if (boxes.length) {
      e.skills = boxes.map((b, i) => ({
        group: b.Type ? clean(b.Type) : "Normal",
        image: `${slug}${i + 1}`,
        name: clean(b.Name ?? ""),
        type: clean(b.Type ?? "Normal"),
        onibi: Number(b.Onibi ?? 0) || 0,
        cooldown: Number(b.Cooldown ?? 0) || 0,
        line: clean(b.Line ?? ""),
        description: clean(b.Description ?? ""),
        upgrades: [2, 3, 4, 5].filter((lv) => b["L" + lv]).map((lv) => ({ lvl: lv, text: clean(b["L" + lv]) })),
      }));
    }
    console.log(`wiki fields filled (skills: ${e.skills.length}) — review before publishing`);
    const wikiNo = (/^\|\s*no\s*=\s*(\d+)/m.exec(wt) ?? [])[1];
    if (wikiNo && String(e.no) !== wikiNo && cat === "shikigami") console.log(`note: wiki's internal shikigami no is ${wikiNo} (ours: ${e.no}) — images are fetched via the wiki no, saved under ${e.no}`);
    await downloadImages(e, safe, slug, wikiNo ?? (cat === "shikigami" && /^\d+$/.test(String(e.no)) ? String(e.no) : null));
  }
  return e;
}

async function downloadImages(e, safe, slug, wikiNo) {
  const j = await apiGet({ action: "query", titles: safe, prop: "images", imlimit: "300" });
  const files = (j?.query?.pages?.[0]?.images ?? []).map((x) => x.title.replace(/^File:/, ""));
  if (!files.length) return;
  /* wiki files are prefixed with the wiki's internal no (e.g. 219.png, 2191.png, 219skin1.png);
     strip that prefix to classify them, then SAVE under our slug (assets/shikigami/<our no>.webp) */
  const prefix = String(wikiNo ?? "");
  const restOf = (base) => (prefix && base.startsWith(prefix) ? base.slice(prefix.length) : base);
  const want = files.filter((f) => {
    if (!prefix) return false;
    const base = f.replace(/\.\w+$/, "");
    if (!base) return false;
    const r = restOf(base);
    return r === "" || /^(skin\d*|\d+)$/.test(r);
  });
  if (!want.length) { console.log("no 'portrait/skin/skill-icon' files matched — set image paths manually"); return; }
  let art = null;
  for (const f of want) {
    const base = f.replace(/\.\w+$/, "");
    const r = restOf(base);
    let dir = "assets/art", dest = `${dir}/${base}`;
    const isPortrait = r === "";
    const isSkin = /^skin\d*$/.test(r);
    const isIcon = /^\d+$/.test(r);
    if (isPortrait) { dir = "assets/shikigami"; dest = `${dir}/${slug}`; }
    else if (isSkin) dest = `${dir}/${prefix}${r}`;
    else if (isIcon) { dir = "assets/skills"; dest = `${dir}/${slug}${r}`; }
    const got = await download(f, dest);
    if (!got) continue;
    const used = `${dest}.${got}`;
    if (isIcon) { e.skills ??= []; const k = e.skills[Number(r) - 1] ?? (e.skills[Number(r) - 1] = {}); k.icon = used; if (!k.image) k.image = `${slug}${r}`; }
    if (isPortrait) { e.localImage = used; e.imageUrl = used; e.image = `File:${base}`; }
    if (isSkin && !art) art = used;
  }
  if (art) e.art = e.art || art;
  console.log(`downloaded image file(s) for wiki no ${prefix}, saved under our no ${slug} — check paths & leftovers`);
}

async function download(file, destBase) {
  for (let i = 0; i < 3; i++) {
    await sleep(400 * (i + 1));
    try {
      const r = await fetch(`https://onmyoji.fandom.com/wiki/Special:FilePath/${encodeURIComponent(file)}`, { headers: { "user-agent": UA, referer: "https://onmyoji.fandom.com/" } });
      if (r.status === 429 || r.status === 403) continue;   /* rate-limited — back off and retry */
      if (!r.ok) return null;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 1000 || buf[0] === 0x3c) return null;
      const t = sniffType(buf);
      if (!t) return null;
      const ext = t === "jpg" ? "jpg" : t;
      const p = path.join(ROOT, destBase) + "." + ext;
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, buf);
      return ext;
    } catch { /* retry */ }
  }
  console.log(`  download failed (rate-limited?): ${file} — re-run with the same command later to fill the gaps`);
  return null;
}
function sniffType(b) {
  if (b[0] === 0x89 && b[1] === 0x50) return "png";
  if (b[0] === 0xff && b[1] === 0xd8) return "jpg";
  if (b.slice(0, 4).toString("ascii") === "RIFF" && b.slice(8, 12).toString("ascii") === "WEBP") return "webp";
  if (b.slice(8, 12).toString("ascii") === "avif") return "avif";
  return null;
}

function clean(s) {
  return String(s ?? "")
    .replace(/\[\[File:[^\]]+\]\]/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\{\{[^{}]*\}\}/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ").replace(/\n{2,}/g, "\n")
    .replace(/^['"""']+|['"""']+$/g, "").trim();
}

function parseSkillBoxes(wt) {
  const boxes = [];
  for (const m of wt.matchAll(/\{\{SkillBox\s*([\s\S]*?)\n\}\}/g)) {
    const fields = {};
    for (const t of m[1].split(/\n(?=\|[A-Za-z][A-Za-z0-9_]*\s*=)/)) {
      const mm = t.match(/^\|\s*([A-Za-z][A-Za-z0-9_]*)\s*=\s*([\s\S]*)$/);
      if (mm) fields[mm[1]] = mm[2].trim();
    }
    if (fields.Name || fields.Description) boxes.push(fields);
  }
  return boxes;
}

/* append the new slug to the bundle order manifest so it appears at the end */
function orderAppend(slugStr) {
  const op = path.join(ROOT, "data", "src", "_order.json");
  const o = fs.existsSync(op) ? JSON.parse(fs.readFileSync(op, "utf8")) : { shikigami: [], souls: [], characters: [], bondlings: [] };
  if (!o[cat].includes(slugStr)) o[cat].push(slugStr);
  fs.writeFileSync(op, JSON.stringify(o, null, 2) + "\n");
}
