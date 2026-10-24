// collect-artwork.mjs — download the large artwork for shikigami and souls.
//   * shikigami: <no>skin1.png (default 580×580 art) from <Name>/Gallery
//   * souls: the single M<n>.png large art on each soul page
// Files are saved under assets/art/ (shikigami) and assets/souls/ and recorded
// in data/*.json as s.art. Rerunnable (skip-if-exists).
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

const shikigami = JSON.parse(await fs.readFile("data/shikigami.json", "utf8"));
const souls = JSON.parse(await fs.readFile("data/souls.json", "utf8"));

const shikiTargets = shikigami.filter((s) => s.no != null && s.en);
const soulTargets = souls.filter((s) => s.en);

// ---- shikigami: list images of <Name>/Gallery, one call per page ------------
// (prop=images has a global per-query value cap (~500); a heavy page sharing a
//  batch silently blanks the other pages — so no batching at all)
console.log(`[gallery] listing ${shikiTargets.length} gallery pages…`);
for (let i = 0; i < shikiTargets.length; i++) {
  const s = shikiTargets[i];
  try {
    const j = await fetchRetry(`${API}?action=query&format=json&formatversion=2&redirects=1&prop=images&imlimit=500&titles=${encodeURIComponent(`${s.en}/Gallery`)}`);
    const p = j.query?.pages?.[0];
    const files = p?.images?.map((x) => x.title.replace(/^File:/, "")) ?? [];
    const pick = files.find((f) => new RegExp(`^${s.no}skin1\\.png$`, "i").test(f))
      ?? files.find((f) => new RegExp(`^${s.no}skin1\\.jpe?g$`, "i").test(f));
    s.art = pick ? `assets/art/${pick}` : null;
  } catch (e) { console.warn(`gallery fail ${s.en}: ${e.message}`); s.art = null; }
  await sleep(140);
  if (i % 50 === 0) console.log(`[gallery] ${i}/${shikiTargets.length}`);
}

// ---- souls: list images of each soul page ----------------------------------
console.log(`[souls] listing ${soulTargets.length} soul pages…`);
for (let i = 0; i < soulTargets.length; i += 25) {
  const batch = soulTargets.slice(i, i + 25).map((s) => s.en);
  const j = await fetchRetry(`${API}?action=query&format=json&formatversion=2&redirects=1&prop=images&imlimit=100&titles=${batch.map(encodeURIComponent).join("%7C")}`);
  const byResp = {};
  for (const p of j.query?.pages ?? [])
    if (p.images) byResp[p.title] = p.images.map((x) => x.title.replace(/^File:/, ""));
  const alias = {};
  for (const n of [...(j.query?.normalized ?? []), ...(j.query?.redirects ?? [])]) alias[n.from] = n.to;
  for (const s of soulTargets.slice(i, i + 25)) {
    const files = byResp[alias[s.en] ?? s.en] ?? [];
    const pick = files.find((f) => /^M\d+\.(png|jpe?g)$/i.test(f));
    s.art = pick ? `assets/souls/${pick}` : null;
  }
  await sleep(280);
}

// ---- resolve URLs + download ------------------------------------------------
const wanted = {};
let artFound = 0, soulArtFound = 0;
for (const s of shikiTargets) if (s.art) { wanted[path.basename(s.art)] = s.art; artFound++; }
for (const s of soulTargets) if (s.art) { wanted[path.basename(s.art)] = s.art; soulArtFound++; }
const names = Object.keys(wanted);
console.log(`[resolve] ${names.length} files (${artFound} shikigami art, ${soulArtFound} soul art)`);

const urls = {};
for (let i = 0; i < names.length; i += 20) {
  const j = await fetchRetry(`${API}?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url&titles=${names.slice(i, i + 20).map((n) => "File:" + n).map(encodeURIComponent).join("%7C")}`);
  for (const p of j.query?.pages ?? []) if (p.imageinfo?.[0]) urls[p.title.replace(/^File:/, "")] = p.imageinfo[0].url;
  await sleep(250);
}

let ok = 0, fail = 0, skip = 0;
for (const name of names) {
  const url = urls[name];
  if (!url) { fail++; continue; }
  const dest = path.join(...wanted[name].split("/"));
  try { await fs.access(dest); skip++; continue; } catch {}
  try {
    const r = await fetch(url, { headers: HDR });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
    ok++;
  } catch (e) { console.warn(`dl fail ${name}: ${e.message}`); fail++; }
  await sleep(90);
}

await fs.writeFile("data/shikigami.json", JSON.stringify(shikigami, null, 2));
await fs.writeFile("data/souls.json", JSON.stringify(souls, null, 2));

console.log(`shikigami art: ${artFound}/${shikiTargets.length}, soul art: ${soulArtFound}/${soulTargets.length}`);
console.log(`downloaded: ${ok}, skipped (cached): ${skip}, failed: ${fail}`);
