/**
 * Download every status icon referenced in data/status-icons.json into
 * assets/status/ and rewrite the URLs to local paths, so the site stays
 * self-contained (the fandom CDN 403s requests without browser headers).
 */
import fs from "fs";
import path from "path";

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const map = JSON.parse(fs.readFileSync("data/status-icons.json", "utf8"));
fs.mkdirSync("assets/status", { recursive: true });

const BROWSER_HEADERS = {
  "User-Agent": UA,
  "Referer": "https://onmyoji.fandom.com/wiki/Shikigami/List",
  "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Fetch-Dest": "image",
  "Sec-Fetch-Mode": "no-cors",
  "Sec-Fetch-Site": "cross-site",
};

let ok = 0, fail = [], skipped = 0;
for (const [name, ic] of Object.entries(map)) {
  if (ic.url.startsWith("assets/status/") && fs.existsSync(path.join("assets/status", path.basename(ic.url)))) { skipped++; continue; }
  /* Special:FilePath redirects to the canonical static URL even for
     case-shifted file names (debuff28.png → Debuff28.png) */
  const res = await fetch("https://onmyoji.fandom.com/wiki/Special:FilePath/" + encodeURIComponent(ic.file.replace(/\.png$/i, "") + ".png"), {
    redirect: "follow",
    headers: BROWSER_HEADERS,
  });
  const buf = Buffer.from(await res.arrayBuffer());
  /* final URL is .../images/x/xy/<File>.png/revision/latest?cb=... — pick the
     segment that actually carries an image extension ("latest" is not a name) */
  const finalFile = (new URL(res.url)).pathname.split("/images/")[1]?.split("/")
    .find((s) => /\.(png|webp|jpe?g|gif)$/i.test(s)); /* /images/x/xy/<File> */
  const file = finalFile ?? ic.file.replace(/[^\w.\-]/g, "_");
  const dest = path.join("assets/status", file);
  if (res.ok && buf.length && !String(res.headers.get("content-type") ?? "").includes("text/html")) {
    fs.writeFileSync(dest, buf);
    map[name] = { ...ic, file, url: "assets/status/" + file };
    ok++;
  } else {
    fail.push({ name, file: ic.file, status: res.status });
  }
  await new Promise((r) => setTimeout(r, 260));
}

fs.writeFileSync("data/status-icons.json", JSON.stringify(map, null, 2) + "\n");
console.log("downloaded+baked:", ok - skipped, "| reused:", skipped, "| failed:", fail.length);
if (fail.length) console.log(fail.slice(0, 20));
