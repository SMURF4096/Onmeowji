// bump17.mjs — one-off: js v18 + css v15 on all six pages.
import { readFileSync, writeFileSync } from "node:fs";
for (const f of ["index.html", "calendar.html", "shikigami.html", "souls.html", "bonding.html", "characters.html"]) {
  writeFileSync(f, readFileSync(f, "utf8").replaceAll("js/app.js?v=17", "js/app.js?v=18").replaceAll("css/style.css?v=14", "css/style.css?v=15"), "utf8");
  console.log(f, "v18/css v15");
}
