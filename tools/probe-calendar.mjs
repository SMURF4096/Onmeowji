// probe-calendar.mjs — one-off: verify EST (fixed) clock + buff calendar vs the Python reference.
import path from "node:path";
import { createRequire } from "node:module";
const { chromium } = createRequire(path.resolve("ux-ui-agent-skills/package.json"))("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true });

// 1) index clock: EST must be fixed -05:00, label EST
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 300 } })).newPage();
  await page.goto(`http://localhost:8123/index.html?c=${Date.now()}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const m = await page.evaluate(() => ({
    label: document.getElementById("clock-ny-tz")?.textContent,
    dt: document.getElementById("clock-ny")?.getAttribute("datetime"),
    place: document.querySelector(".clock-place")?.textContent,
  }));
  console.log("EST clock:", JSON.stringify(m));
  await page.close();
}

// 2) calendar page: today + navigation + August reference values
{
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 1560 } })).newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await page.goto(`http://localhost:8123/calendar.html?c=${Date.now()}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const cells = () => page.evaluate(() => {
    const out = {};
    document.querySelectorAll("#cal-grid .cal-cell").forEach((td, i) => {
      out[i + 1] = td.querySelector(".cal-buff")?.textContent.trim();
    });
    return out;
  });
  const today = await page.evaluate(() => ({
    head: document.getElementById("cal-month-name")?.textContent,
    line: document.getElementById("cal-today-line")?.textContent,
    todayBuff: document.querySelector("#cal-grid .cal-cell.today .cal-buff")?.textContent.trim(),
    flag: !!document.querySelector("#cal-grid .cal-cell.today .cal-flag"),
    cellCount: document.querySelectorAll("#cal-grid .cal-cell").length,
  }));
  console.log("calendar today:", JSON.stringify(today));

  // October 2026: full server-verified schedule (user-provided table)
  const OCT = { 1: "Strong Fire", 2: "Raging Wind", 3: "Fighting Soul", 4: "Dash", 5: "Fragile", 6: "Curse Spell", 7: "Strong Fire", 8: "Raging Wind", 9: "Fighting Soul", 10: "Dash", 11: "Skillful", 12: "Curse Spell", 13: "Strong Fire", 14: "Raging Wind", 15: "Fighting Soul", 16: "Dash", 17: "Skillful", 18: "Fragile", 19: "Strong Fire", 20: "Raging Wind", 21: "Fighting Soul", 22: "Dash", 23: "Skillful", 24: "Fragile", 25: "Curse Spell", 26: "Raging Wind", 27: "Fighting Soul", 28: "Dash", 29: "Skillful", 30: "Fragile", 31: "Curse Spell" };

  {
    await page.goto(`http://localhost:8123/calendar.html?c=${Date.now()}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
  }
  const oct = await cells();
  const head = await page.evaluate(() => document.getElementById("cal-month-name")?.textContent);
  const bad = Object.entries(OCT).filter(([d, v]) => oct[d] !== v);
  console.log(JSON.stringify({ head, check: bad.length ? `MISMATCH ${JSON.stringify(bad)}` : "all 31 server-verified days match" }));

  // month-start anchors (user-verified observations 2025-12 .. 2026-10)
  const starts = await page.evaluate(() => [
    [2025, 12, "Dash"], [2026, 1, "Dash"], [2026, 2, "Dash"], [2026, 3, "Strong Fire"],
    [2026, 4, "Raging Wind"], [2026, 5, "Strong Fire"], [2026, 6, "Raging Wind"],
    [2026, 7, "Strong Fire"], [2026, 8, "Strong Fire"], [2026, 9, "Raging Wind"],
    [2026, 10, "Strong Fire"],
  ].map(([y, m, want]) => `${y}-${String(m).padStart(2, "0")}: ${buffForDay(y, m, 1)} ${buffForDay(y, m, 1) === want ? "ok" : `WANT ${want}`}`));
  console.log("month starts:", JSON.stringify(starts));

  // August 2026: full observed grid (AUGUST_2026_ACTUAL in tools/buff-predictor.py)
  const AUG_LETTERS = "FGBCDEFGACDEFGABDEFGABC EFGABCDF".replace(" ", "").split("");
  await page.click("#cal-prev"); await page.click("#cal-prev");
  await page.waitForTimeout(350);
  const aug = await cells();
  const augHead = await page.evaluate(() => document.getElementById("cal-month-name")?.textContent);
  const L2N = { A: "Fighting Soul", B: "Dash", C: "Skillful", D: "Fragile", E: "Curse Spell", F: "Strong Fire", G: "Raging Wind" };
  const augBad = AUG_LETTERS.filter((L, i) => aug[i + 1] !== L2N[L]).map((L, j) => ({ day: j + 1, want: L2N[L], got: aug[j + 1] }));
  console.log(JSON.stringify({ augustHead: augHead, check: augBad.length ? `MISMATCH ${JSON.stringify(augBad)}` : "all 31 observed August days match", daysShown: Object.keys(aug).length }));

  // today button restores
  await page.click("#cal-today-btn"); await page.waitForTimeout(300);
  const back = await page.evaluate(() => document.getElementById("cal-month-name")?.textContent);
  console.log(JSON.stringify({ backTo: back, errors }));
  await page.screenshot({ path: ".impeccable/review/calendar.png" });
  await page.close();
}
await browser.close();
