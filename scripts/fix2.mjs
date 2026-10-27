/**
 * fix2.mjs — authoritative corrections for the 12-issue batch.
 *  A. Re-tag every skill's type/group from the wiki's own |Type= field
 *     (fixes issue 1 the RIGHT way: Special stays Special, basic attacks stay Normal).
 *  B. Strip the wrongly-appended Wind Aegis glossary from Ichimokuren skill 0.
 *  C. Delete the bogus filler `evolution` objects; real Evolution UI is derived in app.js.
 *  D. Replace every static.wikia image URL in data/*.json with a local assets path,
 *     downloading anything missing (issue 2, fully self-contained).
 *  E. Annotate Arakawa's Reign glossary with Buff, Mark types so it renders colored + icon.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const API = "https://onmyoji.fandom.com/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const write = (p, d) => fs.writeFileSync(path.join(ROOT, p), JSON.stringify(d, null, 2) + "\n");

/* ---------- A. wiki Type re-tag ---------- */

function baseName(n) {
  let s = String(n ?? "");
  const paren = s.match(/^([^（(]*)/)?.[1] ?? s; // strip (jp)/(cn) tail
  s = paren.replace(/[|*"“”；;：:,.\n]/g, " ").replace(/\s+/g, " ").trim();
  return s.toLowerCase();
}
const norm = (s) => String(s ?? "").toLowerCase().replace(/[\s'"“。”·•、,._-]/g, "");

async function apiTitles(titles) {
  const url = API + "?action=query&format=json&formatversion=2&prop=revisions&rvprop=content&rvslots=main&titles=" +
    titles.map((t) => encodeURIComponent(decodeURIComponent(t))).join("|");
  for (let a = 0; a < 3; a++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) return (await r.json()).query.pages ?? [];
    } catch { /* retry */ }
    await sleep(400);
  }
  return [];
}

/* pull "|Name=" and "|Type=" pairs out of a SkillBox wikitext run */
function skillTypes(wikitext) {
  const out = [];
  const re = /\{\{SkillBox\b([\s\S]*?)(?=\{\{SkillBox\b|\{\{\s*Skill(?:\/?)Box|\z)/gi;
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
    else if (t.startsWith("|onibi") || t.startsWith("onibi")) canonical = "Special"; // type param blank; skill costs onibi
    else if (t.startsWith("immunity") || t.startsWith("active") || t.startsWith("linked")) canonical = "Special";
    else canonical = null;
    if (name) out.push({ name, rawType: type || "(blank)", type: canonical });
  }
  return out;
}

async function retagTypes() {
  const shik = read("data/shikigami.json");
  const mains = shik.map((s) => (decodeURIComponent(s.wiki || "").split("/wiki/")[1] ?? "") + "/Main");
  const batch = [];
  for (let i = 0; i < mains.length; i += 25) batch.push(mains.slice(i, i + 25));

  const contentByTitle = new Map(); // title(with /Main) -> wikitext
  for (const chunk of batch) {
    const pages = await apiTitles(chunk);
    for (const p of pages) {
      const c = p?.revisions?.[0]?.slots?.main?.content;
      if (c) contentByTitle.set(p.title, c);
    }
    await sleep(280);
  }
  /* fallback: missing /Main → try the main page */
  const missing = mains.filter((t) => !contentByTitle.has(t));
  for (let i = 0; i < missing.length; i += 25) {
    const titles = missing.slice(i, i + 25).map((t) => t.replace(/\/Main$/, ""));
    const pages = await apiTitles(titles);
    for (const p of pages) {
      const c = p?.revisions?.[0]?.slots?.main?.content;
      if (c) contentByTitle.set(titles[pages.indexOf(p)] ?? titles[0], c);
    }
    /* page.title maps directly */
    const pageByTitle = new Map(pages.map((p) => [p.title, p]));
    for (const t of titles) {
      const p = pageByTitle.get(t);
      const c = p?.revisions?.[0]?.slots?.main?.content;
      if (c && !contentByTitle.has(t)) contentByTitle.set(t, c);
    }
    await sleep(280);
  }

  let matched = 0, unmatchedShik = [], unmatchedSkill = 0;
  shik.forEach((s, i) => {
    const wt = contentByTitle.get(mains[i]);
    if (!wt) { unmatchedShik.push(s.en); return; }
    const boxes = skillTypes(wt);
    if (!boxes.length) { unmatchedShik.push(s.en + " (no SkillBox)"); return; }
    for (const k of s.skills ?? []) {
      const want = norm(baseName(k.name));
      if (!want) { unmatchedSkill++; continue; }
      const hit = boxes.find((b) => norm(baseName(b.name)) === want)
        ?? boxes.find((b) => { const bn = norm(baseName(b.name)); return bn.length > 4 && (want.startsWith(bn) || bn.startsWith(want)); });
      if (!hit || !hit.type) { unmatchedSkill++; continue; }
      k.type = hit.type;
      k.group = hit.type; /* single authoritative tag */
      matched++;
    }
  });

  write("data/shikigami.json", shik);
  console.log(`A. retagged ${matched} skills from wiki`);
  if (unmatchedShik.length) console.log("   shikigami without /Main wikitext:", unmatchedShik.join(", "));
  console.log("   skills unmatched:", unmatchedSkill);
  const dist = {};
  for (const s of shik) for (const k of s.skills ?? []) dist[k.type + "/" + k.group] = (dist[k.type + "/" + k.group] || 0) + 1;
  console.log("   type/group distribution:", JSON.stringify(dist));
}

/* ---------- B. Ichimokuren cleanup + E. Reign annotation ---------- */
function dataCleanups() {
  const shik = read("data/shikigami.json");
  const ichi = shik.find((s) => s.en === "Ichimokuren");
  if (ichi) {
    const k0 = ichi.skills?.[0];
    if (k0 && k0.description.includes(";Wind Aegis")) {
      k0.description = k0.description.replace(/\n;Wind Aegis \(風佑\) : :'''Buff, Mark''': Absorbs a certain amount of damage and cannot be dispelled\./, "");
      console.log("B. removed stray Wind Aegis glossary from Ichimokuren skill 0");
    }
  }
  const ara = shik.find((s) => s.en === "Arakawa no Aruji");
  if (ara) {
    const k2 = ara.skills?.[2];
    if (k2 && k2.description.includes(";Reign (君臨) : :When")) {
      k2.description = k2.description.replace(";Reign (君臨) : :When", ";Reign (君臨) : :'''Buff, Mark''': When");
      console.log("E. Reign glossary annotated Buff, Mark");
    }
  }

  /* C. drop bogus filler evolution objects */
  let dropped = 0;
  for (const s of shik) {
    if (s.evolution && !s.evolution.conditions?.length &&
        /Evolve this shikigami to unlock/.test(s.evolution.description ?? "")) {
      delete s.evolution;
      dropped++;
    }
  }
  console.log("C. dropped bogus evolution fillers:", dropped);

  write("data/shikigami.json", shik);
}

/* ---------- D. localize every fandom image URL ---------- */
function uaFetch(url, referer) {
  return fetch(url, {
    headers: {
      "User-Agent": UA, "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      ...(referer ? { "Referer": referer } : {}),
    },
  });
}

async function dlImage(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 400) return true; // already have it
  for (let a = 0; a < 3; a++) {
    try {
      /* direct CDN path first; Varnish sometimes 403s without /revision — keep the query */
      const r1 = url.startsWith("https://onmyoji.fandom.com/wiki/Special:FilePath")
        ? null : await uaFetch(url, "https://onmyoji.fandom.com/");
      let res = r1;
      if (!res || !res.ok) {
        const file = decodeURIComponent(url.split("/").pop()?.split("?")[0] ?? "");
        res = await uaFetch("https://onmyoji.fandom.com/wiki/Special:FilePath/" + encodeURIComponent(file), "https://onmyoji.fandom.com/");
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (res.ok && buf.length > 400 && buf[0] !== 0x3c) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, buf);
        return true;
      }
    } catch { /* retry */ }
    await sleep(300);
  }
  return false;
}

async function localizeImages() {
  /* map of url → local dest collected from all data files */
  const jobs = new Map(); // url -> dest
  const addJob = (url, dest) => { if (url && /static\.wikia\.nocookie\.net/.test(url)) jobs.set(url, dest); };

  const shik = read("data/shikigami.json");
  const souls = read("data/souls.json");
  const chars = read("data/onmyoji.json");
  let bonds = [];
  try { bonds = read("data/bondlings.json"); } catch { /* optional */ }

  for (const s of shik) {
    addJob(s.imageUrl, s.localImage?.startsWith("assets/") ? s.localImage : `assets/shikigami/${s.no}.png`);
    addJob(s.art, s.art);
    for (const k of s.skills ?? []) if (/static\.wikia/.test(k.icon ?? "")) addJob(k.icon, `assets/skills/${(k.icon.split("/").pop() ?? "icon.png").split("?")[0]}`);
    addJob(s.rarityIcon, s.rarityIcon);
  }
  for (const s of souls) {
    addJob(s.imageUrl, s.localImage ?? `assets/souls/Soul${s.no}.png`);
    addJob(s.art, s.art);
  }
  for (const c of chars) {
    addJob(c.imageUrl, c.image ?? `assets/onmyoji/${c.no}skin1.png`);
    for (const k of c.skills ?? []) if (/static\.wikia/.test(k.icon ?? "")) addJob(k.icon, `assets/skills/${(k.icon.split("/").pop() ?? "icon.png").split("?")[0]}`);
  }
  for (const b of bonds) {
    addJob(b.imageUrl, b.image ?? "");
    for (const sk of b.skins ?? []) if (/static\.wikia/.test(sk)) addJob(sk, sk);
  }

  console.log(`D. ${jobs.size} distinct fandom URLs found`);
  let ok = 0, fail = 0;
  for (const [url, dest] of jobs) {
    if (!dest) { fail++; continue; }
    const good = await dlImage(url, path.join(ROOT, dest));
    good ? ok++ : (fail++, console.log("   FAIL:", dest, "←", url.slice(0, 90)));
    await sleep(160);
  }
  console.log(`   downloaded/present ok=${ok} fail=${fail}`);

  /* rewrite every fandom image URL to its local path */
  const localizeField = (obj, field, localField) => {
    if (/static\.wikia/.test(obj[field] ?? "")) {
      const local = obj[localField];
      if (local && !/static\.wikia/.test(local) && fs.existsSync(path.join(ROOT, local))) obj[field] = local;
    }
  };
  for (const s of shik) {
    localizeField(s, "imageUrl", "localImage");
    for (const k of s.skills ?? []) if (/static\.wikia/.test(k.icon ?? "")) k.icon = `assets/skills/${(k.icon.split("/").pop() ?? "").split("?")[0]}`;
  }
  for (const s of souls) localizeField(s, "imageUrl", "localImage");
  for (const c of chars) { localizeField(c, "imageUrl", "image"); for (const k of c.skills ?? []) if (/static\.wikia/.test(k.icon ?? "")) k.icon = `assets/skills/${(k.icon.split("/").pop() ?? "").split("?")[0]}`; }
  for (const b of bonds) { localizeField(b, "imageUrl", "image"); b.skins = (b.skins ?? []).map((sk) => (/static\.wikia/.test(sk) ? "" : sk)).filter(Boolean); }

  write("data/shikigami.json", shik);
  write("data/souls.json", souls);
  write("data/onmyoji.json", chars);
  if (bonds.length) write("data/bondlings.json", bonds);

  /* residual audit */
  const residual = [];
  for (const f of ["shikigami", "souls", "onmyoji", "bondlings"]) {
    try { if (/static\.wikia/.test(fs.readFileSync(path.join(ROOT, `data/${f}.json`), "utf8"))) residual.push(f); } catch { /* skip */ }
  }
  console.log(residual.length ? "   fandom image URLs remain in: " + residual.join(", ") : "   zero fandom image URLs remain in data/");
}

/* ---------- main ---------- */
await retagTypes();
dataCleanups();
await localizeImages();
console.log("fix2 done.");
