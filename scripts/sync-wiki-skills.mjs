/**
 * Fandom resync for shikigami skills + status icon map.
 *
 * Sources: {{SkillBox}} templates on <Shikigami>/Main raw wikitext pages.
 * - fills EMPTY/short descriptions, missing names, lines, upgrade rows
 * - collects ;Status (jp) : [[File:BuffNN.png]] : '''Types''' — glossary
 *   entries into data/status-icons.json (name → icon file + URL)
 */
import fs from "fs";
import crypto from "crypto";

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const API = "https://onmyoji.fandom.com/api.php";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWikitext(title) {
  /* titles may arrive pre-encoded ("Kagura_%26_Sadaharu") or raw — normalize to single encode */
  let safe = title;
  try { safe = encodeURIComponent(decodeURIComponent(title)); } catch { safe = encodeURIComponent(title); }
  const url = `${API}?action=query&titles=${safe}&prop=revisions&rvprop=content&rvslots=main&format=json&formatversion=2`;
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) { await sleep(700 * (attempt + 1)); continue; }
    const j = await res.json();
    const page = j?.query?.pages?.[0];
    if (page?.revisions?.[0]?.slots?.main?.content) return page.revisions[0].slots.main.content;
    if (page?.missing) return null;
    await sleep(700 * (attempt + 1));
  }
  return null;
}

/* parse every {{SkillBox|...}} template body */
function parseSkillBoxes(wt) {
  const blocks = [];
  const re = /\{\{SkillBox\s*([\s\S]*?)\n\}\}/g;
  for (const m of wt.matchAll(re)) {
    const fields = {};
    const body = m[1];
    const fre = /^\|\s*([A-Za-z][A-Za-z0-9_]*?)\s*=\s*([\s\S]*?)(?=\n\|(?![^\n]*=)|\n\}\})/gm;
    const f2 = /^\|\s*([A-Za-z][A-Za-z0-9_]*)\s*=\s*([\s\S]*?)(?=\n\|([A-Z][A-Za-z0-9_]*)\s*=|\Z)/g;
    // simpler field loop: split on lines starting with |Field=
    const tokens = body.split(/\n(?=\|[A-Za-z][A-Za-z0-9_]*\s*=)/);
    for (const t of tokens) {
      const mm = t.match(/^\|\s*([A-Za-z][A-Za-z0-9_]*)\s*=\s*([\s\S]*)$/);
      if (!mm) continue;
      fields[mm[1]] = mm[2].trim();
    }
    if (fields.Name) blocks.push(fields);
  }
  return blocks;
}

const clean = (s) => String(s ?? "")
  .replace(/\[\[File:[^\]]+\]\]/gi, "")            /* drop inline status icon markers */
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/\n-{4,}\n?/g, "\n")                    /* wikitext separator lines */
  .replace(/\{\{[^{}]*\}\}/g, "")                  /* leftover inline templates (Popup etc.) */
  .replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/[ \t]+/g, " ")
  .replace(/\n{2,}/g, "\n")
  .trim();

/* glossary: ";Name (jp)\n:[[File:X]]\n:'''Buff, Status''': text" */
function parseSkillGlossary(descWiki) {
  const icons = [];
  const re = /;\s*([^\n:;]+?)\s*(?:(?:\(([^)]*)\)\s*)?)\n+:\s*\[\[File:([^\]|]+)(?:\|[^\]]*)?\]\]([\s\S]*?)(?=;\s*[^\n:]+\n|\n----|\Z)/g;
  for (const m of descWiki.matchAll(re)) {
    icons.push({ name: m[1].trim().toLowerCase(), jp: (m[2] ?? "").trim(), file: m[3].trim(), rest: m[4] });
  }
  /* looser: name + icon anywhere */
  const loose = /;\s*([^\n:]+?)\s*(?:\(([^)]*)\)\s*)?\n*:\s*\[\[File:([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  for (const m of descWiki.matchAll(loose)) {
    icons.push({ name: m[1].trim().toLowerCase(), jp: (m[2] ?? "").trim(), file: m[3].trim(), rest: "" });
  }
  return icons;
}

function fileUrl(file) {
  if (!/\.png$/i.test(file)) file += ".png";
  const h = crypto.createHash("md5").update(file).digest("hex");
  return `https://static.wikia.nocookie.net/onmyoji/images/${h[0]}/${h.slice(0, 2)}/${encodeURIComponent(file)}/revision/latest`;
}

const normName = (n) => String(n ?? "").replace(/^\"'\"|\"'\"$/g, "").trim().toLowerCase();
const baseName = (n) => String(n ?? "").split("(")[0].trim().toLowerCase();

async function main() {
  const iconsOnly = process.argv.includes("--icons");
  const data = JSON.parse(fs.readFileSync("data/shikigami.json", "utf8"));
  const shortList = [];
  for (const s of data) {
    for (const k of (s.skills ?? [])) {
      const dl = String(k.description ?? "").length;
      if (dl < 60) shortList.push({ s, k });   /* every short skill; pages deduped below */
    }
  }
  let pages = [...new Set(shortList.map(({ s }) => s.wiki?.split("/wiki/")[1]))].filter(Boolean);
  if (iconsOnly) {
    /* harvest from every shikigami page so common statuses (blooming, etc.) all land in the map */
    pages = [...new Set(data.map((s) => s.wiki?.split("/wiki/")[1]).filter(Boolean))];
  }
  console.log("pages to fetch:", pages.length, iconsOnly ? "(icons mode)" : "");

  const iconMap = JSON.parse(fs.existsSync("data/status-icons.json")
    ? fs.readFileSync("data/status-icons.json", "utf8") : "{}");
  let filled = 0, patchedPages = 0, notFound = [], noMatch = [];

  for (const title of pages) {
    const mainTitle = title + "/Main";
    let wt = await getWikitext(mainTitle);
    if (!wt) wt = await getWikitext(title);   /* some entries put skills on the page itself */
    if (!wt) { notFound.push(title); continue; }

    /* glossary statuses + icon map from this page */
    for (const m of wt.matchAll(/\|\s*Description\s*=\s*([\s\S]*?)(?=\n\|(?:L[2-5]|Line|Onibi|Cooldown|Type|Name|Image)\s*=|\n\}\})/g)) {
      for (const g of parseSkillGlossary(m[1])) {
        const file = g.file.replace(/\.(png)$/i, "") + ".png";
        if (g.name && !iconMap[g.name]) iconMap[g.name] = { file, url: fileUrl(file), jp: g.jp };
      }
    }

    const s = shortList.find(({ s: sh }) => sh.wiki?.endsWith("/" + title) || sh.wiki?.endsWith("/" + title.replace(/_/g, "_")))?.s
      ?? data.find((sh) => (sh.wiki ?? "").endsWith("/" + title));
    const boxes = parseSkillBoxes(wt);
    let patched = false;

    for (const k of (s.skills ?? [])) {
      const want = baseName(k.name);
      const idx = k.__idx != null ? k.__idx : null;
      /* match by base name, else positional */
      let hit = boxes.find((b) => baseName(b.Name) === want);
      if (!hit && !want) hit = boxes[(s.skills ?? []).indexOf(k)] ?? null;
      if (!hit) {
        noMatch.push({ no: s.no, skill: k.name });
        continue;
      }
      const dl = String(k.description ?? "").length;
      if (dl < 60 && hit.Description) {
        k.description = clean(hit.Description);
        patched = true; filled++;
      }
      if (!k.line && hit.Line) { k.line = clean(hit.Line); patched = true; }
      if (!k.name || /^\(\s*\)\s*$/.test(k.name.trim())) {
        if (hit.Name) { k.name = clean(hit.Name); patched = true; }
      }
      /* fill empty upgrade rows */
      const ups = (k.upgrades ?? []);
      for (let lv = 2; lv <= 5; lv++) {
        const key = "L" + lv;
        if (hit[key] && !ups.some((u) => u.lvl === lv)) {
          ups.push({ lvl: lv, text: clean(hit[key]) });
          ups.sort((a, b) => a.lvl - b.lvl);
          patched = true;
        }
      }
      k.upgrades = ups;
    }
    if (patched) patchedPages++;
    await sleep(280);
  }

  fs.writeFileSync("data/shikigami.json", JSON.stringify(data, null, 2) + "\n");
  fs.writeFileSync("data/status-icons.json", JSON.stringify(iconMap, null, 2) + "\n");
  console.log("filled descriptions:", filled, "| pages patched:", patchedPages);
  console.log("status icons collected:", Object.keys(iconMap).length);
  console.log("pages not found:", notFound.length, notFound.slice(0, 8));
  console.log("skills with no box match:", noMatch.slice(0, 20));
}

await main();
