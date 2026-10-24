// probe-char1.mjs — one-off: which dataset does the characters modal hero carry?
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await page.goto(`http://localhost:8123/characters.html?c=${Date.now()}#1`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const m = await page.evaluate(() => {
  const img = document.querySelector(".modal img.avatar");
  const r = img.getBoundingClientRect();
  return {
    cls: img.className, src: img.src.split("/").pop(), natural: `${img.naturalWidth}x${img.naturalHeight}`,
    box: `${Math.round(r.width)}x${Math.round(r.height)}`,
    dW: img.dataset.heroW, dH: img.dataset.heroH, trim: img.dataset.heroTrim,
    inline: img.getAttribute("style"),
  };
});
console.log(JSON.stringify(m, null, 2));
await browser.close();
