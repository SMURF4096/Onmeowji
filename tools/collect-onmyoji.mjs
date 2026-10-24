// collect-onmyoji.mjs — collect the playable Onmyoji (O1–O4), Champions (O5–O7)
// and Bondlings into data/onmyoji.json + data/bondlings.json, mirroring their art.
// Run after the other collectors. Sources (public wiki read endpoints):
//   * Category:Onmyoji pages        → {{OnmyojiBox}}
//   * <Name>/Main                   → {{StatBox/Onmyo}} + {{OnmyoujiSkillBox}}
//   * pageimages API                → lead portrait (O*skin1.png)
//   * Bondlings/List                → table of the eight bondlings
//   * "<Name> (Bondling)" pages     → skill text + skin list
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
async function wikitext(page) {
  const j = await fetchRetry(`${API}?action=parse&format=json&formatversion=2&prop=wikitext&page=${encodeURIComponent(page)}`);
  return j.parse?.wikitext ?? "";
}

const clean = (s) => (s ?? "")
  .replace(/<poem>/gi, "").replace(/<\/poem>/gi, "")
  .replace(/\{\{Item\|([^}|]*)\|([^}]*)\}\}/g, (m, a, b) => /^\d+$/.test(a) ? `Shikigami No.${a} ×${b}` : `${a} ×${b}`)
  .replace(/\{\{PVP zones\}\}/g, "PVP zones")
  .replace(/\{\{[^{}]*\}\}/g, "")
  .replace(/'''''/g, "").replace(/'''([^']*)'''/g, "$1").replace(/''([^']*)''/g, "$1")
  .replace(/\[\[File:[^\]]*\]\]/g, "")
  .replace(/\[\[([^\]]*?)\|([^\]]*?)\]\]/g, "$2")
  .replace(/\[\[([^\]]*?)\]\]/g, "$1")
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/[\uff1a]/g, ":")
  .replace(/\s+/g, " ")
  .trim();

const single = (body, key) => body.match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n]*?)(?=\\r?\\n|$)`))?.[1]?.trim();

// name fields look like "安倍晴明<br>Ānbèi qíngmíng" — first segment is the native name
const splitName = (v) => clean(String(v ?? "").split("<br>")[0]);

// ---------------- onmyoji + champions ----------------
const TITLES = ["Seimei", "Kagura", "Hiromasa", "Yao Bikuni", "Minamoto no Yorimitsu", "Fujiwara no Michitsuna", "Fujiwara no Michinaga"];

// lead portraits via pageimages (original)
const pi = await fetchRetry(`${API}?action=query&format=json&formatversion=2&prop=pageimages&piprop=original&titles=${TITLES.map(encodeURIComponent).join("%7C")}`);
const portrait = {};
for (const p of pi.query?.pages ?? []) if (p.original?.source) portrait[p.title] = p.original.source;

const chars = [];
const onmyojiSkillIcons = new Set();

for (const title of TITLES) {
  console.log(`[char] ${title}`);
  const wt = await wikitext(title);
  const box = wt.match(/\{\{OnmyojiBox([\s\S]*?)\n\}\}/);
  const no = single(box?.[1] ?? "", "no").toUpperCase();
  const role = /^\s*[Oo][1-4]\s*$/.test(no) ? "onmyoji" : "champion";
  const main = await wikitext(`${title}/Main`);

  // fallback intro: the <poem> About text on the Main subpage
  let intro = single(box?.[1] ?? "", "intro");
  if (!intro) {
    const about = main.match(/==\s*About\s*==([\s\S]*?)(?=\n==|\n<gallery)/)?.[1] ?? "";
    intro = clean(about.replace(/<poem>|<\/poem>/gi, ""));
  }

  // stats — {{StatBox/Onmyo}}: Lv1 + Max columns only (no growth grades)
  let stats2 = null;
  const sb = main.match(/\{\{StatBox\/Onmyo([\s\S]*?)\n\}\}/);
  if (sb) {
    const g = (k) => { const v = single(sb[1], k); return v && v !== "?" ? v : null; };
    stats2 = {
      atk: { lv1: g("Atk1"), max: g("AtkMax2") },
      hp: { lv1: g("Hp1"), max: g("HpMax2") },
      def: { lv1: g("Def1"), max: g("DefMax2") },
      spd: { lv1: g("Spd1"), max: g("SpdMax2") },
      crit: { lv1: g("Crit1"), max: g("CritMax2") },
      cdmg: { lv1: g("Cdmg1"), max: g("CdmgMax2") },
      effhit: { lv1: g("Acc1"), max: g("AccMax2") },
      effres: { lv1: g("Res1"), max: g("ResMax2") },
    };
  }

  // skills — {{OnmyoujiSkillBox}} (no tabber groups, no onibi for onmyoji)
  const skills = [];
  for (const b of main.matchAll(/\{\{OnmyoujiSkillBox([\s\S]*?)\n\}\}/g)) {
    const body = b[1];
    const desc = body.match(/\n\|\s*Description\s*=(.*?)(?=\n\s*-{4}|\n\|\s*L\d|\n}})/s)?.[1] ?? "";
    const ups = [...body.matchAll(/\n\|\s*L(\d)\s*=(.*)/g)].map((m) => ({ lvl: +m[1], text: clean(m[2]) }));
    const image = body.match(/\n\|\s*Image\s*=\s*(\S+)/)?.[1] ?? null;
    if (image) onmyojiSkillIcons.add(image);
    skills.push({
      image,
      icon: image ? `assets/skills/${image}.png` : null,
      name: clean(body.match(/\n\|\s*Name\s*=(.*)/)?.[1]),
      type: single(body, "Type") ?? null,
      cooldown: +(body.match(/\n\|\s*Cooldown\s*=\s*(\d+)/)?.[1] ?? 0),
      description: clean(desc),
      upgrades: ups,
    });
  }
  chars.push({
    no, role, page: title,
    en: title,
    cn: splitName(single(box?.[1] ?? "", "name_cn")),
    jp: splitName(single(box?.[1] ?? "", "name_jp")),
    gl: single(box?.[1] ?? "", "name_gl"),
    unlock: single(box?.[1] ?? "", "unlock"),
    cv: splitName(single(box?.[1] ?? "", "cv")),
    intro,
    image: null, // filled after download
    imageUrl: portrait[title] ?? null,
    stats2, skills,
  });
  await sleep(250);
}

// ---------------- bondlings ----------------
const listWt = await wikitext("Bondlings/List");
// parse the "All" tab of the tabber: from "|-|All=" to the next "|-|"
const tab = listWt.match(/\|-\|All\s*=([\s\S]*?)(?=\n\|-\|)/);
const tableText = (tab?.[1] ?? listWt);
const rows = tableText.split(/\|-/).filter((r) => /\[\[File:OB\d+/.test(r));

const bondlings = [];
for (const r of rows) {
  const file = r.match(/\[\[File:(OB\d+s1\.png)/)?.[1];
  const link = r.match(/\[\[([^\]|\n]+)\|([^\]|\n]+)\]\]/);
  if (!file || !link) continue;
  const [, page, en] = link;
  const br = r.split(/<br>/)[1] ?? ""; // "茨球 - 茨玉" or ""
  const [cn, jp] = br.split(/\n|-\s/).slice(0, 2).map((x) => clean(x.replace(/^-\s*/, "")));
  const lines = r.split("\n").map((x) => x.trim()).filter(Boolean);
  const area = clean(lines[lines.length - 2] ?? "");
  const type = clean(lines[lines.length - 1] ?? "").trim();
  bondlings.push({ no: file.replace(/s1\.png$/, ""), page, en, cn: cn || null, jp: jp || null, area, type, image: null, imageUrl: null, skins: [], skill: null });
  console.log(`[bondling] ${en}`);
}

for (const b of bondlings) {
  const wt = await wikitext(b.page);
  b.skill = wt.match(/==\s*Skills\s*==\s*\n([\s\S]*?)(?=\n==|=\|)/)?.[1]?.trim() ?? null;
  const g = [...wt.matchAll(/([A-Za-z0-9 _-]*?skin\d+\.png)\|/g)].map((m) => m[1]);
  b.skins = [...new Set(g)];
  await sleep(200);
}

// ---------------- resolve + download images ----------------
const dl = async (url, dest) => {
  let exists = true;
  try { await fs.access(dest); } catch { exists = false; }
  if (exists) return true; // skip-if-exists
  try {
    const r = await fetch(url, { headers: HDR });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
    return true;
  } catch (e) { console.warn(`dl fail ${dest}: ${e.message}`); return false; }
};

// portraits
let portraitsOk = 0;
for (const c of chars) {
  if (!c.imageUrl) continue;
  // .../images/7/76/O1skin1.png/revision/latest — extract the real file name
  const base = c.imageUrl.match(/\/images\/[0-9a-f]\/[0-9a-f]{2}\/([^/?]+)/)?.[1];
  if (!base) continue;
  c.image = `assets/onmyoji/${base}`;
  if (await dl(c.imageUrl, path.join("assets", "onmyoji", base))) portraitsOk++;
  await sleep(120);
}

// onmyoji + bondling image files via imageinfo
const files = [
  ...[...onmyojiSkillIcons].map((i) => (i.includes(".") ? i : `${i}.png`)),
  ...bondlings.map((b) => `File:${b.no}s1.png`.replace(/^File:File:/, "File:")),
  ...bondlings.flatMap((b) => b.skins),
].map((f) => (f.startsWith("File:") ? f : `File:${f}`));
const uniq = [...new Set(files)];

const urls = {};
for (let i = 0; i < uniq.length; i += 20) {
  console.log(`[images] resolve ${i}/${uniq.length}`);
  const j = await fetchRetry(`${API}?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url&titles=${uniq.slice(i, i + 20).map(encodeURIComponent).join("%7C")}`);
  for (const p of j.query?.pages ?? []) if (p.imageinfo?.[0]) urls[p.title.replace(/^File:/, "")] = p.imageinfo[0].url;
  await sleep(250);
}
let imgOk = 0, imgFail = 0;
for (const [name, url] of Object.entries(urls)) {
  const dir = /^OB\d+/.test(name) ? "bondlings" : "skills";
  if (await dl(url, path.join("assets", dir, name))) imgOk++; else imgFail++;
  await sleep(100);
}
for (const b of bondlings) {
  b.image = `assets/bondlings/${b.no}s1.png`;
  b.imageUrl = urls[`${b.no}s1.png`] ?? null;
  b.skins = b.skins.map((s) => `assets/bondlings/${s}`);
}

await fs.writeFile("data/onmyoji.json", JSON.stringify(chars, null, 2));
await fs.writeFile("data/bondlings.json", JSON.stringify(bondlings, null, 2));

console.log(`characters: ${chars.length} (${chars.filter((c) => c.role === "onmyoji").length} onmyoji, ${chars.filter((c) => c.role === "champion").length} champion)`);
console.log(`  stats: ${chars.filter((c) => c.stats2).length}, skills: ${chars.filter((c) => c.skills.length).length}, portraits: ${portraitsOk}/${chars.length}`);
console.log(`bondlings: ${bondlings.length}, images ok ${imgOk} fail ${imgFail}`);
