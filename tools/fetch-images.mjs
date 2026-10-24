// fetch-images.mjs — mirror wiki images from data/*.json into assets/.
// Downloads original-size art (portraits, soul icons, rarity badges) referenced
// by the collected URLs. Run after tools/collect.mjs.
import fs from "node:fs/promises";
import path from "node:path";

const OUT = "assets";
const HDR = { "User-Agent": "OnmyojiStyleSite/1.0 (local mirror of referenced images; personal project)" };
const CONCURRENCY = 6;

const shikigami = JSON.parse(await fs.readFile("data/shikigami.json", "utf8"));
const souls = JSON.parse(await fs.readFile("data/souls.json", "utf8"));

const jobs = [
  ...shikigami.filter((s) => s.imageUrl).map((s) => ({
    url: s.imageUrl.replace("static.wikia.nocookie.net", "static.wikia.nocookie.net"),
    dest: path.join(OUT, "shikigami", path.basename(s.image.slice(5))),
    apply: (p) => { s.localImage = p; },
  })),
  ...souls.filter((s) => s.imageUrl).map((s) => ({
    url: s.imageUrl,
    dest: path.join(OUT, "souls", path.basename(s.image.slice(5))),
    apply: (p) => { s.localImage = p; },
  })),
  // original (larger) rarity badge icons
  ...["SSR", "SR", "R", "SP", "N"].map((r) => {
    const src = shikigami.find((s) => s.rarity === r && s.image?.endsWith(r + ".png"));
    return {
      url: src?.imageUrl ? src.imageUrl.replace(/\?.*$/, "") : null,
      dest: path.join(OUT, "icons", r + ".png"),
      data: shikigami,
      apply: null, // rarityIcon.patch below
    };
  }),
];

await fs.mkdir(path.join(OUT, "shikigami"), { recursive: true });
await fs.mkdir(path.join(OUT, "souls"), { recursive: true });
await fs.mkdir(path.join(OUT, "icons"), { recursive: true });

let ok = 0, fail = 0;
const queue = [...jobs];
async function worker() {
  while (queue.length) {
    const job = queue.shift();
    if (!job?.url) continue;
    try {
      const r = await fetch(job.url, { headers: HDR });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      await fs.writeFile(job.dest, buf);
      job.apply?.(job.dest.replaceAll("\\", "/"));
      ok++;
    } catch (e) {
      console.warn(`FAIL ${job.dest}: ${e.message}`); fail++;
    }
    await new Promise((r) => setTimeout(r, 120));
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// patch rarityIcon to local copies
for (const s of shikigami) {
  s.rarityIcon = `assets/icons/${s.rarity}.png`;
}

await fs.writeFile("data/shikigami.json", JSON.stringify(shikigami, null, 2));
await fs.writeFile("data/souls.json", JSON.stringify(souls, null, 2));
console.log(`downloaded: ${ok}, failed: ${fail}`);
