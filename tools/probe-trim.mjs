// probe-trim.mjs — one-off: column density profile of the 608 art.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await page.goto(`http://localhost:8123/shikigami.html?t=${Date.now()}`, { waitUntil: "networkidle" });
const out = await page.evaluate(async () => {
  const rec = state.shikigami.find((s) => String(s.no) === "608");
  const img = await new Promise((ok, err) => { const i = new Image(); i.onload = () => ok(i); i.onerror = err; i.src = rec.art; });
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, c.width, c.height);
  const W = c.width, H = c.height;
  const col = new Uint32Array(W);
  const lum = new Uint16Array(W);
  for (let y = 0; y < H; y++) {
    const base = y * W * 4;
    for (let x = 0; x < W; x++) {
      const i = base + x * 4;
      if (data[i + 3] > 26) {
        col[x]++;
        if (Math.max(data[i], data[i + 1], data[i + 2]) > 40) lum[x]++;
      }
    }
  }
  const firstAt = (arr, m) => { for (let x = 0; x < W; x++) if (arr[x] >= m) return x; return -1; };
  const lastAt = (arr, m) => { for (let x = W - 1; x >= 0; x--) if (arr[x] >= m) return x; return -1; };
  const head = [];
  for (let x = 0; x < 220; x += 20) head.push(`${x}:${col[x]}/${lum[x]}`);
  const tail = [];
  for (let x = W - 220; x < W; x += 20) tail.push(`${x}:${col[x]}/${lum[x]}`);
  return {
    dens: [10, 25, 60, 120].map((m) => `min${m}: x[${firstAt(col, m)}..${lastAt(col, m)}]`),
    visible40: `min40bright x[${firstAt(lum, 10)}..${lastAt(lum, 10)}]`,
    head, tail,
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
