// probe-404.mjs — one-off: name the 404 resources on the shikigami page.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const bad = [];
page.on("response", (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url().split("/").slice(-2).join("/")}`); });
await page.goto(`http://localhost:8123/shikigami.html?f=${Date.now()}#606`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
console.log(JSON.stringify(bad));
await browser.close();
