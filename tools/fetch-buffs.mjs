// fetch-buffs.mjs — mirror the seven daily-buff icons from the Onmyoji wiki
// into assets/buffs/ as local files (site stays fully self-contained).
import fs from "node:fs/promises";
import path from "node:path";

const HDR = { "User-Agent": "OnmyojiStyleSite/1.0 (local mirror of referenced images; personal project)" };
const OUT = path.join("assets", "buffs");

const BUFF_ICONS = {
  "strong-fire": "https://static.wikia.nocookie.net/onmyoji/images/d/dc/Songstress3.png/revision/latest?cb=20200609045727",
  "fighting-soul": "https://static.wikia.nocookie.net/onmyoji/images/2/20/00000194.png/revision/latest?cb=20221022062725",
  "dash": "https://static.wikia.nocookie.net/onmyoji/images/4/47/00000253.png/revision/latest?cb=20221022062651",
  "skillful": "https://static.wikia.nocookie.net/onmyoji/images/7/75/3132a.png/revision/latest?cb=20201109045020",
  "fragile": "https://static.wikia.nocookie.net/onmyoji/images/0/0e/Namazu3.png/revision/latest?cb=20200619135522",
  "curse-spell": "https://static.wikia.nocookie.net/onmyoji/images/b/b3/2283.png/revision/latest?cb=20170323161954",
  "raging-wind": "https://static.wikia.nocookie.net/onmyoji/images/0/00/Himiko2.png/revision/latest?cb=20221022070107",
};

await fs.mkdir(OUT, { recursive: true });
let ok = 0, fail = 0;
for (const [slug, url] of Object.entries(BUFF_ICONS)) {
  const dest = path.join(OUT, `${slug}.png`);
  try {
    const thumbs = url.replace("/revision/latest", "/revision/latest/scale-to-width-down/160");
    let r = await fetch(thumbs, { headers: HDR });
    if (!r.ok) r = await fetch(url, { headers: HDR });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    await fs.writeFile(dest, Buffer.from(await r.arrayBuffer()));
    ok++;
    console.log(`ok ${slug}`);
  } catch (e) {
    fail++;
    console.warn(`FAIL ${slug}: ${e.message}`);
  }
}
console.log(`buff icons downloaded: ${ok}/${ok + fail}`);
