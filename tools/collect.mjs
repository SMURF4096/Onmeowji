// collect.mjs — scrape Onmyoji Wiki (Fandom/MediaWiki) content data into JSON.
// Sources: onmyoji.fandom.com (CC BY-NC-SA content). Images remain hosted by Fandom.
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://onmyoji.fandom.com/api.php";
const HDR = { "User-Agent": "OnmyojiStyleSite/1.0 (personal data collection; local project)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = path.resolve("data");
await fs.mkdir(OUT, { recursive: true });

async function fetchRetry(url, tries = 5, base = 800) {
  for (let t = 0; t < tries; t++) {
    try {
      const r = await fetch(url, { headers: HDR });
      const ct = r.headers.get("content-type") ?? "";
      if (r.ok && ct.includes("json")) {
        const text = await r.text();
        if (text.trimStart().startsWith("{") || text.trimStart().startsWith("[")) {
          return JSON.parse(text);
        }
      }
      throw new Error(`status=${r.status} ct=${ct}`);
    } catch (e) {
      if (t === tries - 1) throw e;
      await sleep(base * 2 ** t);
    }
  }
}

async function wikitext(page) {
  const url = `${API}?action=parse&page=${encodeURIComponent(page)}&prop=wikitext&formatversion=2&format=json`;
  const j = await fetchRetry(url);
  return j?.parse?.wikitext ?? "";
}

// ---- wikitext table parsing helpers ---------------------------------------
const PH_LINK = String.fromCharCode(1); // masked pipe inside [[...]]
const PH_TPL = String.fromCharCode(2);  // masked pipe inside {{...}}
const PH_SEP = String.fromCharCode(3);  // row field separator
const maskPipes = (s) =>
  s
    .replace(/\{\{((?:[^{}]|\{[^{}]*\})*)\}\}/g, (m, g) => `{{${g.split("|").join(PH_TPL)}}}`)
    .replace(/\[\[([^\]]*)\]\]/g, (m, g) => `[[${g.split("|").join(PH_LINK)}]]`);
const unmask = (s) => s.split(PH_LINK).join("|").split(PH_TPL).join("|");

function parseRows(text) {
  const mask = maskPipes(text);
  const chunks = mask.split("\n|-").slice(1);
  return chunks
    .map((chunk) =>
      chunk
        .split("\n|").join(PH_SEP)   // field start on its own line
        .split("||").join(PH_SEP))   // inline field separator
    .map((chunk) =>
      chunk.split(PH_SEP).map((f) => unmask(f.replace(/\n/g, " ").replace(/^[|:]*\s*/, "")).trim()))
    .map((fields) => (fields[0] === "" ? fields.slice(1) : fields));
}

const linkTarget = (field) => {
  const m = field.match(/\[\[([^\]]+)/);
  if (!m) return null;
  const t = m[1].split("|")[0].split(new RegExp(PH_LINK, "g")).join("").trim();
  if (/^(File|Category):/i.test(t)) return null;
  return t;
};
const fileRef = (field) => {
  const m = field.match(/\[\[File:(\S+?)(?:\]\]|(?:\s*\|\s*[^\]]*\]\]))/);
  return m ? m[1].trim() : null;
};

// ---- 1. Shikigami roster ---------------------------------------------------
const rosterRows = parseRows(await wikitext("Shikigami/List/All"));
if (process.env.DBG) {
  console.log("rosterRows:", rosterRows.length, JSON.stringify(rosterRows.slice(0, 3), null, 1));
}
const shikigami = rosterRows.filter((r) => r.length >= 4).map((f) => {
  const rawNo = f[0].trim();
  const file = fileRef(f[1]);
  const en = linkTarget(f[2]) ?? "";
  let cn = "", jp = "", gl = "";
  if (f[2].includes("<br")) {
    const seg = f[2].split(/<br\s*\/?>/)[1]?.replace(/\[\[.*?\]\]/g, "").trim() ?? "";
    const parts = seg.split(/\s+-\s+/).filter(Boolean);
    cn = parts[0] ?? ""; jp = parts[1] ?? ""; gl = parts[2] ?? parts[1] ?? "";
  }
  const rarity = f[3]?.match(/data-sort-value="([^"]+)"/)?.[1] ?? "";
  return {
    no: /^\d+$/.test(rawNo) ? parseInt(rawNo) : null,
    en, cn, jp, gl: gl || en,
    rarity,
    image: file ? `File:${file}` : null,
    wiki: en ? `https://onmyoji.fandom.com/wiki/${encodeURIComponent(en.replace(/ /g, "_"))}` : null,
  };
}).filter((s) => s.en && s.rarity);

// ---- 2. Attributes (MIN / MAX tabs) ----------------------------------------
const attrText = await wikitext("Shikigami/Attributes");
const attrTabs = {};
const tabPos = [...attrText.matchAll(/\|-\| ?([A-Za-z]+)\s*=/g)];
const sections = [];
for (let i = 0; i < tabPos.length; i++) {
  const start = tabPos[i].index + tabPos[i][0].length;
  const end = i + 1 < tabPos.length ? tabPos[i + 1].index : attrText.length;
  sections.push({ tab: tabPos[i][1].toLowerCase(), text: attrText.slice(start, end) });
}
const statKeys = ["atk", "hp", "def", "spd", "crit", "critdmg", "effhit", "effres"];
for (const sec of sections) {
  const rows = parseRows(sec.text).filter((r) => r.length >= 9).map((r) => {
    const no = r[0].match(/File:(\d+)/)?.[1];
    const en = linkTarget(r[0]);
    const stats = {};
    statKeys.forEach((k, i) => {
      stats[k] = parseFloat((r[i + 1] ?? "").replace(/%/g, "")) || 0;
    });
    return { no: no ? parseInt(no) : null, en, ...stats };
  }).filter((r) => r.no != null);
  if (rows.length) attrTabs[sec.tab] = rows;
}

// ---- 3. Souls --------------------------------------------------------------
const soulRows = parseRows(await wikitext("Soul/List/Released"));
const souls = soulRows.filter((r) => r.length >= 4).map((f) => {
  const en = linkTarget(f[2]) ?? "";
  let cn = "", jp = "";
  if (f[2].includes("<br")) {
    const seg = f[2].split(/<br\s*\/?>/)[1]?.replace(/\[\[.*?\]\]/g, "").trim() ?? "";
    const parts = seg.split(/\s+-\s+/).filter(Boolean);
    cn = parts[0] ?? ""; jp = parts[1] ?? "";
  }
  return {
    no: /^\d+$/.test(f[0].trim()) ? parseInt(f[0].trim()) : null,
    en, cn, jp,
    type: f[3].trim(),
    image: fileRef(f[1]) ? `File:${fileRef(f[1])}` : null,
    wiki: en ? `https://onmyoji.fandom.com/wiki/${encodeURIComponent(en.replace(/ /g, "_"))}` : null,
  };
}).filter((s) => s.en && s.no != null);

// ---- 4. Infobox enrichment per shikigami (batched queries) ------------------
const titles = shikigami.filter((s) => s.no != null).map((s) => s.en);
const details = {};
for (let i = 0; i < titles.length; i += 25) {
  const batch = titles.slice(i, i + 25);
  const url = `${API}?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&redirects=1&titles=${batch.map(encodeURIComponent).join("%7C")}`;
  const j = await fetchRetry(url);
  // resolve redirect map for details indexing
  const redir = {};
  for (const rr of j.query?.redirects ?? []) redir[rr.to] = rr.from;
  for (const p of j.query?.pages ?? []) {
    const wt = p.revisions?.[0]?.slots?.main?.content;
    if (!wt) continue;
    const box = wt.match(/\{\{ShikigamiBox([\s\S]*?)\n\}\}/);
    if (!box) continue;
    const grab = (key) => {
      const m = box[1].match(new RegExp(`\\n\\|\\s*${key}\\s*=(.*?)\\n\\|`, "s"));
      if (!m) return undefined;
      let v = m[1].trim();
      v = v.split(/<br\s*\/?>/).join(" · ")
        .replace(/<poem>/g, "").replace(/<\/poem>/gi, "")
        .replace(/\{\{[^}]*\}\}/g, "").replace(/\[\[/g, "").replace(/\]\]/g, "");
      return v;
    };
    const data = { cv: grab("cv"), intro: grab("intro"), method: grab("method") };
    if (data.intro) data.intro = data.intro.replace(/\s+/g, " ");
    if (data.method) data.method = data.method.replace(/\s*\*\s*/g, " • ").replace(/^(^|\s*)•\s*/g, "").trim();
    details[p.title] = data;
    if (redir[p.title]) details[redir[p.title]] = data;
  }
  await sleep(300);
}
for (const s of shikigami) Object.assign(s, details[s.en] ?? {});
for (const s of souls) { if (!s.type) continue; }

// ---- 5. Resolve image URLs (batched imageinfo) ------------------------------
function unique(list) { return [...new Set(list.filter(Boolean))]; }
const files = unique([
  ...shikigami.map((s) => s.image?.slice(5)),
  ...souls.map((s) => s.image?.slice(5)),
  "SSR.png", "SR.png", "R.png", "SP.png", "N.png",
]);
const fileUrls = {};
for (let i = 0; i < files.length; i += 20) {
  const batch = files.slice(i, i + 20).map((f) => `File:${f}`);
  const url = `${API}?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url&iiurlwidth=120&titles=${batch.map(encodeURIComponent).join("%7C")}`;
  const j = await fetchRetry(url);
  if (j.error) console.warn(`imageinfo batch ${i}: ${j.error.code} ${j.error.info} URL=${url.slice(0, 240)}`);
  for (const p of j.query?.pages ?? []) {
    const info = p.imageinfo?.[0];
    if (!info) continue;
    fileUrls[p.title.replace(/^File:/, "")] = { url: info.url, thumb: info.thumburl ?? info.url };
  }
  await sleep(250);
}
for (const s of shikigami) if (s.image) s.imageUrl = fileUrls[s.image.slice(5)]?.thumb ?? null;
for (const s of souls) if (s.image) s.imageUrl = fileUrls[s.image.slice(5)]?.thumb ?? null;
for (const s of shikigami) s.rarityIcon = fileUrls[s.rarity + ".png"]?.thumb ?? null;

// ---- write ------------------------------------------------------------------
await fs.writeFile(path.join(OUT, "shikigami.json"), JSON.stringify(shikigami, null, 2));
await fs.writeFile(path.join(OUT, "souls.json"), JSON.stringify(souls, null, 2));
await fs.writeFile(path.join(OUT, "stats.json"), JSON.stringify(attrTabs, null, 2));

console.log(`shikigami: ${shikigami.length}`);
console.log(`souls: ${souls.length}`);
console.log(`infobox details matched: ${Object.keys(details).length}/${titles.length}`);
console.log(`stat tabs: ${Object.entries(attrTabs).map(([k, v]) => `${k}=${v.length}`).join(", ")}`);
console.log(`image urls resolved: ${Object.keys(fileUrls).length}/${files.length}`);
console.log("rarity counts:", JSON.stringify(shikigami.reduce((a, s) => (a[s.rarity] = (a[s.rarity] ?? 0) + 1, a), {})));
