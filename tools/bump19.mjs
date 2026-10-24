// bump19.mjs — one-off: js v19 + css v17 on all six pages.
import { readFileSync, writeFileSync } from "node:fs";
for (const f of ["index.html", "calendar.html", "shikigami.html", "souls.html", "bonding.html", "characters.html"]) {
  writeFileSync(f, readFileSync(f, "utf8").replaceAll("js/app.js?v=18", "js/app.js?v=19").replaceAll("css/style.css?v=16", "css/style.css?v=17"), "utf8");
}
console.log("js v19 / css v17 on all pages");
