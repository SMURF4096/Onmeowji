// probe-cal-dbg.mjs — one-off: inspect boot state of calendar.html.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e}`));
page.on("console", (m) => { if (m.type() === "error") errors.push(`console: ${m.text()}`); });
await page.goto(`http://localhost:8123/calendar.html?d=${Date.now()}`, { waitUntil: "networkidle" });
await page.waitForTimeout(600);
const m = await page.evaluate(() => {
  const grid = document.getElementById("cal-grid");
  return {
    head: document.getElementById("cal-month-name")?.textContent,
    rows: grid?.children.length,
    firstRowTds: grid?.children[0]?.children.length,
    sample: grid?.children[0]?.innerHTML?.slice(0, 80),
    hasFns: typeof buffForDay + "/" + typeof buffIco + "/" + typeof esc + "/" + typeof drawCalendar + "/" + typeof renderBuffDocs,
    docs: document.getElementById("buff-docs")?.children.length,
    scriptSrc: [...document.querySelectorAll("script")].map((s) => s.src),
    line: document.getElementById("cal-today-line")?.textContent?.slice(0, 60),
  };
});
console.log(JSON.stringify(m, null, 1));
console.log("errors:", errors.length ? errors : "none");
await browser.close();
