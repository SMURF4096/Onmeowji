// probe-art-default.mjs — one-off: confirm default entries keep the 340x250 fit and zero console errors.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];

async function one(url, hash, name) {
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
  page.on("pageerror", (e) => errors.push(`${name}: ${e}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`${name}: ${m.text()}`); });
  await page.goto(`http://localhost:8123/${url}?def=${Date.now()}#${hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const m = await page.evaluate(() => {
    const img = document.querySelector(".modal img.avatar.hero");
    if (!img) return null;
    const r = img.getBoundingClientRect();
    return `${Math.round(r.width)}x${Math.round(r.height)}`;
  });
  console.log(name, "->", m);
  await page.close();
}
await one("shikigami.html", "606", "shik 606 (default)");
await one("shikigami.html", "601", "shik 601 (default)");
await one("souls.html", "5", "soul 5 (default)");
await one("characters.html", "1", "character 1 (default)");
console.log("errors:", errors.length ? errors : "none");
await browser.close();
