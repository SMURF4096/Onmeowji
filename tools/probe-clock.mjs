// probe-clock.mjs — one-off: verify the index timezone banner ticks and matches real timezone offsets.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 360 } })).newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(`http://localhost:8123/index.html?c=${Date.now()}`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const read = () => page.evaluate(() => ({
  ny: document.getElementById("clock-ny")?.textContent,
  nyTz: document.getElementById("clock-ny-tz")?.textContent,
  nyDate: document.getElementById("clock-ny-date")?.textContent,
  dt: document.getElementById("clock-ny")?.getAttribute("datetime"),
  bkk: document.getElementById("clock-bkk")?.textContent,
  bkkTz: document.getElementById("clock-bkk-tz")?.textContent,
  bkkDate: document.getElementById("clock-bkk-date")?.textContent,
}));
const t1 = await read();
await page.waitForTimeout(1300);
const t2 = await read();
const ny = new Intl.DateTimeFormat("en-GB", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
const bkk = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
console.log(JSON.stringify({ t1, t2, ticked: t1.ny !== t2.ny, nyNow: ny, bkkNow: bkk, errors }, null, 1));
await page.screenshot({ path: ".impeccable/review/clock-band.png" });
await browser.close();
