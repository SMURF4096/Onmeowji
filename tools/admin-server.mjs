/**
 * admin-server.mjs — local-only admin UI for the content data.
 *
 *   node tools/admin-server.mjs            → http://127.0.0.1:8432
 *
 * Edits land in the SOURCE tree (data/src/<cat>/<slug>.json), then one "Build
 * site data" click regenerates data/*.json that the site fetches.
 * Adding a new entry shells out to scripts/add-entry.mjs (same scaffolds).
 */
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SRC = path.join(ROOT, "data", "src");
const PORT = Number(process.argv.find((a) => /^--port/.test(a))?.split("=")[1] ?? 8432);
const CATS = {
  shikigami: "Shikigami",
  souls: "Souls",
  characters: "Onmyoji & Champions",
  bondlings: "Bondlings",
  "status-icons": "Status Icons",
};
const safeSlug = (s) => /^[A-Za-z0-9_\-.\u4e00-\u9fff]+$/.test(String(s)) && !s.includes("..");

const read = (p) => fs.readFileSync(p, "utf8");
const j200 = (data, res) => { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(data)); };
const j400 = (msg, res) => { res.writeHead(400, { "content-type": "application/json" }); res.end(JSON.stringify({ error: String(msg) })); };

async function body(req) {
  let raw = "";
  for await (const c of req) raw += c;
  try { return JSON.parse(raw); } catch { return null; }
}

const orderPath = path.join(SRC, "_order.json");
const readOrder = () => (fs.existsSync(orderPath) ? JSON.parse(fs.readFileSync(orderPath, "utf8")) : {});
const writeOrder = (o) => fs.writeFileSync(orderPath, JSON.stringify(o, null, 2) + "\n");

function runBuild() {
  return new Promise((resolve) => {
    const p = spawn("node", [path.join(ROOT, "scripts", "build-data.mjs")], { cwd: ROOT, env: process.env });
    let out = "";
    p.stdout.on("data", (c) => (out += c));
    p.stderr.on("data", (c) => (out += c));
    p.on("close", (code) => resolve({ code, out }));
  });
}

const server = (req, res) => {
  const u = new URL(req.url, "http://127.0.0.1");
  const p = u.pathname;

  /* static repo files for previews (local only) */
  if (p.startsWith("/site/")) {
    const rel = decodeURIComponent(p.slice("/site/".length));
    const abs = path.normalize(path.join(ROOT, rel));
    if (!abs.startsWith(path.join(ROOT, "assets")) && !abs.startsWith(path.join(ROOT, "css") + "/")) { j400("not allowed", res); return; }
    try { res.writeHead(200, { "content-type": /webp|png|jpe?g|gif|svg$/i.test(rel) ? "image/" + (rel.split(".").pop()) : "text/plain" }); res.end(fs.readFileSync(abs)); }
    catch { res.writeHead(404); res.end(); }
    return;
  }

  if (p === "/") { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); res.end(read(path.join(ROOT, "tools", "admin.html"))); return; }

  if (p === "/api/list") {
    const cat = u.searchParams.get("cat");
    if (cat === "status-icons") return j200({ items: [{ slug: "status-icons", label: `status-icons.json (${Object.keys(JSON.parse(read(path.join(SRC, "status-icons.json")))).length} keys)` }] }, res);
    try {
      const files = fs.readdirSync(path.join(SRC, cat)).filter((f) => f.endsWith(".json"));
      const items = files.map((f) => {
        const slug = f.replace(/\.json$/, "");
        const e = JSON.parse(read(path.join(SRC, cat, f)));
        return { slug, label: `${e.no ?? "∅"} · ${e.en ?? e.name ?? ""}`.trim() || slug };
      });
      j200({ items }, res);
    } catch { j400("bad category", res); }
    return;
  }

  if (p === "/api/entry") {
    const cat = u.searchParams.get("cat"), slug = u.searchParams.get("slug");
    const f = cat === "status-icons" ? path.join(SRC, "status-icons.json") : path.join(SRC, cat, `${slug}.json`);
    if (!safeSlug(slug) && cat !== "status-icons") return j400("bad slug", res);
    try { j200(JSON.parse(read(f)), res); } catch (e) { console.error("entry/ERR:", f, e.message); j400("not found", res); }
    return;
  }

  if (p === "/api/save" && req.method === "POST") {
    body(req).then(({ cat, slug, data }) => {
      if (data == null) return j400("invalid JSON body", res);
      const f = cat === "status-icons" ? path.join(SRC, "status-icons.json") : path.join(SRC, cat, `${slug}.json`);
      if (!fs.existsSync(f)) return j400("entry does not exist", res);
      fs.writeFileSync(f, JSON.stringify(data, null, 2) + "\n");
      j200({ ok: true, file: path.relative(ROOT, f) }, res);
    });
    return;
  }

  if (p === "/api/new" && req.method === "POST") {
    body(req).then(({ cat, no, name, role }) => {
      const a = ["scripts/add-entry.mjs", cat, `--no=${no}`, ...(name ? [`--name=${name}`] : []), ...(role ? [`--role=${role}`] : [])];
      const p2 = spawn("node", a, { cwd: ROOT });
      let out = "";
      p2.stdout.on("data", (c) => (out += c));
      p2.stderr.on("data", (c) => (out += c));
      p2.on("close", (code) => j200({ code, out }, res));
    });
    return;
  }

  if (p === "/api/delete" && req.method === "POST") {
    body(req).then(({ cat, slug }) => {
      const f = path.join(SRC, cat, safeSlug(slug) + ".json");
      if (fs.existsSync(f)) fs.unlinkSync(f);
      j200({ ok: true }, res);
    });
    return;
  }

  if (p === "/api/build" && req.method === "POST") {
    runBuild().then((r) => j200(r, res));
    return;
  }

  if (p === "/api/assets") {
    const dir = u.searchParams.get("dir") ?? "";
    const abs = path.join(ROOT, "assets", path.join(dir));
    try { j200({ files: fs.readdirSync(abs).filter((f) => /\.(webp|png|jpe?g|gif|svg)$/i.test(f)) }, res); }
    catch { j400("bad dir", res); }
    return;
  }

  res.writeHead(404); res.end();
};

import { createServer } from "http";
createServer(server).listen(PORT, "127.0.0.1", () => {
  console.log(`admin UI → http://127.0.0.1:${PORT/1}   (edits data/src/*, Build regenerates data/*.json)`);
});
