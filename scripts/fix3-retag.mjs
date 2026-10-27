/**
 * fix3-retag.mjs — re-run the wiki |Type= retag with correct title normalization
 * (MediaWiki API returns page titles with spaces; our keys had underscores).
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const API = "https://onmyoji.fandom.com/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const write = (p, d) => fs.writeFileSync(path.join(ROOT, p), JSON.stringify(d, null, 2) + "\n");

const normTitle = (t) => String(t ?? "").replace(/_/g, " ").trim();

function baseName(n) {
  let s = String(n ?? "");
  const paren = s.match(/^([^（(]*)/)?.[1] ?? s;
  s = paren.replace(/[|*"'“。”；;：:,,.\n]/g, " ").replace(/\s+/g, " ").trim();
  return s.toLowerCase();
}
const norm = (s) => String(s ?? "").toLowerCase().replace(/[\s'"“。”·•、,._-]/g, "");

async function apiTitles(titles) {
  const url = API + "?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&titles=" +
    titles.map((t) => encodeURIComponent(normTitle(t))).join("|");
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) {
        const j = await r.json();
        return j.query?.pages ?? [];
      }
      console.log("  HTTP", r.status, "retrying");
    } catch (e) { /* retry */ }
    await sleep(600);
  }
  return [];
}

function skillTypes(wikitext) {
  const out = [];
  const re = /\{\{SkillBox\b([\s\S]*?)(?=\{\{SkillBox\b|\z)/gi;
  for (const m of wikitext.matchAll(re)) {
    const box = m[1];
    const name = /\|\s*Name\s*=\s*([^\n|]*)/.exec(box)?.[1]?.trim() ?? "";
    let type = /\|\s*Type\s*=\s*([^\n|]*)/.exec(box)?.[1]?.trim() ?? "";
    type = type.replace(/\s+/g, " ");
    let canonical;
    const t = type.toLowerCase();
    if (t.startsWith("normal")) canonical = "Normal";
    else if (t.startsWith("passive")) canonical = "Passive";
    else if (t.startsWith("special") || t.startsWith("speical")) canonical = "Special";
    else if (t.startsWith("|onibi") || t.startsWith("onibi")) canonical = "Special";
    else if (t.startsWith("immunity") || t.startsWith("active") || t.startsWith("linked")) canonical = "Special";
    else canonical = null;
    if (name) out.push({ name, rawType: type || "(blank)", type: canonical });
  }
  return out;
}

const shik = read("data/shikigami.json");
const mains = shik.map((s) => {
  const seg = decodeURIComponent(s.wiki || "").split("/wiki/")[1] ?? "";
  return normTitle(seg) + "/Main";
});

/* collect wikitext by title */
const contentByTitle = new Map();
for (let i = 0; i < mains.length; i += 20) {
  const chunk = mains.slice(i, i + 20);
  const pages = await apiTitles(chunk);
  for (const p of pages) {
    const c = p?.revisions?.[0]?.slots?.main?.content;
    if (c && !p.missing) contentByTitle.set(normTitle(p.title), c);
    else if (p.missing) contentByTitle.set(normTitle(p.title), null); // mark as missing page
  }
  await sleep(250);
}
console.log("fetched /Main wikitext:", contentByTitle.size, "pages");

/* fallback: try base page for the /Main-missing ones */
const fallbackTitles = mains.filter((t) => !contentByTitle.has(normTitle(t))).map((t) => t.replace(/\/Main$/, ""));
for (let i = 0; i < fallbackTitles.length; i += 20) {
  const chunk = fallbackTitles.slice(i, i + 20);
  const pages = await apiTitles(chunk);
  for (const p of pages) {
    const c = p?.revisions?.[0]?.slots?.main?.content;
    if (c && !p.missing) contentByTitle.set(normTitle(p.title) + "/Main", c);
  }
  await sleep(250);
}
console.log("total after fallback:", contentByTitle.size);

let matched = 0, unmatchedSkill = 0, noPage = [];
const unmatchedList = [];
shik.forEach((s, i) => {
  const wt = contentByTitle.get(normTitle(mains[i]));
  if (!wt) { noPage.push(s.en); return; }
  const boxes = skillTypes(wt);
  if (!boxes.length) { unmatchedList.push(s.en + " (no SkillBox)"); return; }
  for (const k of s.skills ?? []) {
    const want = norm(baseName(k.name));
    if (!want) { unmatchedSkill++; continue; }
    const hit = boxes.find((b) => norm(baseName(b.name)) === want)
      ?? boxes.find((b) => { const bn = norm(baseName(b.name)); return bn.length > 4 && (want.startsWith(bn) || bn.startsWith(want)); });
    if (!hit || !hit.type) { unmatchedSkill++; unmatchedList.push(s.en + " :: " + k.name); continue; }
    k.type = hit.type;
    k.group = hit.type;
    matched++;
  }
});

write("data/shikigami.json", shik);
console.log(`retagged ${matched} skills; unmatched skills: ${unmatchedSkill}`);
const dist = {};
for (const s of shik) for (const k of s.skills ?? []) dist[k.type + "/" + k.group] = (dist[k.type + "/" + k.group] || 0) + 1;
console.log("distribution:", JSON.stringify(dist));
if (noPage.length) console.log("no wikitext page:", noPage.join(", "));
if (unmatchedList.length) console.log("unmatched details:\n" + unmatchedList.map((x) => "  " + x).join("\n"));
