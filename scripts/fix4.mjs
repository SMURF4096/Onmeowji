/**
 * fix4.mjs — image hygiene for the whole project:
 *  1. detect each local image's true file type (magic bytes) and fix extensions (.webp masquerading as .png, etc.)
 *  2. rename main portrait images to the entry's order number:
 *       shikigami → assets/shikigami/{no}.{ext}
 *       souls     → assets/souls/Soul{no}.{ext}
 *       onmyoji & champions → assets/onmyoji/{no}.{ext}   (O1skin1.png → O1.webp; O7skin1.png → O7.webp)
 *     and update every reference (data/*.json, status-icons map).
 *  Skills/status/art/M-calendar icons keep their canonical ids — they already encode the number/code.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const DATA_FILES = ["shikigami", "souls", "onmyoji", "bondlings", "status-icons"];

const readJSON = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, "data", f + ".json"), "utf8"));
const writeJSON = (f, d) => fs.writeFileSync(path.join(ROOT, "data", f + ".json"), JSON.stringify(d, null, 2) + "\n");

/* ---- 1. true type detection ---- */
function sniffType(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.slice(0, 3).toString("ascii") === "GIF") return "gif";
  if (buf.slice(0, 4).toString("ascii") === "RIFF" && buf.slice(8, 12).toString("ascii") === "WEBP") return "webp";
  if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) return "ico";
  if (buf.slice(8, 12).toString("ascii") === "avif") return "avif";
  return null;
}
const EXT_FOR = { png: ".png", jpg: ".jpg", jpeg: ".jpg", gif: ".gif", webp: ".webp", ico: ".ico", avif: ".avif", svg: ".svg" };

/* ---- collect all local asset refs from data ---- */
const refSets = new Map(); // file -> Set of refs
const refRe = /assets\/[A-Za-z0-9_./\-]+\.(png|jpg|jpeg|webp|gif|avif|ico|svg)/g;
for (const f of DATA_FILES) {
  const txt = fs.readFileSync(path.join(ROOT, "data", f + ".json"), "utf8");
  refSets.set(f, new Set(txt.match(refRe) ?? []));
}
const allRefs = new Set();
for (const s of refSets.values()) for (const r of s) allRefs.add(r);

/* ---- phase A: extension corrections (collect mapping first) ---- */
const renames = new Map(); // old abs path -> new rel path
const audit = { fixed: [], alreadyOk: 0, missing: [], corrupt: [] };
for (const rel of allRefs) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { audit.missing.push(rel); continue; }
  const buf = fs.readFileSync(abs);
  const trueType = sniffType(buf);
  if (!trueType) { audit.corrupt.push(rel); continue; }
  const curExt = path.extname(rel).toLowerCase();
  const wantExt = EXT_FOR[trueType] ?? curExt;
  if (curExt === wantExt) { audit.alreadyOk++; continue; }
  const newRel = rel.slice(0, -curExt.length) + wantExt;
  const newAbs = path.join(ROOT, newRel);
  fs.renameSync(abs, newAbs);
  renames.set(rel, newRel);
  audit.fixed.push(`${rel} → ${newRel}`);
}

/* ---- phase B: numbering renames ---- */
const numRenames = new Map(); // old rel -> new rel (may chain from phase A results)
const followback = (rel) => { let cur = rel; const seen = new Set(); while (renames.has(cur) && !seen.has(cur)) { seen.add(cur); cur = renames.get(cur); } return cur; };
const byNo = (d, key = "no") => new Map(d.map((x) => [x[key], x]));

const shik = readJSON("shikigami");
const souls = readJSON("souls");
const chars = readJSON("onmyoji");

/* shikigami portraits: assets/shikigami/{no}.{ext} */
for (const s of shik) {
  const cur = followback(s.localImage ?? s.imageUrl ?? "");
  if (!cur || !cur.startsWith("assets/shikigami/")) continue;
  const ext = path.extname(cur);
  const want = `assets/shikigami/${s.no}${ext}`;
  if (cur !== want && fs.existsSync(path.join(ROOT, cur))) {
    const wantAbs = path.join(ROOT, want);
    if (fs.existsSync(wantAbs)) continue; // collision — leave
    fs.renameSync(path.join(ROOT, cur), wantAbs);
    numRenames.set(cur, want);
  }
}
/* souls: assets/souls/Soul{no}.{ext} */
for (const s of souls) {
  const cur = followback(s.localImage ?? "");
  if (!cur || !cur.startsWith("assets/souls/Soul")) continue;
  const want = `assets/souls/Soul${s.no}${path.extname(cur)}`;
  if (cur !== want && fs.existsSync(path.join(ROOT, cur))) {
    const wantAbs = path.join(ROOT, want);
    if (fs.existsSync(wantAbs)) continue;
    fs.renameSync(path.join(ROOT, cur), wantAbs);
    numRenames.set(cur, want);
  }
}
/* onmyoji & champions: assets/onmyoji/{no}.{ext} (O1skin1.png → O1.webp) */
for (const c of chars) {
  const cur = followback(c.image ?? "");
  if (!cur || !cur.startsWith("assets/onmyoji/")) continue;
  const want = `assets/onmyoji/${c.no}${path.extname(cur)}`;
  if (cur !== want && fs.existsSync(path.join(ROOT, cur))) {
    const wantAbs = path.join(ROOT, want);
    if (fs.existsSync(wantAbs)) continue;
    fs.renameSync(path.join(ROOT, cur), wantAbs);
    numRenames.set(cur, want);
  }
}

/* ---- phase C: rewrite every reference in data/*.json ---- */
for (const f of DATA_FILES) {
  let txt = fs.readFileSync(path.join(ROOT, "data", f + ".json"), "utf8");
  for (const [from, to] of renames) txt = txt.split(from).join(to);
  for (const [from, to] of numRenames) txt = txt.split(from).join(to);
  if (txt !== fs.readFileSync(path.join(ROOT, "data", f + ".json"), "utf8")) writeJSON(f, JSON.parse(txt));
}

/* ---- audit ---- */
console.log(`extension fixes: ${audit.fixed.length} (already ok: ${audit.alreadyOk})`);
for (const f of audit.fixed.slice(0, 12)) console.log("  ", f);
if (audit.fixed.length > 12) console.log(`   …and ${audit.fixed.length - 12} more`);
console.log(`numbering renames: ${numRenames.size}`);
for (const [from, to] of numRenames) console.log(`   ${from} → ${to}`);
if (audit.corrupt.length) console.log(`CORRUPT (non-image bytes):`, audit.corrupt.join(", "));

/* residual audit: every ref now exists and has the right extension */
const residualWrong = [];
const residualMiss = [];
for (const f of DATA_FILES) {
  const txt = fs.readFileSync(path.join(ROOT, "data", f + ".json"), "utf8");
  for (const rel of new Set(txt.match(refRe) ?? [])) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { residualMiss.push(`${f}:${rel}`); continue; }
    const buf = fs.readFileSync(abs);
    const t = sniffType(buf);
    const curExt = path.extname(rel).toLowerCase();
    if (!t || curExt !== (EXT_FOR[t] ?? curExt)) residualWrong.push(`${f}:${rel}(${t ?? "corrupt"})`);
  }
}
console.log(`residual wrong-type refs: ${residualWrong.length}`, residualWrong.slice(0, 10).join(", "));
console.log(`residual missing refs: ${residualMiss.length}`, residualMiss.slice(0, 10).join(", "));
