// probe-art.mjs — one-off: sample heroFit results across the shikigami roster.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });

const IDS = [262, 300, 551, 606, 601];
async function one(id) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  await page.goto(`http://localhost:8123/shikigami.html?art=${Date.now()}#${id}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(850);
  const m = await page.evaluate(() => {
    const img = document.querySelector(".modal img.avatar");
    if (!img) return { modal: false };
    const r = img.getBoundingClientRect();
    const name = document.querySelector(".modal h3")?.textContent ?? "?";
    const box = { w: Math.round(r.width), h: Math.round(r.height) };
    return {
      name, box, nat: `${img.naturalWidth}x${img.naturalHeight}`,
      trimmed: img.dataset.trimmed === "1" ? img.naturalWidth : null,
      hero: img.classList.contains("hero"),
      up: box.w > img.naturalWidth ? `x${(box.w / img.naturalWidth).toFixed(2)}` : null,
    };
  });
  console.log(JSON.stringify({ id, ...m }));
  if (m.hero && [262, 300].includes(id)) {
    await page.screenshot({ path: `.impeccable/review/art-test-shik${id}.png` });
  }
  await page.close();
}
for (const id of IDS) await one(id);
await browser.close();
