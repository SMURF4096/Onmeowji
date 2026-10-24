// patch-souls.mjs — one-off: strip stray bullet asterisks from stored soul locations.
import fs from "node:fs/promises";
const d = JSON.parse(await fs.readFile("data/souls.json", "utf8"));
for (const s of d) {
  if (s.location) {
    s.location = s.location
      .replace(/\s+\*\s*/g, " · ")
      .replace(/(\s·\s*)+\·\s*/g, " · ")
      .replace(/\s*·(\s*·)+\s*/g, " · ")
      .replace(/^·\s*/, "")
      .trim();
  }
}
await fs.writeFile("data/souls.json", JSON.stringify(d, null, 2));
console.log("patched", d.length, "souls — sample:", d[0].location);
