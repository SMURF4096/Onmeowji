// bump20.mjs — one-off: css/style.css to v18 on all six pages.
import { readFileSync, writeFileSync } from "node:fs";
for (const f of ["index.html", "calendar.html", "shikigami.html", "souls.html", "bonding.html", "characters.html"]) {
  writeFileSync(f, readFileSync(f, "utf8").replaceAll("css/style.css?v=17", "css/style.css?v=18"), "utf8");
}
console.log("css v18 on all pages");
