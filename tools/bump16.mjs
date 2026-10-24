// bump16.mjs — one-off: bring the remaining pages to js v16.
import { readFileSync, writeFileSync } from "node:fs";
for (const f of ["shikigami.html", "souls.html", "bonding.html", "characters.html"]) {
  writeFileSync(f, readFileSync(f, "utf8").replaceAll("js/app.js?v=15", "js/app.js?v=16"), "utf8");
  console.log(f, "v16");
}
