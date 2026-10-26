/** Download missing icon files from fandom CDN or Special:FilePath redirects. */
import fs from "fs";

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

async function downloadOnce(url, dest, retries = 2) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": UA, "Referer": "https://onmyoji.fandom.com/wiki/Shikigami/List",
      "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9", "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors", "Sec-Fetch-Site": "cross-site",
    },
  });
  const buf = Buffer.from(await res.arrayBuffer());
  if (res.ok && buf.length > 100 && !String(res.headers.get("content-type") ?? "").includes("text/html")) {
    fs.mkdirSync(dest.replace(/\/[^\/]+$/, ""), { recursive: true });
    fs.writeFileSync(dest, buf);
    return true;
  }
  if (retries > 0) return downloadOnce(url, dest, retries - 1);
  return false;
}

const jobs = [];

// 1. Character skill icons (O1–O7; O6 needs separate imageUrl)
const chars = JSON.parse(fs.readFileSync("data/onmyoji.json", "utf8"));
const o6 = chars.find(c => c.no === "O6");
jobs.push({ url: o6?.imageUrl || "", dest: "assets/characters/O6skin1.png" });
for (const c of chars) {
  if (c.no === "O6") continue;
  const iconFile = (c.skills && c.skills.length > 0) ? "https://static.wikia.nocookie.net/onmyoji/images/" + c.skills[0].icon.replace(/^assets\//, "") : null;
  if (iconFile) jobs.push({ url: iconFile, dest: c.skills[0].icon });
}

// 2. Boss soul icons (M1–M6, M56)
for (const b of ["M1.png", "M2.png", "M3.png", "M4.png", "M5.png", "M6.png", "M56.png"])
  jobs.push({ url: `https://static.wikia.nocookie.net/onmyoji/images/${b}/revision/latest`, dest: `assets/souls/${b}` });

// 3. Status icon file downloads
for (const f of ["Debuff18.png", "Debuff29.png", "Buff53.png", "Buff51.png", "Debuff35.png", "Buff50.png", "Buff113.png", "Buff114.png", "Buff192.png"]) {
  jobs.push({ url: `https://static.wikia.nocookie.net/onmyoji/images/${f}/revision/latest`, dest: `assets/status/${f}` });
}

// De-dup by dest
const seen = new Set();
const deduped = jobs.filter(j => {
  const key = j.url.replace(/\.png$/, "").toLowerCase();
  if (seen.has(key)) return false; seen.add(key); return true;
});
console.log("download jobs:", deduped.length);

let ok = 0, fail = 0;
for (const j of deduped) {
  const r = await downloadOnce(j.url, j.dest);
  if (r) ok++; else { fail++; console.log(" fail:", j.dest); }
  await new Promise(res => setTimeout(res, 200));
}
console.log("ok:", ok, "| fail:", fail);

// verify results
if (fail) {
  console.log("\nretry via Special:FilePath for fails:");
  for (const j of deduped.filter(x => !fs.existsSync(x.dest) || fs.statSync(x.dest).size < 100)) {
    const sfp = "https://onmyoji.fandom.com/wiki/Special:FilePath/" + encodeURIComponent(j.dest.split("/").pop());
    const r2 = await downloadOnce(sfp, j.dest);
    if (r2) ok++; else fail++;
    await new Promise(res => setTimeout(res, 200));
  }
  console.log("retry ok:", ok - (deduped.length - fail), "| fail:", fail);
}
