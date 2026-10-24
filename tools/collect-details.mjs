// collect-details.mjs — deepen the dataset so the site is fully self-contained.
// 1) Per-shikigami <Name>/Main wikitext → StatBox (growth/awakened stats), SkillBox
//    (skills: name/type/onibi/cooldown/voice line/description/level-ups), BioUnlock.
// 2) Soul pages → MitamaBox: 2-set / 4-set effects and drop locations.
// 3) Downloads skill icons into assets/skills/.
// Run after tools/collect.mjs. Updates data/*.json in place.
import fs from "node:fs/promises";
import path from "node:path";

const API = "https://onmyoji.fandom.com/api.php";
const HDR = { "User-Agent": "OnmyojiStyleSite/1.0 (personal data collection; local project)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchRetry(url, tries = 5, base = 800) {
  for (let t = 0; t < tries; t++) {
    try {
      const r = await fetch(url, { headers: HDR });
      const ct = r.headers.get("content-type") ?? "";
      if (r.ok && ct.includes("json")) return await r.json();
      throw new Error(`status=${r.status} ct=${ct}`);
    } catch (e) {
      if (t === tries - 1) throw e;
      await sleep(base * 2 ** t);
    }
  }
}

const clean = (s) => (s ?? "")
  .replace(/<poem>/gi, "").replace(/<\/poem>/gi, "")
  .replace(/\{\{Item\|([^}|]*)\|([^}]*)\}\}/g, (m, a, b) => /^\d+$/.test(a) ? `Shikigami No.${a} ×${b}` : `${a} ×${b}`)
  .replace(/\{\{PVP zones\}\}/g, "PVN zones")
  .replace(/\{\{[^{}]*\}\}/g, "")
  .replace(/\[\[File:[^\]]*\]\]/g, "")
  .replace(/\[\[([^\]]*?)\|([^\]]*?)\]\]/g, "$2")
  .replace(/\[\[([^\]]*?)\]\]/g, "$1")
  .replace(/\s+/g, " ")
  .trim();

// ---------------- helpers ----------------
const fieldGrab = (body, key) => {
  const m = body.match(new RegExp(`\\n\\|\\s*${key}\\s*=([^}}]*?)(?=\\n\\|\\s*[A-Za-z]|$)`));
  return m ? m[1].trim() : undefined;
};

function parseStatBox(text) {
  const m = text.match(/\{\{StatBox([\s\S]*?)\n\}\}/);
  if (!m) return null;
  const body = m[1];
  const v = (key) => {
    const raw = fieldGrab2(body, key);
    if (raw == null || raw === "?") return null;
    return raw.startsWith("#") ? raw.slice(1) : raw; // growth currently letters; defensive
  };
  const gradeOf = (key) => fieldGrab2(body, key);
  const pick = (base) => ({
    lv1: v(`${base}1` === "Cdmg1" ? "Cdmg1" : base + "1"),
    lv2: v(base + "2"),
    max: v(base === "Cdmg" ? "CdmgMax2" : `${base}Max` + "2"),
  });
  return {
    base: { atk: pick("Atk"), hp: pick("Hp"), def: pick("Def"), spd: pick("Spd"), crit: pick("Crit"), cdmg: pick("Cdmg"), acc: { lv1: v("Acc1"), lv2: v("Acc2"), max: v("AccMax2") }, res: { lv1: v("Res1"), lv2: v("Res2"), max: v("ResMax2") } },
    grades: {
      atk: [gradeOf("AtkGr1"), gradeOf("AtkGr2")], hp: [gradeOf("HpGr1"), gradeOf("HpGr2")],
      def: [gradeOf("DefGr1"), gradeOf("DefGr2")], spd: [gradeOf("SpdGr1"), gradeOf("SpdGr2")],
      crit: [gradeOf("CritGr1"), gradeOf("CritGr2")],
    },
  };
}
function fieldGrab2(body, key) {
  const m = body.match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n]*)\\n`));
  return m ? m[1].trim() : m;
}

function parseSkills(text) {
  // split tabber groups:  |-| Normal= ... etc.
  const groups = [];
  const tabber = text.match(/<tabber>([\s\S]*?)<\/tabber>/s);
  const scope = tabber ? tabber[1] : text;
  const headers = [...scope.matchAll(/\|-\| ?([A-Za-z& ]+?)\s*=/g)];
  // fallback: single group
  const parts = [];
  for (let i = 0; i < headers.length; i++) {
    const start = headers[i].index + headers[i][0].length;
    const end = i + 1 < headers.length ? headers[i + 1].index : scope.length;
    parts.push({ group: headers[i][1].trim(), text: scope.slice(start, end) });
  }
  const blocks = [];
  for (const part of parts) {
    for (const b of part.text.matchAll(/\{\{SkillBox([\s\S]*?)\n\}\}/g)) blocks.push({ group: part.group, body: b[1] });
  }
  return blocks.map(({ group, body }) => {
    const desc = body.match(/\n\|\s*Description\s*=(.*?)(?=\n\s*-{4}|\n\|\s*L\d|\n}})/s)?.[1] ?? "";
    const ups = [...body.matchAll(/\n\|\s*L(\d)\s*=(.*)/g)].map((m) => ({ lvl: +m[1], text: clean(m[2]) }));
    return {
      group,
      image: body.match(/\n\|\s*Image\s*=\s*(\S+)/)?.[1] ?? null,
      name: clean(body.match(/\n\|\s*Name\s*=(.*)/)?.[1]),
      type: body.match(/\n\|\s*Type\s*=\s*(\S+)/)?.[1] ?? null,
      onibi: +(body.match(/\n\|\s*Onibi\s*=\s*(\d+)/)?.[1] ?? 0),
      cooldown: +(body.match(/\n\|\s*Cooldown\s*=\s*(\d+)/)?.[1] ?? 0),
      line: clean(body.match(/\n\|\s*Line\s*=(.*)/)?.[1]),
      description: clean(desc),
      upgrades: ups,
      icon: null, // filled after icon resolution
    };
  }).filter((k) => k.name);
}

function parseBio(text) {
  const m = text.match(/\{\{BioUnlock([\s\S]*?)\n\}\}/);
  if (!m) return null;
  const out = [];
  for (let i = 1; i <= 3; i++) {
    const c = clean(fieldGrab2(m[1], `condition${i}`));
    const rw = clean(fieldGrab2(m[1], `reward${i}`));
    if (c) out.push({ condition: c, reward: rw });
  }
  return out.length ? out : null;
}

// ---------------- shikigami detail batches ----------------
const shikigami = JSON.parse(await fs.readFile("data/shikigami.json", "utf8"));
const souls = JSON.parse(await fs.readFile("data/souls.json", "utf8"));

const targets = shikigami.filter((s) => s.no != null).map((s) => `${s.en}/Main`);
const statFound = [];
const skillIconIds = new Set();
let bioCount = 0;

for (let i = 0; i < targets.length; i += 25) {
  const batch = targets.slice(i, i + 25);
  console.log(`[shiki] batch ${i}/${targets.length}`);
  const url = `${API}?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&redirects=1&titles=${batch.map(encodeURIComponent).join("%7C")}`;
  const j = await fetchRetry(url);
  // map (normalized/redirected) titles back to requested ones
  const byRespTitle = {};
  for (const p of j.query?.pages ?? []) {
    const wt = p.revisions?.[0]?.slots?.main?.content;
    if (wt) byRespTitle[p.title] = wt;
  }
  const alias = {};
  for (const n of j.query?.normalized ?? []) alias[n.from] = n.to;
  for (const red of j.query?.redirects ?? []) alias[red.from] = red.to;
  for (let k = 0; k < batch.length; k++) {
    const req = batch[k];
    const resolved = alias[req] ?? req;
    const wt = byRespTitle[resolved];
    const s = shikigami.find((x) => `${x.en}/Main` === req);
    if (!s || !wt) continue;
    s.stats2 = parseStatBox(wt);
    if (s.stats2) statFound.push(s.no);
    const sk = parseSkills(wt);
    for (const k2 of sk) if (k2.image) skillIconIds.add(k2.image);
    if (sk.length) s.skills = sk;
    const bio = parseBio(wt);
    if (bio) { s.bio = bio; bioCount++; }
  }
  await sleep(300);
}

// ---------------- soul detail batches ----------------
for (let i = 0; i < souls.length; i += 25) {
  console.log(`[souls] batch ${i}/${souls.length}`);
  const batch = souls.slice(i, i + 25).map((s) => s.en);
  const url = `${API}?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&redirects=1&titles=${batch.map(encodeURIComponent).join("%7C")}`;
  const j = await fetchRetry(url);
  const byRespTitle = {};
  for (const p of j.query?.pages ?? []) {
    const wt = p.revisions?.[0]?.slots?.main?.content;
    if (wt) byRespTitle[p.title] = wt;
  }
  const alias = {};
  for (const n of j.query?.normalized ?? []) alias[n.from] = n.to;
  for (const red of j.query?.redirects ?? []) alias[red.from] = red.to;
  for (const s of souls.slice(i, i + 25)) {
    const wt = byRespTitle[alias[s.en] ?? s.en];
    if (!wt) continue;
    const m = wt.match(/\{\{MitamaBox([\s\S]*?)\n\}\}/);
    if (!m) continue;
    s.combo2 = clean(fieldGrab2(m[1], "combo2"));
    s.combo4 = clean(fieldGrab2(m[1], "combo4"));
    const locRaw = m[1].match(/\n\|\s*location\s*=([\s\S]*?)(?=\n\}\}|$)/)?.[1] ?? "";
    s.location = locRaw
      .split(/\n\s*\*+\s*/).filter(Boolean)
      .map((x) => clean(x.replace(/^\*+\s*/, ""))).filter(Boolean)
      .join(" · ");
    s.version = clean(fieldGrab2(m[1], "version"));
  }
  await sleep(300);
}

// ---------------- skill icons: resolve + download ----------------
await fs.mkdir("assets/skills", { recursive: true });
const iconFiles = [...skillIconIds].map((id) => `File:${id.match(/\.\w+$/) ? id : id + ".png"}`);
const iconUrls = {};
for (let i = 0; i < iconFiles.length; i += 20) {
  console.log(`[icons] resolve ${i}/${iconFiles.length}`);
  const batch = iconFiles.slice(i, i + 20);
  const url = `${API}?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url&titles=${batch.map(encodeURIComponent).join("%7C")}`;
  const j = await fetchRetry(url);
  for (const p of j.query?.pages ?? []) {
    const info = p.imageinfo?.[0];
    if (info) iconUrls[p.title.replace(/^File:/, "")] = info.url;
  }
  await sleep(250);
}
let iconOk = 0, iconFail = 0;
for (const s of shikigami) {
  for (const sk of s.skills ?? []) {
    if (!sk.image) continue;
    const base = sk.image.match(/\.\w+$/) ? sk.image : sk.image + ".png";
    sk.icon = `assets/skills/${base}`;
    if (iconUrls[base]) {
      const dest = path.join("assets", "skills", base);
      let exists = true;
      try { await fs.access(dest); } catch { exists = false; }
      if (exists) { sk.icon = `assets/skills/${base}`; continue; } // already mirrored
      try {
        const r = await fetch(iconUrls[base], { headers: HDR });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
        iconOk++;
      } catch (e) { console.warn(`skill icon fail ${base}: ${e.message}`); iconFail++; }
      await sleep(100);
    }
  }
}

await fs.writeFile("data/shikigami.json", JSON.stringify(shikigami, null, 2));
await fs.writeFile("data/souls.json", JSON.stringify(souls, null, 2));

console.log(`shikigami statboxes: ${statFound.length}/${targets.length}`);
console.log(`shikigami with skills: ${shikigami.filter((s) => s.skills?.length).length}`);
console.log(`biographies parsed: ${bioCount}`);
console.log(`souls with set effects: ${souls.filter((s) => s.combo2).length}/${souls.length}`);
console.log(`skill icons downloaded: ${iconOk}, failed: ${iconFail}`);
