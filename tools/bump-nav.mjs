// bump-nav.mjs — one-off: add Calendar to nav + bump asset versions on the five pages.
import { readFileSync, writeFileSync } from "node:fs";

for (const f of ["index.html", "shikigami.html", "souls.html", "bonding.html", "characters.html"]) {
  let x = readFileSync(f, "utf8");
  if (!x.includes("calendar.html")) {
    x = x.replace(/(<a href="characters\.html">[^<]*<\/a>\s*?\n)/, `$1      <a href="calendar.html">Calendar</a>\n`);
  }
  x = x.replaceAll("js/app.js?v=14", "js/app.js?v=15").replaceAll("js/app.js?v=13", "js/app.js?v=15");
  x = x.replaceAll("css/style.css?v=13", "css/style.css?v=14").replaceAll("css/style.css?v=12", "css/style.css?v=14");
  writeFileSync(f, x, "utf8");
  console.log(f, "ok");
}
