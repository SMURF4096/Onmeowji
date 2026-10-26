/** Download icon files that failed direct CDN access (special shapes, misnamed).
 *  Use Referer: wiki page to bypass Varnish 403. */
import fs from "fs";

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const CFG = { headers: { "User-Agent": UA, "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9", "Sec-Fetch-Dest": "image", "Sec-Fetch-Mode": "no-cors", "Sec-Fetch-Site": "cross-site" } };

async function dl(url, referer, dest) {
  fs.mkdirSync(dest.replace(/\/[^\/]+$/, ""), { recursive: true });
  const r = await fetch(url, { ...CFG, headers: { ...CFG.headers, "Referer": referer } });
  const b = Buffer.from(await r.arrayBuffer());
  if (r.ok && b.length > 300 && b[0] !== 0x3c) { fs.writeFileSync(dest, b); return true; }
  return false;
}

const jobs = [
  { u: "https://static.wikia.nocookie.net/onmyoji/images/5/56/Buff50.png/revision/latest/scale-to-width-down/48", r: "https://onmyoji.fandom.com/wiki/Ichimokuren", d: "assets/status/Buff50.png" },
  { u: "https://static.wikia.nocookie.net/onmyoji/images/9/95/Buff114.png/revision/latest/scale-to-width-down/48", r: "https://onmyoji.fandom.com/wiki/Youtou_Hime", d: "assets/status/Buff114.png" },
  { u: "https://static.wikia.nocookie.net/onmyoji/images/2/28/Buff192.png/revision/latest/scale-to-width-down/48", r: "https://onmyoji.fandom.com/wiki/Arakawa_no_Aruji", d: "assets/status/Buff192.png" },
];

let ok = 0;
for (const j of jobs) {
  const r = await dl(j.u, j.r, j.d);
  if (r) { ok++; console.log("ok:", j.d); }
  else { console.log("FAIL:", j.d); }
  await new Promise(res => setTimeout(res, 300));
}
console.log("done:", ok, "/", jobs.length);
