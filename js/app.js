/* app.js — shared data loader + page renderers.
   Data: data/*.json produced by tools/collect*.mjs (public wiki data, CC BY-NC-SA).
   Site is fully self-contained: no outbound navigation anywhere. */

const state = { shikigami: [], souls: [], stats: { min: [], max: [] }, chars: [], bonds: [] };

/* entrance choreography opt-in: only when JS is live and motion allowed */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("js-fx");

const RARITY_ORDER = { SP: 0, SSR: 1, SR: 2, R: 3, N: 4 };
const esc = (s) => String(s ?? "").replace(/<br\s*\/?>/gi, "\n").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/* Format wiki definition-list remnants like ";Upper Hand :Auto gain…" → "Upper Hand — Auto gain…" */
const fmtText = (s) => esc(String(s ?? "")
  .replace(/;\s*([^;:\n]{1,80}?)\s*:\s*/g, "$1 — ")
  .replace(/(?:^|\n)\s*:\s*/g, "— ")
  .replace(/(^|\n)\s*;\s*/g, "$1"));

async function loadAll() {
  const base = document.body.dataset.data ?? "data/";
  const [sh, so, st, ch, bo] = await Promise.all([
    fetch(base + "shikigami.json").then((r) => r.json()),
    fetch(base + "souls.json").then((r) => r.json()),
    fetch(base + "stats.json").then((r) => r.json()),
    fetch(base + "onmyoji.json").then((r) => r.json()),
    fetch(base + "bondlings.json").then((r) => r.json()),
  ]);
  state.shikigami = sh;
  state.souls = so.sort((a, b) => a.no - b.no);
  state.stats = st;
  state.chars = ch;
  state.bonds = bo;
  document.dispatchEvent(new CustomEvent("data-ready"));
}

const statMap = (tab) => Object.fromEntries(state.stats[tab].map((r) => [r.no, r]));

/* ============ Entrance choreography ============ */
let revealIO;
/** Stagger-reveal .card/.soul-row/.stat-card inside the given container as they enter the viewport. */
/* ============ ArcanaMana motion engine (GSAP mirrors arcanamana.com) ============
   Their engine: Framer Motion JS — 3D card-draw flip (perspective 1200px,
   rotateY 180°), scroll-appear entrances (scale 0.96 → 1, rise 16px),
   clock 150/300/500ms, standard ease. We clone it with the vendored GSAP. */
function arcanamanaFx() {
  if (REDUCED || !window.gsap) return;
  document.documentElement.classList.add("gsap-fx"); /* kills the CSS fallbacks */
  if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  window.revealGSAP = (container) => {
    if (!container) return;
    const els = container.querySelectorAll(".card, .soul-row, .stat-card");
    if (!els.length) return;
    gsap.fromTo(els,
      { opacity: 0, y: 16, scale: 0.96, overwrite: false },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out", stagger: 0.06, overwrite: "auto" });
  };

  /* hero choreography on index (replaces the CSS rises gsap-fx disables) */
  if (document.querySelector(".hero h1")) {
    gsap.timeline({ defaults: { ease: "power2.out" } })
      .from(".nav", { y: -10, opacity: 0, duration: 0.3 }, 0)
      .from(".hero-mono", { opacity: 0, duration: 0.3 }, 0.05)
      .from(".hero h1", { opacity: 0, y: 24, scale: 0.96, duration: 0.5 }, 0.1)
      .from(".hero .sub", { opacity: 0, y: 16, duration: 0.5 }, 0.45)
      .from(".hero .cta", { opacity: 0, y: 16, duration: 0.5 }, 0.6);
  }

  /* section headings reveal on scroll (replaces the view() timeline) */
  document.querySelectorAll(".sec-head").forEach((h) => {
    gsap.from(h, {
      opacity: 0, y: 16, duration: 0.3, ease: "power2.out",
      ...(window.ScrollTrigger ? { scrollTrigger: { trigger: h, start: "top 88%" } } : {}),
    });
  });
}

/* 3D card-draw flip for the detail dialog — the signature ArcanaMana move */
function modalFlip(modal) {
  if (REDUCED || !window.gsap || !modal) return;
  gsap.fromTo(modal,
    { opacity: 0, transformPerspective: 1200, rotateY: -180, transformOrigin: "50% 50%", overwrite: "auto" },
    { opacity: 1, rotateY: 0, duration: 0.55, ease: "power3.out", overwrite: "auto" });
}

function revealIn(container) {
  if (!container) return;
  if (window.revealGSAP) { window.revealGSAP(container); return; }
  const els = container.querySelectorAll(".card:not(.in-view), .soul-row:not(.in-view), .stat-card:not(.in-view)");
  if (!els.length) return;
  if (REDUCED) { els.forEach((el) => el.classList.add("in-view")); return; }
  revealIO ??= new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("in-view"); revealIO.unobserve(e.target); }
    }
  }, { rootMargin: "0px 0px -40px" }); /* ds-allow-hardcode: observer margin */
  els.forEach((el, i) => {
    const d = Math.min(i % 12, 12) * 45;
    el.style.setProperty("--st", `${d}ms`);
    el.style.setProperty("--sheen-st", `${d}ms`);
    revealIO.observe(el);
    /* once revealed, drop the entrance delay so hover stays instant */
    setTimeout(() => el.style.removeProperty("--st"), 1100 + d);
  });
}

/* keyboard activation for role=button cards and rows */
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") &&
      e.target instanceof Element &&
      e.target.matches('.card[role="button"], .soul-row[role="button"]') &&
      !e.target.matches("input, textarea, select, button, a, [contenteditable]")) {
    e.preventDefault();
    e.target.click();
  }
});

/* ============ index.html ============ */
async function renderIndex() {
  await loadAll();
  const counts = {};
  for (const s of state.shikigami) counts[s.rarity] = (counts[s.rarity] ?? 0) + 1;

  const byNo = Object.fromEntries(state.shikigami.filter((s) => s.no != null).map((s) => [s.no, s]));
  const band = document.getElementById("stats-band");
  if (band) {
    band.innerHTML = `
      <div class="stat-card"><div class="num">${state.shikigami.length}</div><div class="label">Shikigami</div>
        <div class="mini"><span><b>${counts.SSR ?? 0}</b> SSR</span><span><b>${counts.SR ?? 0}</b> SR</span><span><b>${counts.SP ?? 0}</b> SP</span></div></div>
      <div class="stat-card"><div class="num">${state.souls.length}</div><div class="label">Soul Sets</div>
        <div class="mini"><span>2-set &amp; 4-set effects stored</span></div></div>
      <div class="stat-card"><div class="num">${state.shikigami.filter((s) => s.skills?.length).length}</div><div class="label">Skill Sheets</div>
        <div class="mini"><span>full text, onibi costs, level-ups</span></div></div>
      <div class="stat-card"><div class="num">${state.chars.length}</div><div class="label">Onmyoji &amp; Champions</div>
        <div class="mini"><span>plus <b>${state.bonds.length}</b> <a href="bonding.html" style="color:var(--gold-soft)">bondlings</a></span></div></div>
      <div class="stat-card"><div class="num">${state.shikigami.filter((s) => s.cv).length}</div><div class="label">Voice Actors</div>
        <div class="mini"><span>collected with the roster</span></div></div>`;
  }

  const featured = state.shikigami
    .filter((s) => (s.rarity === "SSR" || s.rarity === "SP") && (s.localImage || s.imageUrl) && s.no)
    .sort((a, b) => b.no - a.no)
    .slice(0, 8);
  const feat = document.getElementById("featured");
  if (feat) {
    feat.classList.add("grid");
    feat.innerHTML = featured.map((s, i) => shikCard(s, i === 0)).join("");
    feat.querySelectorAll(".card").forEach((el) =>
      el.addEventListener("click", () => openDetail(byNo[el.dataset.no])));
    markImages(feat);
    revealIn(feat);
  }
  revealIn(band);
}

/* ============ shikigami.html ============ */
let currentQuery = "";
let currentRar = "ALL";
let currentSort = "no-desc";

const CLOSE_SVG = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>`;
const SEARCH_SVG = `<svg class="search-ico" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="7" cy="7" r="4.4"/><path d="m10.4 10.4 3 3"/></svg>`;

function markImages(grid) {
  // graceful degradation for any art that fails to load
  grid?.querySelectorAll(".card img, .soul-row img").forEach((img) => {
    img.addEventListener("error", () => {
      const c = img.closest(".card");
      if (c) { c.classList.add("img-err"); c.dataset.initial ||= (c.querySelector(".name strong")?.textContent ?? "?")[0]; }
      const row = img.closest(".soul-row");
      if (row) img.style.visibility = "hidden";
    });
  });
}

function shikCard(s, lead = false) {
  return `
  <div class="card${lead ? " lead" : ""}" data-no="${s.no}" data-rarity="${s.rarity}" tabindex="0" role="button"
       aria-label="${esc(s.en)} (${s.rarity})">
    <span class="sheen" aria-hidden="true"></span>
    ${s.art || s.localImage || s.imageUrl ? `<img src="${s.art || s.localImage || s.imageUrl}" loading="lazy" decoding="async" alt="${esc(s.en)}">` : `<div class="skeleton"></div>`}
    <div class="name"><strong>${esc(s.en)}</strong>${s.cn ? `<div class="cn">${esc(s.cn)}</div>` : ""}</div>
    <div class="meta"><span class="badge ${s.rarity}">${s.rarity}</span>${s.no ? `<span class="no">No.${s.no}</span>` : ""}</div>
  </div>`;
}

function renderGrid() {
  const grid = document.getElementById("shik-grid");
  const note = document.getElementById("count-note");
  let list = state.shikigami.filter((s) => currentRar === "ALL" || s.rarity === currentRar);
  if (currentQuery.trim()) {
    const q = currentQuery.trim().toLowerCase();
    list = list.filter((s) => [s.en, s.cn, s.jp, s.gl, s.cv, JSON.stringify(s.skills ?? [])].some((v) => v && v.toLowerCase().includes(q)));
  }
  const cmp = {
    "no-desc": (a, b) => (b.no ?? 1e9) - (a.no ?? 1e9),
    "no-asc": (a, b) => (a.no ?? 1e9) - (b.no ?? 1e9),
    "rar": (a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity] || (b.no ?? 0) - (a.no ?? 0),
    "en": (a, b) => a.en.localeCompare(b.en),
  }[currentSort];
  list = [...list].sort(cmp);
  note.textContent = `${list.length} / ${state.shikigami.length} shown`;
  grid.innerHTML = list.length
    ? list.map((s) => shikCard(s)).join("")
    : `<div class="center-note" style="grid-column:1/-1">No shikigami match your search.</div>`;
  grid.querySelectorAll(".card").forEach((el) => el.addEventListener("click", () => openDetail(list.find((x) => String(x.no) === el.dataset.no))));
  markImages(grid);
  revealIn(grid);
}

/* ============ Custom sort listbox (native <select> never ships) ============ */
const SORT_LABELS = { "no-desc": "Newest", "no-asc": "Oldest", "rar": "Rarity", "en": "Name A–Z" };

function initSortMenu() {
  const root = document.getElementById("sort-menu");
  if (!root) return;
  const btn = root.querySelector(".menu-btn");
  const label = root.querySelector("#sort-label");
  const listbox = root.querySelector(".menu-list");
  const opts = [...listbox.querySelectorAll('[role="option"]')];

  const open = (focusOpt) => {
    listbox.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    if (focusOpt) focusOpt.focus();
  };
  const close = (refocus) => {
    listbox.hidden = true;
    btn.setAttribute("aria-expanded", "false");
    if (refocus) btn.focus();
  };
  const pick = (opt) => {
    opts.forEach((o) => o.setAttribute("aria-selected", String(o === opt)));
    currentSort = opt.dataset.value;
    label.textContent = SORT_LABELS[currentSort] ?? "Sort";
    close(true);
    renderGrid();
  };

  btn.addEventListener("click", () => (listbox.hidden ? open() : close()));
  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(opts.find((o) => o.getAttribute("aria-selected") === "true") ?? opts[0]);
    }
  });

  opts.forEach((o) => {
    o.tabIndex = -1;
    o.addEventListener("click", () => pick(o));
    o.addEventListener("keydown", (e) => {
      const i = opts.indexOf(o);
      const sel = opts.find((x) => x.getAttribute("aria-selected") === "true");
      const selIdx = opts.indexOf(sel) >= 0 ? opts.indexOf(sel) : i;
      const move = (n) => opts[(n + opts.length) % opts.length]?.focus();
      if (e.key === "ArrowDown") { e.preventDefault(); move(selIdx + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(selIdx - 1); }
      else if (e.key === "Home") { e.preventDefault(); opts[0].focus(); }
      else if (e.key === "End") { e.preventDefault(); opts[opts.length - 1].focus(); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(o); }
      else if (e.key === "Escape") { e.preventDefault(); close(true); }
      else if (e.key.length === 1) { /* typeahead */
        e.preventDefault();
        const hit = opts.filter((x) => x.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()));
        if (hit.length) move(Math.max(selIdx, 0) + (hit.indexOf(o) + 1));
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target) && !listbox.hidden) close();
  });
}

async function renderShikigami() {
  await loadAll();
  const grid = document.getElementById("shik-grid");
  grid.innerHTML = Array.from({ length: 12 }, () => `<div class="skeleton"></div>`).join("");

  document.getElementById("search").addEventListener("input", (e) => { currentQuery = e.target.value; renderGrid(); });
  document.querySelectorAll(".chip[data-rarity]").forEach((chip) =>
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      currentRar = chip.dataset.rarity;
      renderGrid();
    }));

  initSortMenu();
  const label = document.getElementById("sort-label");
  if (label) label.textContent = SORT_LABELS[currentSort];

  const allChip = document.querySelector('.chip[data-rarity="ALL"]');
  if (allChip) allChip.classList.add("on");
  renderGrid();
}

/* ============ souls.html ============ */
let soulQuery = "";
let soulType = "ALL";

async function renderSouls() {
  await loadAll();
  const types = ["ALL", ...[...new Set(state.souls.map((s) => s.type))].filter(Boolean).sort()];
  const chips = document.getElementById("type-chips");
  chips.innerHTML = types.map((t) => `<button class="chip${t === "ALL" ? " on" : ""}" data-type="${t}">${t}</button>`).join("");
  chips.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.querySelectorAll(".chip").forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      soulType = chip.dataset.type;
      renderSoulList();
    }));
  document.getElementById("soul-search").addEventListener("input", (e) => { soulQuery = e.target.value; renderSoulList(); });
  renderSoulList();
}

function renderSoulList() {
  const listEl = document.getElementById("soul-list");
  const note = document.getElementById("count-note");
  let list = state.souls;
  if (soulType !== "ALL") list = list.filter((s) => s.type === soulType);
  if (soulQuery.trim()) {
    const q = soulQuery.trim().toLowerCase();
    list = list.filter((s) => [s.en, s.cn, s.jp].some((v) => v && v.toLowerCase().includes(q)));
  }
  note.textContent = `${list.length} / ${state.souls.length} shown`;
  listEl.innerHTML = list.length ? list.map((s) => `
    <div class="soul-row" tabindex="0" role="button" data-no="${s.no}" aria-label="${esc(s.en)} details">
      <span class="soul-icon">${s.art || s.localImage || s.imageUrl ? `<img src="${s.art || s.localImage || s.imageUrl}" loading="lazy" alt="${esc(s.en)} icon">` : ""}</span>
      <span class="names">
        <span class="en"><strong>No.${s.no}</strong> · ${esc(s.en)}</span>
        <span class="cn">${esc(s.cn)}${s.jp ? ` — ${esc(s.jp)}` : ""}</span>
      </span>
      <span class="fx">
        <span class="line" title="${esc(s.combo2 ?? "")}">2 — ${esc(s.combo2 ?? "")}</span>
        <span class="line dim" title="${esc(s.combo4 ?? "")}">4 — ${esc(s.combo4 ?? "")}</span>
      </span>
      <span class="type-col"><span class="badge ${s.type}">${esc(s.type)}</span></span>
    </div>`).join("")
    : `<div class="center-note">No souls match your search.</div>`;
  listEl.querySelectorAll(".soul-row").forEach((row) =>
    row.addEventListener("click", () => openSoulDetail(list.find((x) => String(x.no) === row.dataset.no))));
  markImages(listEl);
  revealIn(listEl);
}

/* ============ characters.html ============ */
let charTab = "onmyoji";
let charQuery = "";


function charCard(c) {
  const sub = c.unlock ? `${esc(c.unlock)}` : "";
  return `
    <div class="card" data-id="${esc(c.no)}" data-tab="${c.role}" tabindex="0" role="button"
         aria-label="${esc(c.en)} (${c.role})">
      <span class="sheen" aria-hidden="true"></span>
      ${c.image || c.imageUrl ? `<img src="${c.image ?? c.imageUrl}" loading="lazy" decoding="async" alt="${esc(c.en)}">` : `<div class="skeleton"></div>`}
      <div class="name"><strong>${esc(c.en)}</strong>${c.cn ? `<div class="cn">${esc(c.cn)}</div>` : ""}</div>
      <div class="meta"><span class="badge ${c.role === "onmyoji" ? "SSR" : "SP"}">${c.role === "onmyoji" ? "Onmyoji" : "Champion"}</span>${sub ? `<span class="no">${sub}</span>` : ""}</div>
    </div>`;
}

function bondCard(b) {
  const skin0 = (b.skins && b.skins[0]) ? b.skins[0] : "";
  const imgSrc = skin0 || b.image || b.imageUrl || "";
  const imgHtml = imgSrc ? `<img src="${imgSrc}" loading="lazy" decoding="async" alt="${esc(b.en)}">` : `<div class="skeleton"></div>`;
  return `
    <div class="card" data-id="${esc(b.no)}" data-tab="bondling" tabindex="0" role="button"
         aria-label="${esc(b.en)} (bondling)">
      <span class="sheen" aria-hidden="true"></span>
      ${imgHtml}
      <div class="name"><strong>${esc(b.en)}</strong>${b.cn ? `<div class="cn">${esc(b.cn)}</div>` : ""}</div>
      <div class="meta"><span class="badge">${esc(b.type)}</span>${b.area ? `<span class="no">${esc(b.area)}</span>` : ""}</div>
    </div>`;
}

function renderCharGrid() {
  const grid = document.getElementById("char-grid");
  const note = document.getElementById("count-note");
  let list;
  if (charTab === "bondling") {
    list = state.bonds;
  } else {
    list = state.chars.filter((c) => c.role === charTab);
  }
  if (charQuery.trim()) {
    const q = charQuery.trim().toLowerCase();
    list = list.filter((c) => [c.en, c.cn, c.jp, c.gl, c.cv, c.type, c.skill].some((v) => v && String(v).toLowerCase().includes(q)));
  }
  note.textContent = `${list.length} / ${charTab === "bondling" ? state.bonds.length : state.chars.length} shown`;
  grid.innerHTML = list.length
    ? list.map((c) => (charTab === "bondling" ? bondCard(c) : charCard(c))).join("")
    : `<div class="center-note" style="grid-column:1/-1">Nothing to show here yet.</div>`;
  grid.querySelectorAll(".card").forEach((el) => el.addEventListener("click", () => {
    const id = el.dataset.id;
    if (charTab === "bondling") openBondDetail(state.bonds.find((b) => b.no === id));
    else openCharDetail(state.chars.find((c) => c.no === id));
  }));
  markImages(grid);
  revealIn(grid);
}

async function renderCharacters() {
  await loadAll();
  document.getElementById("char-search").addEventListener("input", (e) => { charQuery = e.target.value; renderCharGrid(); });
  document.querySelectorAll("#char-chips .chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      document.querySelectorAll("#char-chips .chip").forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      charTab = chip.dataset.tab;
      renderCharGrid();
    }));
  renderCharGrid();
}

/* ============ bonding.html ============ */
function renderBondGrid() {
  const grid = document.getElementById("bond-grid");
  const note = document.getElementById("count-note");
  let list = state.bonds;
  if (charQuery.trim()) {
    const q = charQuery.trim().toLowerCase();
    list = list.filter((b) => [b.en, b.cn, b.jp, b.type, b.area].some((v) => v && String(v).toLowerCase().includes(q)));
  }
  note.textContent = `${list.length} / ${state.bonds.length} shown`;
  grid.innerHTML = list.length
    ? list.map(bondCard).join("")
    : `<div class="center-note" style="grid-column:1/-1">No bondling match your search.</div>`;
  grid.querySelectorAll(".card").forEach((el) => el.addEventListener("click", () =>
    openBondDetail(state.bonds.find((b) => b.no === el.dataset.id))));
  markImages(grid);
  revealIn(grid);
}

async function renderBonding() {
  await loadAll();
  document.getElementById("bond-search").addEventListener("input", (e) => { charQuery = e.target.value; renderBondGrid(); });
  renderBondGrid();
}

/* detail-hero sizing: [maxW, maxH, "trim"]. Every roster entry uses the enlarged
   box; "trim" crops transparent canvas margins first, so the visible artwork
   fills the box. Callers may still override single entries via the maps. */
const HERO_SHIK = {};
const HERO_SHIK_DEFAULT = [640, 500, "trim"];
const HERO_SOUL = {};
const HERO_SOUL_DEFAULT = [470, 380, "trim"];
const heroBox = (map, no, def) => {
  const t = map[no] ?? def;
  return `data-hero-w="${t?.[0] ?? 340}" data-hero-h="${t?.[1] ?? 250}"${t?.[2] ? ' data-hero-trim="1"' : ""}${t ? ' data-hero-big="1"' : ""}`;
};

/* ============ Character detail ============ */
function heroFit(img) {
  // deterministic hero sizing: fit the artwork inside its box (with per-entry override)
  const maxW = Number(img.dataset.heroW) || 340, maxH = Number(img.dataset.heroH) || 250;
  if (!img.naturalWidth || !img.naturalHeight) return;
  /* trim pass: crop fully transparent margins, then re-fit the cropped art */
  if (img.dataset.heroTrim === "1" && img.dataset.trimmed !== "1") {
    img.dataset.trimmed = "1";
    try {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      const W = c.width, H = c.height;
      /* density scan: a row/column is content only when it holds a minimum
         number of solid pixels — single stray dust dots at the extremes
         must not stretch the crop box (keeps the hero art tight) */
      const col = new Uint32Array(W), row = new Uint32Array(H);
      for (let y = 0; y < H; y++) {
        const base = y * W * 4;
        for (let x = 0; x < W; x++) {
          if (d[base + x * 4 + 3] > 26) { col[x]++; row[y]++; }
        }
      }
      const MIN = 3;
      let x0 = 0, y0 = 0, x1 = W - 1, y1 = H - 1;
      while (x0 < x1 && col[x0] < MIN) x0++;
      while (x1 > x0 && col[x1] < MIN) x1--;
      while (y0 < y1 && row[y0] < MIN) y0++;
      while (y1 > y0 && row[y1] < MIN) y1--;
      const found = x1 - x0 + 1 > 8 && y1 - y0 + 1 > 8;
      if (found) {
        /* keep a small safety margin so soft edges are not clipped */
        x0 = Math.max(0, x0 - 6); y0 = Math.max(0, y0 - 6);
        x1 = Math.min(W - 1, x1 + 6); y1 = Math.min(H - 1, y1 + 6);
        const out = document.createElement("canvas");
        out.width = x1 - x0 + 1; out.height = y1 - y0 + 1;
        out.getContext("2d").drawImage(img, -x0, -y0);
        lastTrimSrc = img.src;
        img.src = out.toDataURL("image/png");
        return; /* onload re-fires heroFit with the cropped natural size */
      }
    } catch { /* canvas unavailable — fall through to the plain fit */ }
  }
  const s = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
  img.style.width = Math.round(img.naturalWidth * s) + "px";
  img.style.height = Math.round(img.naturalHeight * s) + "px";
}

function skillsBlock(skills, emptyNote) {
  const rows = (skills ?? []).map((k) => `
    <div class="skill-card">
      ${k.icon ? `<img class="skill-icon" src="${k.icon}" alt="" onerror="this.onerror=null;this.style.display='none'">` : ""}
      <div class="skill-body">
        <div class="skill-head"><strong>${esc(k.name)}</strong>
          <span class="skill-tags">
            ${k.type ? `<span class="skill-kind">${esc(k.type)}</span>` : ""}
            ${k.onibi != null && k.onibi !== "" ? `<span>Onibi ${esc(k.onibi)}</span>` : ""}
          </span>
        </div>
        <div class="skill-cost">Cooldown ${k.cooldown ?? 0}</div>
        ${k.line ? `<p class="skill-line">“${esc(k.line)}”</p>` : ""}
        ${k.description ? `<p>${fmtText(k.description)}</p>` : ""}
        ${(k.upgrades ?? []).length ? `<ul class="skill-ups">${k.upgrades.map((u) => `<li><b>Lv.${u.lvl}</b> ${esc(u.text)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>`).join("");
  return `<section><h4>Skills</h4>${rows || `<p class="center-note">${emptyNote}</p>`}</section>`;
}

function charStatsBlock(stats2) {
  if (!stats2) return "";
  const rows = [
    ["ATK", stats2.atk], ["HP", stats2.hp], ["DEF", stats2.def], ["SPD", stats2.spd],
    ["Crit", stats2.crit, "%"], ["Crit DMG", stats2.cdmg, "%"],
    ["Eff Hit", stats2.effhit, "%"], ["Eff Res", stats2.effres, "%"],
  ];
  return `<section><h4>Growth Stats</h4>
    <table class="mini"><thead><tr><th></th><th>Lv1</th><th>Max</th></tr></thead><tbody>
    ${rows.map(([label, t, suf]) => `<tr><td>${label}</td><td>${t?.lv1 ?? "?"}${suf ?? ""}</td><td>${t?.max ?? "?"}${suf ?? ""}</td></tr>`).join("")}
    </tbody></table></section>`;
}

function openCharDetail(c) {
  if (!c) return;
  history.replaceState(null, "", `#${c.no}`);
  showModal(`
    <button class="close" aria-label="Close">${CLOSE_SVG}</button>
    <div class="md">
      <div class="md-head">
        <img class="avatar" src="${c.image ?? c.imageUrl ?? ""}" alt="${esc(c.en)}">
        <div>
          <h3>${esc(c.en)}</h3>
          <div class="md-names">${esc(c.cn ?? "")}${c.jp ? ` · ${esc(c.jp)}` : ""}${c.gl && c.gl !== c.en ? ` · ${esc(c.gl)}` : ""}</div>
          <div class="md-meta">
            <span class="badge ${c.role === "onmyoji" ? "SSR" : "SP"}">${c.role === "onmyoji" ? "Onmyoji" : "Champion"}</span>
            <span class="no" style="color:var(--faint);font-size:.78rem;">No.${esc(c.no)}</span>
            ${c.unlock ? `<span style="color:var(--muted);font-size:.82rem;">Unlocked: ${esc(c.unlock)}</span>` : ""}
            ${c.cv ? `<span style="color:var(--muted);font-size:.82rem;">CV: ${esc(c.cv)}</span>` : ""}
          </div>
        </div>
      </div>
      ${c.intro ? `<section><h4>Introduction</h4><p>${fmtText(c.intro)}</p></section>` : ""}
      ${skillsBlock(c.skills, "Skill records for this character have not been added to the wiki yet.")}
      ${charStatsBlock(c.stats2)}
    </div>`);
}

/* ============ Bondling detail ============ */
function openBondDetail(b) {
  if (!b) return;
  history.replaceState(null, "", `#${b.no}`);
  showModal(`
    <button class="close" aria-label="Close">${CLOSE_SVG}</button>
    <div class="md">
      <div class="md-head">
        <img class="avatar" src="${b.image ?? b.imageUrl ?? ""}" alt="${esc(b.en)}">
        <div>
          <h3>${esc(b.en)}</h3>
          <div class="md-names">${esc(b.cn ?? "")}${b.jp ? ` · ${esc(b.jp)}` : ""}</div>
          <div class="md-meta">
            <span class="badge">${esc(b.type)}</span>
            <span class="no" style="color:var(--faint);font-size:.78rem;">No.${esc(b.no)}</span>
            ${b.area ? `<span style="color:var(--muted);font-size:.82rem;">Area: ${esc(b.area)}</span>` : ""}
          </div>
        </div>
      </div>
      ${b.skill ? `<section><h4>Bonding Effect</h4><p>${fmtText(b.skill)}</p></section>` : ""}
      ${(b.skins ?? []).length ? `<section><h4>Skins</h4>
        <div class="thumb-row">${b.skins.map((s) => `<div class="thumb"><img src="${s}" loading="lazy" alt="${esc(b.en)} skin"></div>`).join("")}</div></section>` : ""}
    </div>`);
}

/* ============ Modal core ============ */
function ensureModal() {
  let bd = document.getElementById("modal-backdrop");
  if (!bd) {
    bd = document.createElement("div");
    bd.id = "modal-backdrop";
    bd.className = "modal-backdrop";
    document.body.appendChild(bd);
  }
  return bd;
}

/* Tab trap: while the dialog is open, cycling focus stays inside it */
function modalTabTrap(e) {
  if (e.key !== "Tab") return;
  const bd = document.getElementById("modal-backdrop");
  if (!bd || !bd.classList.contains("open")) return;
  const focusables = [...bd.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')]
    .filter((el) => el.offsetParent !== null);
  if (!focusables.length) { e.preventDefault(); return; }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

let modalOpener = null;
function showModal(html) {
  const bd = ensureModal();
  bd.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  const modal = bd.querySelector(".modal");
  const title = bd.querySelector(".modal h3, .modal h2");
  if (title) { title.id = title.id || "modal-title"; modal.setAttribute("aria-labelledby", title.id); }
  const closeBtn = bd.querySelector(".close");
  closeBtn.addEventListener("click", closeModal);
  /* focus management: land on the close affordance, trap Tab, restore on close */
  modalOpener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  bd.classList.add("open");
  modalFlip(modal); /* ArcanaMana 3D draw; no-ops when GSAP/motion unavailable */
  closeBtn.focus();
  document.addEventListener("keydown", modalTabTrap, true);
  /* images already complete when injected (cache) never fire onload — size them now */
  const hero = bd.querySelector("img.avatar.hero");
  if (hero && hero.complete && hero.naturalWidth) heroFit(hero);
  /* widen the stage for entries whose hero art renders oversized */
  modal.classList.toggle("modal-wide", !!bd.querySelector("[data-hero-big]"));
}
function closeModal() {
  const bd = ensureModal();
  bd.classList.remove("open");
  document.removeEventListener("keydown", modalTabTrap, true);
  if (modalOpener) { modalOpener.focus(); modalOpener = null; }
  if (location.hash) history.replaceState(null, "", location.pathname + (location.search ?? ""));
}

/* ============ Shikigami detail ============ */
function openDetail(s) {
  if (!s) return;
  history.replaceState(null, "", `#${s.no}`);
  const min = statMap("min")[s.no] ?? {};
  const max = statMap("max")[s.no] ?? {};
  const legacy = ["atk", "hp", "def", "spd", "crit", "critdmg", "effhit", "effres"].some((k) => min[k] != null)
    ? { min, max } : null;

  let stats;
  if (s.stats2) {
    const g = s.stats2.grades ?? {};
    const rows = [
      ["ATK", s.stats2.base.atk, g.atk], ["HP", s.stats2.base.hp, g.hp],
      ["DEF", s.stats2.base.def, g.def], ["SPD", s.stats2.base.spd, g.spd],
      ["Crit", s.stats2.base.crit, g.crit, "%"], ["Crit DMG", s.stats2.base.cdmg, null, "%"],
      ["Eff Hit", s.stats2.base.acc, null, "%"], ["Eff Res", s.stats2.base.res, null, "%"],
    ];
    stats = `<section><h4>Growth Stats</h4>
      <table class="mini"><thead><tr><th></th><th>Grade</th><th>Lv1</th><th>Awakened</th><th>Max</th></tr></thead><tbody>
      ${rows.map(([label, t, gr, suf]) => `
        <tr><td>${label}</td><td>${gr && gr[0] ? `${esc(gr[0])} → ${esc(gr[1])}` : "—"}</td>
        <td>${t?.lv1 ?? "?"}${suf ?? ""}</td><td>${t?.lv2 ?? "?"}${suf ?? ""}</td><td>${t?.max ?? "?"}${suf ?? ""}</td></tr>`).join("")}
      </tbody></table></section>`;
  } else if (legacy) {
    const statRows = ["atk", "hp", "def", "spd", "crit", "critdmg", "effhit", "effres"];
    const labels = { atk: "ATK", hp: "HP", def: "DEF", spd: "SPD", crit: "Crit", critdmg: "Crit DMG", effhit: "Eff Hit %", effres: "Eff Res %" };
    stats = `<section><h4>Base Stats</h4>
      <table class="mini"><thead><tr><th></th>${statRows.map((k) => `<th>${labels[k]}</th>`).join("")}</tr></thead>
      <tbody><tr><td>LV1</td>${statRows.map((k) => `<td>${legacy.min[k] ?? "?"}</td>`).join("")}</tr>
      <tr><td>MAX</td>${statRows.map((k) => `<td>${legacy.max[k] ?? "?"}</td>`).join("")}</tr></tbody></table></section>`;
  }

  const skills = (s.skills ?? []).map((k) => `
    <div class="skill-card">
      ${k.icon ? `<img class="skill-icon" src="${k.icon}" alt="" onerror="this.onerror=null;this.style.display='none'">` : ""}
      <div class="skill-body">
        <div class="skill-head"><strong>${esc(k.name)}</strong>
          <span class="skill-tags"><span class="skill-kind">${esc(k.group ?? "")}</span>
          ${k.type && k.type.toUpperCase() !== (k.group ?? "").toUpperCase() ? `<span>${esc(k.type)}</span>` : ""}</span>
        </div>
        <div class="skill-cost">Onibi ${k.onibi ?? 0} · Cooldown ${k.cooldown ?? 0}</div>
        ${k.line ? `<p class="skill-line">“${esc(k.line)}”</p>` : ""}
        ${k.description ? `<p>${fmtText(k.description)}</p>` : ""}
        ${(k.upgrades ?? []).length ? `<ul class="skill-ups">${k.upgrades.map((u) => `<li><b>Lv.${u.lvl}</b> ${esc(u.text)}</li>`).join("")}</ul>` : ""}
      </div>
    </div>`).join("");

  const bio = (s.bio ?? []).length ? `
    <section><h4>Biography</h4>
      <ul class="bio-list">${s.bio.map((b) => `<li>${esc(b.condition)}${b.reward ? ` <span class="bio-award">— reward: ${esc(b.reward)}</span>` : ""}</li>`).join("")}</ul></section>` : "";

  showModal(`
    <button class="close" aria-label="Close">${CLOSE_SVG}</button>
    <div class="md">
      <div class="md-head">
        <img class="avatar${s.art ? " hero" : ""}" ${heroBox(HERO_SHIK, s.no, HERO_SHIK_DEFAULT)} src="${s.art ?? s.localImage ?? s.imageUrl ?? ""}"
             alt="${esc(s.en)}" ${s.art ? `onload="heroFit(this)" onerror="this.onerror=null;this.src='${esc(s.localImage ?? s.imageUrl ?? "")}';this.classList.remove('hero');"` : ""}>
        <div>
          <h3>${esc(s.en)}</h3>
          <div class="md-names">${esc(s.cn)}${s.jp ? ` · ${esc(s.jp)}` : ""}${s.gl && s.gl !== s.en ? ` · ${esc(s.gl)}` : ""}</div>
          <div class="md-meta">
            <span class="badge ${s.rarity}">${s.rarity}</span>
            ${s.no ? `<span class="no" style="color:var(--faint);font-size:.78rem;">No.${s.no}</span>` : ""}
            ${s.cv ? `<span style="color:var(--muted);font-size:.82rem;">CV: ${esc(s.cv)}</span>` : ""}
          </div>
        </div>
      </div>
      ${s.intro ? `<section><h4>Introduction</h4><p>${esc(s.intro)}</p></section>` : ""}
      ${skills ? `<section><h4>Skills</h4>${skills}</section>` : ""}
      ${stats}
      ${bio}
      ${s.method ? `<section><h4>How to Obtain</h4><p>${esc(s.method)}</p></section>` : ""}
    </div>`);
}

/* ============ Soul detail ============ */
function openSoulDetail(s) {
  if (!s) return;
  history.replaceState(null, "", `#${s.no}`);
  showModal(`
    <button class="close" aria-label="Close">${CLOSE_SVG}</button>
    <div class="md">
      <div class="md-head">
        <img class="avatar${s.art ? " hero" : ""}" ${heroBox(HERO_SOUL, s.no, HERO_SOUL_DEFAULT)} src="${s.art ?? s.localImage ?? s.imageUrl ?? ""}"
             alt="${esc(s.en)}" ${s.art ? `onload="heroFit(this)" onerror="this.onerror=null;this.src='${esc(s.localImage ?? s.imageUrl ?? "")}';this.classList.remove('hero');"` : ""}>
        <div>
          <h3>${esc(s.en)}</h3>
          <div class="md-names">${esc(s.cn)}${s.jp ? ` · ${esc(s.jp)}` : ""}</div>
          <div class="md-meta">
            <span class="badge ${s.type}">${esc(s.type)}</span>
            <span class="no" style="color:var(--faint);font-size:.78rem;">No.${s.no}</span>
            ${s.version ? `<span style="color:var(--muted);font-size:.82rem;">Servers: ${esc(s.version)}</span>` : ""}
          </div>
        </div>
      </div>
      ${s.combo2 ? `<section><h4>2-Set Bonus</h4><p>${esc(s.combo2)}</p></section>` : ""}
      ${s.combo4 ? `<section><h4>4-Set Bonus</h4><p>${esc(s.combo4)}</p></section>` : ""}
      ${s.location ? `<section><h4>Where to Find</h4><p>${esc(s.location)}</p></section>` : ""}
    </div>`);
}

/* ============ Hash routing ============ */
function applyHash() {
  const no = location.hash.replace("#", "");
  if (!no) return;
  if (/^O/i.test(no)) {
    const ch = state.chars.find((c) => c.no.toUpperCase() === no.toUpperCase());
    if (ch) { openCharDetail(ch); return; }
  }
  if (/^OB\d/i.test(no)) {
    const bo = state.bonds.find((b) => b.no.toUpperCase() === no.toUpperCase());
    if (bo) { openBondDetail(bo); return; }
  }
  const sh = state.shikigami.find((s) => String(s.no) === no);
  if (sh) { openDetail(sh); return; }
  const so = state.souls.find((s) => String(s.no) === no);
  if (so) { openSoulDetail(so); return; }
}
window.addEventListener("hashchange", applyHash);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ============ live timezone banner (index) — fixed EST (UTC-5, no DST) & Bangkok (GMT+7) ============ */
const CLOCK_ZONES = [
  { /* the game's schedule timezone: fixed US Eastern without daylight saving */
    shiftMs: -5 * 3.6e6, fmtTz: "UTC", label: "EST", off: "-0500",
    time: "clock-ny", zone: "clock-ny-tz", date: "clock-ny-date",
  },
  {
    shiftMs: 0, fmtTz: "Asia/Bangkok", label: null, off: "+0700",
    time: "clock-bkk", zone: "clock-bkk-tz", date: "clock-bkk-date",
  },
];
function startClockBand() {
  const els = CLOCK_ZONES.map((z) => {
    const shift = z.shiftMs ? () => new Date(Date.now() + z.shiftMs) : () => new Date();
    return {
      shift,
      label: z.label,
      off: z.off,
      zoneEl: document.getElementById(z.zone),
      timeEl: document.getElementById(z.time),
      dateEl: document.getElementById(z.date),
      parts: new Intl.DateTimeFormat("en-GB", {
        timeZone: z.fmtTz, hour: "2-digit", minute: "2-digit", second: "2-digit",
        month: "short", day: "2-digit", weekday: "short", hourCycle: "h23",
      }),
      zoneName: z.label ? null : new Intl.DateTimeFormat("en", { timeZone: z.fmtTz, timeZoneName: "short" }),
      iso: new Intl.DateTimeFormat("en-CA", { timeZone: z.fmtTz, year: "numeric", month: "2-digit", day: "2-digit" }),
    };
  });
  if (!els[0].timeEl) return;

  const part = (arr, type) => arr.find((p) => p.type === type)?.value ?? "";
  const tick = () => {
    const now = new Date();
    for (const e of els) {
      const a = e.parts.formatToParts(e.shift());
      const h = part(a, "hour"), m = part(a, "minute"), s = part(a, "second");
      e.timeEl.textContent = `${h}:${m}:${s}`;
      e.timeEl.setAttribute("datetime", `${e.iso.format(e.shift())}T${h}:${m}:${s}${e.off}`);
      e.zoneEl.textContent = e.zoneName ? part(e.zoneName.formatToParts(now), "timeZoneName") : e.label;
      e.dateEl.textContent = `${part(a, "weekday")} · ${part(a, "day")} ${part(a, "month")}`;
    }
  };
  /* re-align to the edge of each second so the banner never drifts */
  const syncTick = () => { tick(); setTimeout(syncTick, 1000 - (Date.now() % 1000) + 2); };
  syncTick();
}

/* ============ calendar.html — daily game buffs, dated on fixed EST (UTC-5) ============ */
const BUFFS = ["Fighting Soul", "Dash", "Skillful", "Fragile", "Curse Spell", "Strong Fire", "Raging Wind"];
/* effect copy as referenced from the wiki (Fighting Soul: "Buff51ATK" template junk removed) */
const BUFF_DESC = {
  "Strong Fire": "Cost for all onibi using skills is decreased by 2.",
  "Fighting Soul": "Decreases the boss' damage from non-Crits by 80% and grants the ally with the highest Crit DMG a 40% ATK bonus.",
  "Dash": "When dealing damage, the damage is increased by 4% for each buff, max of 5 stacks. At the end of the turn, increases own move bar by 20%.",
  "Skillful": "Normal attacks also inflicts 40% of splash damage. At the end of turn, reduces all allies' damage received by 5%, max of 30 stacks. When the ally with the highest ATK uses a normal attack, they immediately gain an additional action. At the end of their turn, their move bar is increased by 35%.",
  "Fragile": "Boss' indirect damage received is decreased by 99% and own DEF is decreased by 35%.",
  "Curse Spell": "Transferred damage is increased by 30%.",
  "Raging Wind": "When dealing damage on own turn, inflicts additional true damage equal to 20% of the damage dealt to the enemy.",
};
const buffIco = (name) => `assets/buffs/${name.toLowerCase().replace(" ", "-")}.png`;
/* the game's daily-buff rotation (provisional model, canonical in tools/buff-predictor.py):
   a continuous day count from REFERENCE = 2026-08-01 (Strong Fire),
   block/position = divmod(n, 7), extra +1 from position >= 2 within a block.
   Python-style divmod + modulo normalization keeps pre-anchor dates correct. */
const BUFF_REF = Date.UTC(2026, 7, 1); /* 2026-08-01 = Strong Fire (F) */
function buffForDay(y, m, d) {
  const n = Math.round((Date.UTC(y, m - 1, d) - BUFF_REF) / 8.64e7);
  const block = Math.floor(n / 7), pos = n - block * 7;
  const idx = (block + 5 + pos + (pos >= 2 ? 1 : 0)) % 7;
  return BUFFS[((idx % 7) + 7) % 7];
}
const EST_SHIFT = -5 * 3.6e6; /* fixed EST = UTC-5, daylig saving not applied */
const estNow = () => new Date(Date.now() + EST_SHIFT); /* read as UTC wall clock = EST wall clock */
const estMidnight = (y, m, d) => new Date(Date.UTC(y, m - 1, d) - EST_SHIFT); /* instant of EST midnight */

let calYear = 0, calMonth = 0;
function drawCalendar() {
  const head = document.getElementById("cal-month-name");
  const grid = document.getElementById("cal-grid");
  if (!grid) return;
  const now = estNow();
  const nowY = now.getUTCFullYear(), nowM = now.getUTCMonth() + 1, nowD = now.getUTCDate();
  const days = new Date(Date.UTC(calYear, calMonth, 0)).getUTCDate();
  const first = estMidnight(calYear, calMonth, 1).getUTCDay();
  const monthName = new Intl.DateTimeFormat("en", { timeZone: "UTC", month: "long", year: "numeric" })
    .format(new Date(Date.UTC(calYear, calMonth - 1, 1)));
  head.textContent = monthName;

  const rows = [];
  let tr = [];
  const flush = () => { if (tr.length) rows.push(tr); };
  for (let i = 0; i < first; i++) tr.push("<td class=\"cal-lead\" aria-hidden=\"true\"></td>");
  for (let d = 1; d <= days; d++) {
    const today = calYear === nowY && calMonth === nowM && d === nowD;
    const weekend = (first + d - 1) % 7 === 0 || (first + d - 1) % 7 === 6;
    const buff = buffForDay(calYear, calMonth, d);
    tr.push(`<td class="cal-cell${today ? " today" : ""}${weekend ? " weekend" : ""}">
      <div class="cal-day">${d}${today ? '<span class="cal-flag">today</span>' : ""}</div>
      <div class="cal-buff-row"><img class="cal-ico" src="${buffIco(buff)}" alt="" loading="lazy" onerror="this.style.display='none'"><span class="cal-buff" title="${esc(buff)}: ${esc(BUFF_DESC[buff] ?? "")}">${buff}</span></div>
      <time datetime="${calYear}-${String(calMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}" hidden>true</time></td>`);
    if (tr.length === 7) { rows.push(tr); tr = []; }
  }
  while (tr.length && tr.length < 7) tr.push("<td class=\"cal-lead\" aria-hidden=\"true\"></td>");
  flush();
  grid.innerHTML = rows.map((r) => `<tr>${r.join("")}</tr>`).join("");
}

function renderBuffDocs() {
  const docs = document.getElementById("buff-docs");
  if (!docs) return;
  const en = estNow();
  const todayBuff = buffForDay(en.getUTCFullYear(), en.getUTCMonth() + 1, en.getUTCDate());
  docs.innerHTML = BUFFS.map((b) => `<div class="buff-doc${b === todayBuff ? " today" : ""}">
    <img class="cal-ico" src="${buffIco(b)}" alt="" loading="lazy" onerror="this.style.display='none'">
    <div class="buff-doc-body">
      <div class="buff-name">${esc(b)}${b === todayBuff ? '<span class="cal-flag">today</span>' : ""}</div>
      <p>${esc(BUFF_DESC[b] ?? "")}</p>
    </div>
  </div>`).join("");
}

function renderCalendar() {
  const legend = document.getElementById("cal-legend");
  if (legend) {
    legend.innerHTML = BUFFS.map((b) => `<span class="cal-leg-item"><img class="cal-ico mini" src="${buffIco(b)}" alt="" loading="lazy" onerror="this.style.display='none'">${esc(b)}</span>`).join("");
  }
  renderBuffDocs();
  const now = estNow();
  calYear = now.getUTCFullYear();
  calMonth = now.getUTCMonth() + 1;
  const line = document.getElementById("cal-today-line");
  if (line) {
    const wd = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(now);
    const b = buffForDay(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
    line.innerHTML = `<img class="cal-ico mini" src="${buffIco(b)}" alt="" onerror="this.style.display='none'">Today (<b>EST</b>) is ${wd}, and the daily buff is <b>${b}</b>.`;
  }
  drawCalendar();
  const step = (n) => {
    calMonth += n;
    if (calMonth < 1) { calMonth = 12; calYear--; }
    if (calMonth > 12) { calMonth = 1; calYear++; }
    drawCalendar();
    renderBuffDocs();
  };
  document.getElementById("cal-prev")?.addEventListener("click", () => step(-1));
  document.getElementById("cal-next")?.addEventListener("click", () => step(1));
  document.getElementById("cal-today-btn")?.addEventListener("click", () => {
    const n = estNow();
    calYear = n.getUTCFullYear(); calMonth = n.getUTCMonth() + 1;
    drawCalendar();
  });
}

/* boot by page */
const page = document.body.dataset.page;
window.addEventListener("DOMContentLoaded", async () => {
  arcanamanaFx();
  if (page === "index") { startClockBand(); await renderIndex(); }
  else if (page === "calendar") { startClockBand(); renderCalendar(); }
  else if (page === "shikigami") await renderShikigami();
  else if (page === "souls") await renderSouls();
  else if (page === "characters") await renderCharacters();
  else if (page === "bonding") await renderBonding();
  applyHash();
});
