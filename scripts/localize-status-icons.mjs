/**
 * localize-status-icons.mjs — running part of the build (also usable standalone).
 *
 * Moves the status/buff icons an entry's skills reference INTO that entry's own
 * file (data/src/{shikigami,characters,bondlings,souls}/{no}.json →
 * `statusIcons`), so revising one entity only ever opens one file. New entries
 * added later (e.g. via scripts/add-entry.mjs) are picked up automatically on
 * every build.
 *
 * - Uses the SAME resolver as the site (js/app.js parseSkillDesc +
 *   findStatusKey), so it seeds exactly the statuses that show icons today.
 * - A status referenced by several entries is copied into each of them.
 * - After seeding, every referenced key drops OUT of the shared glossary
 *   (data/src/status-icons.json) — it only remains a fallback for keys nothing
 *   references (and the tiny residual list of junk keys from the wiki source).
 * - `scripts/build-data.mjs` folds the per-entry maps back into the generated
 *   status-icons.json — runtime behaviour is unchanged.
 *
 * Run alone:  node scripts/localize-status-icons.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SRC = path.join(ROOT, "data", "src");
const glossaryPath = path.join(SRC, "status-icons.json");

const CLASSIC_BUFF = ["Heal", "Shield", "Amulet"];
const CLASSIC_DEBUFF = ["Confuse", "Silence", "Sleep", "Freeze", "Stun", "Bind", "Morph", "Disarm", "Daze", "Bone Lock", "Blind", "Slow", "Curse", "Poison", "Bleed", "Banish"];

/* ---- helpers mirrored from js/app.js ---- */
function parseSkillDesc(raw) {
  raw = String(raw ?? "").replace(/^\?\s*(?=\n|;|$)/, "");
  const parts = raw.split(/;\s*(?=[A-Z(（])/);
  const main = parts[0].replace(/;\s*:\s*/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  const effects = [];
  for (const seg of parts.slice(1)) {
    /* mirror of js/app.js parseSkillDesc — name may contain one ": Sub" segment */
    const m = seg.match(/^([^:]{1,60}?(?:\s*:\s*[^\s:][^:]{0,39}?)?)\s*(?:\(([^)]*)\))?\s*[:\s]*'{2,4}([^']+?)'{2,4}\s*[:.?]*\s*([\s\S]*)$/);
    if (m) { effects.push(m[1].trim().toLowerCase()); continue; }
    const n = seg.match(/^([^:]{1,60}?)\s*:+\s*([\s\S]{10,})$/);
    if (n && /^[A-Z]/.test(n[1])) effects.push(n[1].trim().toLowerCase());
  }
  if (!effects.length) {
    for (const w of [...CLASSIC_DEBUFF.map((x) => x.toLowerCase()), ...CLASSIC_BUFF.map((x) => x.toLowerCase())]) {
      if (new RegExp("(^|[^A-Za-z])" + w + "(?![A-Za-z])").test(main)) effects.push(w);
    }
  }
  return { names: effects };
}

function findStatusKey(name, ic) {
  const raw = String(name ?? "").toLowerCase().trim();
  if (!raw) return null;
  if (ic[raw]) return raw;
  const noJp = raw.replace(/\s*[（(][^）)]*[）)]\s*/g, "").trim().replace(/[.。]$/, "");
  if (noJp) {
    if (ic[noJp]) return noJp;
    const keys = Object.keys(ic).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (noJp.startsWith(key) || key.startsWith(noJp)) return key;
    }
  }
  return null;
}

export function localize() {
  const glossary = JSON.parse(fs.readFileSync(glossaryPath, "utf8"));
  const glossaryBefore = JSON.stringify(glossary);

  const readDir = (cat) => fs.readdirSync(path.join(SRC, cat)).filter((f) => f.endsWith(".json"))
    .map((f) => ({ f, e: JSON.parse(fs.readFileSync(path.join(SRC, cat, f), "utf8")) }));

  const CATS = ["shikigami", "characters", "bondlings", "souls"];

  /* statuses already localized live inside per-entry statusIcons, not the shared
     glossary — fold them back in for resolution so NEW entries referencing an
     already-localized status (e.g. "blooming") still self-seed on build */
  const localized = {};
  for (const cat of CATS) {
    for (const { f, e } of readDir(cat)) {
      for (const [name, v] of Object.entries(e.statusIcons ?? {})) {
        const file = typeof v === "string" ? { file: path.basename(v), url: v, jp: "" } : { file: v.file, url: v.url ?? v.file, jp: v.jp ?? "" };
        localized[name.toLowerCase().trim()] = file;
      }
    }
  }
  const resolver = { ...localized, ...glossary }; /* shared glossary wins where both have a key */

  /* reference map: key → entries that use it, per category */
  const refsByCat = Object.fromEntries(CATS.map((c) => [c, new Map()]));
  for (const cat of CATS) {
    for (const { f, e } of readDir(cat)) {
      for (const k of [...(e.skills ?? []), ...(e.skill ? [e.skill] : [])]) {
        if (!k?.description && !k?.upgrades) continue;
        const names = [...parseSkillDesc(k.description).names];
        for (const u of k.upgrades ?? []) {
          const parts = String(u.text ?? "").split(/'''([^']+?)'''\s*:\s*/);
          for (let i = 1; i < parts.length; i += 2) names.push(parts[i].trim().toLowerCase());
        }
        const keys = new Set(names.map((n) => findStatusKey(n, resolver)).filter(Boolean));
        for (const key of keys) {
          const m = refsByCat[cat];
          if (!m.has(key)) m.set(key, []);
          m.get(key).push({ f, no: e.no, en: e.en });
        }
      }
    }
  }

  /* seed per-entry statusIcons in every category (skip unless something changed) */
  let moved = 0, filesTouched = 0;
  for (const cat of CATS) {
    for (const [key, users] of refsByCat[cat]) {
      for (const { f } of users) {
        const p = path.join(SRC, cat, f);
        const beforeRaw = fs.readFileSync(p, "utf8");
        const e = JSON.parse(beforeRaw);
        if (e.statusIcons?.[key]) continue; /* already there */
        e.statusIcons ??= {};
        e.statusIcons[key] = resolver[key];
        e.statusIcons = Object.fromEntries(Object.entries(e.statusIcons).sort(([a], [b]) => a.localeCompare(b)));
        const afterRaw = JSON.stringify(e, null, 2) + "\n";
        if (afterRaw !== beforeRaw) { fs.writeFileSync(p, afterRaw); filesTouched++; }
      }
      moved++;
      /* the key now lives with every entry that references it */
      if (key in glossary) delete glossary[key];
    }
  }

  if (JSON.stringify(glossary) !== glossaryBefore) fs.writeFileSync(glossaryPath, JSON.stringify(glossary, null, 2) + "\n");

  if (moved || filesTouched || JSON.stringify(glossary) !== glossaryBefore) {
    const catSummary = CATS.map((c) => `${c} ${refsByCat[c].size}`).join(" / ");
    console.log(`localize-status-icons: ${moved} status key(s) self-seeded (${catSummary}), ${filesTouched} file(s) updated`);
    if (JSON.stringify(glossary) !== glossaryBefore || moved || filesTouched)
      console.log(`  shared glossary holds ${Object.keys(glossary).length} key(s) (fallback only)`);
  }
  return { moved, filesTouched, glossaryKeys: Object.keys(glossary).length };
}

/* CLI mode */
if (process.argv[1] === fileURLToPath(import.meta.url)) localize();
