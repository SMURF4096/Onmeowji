// probe-overflow.mjs — one-off: name the widest overflowing elements at narrow widths.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
for (const [url, w] of [["calendar.html", 280], ["index.html", 280], ["calendar.html", 320]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: 700 } })).newPage();
  await page.goto(`http://localhost:8123/${url}?o=${Date.now()}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const m = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const widest = [...document.querySelectorAll("body *")]
      .map((el) => ({ tag: el.tagName.toLowerCase(), cls: String(el.className.baseVal ?? el.className).split(" ")[0], r: Math.round(el.getBoundingClientRect().right), w: Math.round(el.getBoundingClientRect().width) }))
      .filter((e) => e.r > vw && e.r <= vw + 40)
      .sort((a, b) => b.r - a.r)
      .slice(0, 5);
    return { vw, scrollW: document.documentElement.scrollWidth, widest };
  });
  console.log(JSON.stringify({ url, w, ...m }));
  await page.close();
}
await browser.close();
