// bump18.mjs — one-off: css/style.css to v16 on all six pages.
import { readFileSync, writeFileSync } from "node:fs";
for (const f of ["index.html", "calendar.html", "shikigami.html", "souls.html", "bonding.html", "characters.html"]) {
  writeFileSync(f, readFileSync(f, "utf8").replaceAll("css/style.css?v=15", "css/style.css?v=16"), "utf8");
}
console.log("css v16 on all pages");
