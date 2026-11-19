"use strict";
/* PepSeekr · Cobalt build */
const SB = "https://vddteufnmnkqqndzepbk.supabase.co";
const KEY = "sb_publishable_cj-yQOK0b1fdMqzOHmA4KQ_LhPFKE0t";
const VAPID = "BFmNh-h076YX0HcJHALM3SqhxunI8P6nZ9EM5eNRG1Br6wXIilGS5QgJWYPZWG_tkTsGsrvpzC-BHAMFGndhAdk";
const FN = SB + "/functions/v1/vs-reviews";
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = n => n == null || !isFinite(n) ? "—" : "$" + (Math.round(n * 100) / 100).toFixed(Math.abs(n % 1) > 0.001 ? 2 : 0);
const money2 = n => n == null || !isFinite(n) ? "—" : "$" + n.toFixed(2);
const slugOf = s => s.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ago = iso => { const m = Math.round((Date.now() - Date.parse(iso)) / 60000); if (!isFinite(m)) return ""; if (m < 1) return "just now"; if (m < 60) return m + "m ago"; const h = Math.round(m / 60); return h < 48 ? h + "h ago" : Math.round(h / 24) + "d ago"; };
const agoS = iso => ago(iso).replace(" ago", "");
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
const isM = () => matchMedia("(max-width:767px)").matches;
async function rpc(fn, args = {}) {
  const r = await fetch(`${SB}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify(args) });
  if (!r.ok) { let m = r.status; try { m = (await r.json()).message || m; } catch {} throw new Error(m); }
  return r.json();
}
async function fnPost(body) {
  const isForm = body instanceof FormData;
  const r = await fetch(FN, { method: "POST", headers: isForm ? { apikey: KEY } : { apikey: KEY, "Content-Type": "application/json" }, body: isForm ? body : JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Something went wrong. Try again.");
  return j;
}

/* ---------- icons (line, 1.8 stroke) ---------- */
const ic = (d, sw = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  search: ic(`<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`),
  bell: ic(`<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`),
  star: ic(`<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>`),
  sun: ic(`<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>`),
  moon: ic(`<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>`),
  home: ic(`<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>`),
  dl: ic(`<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>`),
  cam: ic(`<path d="M4 7h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>`),
  file: ic(`<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 17h6"/>`),
  paste: ic(`<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 12h6M9 16h4"/>`),
  back: ic(`<path d="m15 5-7 7 7 7"/>`, 2),
  chev: ic(`<path d="m9 5 7 7-7 7"/>`, 2),
  down: ic(`<path d="m6 9 6 6 6-6"/>`, 2),
  check: ic(`<path d="m5 12 5 5 9-10"/>`, 2.4),
  x: ic(`<path d="M6 6l12 12M18 6 6 18"/>`, 2),
  sliders: ic(`<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>`),
  ext: ic(`<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v6H4V6h6"/>`),
  truck: ic(`<path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>`),
  shield: ic(`<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>`),
  store: ic(`<path d="M4 9 5.5 4h13L20 9"/><path d="M4 9h16v2a3 3 0 0 1-5.3 2 3 3 0 0 1-5.4 0A3 3 0 0 1 4 11z"/><path d="M5 13v8h14v-8"/>`),
  plus: ic(`<path d="M12 5v14M5 12h14"/>`, 2),
  minus: ic(`<path d="M5 12h14"/>`, 2),
  list: ic(`<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>`),
};
const STARF = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>`;
function stars(n) { const r = Math.round(n * 2) / 2; let h = ""; for (let i = 1; i <= 5; i++) h += `<span class="${r >= i - .25 ? "" : "e"}">${STARF}</span>`; return `<span class="stars" aria-label="${n.toFixed(1)} out of 5">${h}</span>`; }
const LOGO = (ink = "var(--logo-ink)") => `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="lq${++gid}"><circle cx="43" cy="43" r="21"/></clipPath></defs><circle cx="43" cy="43" r="26" fill="none" style="stroke:${ink}" stroke-width="11"/><line x1="63.5" y1="63.5" x2="83" y2="83" style="stroke:${ink}" stroke-width="12" stroke-linecap="round"/><rect x="16" y="44" width="54" height="26" style="fill:${ink === "#fff" ? "#1F55D8" : "var(--brand)"}" clip-path="url(#lq${gid})"/></svg>`;
const wordmark = (ink) => `<span class="logo">${LOGO(ink)}<span>Pep<b>Seekr</b></span></span>`;

/* ---------- categories ---------- */
const CATS = [
  // Grouped by compound family, never by intended effect.
  ["GLP & amylin analogs", 1, ["Retatrutide", "Tirzepatide", "Semaglutide", "Cagrilintide", "Survodutide", "Mazdutide", "Retatrutide + Cagrilintide"]],
  ["BPC, TB & thymic peptides", 2, ["BPC-157", "TB-500", "BPC-157 + TB-500", "GLOW (BPC/TB/GHK)", "KLOW (BPC/TB/GHK/KPV)", "BPC-157 + TB-500 + Cartalax", "Thymosin Alpha-1"]],
  ["GH secretagogues", 3, ["CJC-1295 (no DAC)", "CJC-1295 (DAC)", "CJC-1295 + Ipamorelin", "Ipamorelin", "Tesamorelin", "Tesamorelin + Ipamorelin", "Sermorelin", "GHRP-2", "GHRP-6", "Hexarelin", "MK-677", "HGH 191AA", "AOD-9604", "Fragment 176-191"]],
  ["Copper & cosmetic peptides", 4, ["GHK-Cu", "AHK-Cu", "Pal-GHK", "Snap-8", "Matrixyl", "GHK-Cu + KPV"]],
  ["Neuropeptides", 5, ["Selank", "Semax", "Semax + Selank", "DSIP", "Dihexa", "P21", "Adamax", "Cerebrolysin", "PE-22-28", "Pinealon", "Oxytocin"]],
  ["Bioregulators", 6, ["Epitalon", "Thymalin", "Thymagen", "Thymogen", "Cartalax", "Cardiogen", "Crystagen", "Testagen", "Prostamax", "Vesugen", "Vesilut", "Pancragen", "Bronchogen", "Ovagen", "Cortagen", "Livagen", "Chonluten"]],
  ["Mitochondrial peptides", 7, ["MOTS-c", "SS-31", "Humanin"]],
  ["Melanocortins", 8, ["Melanotan I", "Melanotan II", "PT-141"]],
  ["Growth factors", 3, ["IGF-1 LR3", "IGF-1 DES", "MGF", "PEG-MGF", "Follistatin"]],
];
const ALLCATS = [...CATS.map(c => c[0]), "Blends", "Other"];
const catOf = p => (CATS.find(c => c[2].includes(p)) || [])[0] || (/ \+ /.test(p) ? "Blends" : "Other");
const catN = c => (CATS.find(x => x[0] === c) || [])[1] || (c === "Blends" ? 7 : 8);
const TILES = CATS.slice(0, 6);
const capVar = p => `var(--cat-${catN(catOf(p))})`;
const short = p => p.replace(/ \(no DAC\)/, " no DAC").replace(/ \(.*\)/, "").replace("BPC-157 + TB-500", "BPC + TB").replace("CJC-1295 + Ipamorelin", "CJC + Ipa").replace("Retatrutide + Cagrilintide", "Reta + Cagri");
const PRIOR = { strong: 4.5, good: 4.2, mixed: 3.2, unrated: 3.8 };
const TAGS_POS = ["Fast shipping", "Well packaged", "Matches lab report", "Helpful support", "Would buy again"];
const TAGS_NEG = ["Slow shipping", "Order problem", "Hard to reach"];
const STARWORD = ["", "Bad", "Not great", "Okay", "Good", "Great"];

/* ---------- state ---------- */
let FR_MID = 3.9, D = null, V = {}, ROWS = [], ALERTS = [], RV = { stats: {}, recent: [] }, PEPS = [];
const S = Object.assign({ q: "", cat: "All", sort: "ppu", rep: false, stock: true, coa: false, ship: false, vendor: "", strat: "rec", one: false, swaps: true, open: null }, store.get("pf_filters", {}), { q: "", cat: "All", vendor: "" });
const saveS = () => { store.set("pf_filters", { sort: S.sort, rep: S.rep, stock: S.stock, coa: S.coa, ship: S.ship, fill: S.fill, strat: S.strat, one: S.one, swaps: S.swaps }); prefsDirty(); };
let HIDE = new Set(store.get("pf_hidden", []));
let WATCH = store.get("pf_watch", null);           // { "pep|size": {target, on, drop, restock, sale} }
let PROT = store.get("pf_proto2", null);           // [{pep,size,qty}]
let FOLLOW = new Set(store.get("pf_follow", []));  // vendor ids for sale alerts
const seenAlerts = () => store.get("pf_seen_alerts", 0);
const saveW = () => { store.set("pf_prefs_at", Date.now()); store.set("pf_watch", WATCH); syncPush(); prefsDirty(); };
const saveP = () => { store.set("pf_prefs_at", Date.now()); store.set("pf_proto2", PROT); syncPush(); prefsDirty(); };

function ingest(d) {
  D = d; V = {};
  (d.vendors || []).forEach(v => { v.tier = PRIOR[v.rep_tier] ? v.rep_tier : "unrated"; V[v.id] = v; });
  ROWS = (d.products || []).map(a => ({ v: a[0], pep: a[1], size: a[2], sv: +a[3], unit: a[4], price: +a[5], reg: a[6] == null ? null : +a[6], sale: !!a[7], stock: !!a[8], coa: a[9], url: a[10], img: a[11] || null, coaUrl: a[12] || null, lot: a[13] || null, lab: a[15] || null, tested: a[16] || null, coaState: a[17] || null, coaDate: a[18] || null, coaShared: a[19] || 0, cartId: a[20] || null }))
    .filter(r => V[r.v] && r.price > 0 && r.sv > 0);
  // Same compound spelled differently by different stores ("5 Amino 1MQ" / "5-Amino-1MQ", "ACE 031" / "ACE-031"):
  // fold onto one name, the spelling most stores use (ties go to the hyphenated one). Drop names with no letters.
  const ALIAS = { "CJC-1295 + DAC": "CJC-1295 (DAC)", "CJC 1295 + O Dac + Ipamorelin": "CJC-1295 + Ipamorelin", "Acetyl Hexapeptide, Raw": "Acetyl Hexapeptide-3", "NAD+ , Mots-c , 5-amino-1mq": "NAD+ + MOTS-c + 5-Amino-1MQ", "MOTS-c + 5-AMINO 1MQ": "MOTS-c + 5-Amino-1MQ", "Reta": "Retatrutide", "Tirz": "Tirzepatide", "Sema": "Semaglutide", "Gp-cag": "Cagrilintide", "GP-CAG": "Cagrilintide", "BPC-157 TB-500": "BPC-157 + TB-500", "TB-500 + BPC-157": "BPC-157 + TB-500", "Bronnchgen": "Bronchogen", "Cyrstagen": "Crystagen", "Cagrilintide , Semaglutide": "Cagrilintide + Semaglutide", "Cagrilintide + Retatrutide": "Retatrutide + Cagrilintide", "Glp-tirz": "Tirzepatide", "Glp-sema": "Semaglutide", "GLP- Tirz + Retatrutide": "Tirzepatide + Retatrutide", "Glp-sema + Retatrutide": "Semaglutide + Retatrutide", "Glp-tirz + Semaglutide": "Tirzepatide + Semaglutide", "Tirzepatide + RT": "Tirzepatide + Retatrutide", "GHK- Cu + BPC-157": "BPC-157 + GHK-Cu", "Tesamorelin, Ipamorelin 10+": "Tesamorelin + Ipamorelin", "Tesamorelin, Ipamorelin 5+": "Tesamorelin + Ipamorelin", "Tesamorelin + Ipa 10": "Tesamorelin + Ipamorelin", "Adipotide FTPP": "Adipotide", "FTPP": "Adipotide", "Regeno": "BPC-157 + TB-500 + Cartalax", "Selank + Semax": "Semax + Selank" };
  // a size that is just the number in the compound's name ("BPC-157" read as 157mg) is a misread, not a vial
  ROWS = ROWS.filter(r => /[a-z]/i.test(r.pep) && /^[a-z0-9]/i.test(r.pep) && !/tadalafil/i.test(r.pep) && !/leviathan|curcumin|d3 \+ k2|quercetin|pre shred|nectar 3|glycohack|^lipo|b12 \+ ml|carnitine \+ ml|biomale|biofemale/i.test(r.pep) && !(r.sv >= 100 && new RegExp("\\b" + r.sv + "\\b").test(r.pep)));
  ROWS.forEach(r => { if (ALIAS[r.pep]) r.pep = ALIAS[r.pep]; });
  { const keyOf = n => n.toLowerCase().replace(/\bno\b|\bw\/o\b|without/g, "no").replace(/[^a-z0-9+]/g, "");
    const spell = new Map(); ROWS.forEach(r => { const k = keyOf(r.pep), m = spell.get(k) || new Map(); m.set(r.pep, (m.get(r.pep) || 0) + 1); spell.set(k, m); });
    const pick = new Map([...spell].map(([k, m]) => [k, [...m].sort((a, b) => b[1] - a[1] || (b[0].includes("-") - a[0].includes("-")) || b[0].length - a[0].length)[0][0]]));
    ROWS.forEach(r => r.pep = pick.get(keyOf(r.pep)) || r.pep); }
  // One row per store, compound and size: some stores list the same vial under several names. Keep the
  // in-stock one, then the cheapest, then the one with a lab report.
  { const best = new Map(); ROWS.forEach(r => { const k = r.v + "|" + r.pep + "|" + r.size, o = best.get(k);
      if (!o || (r.stock && !o.stock) || (r.stock === o.stock && (r.price < o.price || (r.price === o.price && r.coa === true && o.coa !== true)))) best.set(k, r); });
    ROWS = [...best.values()]; }
  ROWS.forEach(r => r.ppu = r.price / r.sv);
  ALERTS = (d.alerts || []).map(a => ({ v: a[0], pep: a[1], size: a[2], kind: a[3], old: a[4] == null ? null : +a[4], now: +a[5], url: a[6], at: a[7], note: a[8] || "" })).filter(a => V[a.v]).sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
  PEPS = [...new Set(ROWS.map(r => r.pep))].sort();
  score(); migrate();
}
const purgeW = () => { if (WATCH) Object.keys(WATCH).forEach(k => { if (!WATCH[k] || !WATCH[k].on) delete WATCH[k]; }); };
function migrate() {
  purgeW(); if (WATCH) store.set("pf_watch", WATCH);
  if (WATCH && PROT) return;
  const old = store.get("pf_protocol", store.get("vs_protocol", []));
  if (!PROT) { PROT = old.map(p => { const b = bestOf(ROWS.filter(r => r.pep === p)); return b ? { pep: p, size: b.size, qty: 1 } : null; }).filter(Boolean); store.set("pf_proto2", PROT); }
  if (!WATCH) { WATCH = {}; PROT.forEach(i => WATCH[i.pep + "|" + i.size] = { target: null, on: true, drop: true, restock: true, sale: true }); store.set("pf_watch", WATCH); }
}
function med(a) { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : NaN; }
function score() {
  const g = {}; ROWS.forEach(r => (g[r.pep + "|" + r.size] ??= []).push(r));
  const idx = {}, wins = {};
  Object.values(g).forEach(list => {
    const m = med(list.map(r => r.price)); list.forEach(r => { r.med = m; r.vsMed = r.price / m; (idx[r.v] ??= []).push(dealUnit(r) / m); });
    const pool = list.filter(r => r.stock); if (pool.length > 1) { const b = pool.reduce((a, c) => dealUnit(c) < dealUnit(a) ? c : a); wins[b.v] = (wins[b.v] || 0) + 1; }
  });
  const frs = Object.values(V).map(v => v.finnrick_pct).filter(x => x != null);
  FR_MID = frs.length ? 1 + 4 * med(frs) / 100 : 3.9;
  Object.values(V).forEach(v => {
    const rel = idx[v.id]?.length ? med(idx[v.id]) : 1; v.priceIdx = rel; v.wins = wins[v.id] || 0;
    const mine = ROWS.filter(r => r.v === v.id); v.count = mine.length;
    const known = mine.filter(r => r.coa === true || r.coa === false); v.coaKnown = known.length > 0;
    // current report = full credit, outdated = half, reused = none
    const credit = r => r.coa !== true ? 0 : r.coaState === "reused" ? 0 : r.coaState === "outdated" ? .5 : 1;
    v.coaPct = known.length ? Math.round(known.reduce((a, r) => a + credit(r), 0) / known.length * 100) : 0;
    v.coaReused = mine.filter(r => r.coaState === "reused").length;
    // Rating: outside reputation as a prior (weight 8) blended with verified PepSeekr reviews (weight 1 each).
    // Outside signal: Finnrick's independent lab-test rating (share of acceptable tests) on a 1-5 scale.
    // Trustpilot removed the peptide stores in 2026, so it no longer counts.
    // Stores Finnrick hasn't tested start at the middle of the tested stores, so being tested is never a penalty
    // in itself: above-median results raise the start point, below-median results lower it.
    const fr = v.finnrick_pct != null ? 1 + 4 * v.finnrick_pct / 100 : FR_MID;
    const prior = v.tier === "mixed" ? Math.min(fr, PRIOR.mixed) : fr;
    const st = RV.stats[v.id]; v.rvN = st ? +st.n : 0; v.rvAvg = st ? +st.avg : null;
    v.rating = v.rvN ? (prior * 8 + v.rvAvg * v.rvN) / (8 + v.rvN) : prior;
    const rep = Math.max(0, Math.min(40, (v.rating - 3) / 2 * 40));
    const price = Math.max(0, Math.min(30, 15 + (1 - rel) * 60));
    // COA (20): the share of this vendor's product pages where we found a current certificate of analysis.
    // If we can't check a store's pages (e.g. it blocks our checker), COA is neutral: 10 of 20, neither rewarded nor penalized.
    const coa = v.coaKnown ? Math.round(20 * v.coaPct / 100) : 10;
    let ship = 5; if (v.free_ship_over != null) ship = v.free_ship_over <= 150 ? 10 : v.free_ship_over <= 250 ? 8 : 6;
    v.pts = { rep: Math.round(rep), price: Math.round(price), coa, ship };
    v.score = Math.round(rep + price + coa + ship);
  });
  Object.values(V).sort((a, b) => b.score - a.score).forEach((v, i) => v.rank = i + 1);
}
const sizeTxt = s => (s || "").replace(/iu$/, " IU");
const unitTxt = u => u === "iu" ? "IU" : u;
const shipCost = (v, sub) => v.ship_flat == null ? 0 : (v.free_ship_over != null && sub >= +v.free_ship_over ? 0 : +v.ship_flat);
/* ---------- store deals: "buy 1 get 2 free", "30% off at checkout" ----------
   promo_rule on the store: { type: "bxgy", buy, get } or { type: "pct", off }. Prices on PepSeekr stay the store's list price;
   comparisons, $/mg, "best value" and cart totals use what you'd actually pay with the deal. */
const promoOf = v => { const p = v && v.promo_rule; return p && (p.type === "pct" || (p.type === "bxgy" && p.buy > 0 && p.get > 0)) ? p : null; };
const setSize = p => p.buy + p.get;
// vials you pay for to end up with at least q (taking the free ones when that's cheaper)
const paidUnits = (vid, q) => { const p = promoOf(V[vid]); if (!p || p.type !== "bxgy") return q; const s = setSize(p); return Math.min(q - Math.floor(q / s) * p.get, Math.ceil(q / s) * p.buy); };
const gotUnits = (vid, q) => { const p = promoOf(V[vid]); if (!p || p.type !== "bxgy") return q; const s = setSize(p), paid = paidUnits(vid, q); return Math.max(q, Math.floor(paid / p.buy) * s + (paid % p.buy)); };
// price per vial with the deal (bxgy: when you take a full set)
const dealUnit = r => { const p = promoOf(V[r.v]); if (!p) return r.price; return p.type === "pct" ? r.price * (1 - p.off / 100) : r.price * p.buy / setSize(p); };
const dealNote = r => { const p = promoOf(V[r.v]); if (!p) return ""; return p.type === "pct" ? `${p.off}% off at checkout: ${money2(dealUnit(r))}` : `${setSize(p)} for ${money2(r.price * p.buy)}: ${money2(dealUnit(r))} a vial`; };
const promoShort = v => { const p = promoOf(v); return !p ? "" : p.type === "pct" ? `${p.off}% off` : `Buy ${p.buy}, get ${p.get} free`; };
// the pill that explains why a price is so low
const dealTag = v => promoOf(v) ? `<span class="pill p-deal" title="${esc(promoOf(v).label || promoShort(v))}${v.promo_ends ? " · ends " + new Date(v.promo_ends).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}">${esc(promoShort(v))}</span>` : "";
const eff = r => dealUnit(r) + (S.ship ? shipCost(V[r.v], r.price) : 0);
const live = () => ROWS.filter(r => !HIDE.has(r.v));
// "Hide low-rated stores": flagged stores, Finnrick results under 60%, or 5+ buyer reviews averaging under 3.5.
// Stores with no ratings at all stay in: having no data isn't a strike.
const lowRated = v => v.tier === "mixed" || (v.finnrick_pct != null && v.finnrick_pct < 60) || (v.rvN >= 5 && v.rvAvg < 3.5);
// Stores where we can put the items in the cart for you (tested by hand; verify_first = after their age check)
const I_CART = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11h11l2-8H6.2"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/><path d="M10.5 10.5l1.8 1.8 3.4-3.6"/></svg>`;
const fillsCart = v => !!v && ["fill", "bag_link", "verify_first"].includes(v.cart_mode) && (v._ids ??= ROWS.some(r => r.v === v.id && r.cartId));
const cartPill = v => !fillsCart(v) ? "" : `<span class="pill p-cart" title="${v.cart_mode === "verify_first" ? "We can fill your cart here after you confirm your age on their site" : "We can put your items in this store's cart for you"}">${I_CART}<span class="cp-t">Fills cart</span></span>`;
// Influencer ties: who owns or promotes the store, with the source we found it in
const I_MIC = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`;
const tiePill = v => !v || !v.tie_text ? "" : `<span class="pill p-tie" title="${esc(v.tie_text)}">${I_MIC}<span class="cp-t">${v.tie_kind === "owner" ? "Creator-owned" : "Creator-promoted"}</span></span>`;
const tieHit = (v, q) => q.length >= 3 ? (v.tie_people || []).find(n => n.toLowerCase().includes(q)) : null;
const tieWho = v => (v.tie_people || [])[0] || "";
const tieLine = v => !v || !v.tie_text ? "" : `<p class="tie">${I_MIC}<span>${esc(v.tie_text)}.${v.tie_url ? ` <a href="${esc(v.tie_url)}" target="_blank" rel="noopener">Source ↗</a>` : ""}${v.tie_checked ? ` <span class="t3">Checked ${esc(new Date(v.tie_checked + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }))}.</span>` : ""} <a href="/contact?topic=correction&amp;about=${esc(v.id)}">Report a correction</a></span></p>`;
const vis = (rows = live()) => rows.filter(r => (!S.fill || fillsCart(V[r.v])) && (!S.rep || !lowRated(V[r.v])) && (!S.stock || r.stock) && (!S.coa || (r.coa === true && r.coaState !== "reused")) && (!S.vendor || r.v === S.vendor));
const bestOf = list => { const p = list.filter(r => r.stock); return p.length ? p.reduce((a, c) => eff(c) / c.sv < eff(a) / a.sv ? c : a) : null; };
const bestPrice = list => { const p = list.filter(r => r.stock); return p.length ? p.reduce((a, c) => eff(c) < eff(a) ? c : a) : null; };
const groupBy = rows => { const g = {}; rows.forEach(r => ((g[r.pep] ??= {})[r.size] ??= []).push(r)); return g; };
const vendors = () => Object.values(V).filter(v => !HIDE.has(v.id)).sort((a, b) => b.score - a.score);
function vBadge(v) {
  if (v.tier === "mixed") return `<span class="pill p-warn">Mixed</span>`;
  if (v.rank === 1 && v.rating >= 4.4 && (v.rvN || v.rep_trustpilot)) return `<span class="pill p-brand">Top rated</span>`;
  if (v.rating >= 4.2 && (v.rvN || v.rep_trustpilot)) return `<span class="pill p-brand">Well reviewed</span>`;
  if (!v.rvN && v.finnrick_pct != null) return `<span class="pill ${v.finnrick_pct >= 75 ? "p-brand" : v.finnrick_pct >= 60 ? "p-n" : "p-warn"}" title="${esc(frTitle(v))}">Lab-tested ${v.finnrick_pct}%</span>`;
  if (!v.rvN && !v.rep_trustpilot) return `<span class="pill p-n" title="No reviews from verified buyers yet">No reviews yet</span>`;
  return "";
}
const ringC = s => s >= 60 ? "var(--brand)" : s >= 40 ? "var(--warn)" : "var(--sale)";
function ring(s, size = 54) {
  const r = (size - 5) / 2, c = 2 * Math.PI * r;
  return `<span class="ring" style="width:${size}px;height:${size}px;--rc:${ringC(s)}" role="img" aria-label="Score ${s} of 100"><svg viewBox="0 0 ${size} ${size}"><circle class="tr" cx="${size / 2}" cy="${size / 2}" r="${r}"/><circle class="fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - s / 100)}"/></svg><b style="font-size:${size > 60 ? 20 : size < 46 ? 13 : 15}px">${s}</b></span>`;
}
const frTitle = v => `Finnrick independent testing: ${v.finnrick_pct}% rating${v.finnrick_rank ? `, #${v.finnrick_rank} of ${v.finnrick_of} vendors` : ""}${v.finnrick_tests ? `, ${v.finnrick_tests} samples` : ""}`;
const frUrl = v => v.finnrick_slug ? `https://www.finnrick.com/vendors/all/${encodeURIComponent(v.finnrick_slug)}` : "";
const siteRev = v => v.site_reviews > 0 && v.site_rating != null ? `★ ${(+v.site_rating).toFixed(1)} (${v.site_reviews}) on site` : "";
const repTxt = v => v.rvN ? `★ ${v.rvAvg.toFixed(1)} (${v.rvN})` : v.rep_trustpilot ? `★ ${(+v.rep_trustpilot).toFixed(1)} TP` : siteRev(v) || "No reviews";
// "Their reviews ↗": the store's own reviews page, when it has one. Never use inside a card that is itself a link.
const theirRev = (v, txt) => v.site_reviews_url ? `<a class="link" href="${esc(v.site_reviews_url)}" target="_blank" rel="noopener" style="font-size:12.5px">${txt || "Their reviews"} ↗</a>` : "";
const mktTxt = v => { const d = Math.round((v.priceIdx - 1) * 100); return d === 0 ? "at market" : (d < 0 ? "−" + -d + "%" : "+" + d + "%") + " vs market"; };
function shipText(v) { const b = []; if (v.ship_flat != null) b.push(money(+v.ship_flat) + " flat"); if (v.free_ship_over != null) b.push("free over " + money(+v.free_ship_over)); return b.join(", ") || "Shown at checkout"; }
const poss = n => n + (/s$/i.test(n) ? "'" : "'s");
const coaPctTxt = v => v.coaKnown ? v.coaPct + "%" : "n/a";
// store logos saved on our own server (site/logos/<id>.png); a letter tile when we don't have one
const LOGOS = new Set(["aavant", "ascension", "atomik", "behemoth", "biolongevity", "biostrategix", "biotech", "certifiedpep", "core", "evolve", "ezpeptides", "gentleman", "gila", "glacier", "hvy", "ionpeptide", "ldaminos", "milehigh", "modernaminos", "newbiorx", "nura", "paramount", "patriot", "pepshop", "primepeptides", "puratek", "stl", "swisschems", "thepeptideshop"]);
const avatar = v => LOGOS.has(v.id) ? `<span class="av lg" aria-hidden="true"><img src="/logos/${esc(v.id)}.png" alt="" loading="lazy" decoding="async"></span>` : `<span class="av" aria-hidden="true">${esc(v.name[0])}</span>`;
const mdy = d => d ? new Date(d + "T12:00").toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "";
// COA badge: COA ✓ (report on file), Outdated (report > 12 months old), Reused? (same report file at other sellers or for other compounds), No COA.
// "Verified" is reserved for a batch match against a buyer's vial photo, which isn't collected yet.
const coaB = (r, full) => {
  if (r.coa === true && r.coaState === "reused") return `<a class="coa bad" href="${esc(r.coaUrl || r.url)}" target="_blank" rel="noopener" title="${esc(r.coaShared > 1 ? "The same report file appears at " + r.coaShared + " sellers." : "The same report file is used for more than one compound.")} Treat as unverified.">⚠ Reused?</a>`;
  if (r.coa === true && r.coaState === "outdated") return `<a class="coa old" href="${esc(r.coaUrl || r.url)}" target="_blank" rel="noopener" title="Report dated ${esc(r.coaDate || "")}, more than 12 months ago">◷ Outdated${full && r.coaDate ? " · " + esc(mdy(r.coaDate)) : ""}</a>`;
  if (r.coa === true) return `<a class="coa" href="${esc(r.coaUrl || r.url)}" target="_blank" rel="noopener" title="${esc(["Certificate of analysis on the vendor's page", r.lot && "Lot " + r.lot, r.lab, r.coaDate && "Report " + r.coaDate].filter(Boolean).join(" · "))}">COA ✓${full && r.lot && isPro() ? " · Lot " + esc(r.lot) : full && r.coaDate ? " · " + esc(mdy(r.coaDate)) : ""}</a>`;
  if (r.coa === false) return `<span class="pill p-warn" title="We checked the product page and found no certificate of analysis">No COA</span>`;
  return "";
};
// Same badge without a link, for use inside cards that are already links (a link inside a link breaks the card).
const coaTag = (r, full) => coaB(r, full).replace(/^<a /, "<span ").replace(/ href="[^"]*" target="_blank" rel="noopener"/, "").replace(/<\/a>$/, "</span>");
const promoPill = v => v.promo_text ? `<span class="pill p-sale" title="${esc(v.promo_detail || "")}">${esc(v.promo_text.length > 34 ? v.promo_text.slice(0, 32) + "…" : v.promo_text)}</span>` : "";
const isW = (p, s) => !!(WATCH[p + "|" + s]?.on);
const watchingPep = p => Object.keys(WATCH).some(k => k.startsWith(p + "|") && WATCH[k].on);
const inProt = p => PROT.some(i => i.pep === p);
const AUTOW = () => store.get("pf_autowatch", true);
// put vials on the watchlist, stopping at the Free limit; returns how many were added and whether the limit stopped it
function watchItems(items) { let n = 0, cap = false; items.forEach(i => { const k = i.pep + "|" + i.size; if (WATCH[k]?.on) return; if (!watchAllowed()) { cap = true; return; } WATCH[k] = { target: null, on: true, drop: true, restock: true, sale: true }; n++; }); if (n) saveW(); return { n, cap }; }
const awBox = () => `<button type="button" class="ck awbox" role="checkbox" aria-checked="${AUTOW()}" data-autow><span class="chk">${I.check}</span>Alert me when these drop in price</button>`;
/* ---------- clean URLs ----------
   The app still thinks in "#route" strings (p-bpc-157, v-core, alerts...). HASH() derives that string from the real
   path, toPath() turns one back into a path, and go() navigates with history.pushState (no page reload). */
const APP_ROUTES = /^#(home|search|vendors|sellers|list|protocol|alerts|watchlist|coa|account|stats|sales|seller-log|doc|p-[\w%-]+|v-[\w%-]+|s-[\w%-]+)(\?.*)?$/;
function HASH() {
  const p = location.pathname.replace(/\/+$/, "") || "/", q = location.search, seo = document.getElementById("seo")?.dataset.route;
  let m, r;
  if (p === "/") r = "home";
  else if ((m = p.match(/^\/peptides\/([^/]+)$/))) r = "p-" + m[1];
  else if ((m = p.match(/^\/vendors\/([^/]+)$/))) r = "v-" + m[1];
  else if (p === "/peptides") r = "search";
  else if (p === "/influencers") r = "vendors";
  else if (p.startsWith("/influencers/")) r = seo && seo.startsWith("v-") ? seo : "vendors";
  else if (/^\/(method|about|terms|privacy|contact|pricing)$/.test(p)) r = "doc";
  else r = p.slice(1);
  return r === "home" ? "#home" : "#" + r + q;
}
function toPath(h) {
  if (!h || h === "#" || h === "#home") return "/";
  if (h.startsWith("/")) return h;
  const [r, q] = h.replace(/^#/, "").split("?"), qs = q ? "?" + q : "";
  if (r === "home") return "/" + qs;
  if (r.startsWith("p-")) return "/peptides/" + r.slice(2) + qs;
  if (r.startsWith("v-") || r.startsWith("s-")) return "/vendors/" + r.slice(2) + qs;
  if (r === "protocol") return "/list" + qs;
  if (r === "sellers") return "/vendors" + qs;
  return "/" + r + qs;
}
let NAVS = 0;   // in-app navigations this visit; the back arrow goes home when there are none
function go(h, replace) {
  const path = toPath(h); if (!replace) NAVS++;
  if (path !== location.pathname + location.search) history[replace ? "replaceState" : "pushState"](null, "", path);
  if (typeof closeSheet === "function") closeSheet();
  route();
}
// link to a product page opened on one size, with one store's offer highlighted: #p-slug?s=15mg&v=puratek
const pHref = (pep, size, vid) => "/peptides/" + slugOf(pep) + (size || vid ? "?" + [size && "s=" + encodeURIComponent(size), vid && "v=" + encodeURIComponent(vid)].filter(Boolean).join("&") : "");
let FOCUS_V = null;
// per-vial drop threshold for in-app alerts (default 15%); a dollar target, if set, also counts
const DEF_PCT = 15;
const wPct = k => (WATCH[k] && WATCH[k].pct) || DEF_PCT;
const dropOf = a => a.old > 0 ? Math.round((1 - a.now / a.old) * 100) : 0;
const dropOk = a => { const k = a.pep + "|" + a.size, w = WATCH[k]; if (a.kind !== "drop" || !w || !w.on) return true; return dropOf(a) >= wPct(k) || (w.target && a.now <= w.target); };
// the slider + live dollar line, used in the watchlist sheet and on the product page
function pctCtl(k, compact) {
  const [p, s] = k.split("|"), pct = wPct(k), b = bestPrice(live().filter(r => r.pep === p && r.size === s));
  return `<div class="pctc" data-pctk="${esc(k)}"><label class="pctl" for="pct-${slugOf(k)}">Alert me when a store drops it by <b class="mono" data-pctv>${pct}%</b> or more</label>
    <input type="range" id="pct-${slugOf(k)}" min="5" max="40" step="5" value="${pct}" data-pctr="${esc(k)}" aria-valuetext="${pct} percent">
    <div class="pctticks" aria-hidden="true"><span>5%</span><span>15%</span><span>25%</span><span>40%</span></div>
    ${b ? `<p class="hint" data-pctd>Best now ${money2(b.price)} at ${esc(V[b.v].name)}. ${pct}% below is <b>${money2(b.price * (1 - pct / 100))}</b>.</p>` : ""}
    ${compact ? "" : pct !== DEF_PCT ? `<button class="link" type="button" data-pctreset="${esc(k)}">Reset to ${DEF_PCT}%</button>` : ""}</div>`;
}

/* ---------- art ---------- */
let gid = 0;
function vial(p, size, h = 116) {
  const id = "g" + (++gid), cap = capVar(p), nm = short(p).toUpperCase(), w = Math.round(h / 2);
  const fs = nm.length > 10 ? 4.6 : nm.length > 7 ? 5.4 : 6.4;
  return `<svg width="${w}" height="${h}" viewBox="0 0 60 120" role="img" aria-label="${esc(p)} vial"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity=".05"/><stop offset=".8" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></linearGradient></defs>
<rect x="16" y="4" width="28" height="17" rx="3" style="fill:${cap}"/><rect x="19" y="20" width="22" height="7" fill="#c9ced3"/>
<path d="M13 36q0-7 7-7h20q7 0 7 7v70q0 10-10 10h-14q-10 0-10-10z" style="fill:var(--vial-glass)"/>
<path d="M13 90h34v16q0 10-10 10h-14q-10 0-10-10z" style="fill:var(--data)" opacity=".18"/>
<rect x="13" y="48" width="34" height="34" style="fill:var(--vial-label)"/><rect x="13" y="48" width="34" height="4" style="fill:${cap}"/>
<text x="30" y="64" font-size="${fs}" font-weight="800" text-anchor="middle" style="fill:var(--vial-ink)" font-family="Instrument Sans,system-ui,sans-serif">${esc(nm.slice(0, 13))}</text>
<text x="30" y="73" font-size="5.4" text-anchor="middle" style="fill:var(--vial-ink)" opacity=".65" font-family="Instrument Sans,system-ui,sans-serif">${esc(sizeTxt(size))}</text>
<path d="M13 36q0-7 7-7h20q7 0 7 7v70q0 10-10 10h-14q-10 0-10-10z" fill="url(#${id})"/></svg>`;
}
function barcode(seed) {
  let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  let x = 0, out = ""; while (x < 118) { h = (h * 1103515245 + 12345) >>> 0; const w = 1 + (h >>> 13) % 3; out += `<rect x="${x}" y="0" width="${w}" height="26" style="fill:var(--text)"/>`; x += w + 1 + (h >>> 7) % 2; }
  return `<svg width="120" height="26" aria-hidden="true">${out}</svg>`;
}

/* ---------- chrome: band, nav, mobile bars, footer ---------- */
const newest = () => Object.values(V).map(v => Date.parse(v.last_scraped_at) || 0).reduce((a, b) => Math.max(a, b), 0);
const pulled = () => newest() ? "pulled " + ago(new Date(newest()).toISOString()) : "loading";
const curTab = () => { let h = (HASH() || "#home").slice(1); if (h === "list") h = "protocol"; return h.startsWith("p-") ? "index" : h.startsWith("v-") || h.startsWith("s-") || h === "vendors" ? "vendors" : h === "coa" ? "coa" : h === "protocol" ? "protocol" : h === "alerts" ? "alerts" : h === "watchlist" ? "watchlist" : h === "search" ? "search" : "index"; };
function unread() { const since = seenAlerts(); return ALERTS.filter(a => Date.parse(a.at) > since && relevant(a)).length; }
const relevant = a => a.kind === "promo" ? FOLLOW.has(a.v) || Object.keys(WATCH).some(k => WATCH[k].on && ROWS.some(r => r.v === a.v && r.pep + "|" + r.size === k)) : !!WATCH[a.pep + "|" + a.size]?.on && dropOk(a);
const themeSel = () => document.documentElement.dataset.theme || "system";
function chrome() {
  const tab = curTab(), n = unread(), cnt = `<span class="cnt" ${n ? "" : "hidden"}>${n > 9 ? "9+" : n}</span>`;
  const home = (HASH() || "#home") === "#home" || HASH() === "";
  $("#band").innerHTML = home ? `<div class="band"><div class="wrap"><a href="#list"><span class="new">NEW</span>My list: check off what you need and get the cheapest cart →</a><span class="r">${vendors().length} vendors · ${live().length} live listings</span></div></div>` : "";
  const nl = (h, t, k) => `<a href="#${h}" ${tab === k ? 'aria-current="page"' : ""}>${t}</a>`;
  const res = document.documentElement.dataset.resolved;
  $("#top").innerHTML = `<div class="wrap in"><a href="#home" aria-label="PepSeekr home">${wordmark()}</a>
    <nav class="nav" aria-label="Main">${nl("home", "Index", "index")}${nl("vendors", "Vendors", "vendors")}${nl("sales", "Sales", "sales")}${nl("coa", "COA library", "coa")}${nl("list", "My list", "protocol")}</nav>
    <div class="nsearch" role="combobox" aria-expanded="false" aria-haspopup="listbox">${I.search}<input id="nq" type="search" placeholder="Search peptides or vendors" autocomplete="off" aria-label="Search peptides or vendors" value="${esc(S.q)}"><span class="kbd">⌘K</span><div class="sugg" id="sugg" role="listbox"></div></div>
    <div class="acts"><div class="tt" role="radiogroup" aria-label="Theme"><button type="button" role="radio" aria-checked="${res === "light"}" data-theme-set="light" aria-label="Light">${I.sun}</button><button type="button" role="radio" aria-checked="${res === "dark"}" data-theme-set="dark" aria-label="Dark">${I.moon}</button></div>
    <a class="btn" href="#watchlist">${I.star} Watchlist <span class="mono t3">${Object.values(WATCH).filter(w => w.on).length}</span></a>
    <div class="bellwrap"><button class="ib" type="button" id="bell" aria-haspopup="true" aria-expanded="false" aria-label="${n} unread alerts">${I.bell}${cnt}</button><div class="dd" id="dd"></div></div>
    ${acctBtn("btn")}<button class="btn p" type="button" data-review="">Write a review</button></div></div>`;
  const h = (HASH() || "#home").slice(1), pushed = h.startsWith("p-") || h.startsWith("v-") || h.startsWith("s-");
  const ttl = h.startsWith("p-") ? short(PEPS.find(p => slugOf(p) === h.slice(2)) || "") : pushed ? (V[h.slice(2)]?.name || "") : "";
  $("#mtop").innerHTML = `<div class="in">${pushed ? `<button class="mib back" type="button" data-back aria-label="Back">${I.back}</button><span class="ttl">${esc(ttl)}</span>` : `<a href="#home" aria-label="PepSeekr home">${wordmark()}</a><span class="sp"></span>`}
    <a class="mib" href="#search" aria-label="Search">${I.search}</a><a class="mib" href="#alerts" aria-label="${n} unread alerts">${I.bell}${cnt}</a>${acctBtn("mib")}</div>`;
  const tb = (hh, t, k, icn, extra = "") => `<a href="#${hh}" ${tab === k ? 'aria-current="page"' : ""}><i>${icn}</i>${t}${extra}</a>`;
  $("#tabbar").innerHTML = tb("home", "Index", "index", I.home) + tb("search", "Search", "search", I.search) + tb("list", "My list", "protocol", I.dl) + tb("alerts", "Alerts", "alerts", I.bell, cnt) + tb("watchlist", "Watchlist", "watchlist", I.star);
  $("#foot").innerHTML = `<div class="wrap in"><div style="display:grid;gap:10px">${wordmark(res === "light" ? "#fff" : undefined)}<p>Prices pulled every 2 hours from sellers' own sites · content is user-generated and unverified. PepSeekr doesn't sell anything or take a cut from sellers; confirm price, stock and lab reports on the seller's page before you buy.</p><p><a href="/sales">Sales today</a> · <a href="/method">How it works</a> · <a href="/pricing">Pricing</a> · <a href="/about">About</a> · <a href="/contact">Contact</a> · <a href="/contact?topic=store">List or suggest a store</a> · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a></p></div><div class="ru">FOR LABORATORY RESEARCH USE ONLY</div></div>`;
}
function bellDD() {
  const list = ALERTS.filter(relevant).slice(0, 4), since = seenAlerts();
  $("#dd").innerHTML = `<div class="hd"><b>Alerts</b><button class="link" type="button" data-markread>Mark all read</button></div>${list.map(a => alertItem(a, since, true)).join("") || `<div class="empty"><span class="ei">${I.bell}</span><b>No alerts on your watchlist yet</b><p>Tap ☆ on any vial to track its price.</p></div>`}<a class="ft" href="#alerts">View all alerts</a>`;
}

/* ---------- shared bits ---------- */
const sec = (n, kick, title, meta = "", see = "") => `<div class="sec"><div><span class="kick"><span class="lbl">${n ? n + " · " : ""}${esc(kick)}</span></span><h2>${title}</h2></div>${meta ? `<div class="meta">${meta}</div>` : ""}${see ? `<a class="see monly" href="${see}">See all</a>` : ""}</div>`;
const KIND = { sale: ["Sale", "p-sale"], drop: ["Price drop", "p-sale"], restock: ["Restock", "p-brand"], promo: ["Store-wide sale", "p-sale"] };
const rowFor = (a) => ROWS.find(r => r.v === a.v && r.pep === a.pep && r.size === a.size);
function delta(a) { if (a.kind === "restock" || !a.old || a.old <= a.now) return a.kind === "restock" ? `<span class="d data">▲ In stock</span>` : ""; return `<span class="d sale">▼ −${Math.round((1 - a.now / a.old) * 100)}%</span>`; }
function alertCard(a) {
  const k = KIND[a.kind] || ["Update", "p-n"];
  return `<a class="card acard" href="${pHref(a.pep, a.size, a.v)}"><span class="vwell" style="height:58px">${vial(a.pep, a.size, 52)}</span><span style="min-width:0"><span class="pill ${k[1]}">${k[0]}</span><div class="nm">${esc(short(a.pep))} · ${esc(sizeTxt(a.size))}</div><div class="px">${money2(a.now)}${a.old && a.old > a.now ? `<s>${money2(a.old)}</s>` : ""}</div><div class="hint">${esc(V[a.v].name)} · ${ago(a.at)}</div></span></a>`;
}
function ctxTag(a) {
  const w = WATCH[a.pep + "|" + a.size];
  if (w?.target && a.now <= w.target) return `<span class="ctx">Below your ${money(w.target)} target</span>`;
  if (inProt(a.pep)) return `<span class="ctx">On your list</span>`;
  if (watchingPep(a.pep)) return `<span class="ctx">Watching</span>`;
  if (a.kind === "promo" && FOLLOW.has(a.v)) return `<span class="ctx">Following</span>`;
  return "";
}
function alertItem(a, since, compact) {
  const k = KIND[a.kind] || ["Update", "p-n"], un = Date.parse(a.at) > since;
  if (a.kind === "promo") return `<a class="ai ${un ? "unread" : ""}" href="#v-${esc(a.v)}"><span class="ud"></span><span class="vwell vw">${avatar(V[a.v])}</span><span style="min-width:0"><span class="row" style="gap:6px"><span class="pill ${k[1]}">${k[0]}</span>${ctxTag(a)}</span><div class="nm">${esc(a.note || V[a.v].promo_text || "Store-wide sale")}</div><div class="hint">${esc(V[a.v].name)} · ${ago(a.at)}</div></span>${compact ? "" : `<span class="rt"></span>`}</a>`;
  return `<a class="ai ${un ? "unread" : ""}" href="${pHref(a.pep, a.size, a.v)}"><span class="ud"></span><span class="vwell vw">${vial(a.pep, a.size, 50)}</span><span style="min-width:0"><span class="row" style="gap:6px"><span class="pill ${k[1]}">${k[0]}${a.kind === "drop" && dropOf(a) > 0 ? " " + dropOf(a) + "%" : ""}</span>${ctxTag(a)}${a.kind === "drop" && bestPrice(live().filter(r => r.pep === a.pep && r.size === a.size))?.v === a.v ? `<span class="pill p-brand">Now the cheapest</span>` : ""}</span><div class="nm">${esc(short(a.pep))} · ${esc(sizeTxt(a.size))}</div><div class="hint">${esc(V[a.v].name)} · ${ago(a.at)}</div></span><span class="rt">${a.old && a.old !== a.now ? `<span class="t3">${money2(a.old)}</span> → ` : ""}<b>${money2(a.now)}</b> ${delta(a)}</span></a>`;
}
function dealsList(n) {
  const g = groupBy(vis(live().filter(r => V[r.v].rating >= 3.5))), out = [];
  Object.entries(g).forEach(([p, sz]) => Object.entries(sz).forEach(([s, l]) => { if (l.length < 3) return; const b = bestPrice(l); if (!b) return; const pct = Math.round((1 - dealUnit(b) / b.med) * 100); if (pct >= 8) out.push({ p, s, b, pct, n: l.length }); }));
  out.sort((a, b) => b.pct - a.pct); const seen = new Set(), res = [];
  for (const d of out) { if (seen.has(d.p)) continue; seen.add(d.p); res.push(d); if (res.length >= n) break; }
  return res;
}
function dealCard(d, glow) {
  return `<a class="card deal ${glow ? "glow" : ""}" href="#p-${slugOf(d.p)}"><span class="vw">${vial(d.p, d.s, 82)}</span><span class="bd"><span class="row" style="justify-content:space-between"><span class="lbl">vs market average</span>${coaTag(d.b)}</span><div style="font-weight:600;margin-top:6px">${esc(short(d.p))} · ${esc(sizeTxt(d.s))}</div><div class="px">${money2(dealUnit(d.b))}<s>${money2(d.b.med)}</s></div>${promoOf(V[d.b.v]) ? `<div style="margin-top:4px">${dealTag(V[d.b.v])}</div>` : ""}<div class="ft"><span class="t2">${esc(V[d.b.v].name)}</span><span class="pct">−${d.pct}%</span></div></span></a>`;
}
function vendorCard(v, glow) {
  return `<a class="card vcard ${glow ? "glow" : ""}" href="#v-${esc(v.id)}"><div class="hd">${ring(v.score)}<div style="min-width:0;flex:1"><div class="lbl">Rank #${v.rank}</div><div class="row" style="gap:8px;margin-top:2px"><span class="nm">${esc(v.name)}</span>${vBadge(v)}</div>${v.tie_text ? `<span class="vtie">${I_MIC}${v.tie_kind === "owner" ? "Owned by" : "Promoted by"} ${esc(tieWho(v))}</span>` : ""}<span class="mline monly">${repTxt(v)} · ${mktTxt(v)}</span></div><span class="monly t3" style="width:20px">${I.chev}</span></div>
    <div class="trip"><div><span class="lbl">Rating</span><b>${v.rvN ? "★ " + v.rvAvg.toFixed(1) : v.finnrick_pct != null ? v.finnrick_pct + "%" : v.site_reviews > 0 && v.site_rating != null ? "★ " + (+v.site_rating).toFixed(1) : "—"}</b><span class="hint">${v.rvN ? v.rvN + " verified" : v.finnrick_pct != null ? "Finnrick lab tests" : v.site_reviews > 0 && v.site_rating != null ? v.site_reviews + " on their site" : "none yet"}</span></div><div><span class="lbl">COA on file</span><b>${coaPctTxt(v)}</b></div><div><span class="lbl">vs market</span>${(d => `<b class="${d < 0 ? "data" : d > 2 ? "warn" : ""}">${d < 0 ? "▼ −" + -d : d > 0 ? "▲ +" + d : "0"}%</b>`)(Math.round((v.priceIdx - 1) * 100))}</div></div>
    <div class="vfoot"><span>${I.truck.replace("<svg", '<svg style="width:14px;height:14px;display:inline;vertical-align:-2px;margin-right:4px"')}${esc(shipText(v))}<span class="mono" style="margin-left:8px;opacity:.8">${v.count} listings</span></span>${promoOf(v) ? dealTag(v) : v.promo_text ? promoPill(v) : ""}</div></a>`;
}
function pcard(p, list) {
  const b = bestOf(list), any = list[0], n = new Set(list.map(r => r.v)).size, sizes = [...new Set(list.map(r => sizeTxt(r.size)))];
  const sale = list.some(r => r.sale && r.stock), w = watchingPep(p);
  return `<div class="card pcard"><button class="watch" type="button" data-watch="${esc(p)}" data-size="${esc((b || any).size)}" aria-pressed="${w}" aria-label="${w ? "Stop watching" : "Watch"} ${esc(p)}">${I.star}</button>
    <a href="#p-${slugOf(p)}"><span class="md">${vial(p, (b || any).size, 100)}</span><span class="fl">${sale ? `<span class="pill p-sale">Sale</span>` : ""}${b ? "" : `<span class="pill p-n">Out of stock</span>`}</span>
    <span class="bd"><span class="lbl">${esc(catOf(p))}</span><span class="nm">${esc(p)}</span><span class="fr">${b ? `from <b>${money2(eff(b) / b.sv)}</b>/${unitTxt(b.unit)}` : "Out of stock everywhere"}</span><span class="mt"><span>${n} vendor${n > 1 ? "s" : ""}</span><span>${esc(sizes.slice(0, 3).join(" · "))}${sizes.length > 3 ? " +" + (sizes.length - 3) : ""}</span></span></span></a></div>`;
}
function catalogGrid(limit) {
  const q = S.q.trim().toLowerCase();
  let rows = vis().filter(r => (S.cat === "All" || (S.cat === "Watching" ? watchingPep(r.pep) || inProt(r.pep) : catOf(r.pep) === S.cat)) && (!q || r.pep.toLowerCase().includes(q) || V[r.v].name.toLowerCase().includes(q)));
  const g = groupBy(rows); let peps = Object.keys(g);
  const flat = p => Object.values(g[p]).flat();
  if (S.sort === "ppu") peps.sort((a, b) => { const x = bestOf(flat(a)), y = bestOf(flat(b)); return (x ? x.vsMed : 9) - (y ? y.vsMed : 9) || a.localeCompare(b); });
  else if (S.sort === "score") peps.sort((a, b) => Math.max(...flat(b).map(r => V[r.v].score)) - Math.max(...flat(a).map(r => V[r.v].score)));
  else if (S.sort === "rating") peps.sort((a, b) => Math.max(...flat(b).map(r => V[r.v].rating)) - Math.max(...flat(a).map(r => V[r.v].rating)));
  else peps.sort((a, b) => a.localeCompare(b));
  return { html: peps.slice(0, limit || 9999).map(p => pcard(p, flat(p))).join("") + (limit && peps.length > limit ? `<a class="btn lg" href="#search" style="grid-column:1/-1">See all ${peps.length} peptides</a>` : "") || (vMatch() ? `<p class="hint" style="grid-column:1/-1">No peptides match. Tap a store above to see its prices.</p>` : "") || `<div class="card empty" style="grid-column:1/-1"><span class="ei">${I.search}</span><b>Nothing matches that</b><p>Check the spelling, or loosen the filters.</p><button class="btn" type="button" data-clearf>Clear filters</button></div>`, n: peps.length, offers: rows.length };
}
function catCounts() { const g = groupBy(vis()), c = { All: Object.keys(g).length, Watching: Object.keys(g).filter(p => watchingPep(p) || inProt(p)).length }; ALLCATS.forEach(k => c[k] = Object.keys(g).filter(p => catOf(p) === k).length); return c; }
function catalog(limit) {
  const r = catalogGrid(limit), c = catCounts();
  const sorts = [["ppu", "Lowest $/mg vs average"], ["score", "Vendor score"], ["rating", "Rating"], ["az", "A to Z"]];
  return `<div class="cat" id="catalog"><div class="card catnav" role="group" aria-label="Category">${["All", "Watching", ...ALLCATS].filter(k => c[k] || k === "All" || k === "Watching").map(k => `<button type="button" data-cat="${esc(k)}" aria-pressed="${S.cat === k}"><span style="font:inherit;color:inherit">${ALLCATS.includes(k) ? `<i style="--h:var(--cat-${catN(k)})"></i>` : ""}${esc(k)}</span><span>${c[k]}</span></button>`).join("")}</div>
    <div><div class="sortbar"><span class="mono t3" style="font-size:12px" id="catmeta">${r.n} peptides · ${r.offers} offers</span><label class="row" style="gap:8px"><span class="lbl donly">Sort</span><select class="btn sm" id="sortSel" aria-label="Sort">${sorts.map(s => `<option value="${s[0]}" ${S.sort === s[0] ? "selected" : ""}>${s[1]}</option>`).join("")}</select></label></div><div class="pgrid" id="pgrid">${r.html}</div></div></div>`;
}
const ck = (k, t) => `<button type="button" class="ck" role="checkbox" aria-checked="${!!S[k]}" data-filt="${k}"><span class="chk">${I.check}</span>${t}</button>`;
function filtersBar() {
  return `<div class="card filters"><span class="lbl">Filters</span>${ck("rep", "Hide low-rated stores")}${ck("stock", "In stock only")}${ck("coa", "COA on file")}${ck("fill", "Fills your cart")}${ck("ship", "Include shipping")}
    <div class="r"><select class="btn sm" id="vsel" aria-label="Vendor"><option value="">All vendors</option>${vendors().map(v => `<option value="${esc(v.id)}" ${S.vendor === v.id ? "selected" : ""}>${esc(v.name)}</option>`).join("")}</select><button class="btn sm" type="button" data-stores>${I.store} Stores</button></div></div>`;
}
function ctaBand() {
  return `<div class="ctab"><div><span class="kick"><span class="lbl">My list</span></span><h3 style="margin-top:10px">Paste your list. Get the cheapest COA-backed cart.</h3><p>We read the compound names and vial sizes, then price every item across ${vendors().length} vendors.</p></div><div class="row"><a class="btn p lg" href="#list" data-imp="paste">${I.paste} Paste a list</a><a class="btn lg" href="#list" data-imp="pdf">${I.file} Drop a PDF</a></div></div>`;
}

/* ---------- home ---------- */
function vHome() {
  const vs = vendors(), g = groupBy(live()), deals = dealsList(6), top = deals.find(d => d.b.coa === true && d.b.coaState !== "reused");   // featured card only shows a listing with a COA on file
  const recent = ALERTS.filter(a => a.kind !== "promo" && !HIDE.has(a.v) && Date.now() - Date.parse(a.at) < 7 * 864e5);
  const mine = recent.filter(relevant), sa = [...mine, ...recent.filter(a => !mine.includes(a))].slice(0, 8);
  const c = catCounts();
  const spec = top ? `<a class="spec" href="#p-${slugOf(top.p)}"><div class="bar" style="align-items:start"><div><div class="lbl">Specimen · best offer today</div><h3>${esc(short(top.p))}</h3><div class="mono t2">${esc(sizeTxt(top.s))} · lyophilized · 1 vial</div></div><div class="vwell" style="width:86px;height:118px">${vial(top.p, top.s, 112)}</div></div>
    <div class="g4"><div><div class="lbl">Best price</div><div class="v data">${money2(top.b.price)}</div></div><div><div class="lbl">Market average</div><div class="v s">${money2(top.b.med)}</div></div><div><div class="lbl">Vendor</div><div class="v s">${esc(V[top.b.v].name)}</div></div><div><div class="lbl">Saving</div><div class="v s data">−${top.pct}%</div></div></div>
    <div class="bar"><div>${barcode(top.p + top.s)}<div class="mono t3" style="font-size:10.5px;margin-top:4px">PSK-${esc(slugOf(short(top.p)).toUpperCase().replace(/-/g, ""))}-${esc(top.s.toUpperCase())} · CHECKED ${new Date(newest() || Date.now()).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })}</div></div><div style="text-align:right">${top.b.coa === true ? `<span class="coa" style="font-size:12px;padding:5px 10px">✓ COA ON FILE</span>` : `<span class="pill p-n">COA not listed</span>`}<div class="mono t3" style="font-size:10.5px;margin-top:6px">${new Set(g[top.p][top.s].map(r => r.v)).size} vendors · ${top.n} offers</div></div></div></a>` : "";
  return `<section class="hero"><div class="gridbg"></div><div class="wrap in"><div>
      <div class="live"><span class="pill p-brand"><span class="dot"></span> Live price index</span><span class="mono t3" style="font-size:12px">Snapshot · prices ${pulled()}</span></div>
      <h1 class="display">The peptide price index,<br><span class="grad">with the paperwork.</span></h1>
      <p class="sub"><span class="donly">Every vial, every vendor, side by side: price per mg, COA on file, verified buyer reviews and shipping. Refreshed automatically.</span><span class="monly">Price per mg, COA on file, verified buyer reviews and shipping for every vendor.</span></p>
      <label class="msearch monly">${I.search}<input type="search" id="mq" placeholder="Search peptides or vendors" enterkeyhint="search" aria-label="Search peptides or vendors"><button class="mib" type="button" data-filters aria-label="Filters">${I.sliders}</button></label>
      <div class="stats"><div class="stat"><b>${vs.length}</b><span class="lbl">Vendors</span></div><div class="stat"><b>${Object.keys(g).length}</b><span class="lbl">Peptides</span></div><div class="stat"><b>${live().length}</b><span class="lbl">${isM() ? "Listings" : "Live listings"}</span></div></div>
      <div class="ctas"><a class="btn p lg" href="#list">${I.dl} Build my list</a><a class="btn lg" href="#coa">Browse COA library</a></div></div>${spec}</div></section>
  <div class="wrap">
    ${filtersBar()}
    <div class="tiles">${TILES.map(([n, i]) => `<a class="ctile" style="--h:var(--cat-${i})" href="#catalog" data-cat="${esc(n)}"><span class="vw">${vial(CATS[i - 1][2][0], "", 44).replace(/<text[^]*?<\/text>/g, "")}</span><span style="min-width:0"><b>${esc(n)}</b><span>${c[n]} peptides</span></span></a>`).join("")}</div>
    ${sec("01", "Sale alerts", "Sales, price drops &amp; restocks", `Last 7 days · ${I.bell.replace("<svg", '<svg style="width:13px;height:13px;display:inline;vertical-align:-2px"')} alert me on watched items`, "#alerts")}
    ${sa.length ? `<div class="g4c hs">${sa.slice(0, isM() ? 8 : 4).map(alertCard).join("")}</div>` : `<div class="card empty"><span class="ei">${I.bell}</span><b>No sales or price drops this week</b><p>We check every 2 hours. Watch a vial to hear about it first.</p></div>`}
    ${vs.some(v => v.promo_text) ? `<div class="row hs promos" style="margin-top:12px">${vs.filter(v => v.promo_text).map(v => `<a class="chip" href="#v-${esc(v.id)}"><span class="pill p-sale">Store-wide</span>${esc(v.name)}: ${esc(v.promo_text)}</a>`).join("")}</div>` : ""}
    <div class="monly">${sec("", "Categories", "Browse by category")}<div class="hs mchips"><button class="chip" type="button" data-cat="All" aria-pressed="${S.cat === "All"}">All <span>${c.All}</span></button>${TILES.map(([n, i]) => `<button class="chip" type="button" style="--h:var(--cat-${i})" data-cat="${esc(n)}" aria-pressed="${S.cat === n}">${esc(n)} <span>${c[n]}</span></button>`).join("")}</div></div>
    ${sec("02", "Best deals", "Best deals vs market average", "Same vial, same size, vendors rated 3.5★ and up", "#search")}
    ${deals.length ? `<div class="g3c">${deals.slice(0, isM() ? 4 : 6).map((d, i) => dealCard(d, i === 0)).join("")}</div>` : `<div class="card empty"><b>No standout deals right now</b><p>Loosen the filters or check back after the next price pull.</p></div>`}
    ${sec("03", "Who to buy from", "Who to buy from", "Score = reviews 40 + price 30 + COA 20 + shipping 10", "#vendors")}
    <div class="g3c">${vs.slice(0, 6).map((v, i) => vendorCard(v, i === 0)).join("")}</div>
    ${ctaBand()}
    ${sec("04", "Catalog", "Every peptide we track", "", "")}
    ${catalog(24)}
    ${signupBox("home")}
  </div>`;
}
function vSearch() {
  const c = catCounts();
  return `<div class="wrap"><div class="monly" style="margin-top:14px"><label class="msearch">${I.search}<input type="search" id="mq" placeholder="Search peptides or vendors" enterkeyhint="search" value="${esc(S.q)}" aria-label="Search peptides or vendors"><button class="mib" type="button" data-filters aria-label="Filters">${I.sliders}</button></label>
    <div class="hs mchips" style="margin-top:12px"><button class="chip" type="button" data-cat="All" aria-pressed="${S.cat === "All"}">All <span>${c.All}</span></button><button class="chip" type="button" data-cat="Watching" aria-pressed="${S.cat === "Watching"}">☆ Watching <span>${c.Watching}</span></button>${ALLCATS.filter(k => c[k]).map(k => `<button class="chip" type="button" style="--h:var(--cat-${catN(k)})" data-cat="${esc(k)}" aria-pressed="${S.cat === k}">${esc(k)} <span>${c[k]}</span></button>`).join("")}</div></div>
    <div class="donly">${sec("", "Catalog", S.q ? `Results for “${esc(S.q)}”` : "Every peptide we track")}${filtersBar()}<div style="height:20px"></div></div>
    <div style="height:14px" class="monly"></div><div id="vmatch">${vMatch()}</div>${catalog()}</div>`;
}
// stores whose name or influencer matches the search
function vMatch() {
  const q = (S.q || "").trim().toLowerCase(); if (q.length < 3) return "";
  const vs = Object.values(V).filter(v => v.name.toLowerCase().includes(q) || tieHit(v, q)); if (!vs.length) return "";
  return `<div class="vmatch">${vs.slice(0, 4).map(v => `<a class="card vm" href="#v-${esc(v.id)}">${avatar(v)}<span style="min-width:0"><b>${esc(v.name)}</b><span class="hint">${tieHit(v, q) ? `${v.tie_kind === "owner" ? "Owned by" : "Promoted by"} ${esc(tieHit(v, q))}` : `Store · score ${v.score}`}</span></span>${I.chev}</a>`).join("")}</div>`;
}

/* ---------- product ---------- */
let curSize = {};
function vProduct(slug) {
  const p = PEPS.find(x => slugOf(x) === slug);
  if (!p) return `<div class="wrap"><div class="card empty" style="margin-top:30px"><span class="ei">${I.search}</span><b>No vendor lists this right now</b><p>It may be out of stock everywhere. Check back after the next price pull.</p><a class="btn" href="#search">Browse the catalog</a></div></div>`;
  const all = live().filter(r => r.pep === p), g = groupBy(all)[p] || {};
  const sizes = Object.keys(g).sort((a, b) => g[a][0].sv - g[b][0].sv);
  const overall = bestOf(all) || all[0];
  const size = curSize[p] && g[curSize[p]] ? curSize[p] : overall.size;
  const raw = g[size], list = vis(raw).sort((a, b) => (b.stock - a.stock) || eff(a) - eff(b));
  // the store you came from stays in the table even if a filter would hide it
  if (FOCUS_V && !list.some(r => r.v === FOCUS_V)) { const fr = raw.find(r => r.v === FOCUS_V); if (fr) list.push(fr); }
  const b = bestPrice(list) || bestPrice(raw) || raw[0], nV = new Set(all.map(r => r.v)).size;
  const pct = Math.round((1 - dealUnit(b) / b.med) * 100), w = WATCH[p + "|" + size] || {};
  const rv = RV.recent.filter(r => r.pep === p), avg = rv.length ? rv.reduce((a, r) => a + r.stars, 0) / rv.length : 0;
  const multi = list.filter(r => r.stock).length > 1;
  return `<div class="wrap" data-pep="${esc(p)}" data-size="${esc(size)}">
    <div class="crumbs"><a href="#home">Index</a> / <a href="#catalog" data-cat="${esc(catOf(p))}">${esc(catOf(p))}</a> / ${esc(p)}</div>
    <div class="dgrid"><div style="display:grid;gap:16px;min-width:0">
      <div class="card glow phead"><span class="vwell vw">${vial(p, size, 130)}</span><div style="min-width:0"><span class="lbl">${esc(catOf(p))}</span><h1>${esc(p)}</h1><div class="ln mono" style="font-size:13px">${nV} vendors · ${all.length} offers${b ? ` · best $/${unitTxt(b.unit)} at <a class="link" href="${esc(b.url || V[b.v].url)}" target="_blank" rel="noopener">${esc(V[b.v].name)} ↗</a>` : ""}${rv.length ? ` · ★ ${avg.toFixed(1)} (${rv.length})` : ""}</div>
        <div class="sizes donly" role="radiogroup" aria-label="Vial size">${sizes.map(s => { const lb = bestPrice(g[s]); return `<button type="button" role="radio" data-sz="${esc(s)}" aria-checked="${s === size}"><b>${esc(sizeTxt(s))}</b><small>${lb ? "from " + money2(dealUnit(lb)) : "Out of stock"}</small><small>${g[s].length} offer${g[s].length === 1 ? "" : "s"}</small></button>`; }).join("")}</div></div>
        <div class="bp"><span class="lbl donly">Best ${esc(sizeTxt(size))} price${promoOf(V[b.v]) ? " with deal" : ""}</span><b>${money2(dealUnit(b))}</b>${promoOf(V[b.v]) ? `<span class="row" style="gap:6px;margin-top:4px">${dealTag(V[b.v])}<span class="hint">${esc(dealNote(b))}</span></span>` : ""}<span class="mono ${pct > 0 ? "data" : "t3"}" style="font-size:13px">${pct > 0 ? "−" + pct + "% vs average" : "at average"}</span><div class="pacts">${b.stock ? `<a class="btn p lg" href="${esc(b.url || V[b.v].url)}" target="_blank" rel="noopener">Buy at ${esc(V[b.v].name)} ${I.ext}</a>` : `<span class="pill p-n">Out of stock everywhere</span>`}<div class="row" style="gap:8px;justify-content:flex-end"><button class="btn sm" type="button" data-watch="${esc(p)}" data-size="${esc(size)}" aria-pressed="${!!w.on}">${I.star} ${w.on ? "Watching" : "Watch"}</button><button class="btn sm" type="button" data-addlist="${esc(p)}|${esc(size)}">${PROT.some(i => i.pep === p && i.size === size) ? I.check + " On my list" : I.plus + " Add to list"}</button></div><span class="ruo" style="text-align:right">Research use only</span></div></div></div>
      <div class="sizes monly" role="radiogroup" aria-label="Vial size">${sizes.map(s => { const lb = bestPrice(g[s]); return `<button type="button" role="radio" data-sz="${esc(s)}" aria-checked="${s === size}"><b>${esc(sizeTxt(s))}</b><small>${lb ? "from " + money(dealUnit(lb)) : "out"}</small></button>`; }).join("")}</div>
      ${b.v && V[b.v].promo_text ? `<div class="promo"><b><a href="${esc(b.url || V[b.v].url)}" target="_blank" rel="noopener" style="text-decoration:underline">${esc(V[b.v].name)} ↗</a>: ${esc(V[b.v].promo_text)}</b><div class="hint" style="margin-top:2px">${esc((V[b.v].promo_detail || "").replace(/\.?$/, ". ").replace(/^\. $/, ""))}${promoOf(V[b.v]) ? "The prices and $/mg below count this deal." : "Prices shown are before this discount."}</div></div>` : ""}
      <div class="card"><div class="phd"><div><span class="lbl">Vendor comparison · ${esc(sizeTxt(size))}</span></div><div class="row" style="gap:16px">${ck("stock", "In stock only")}<span class="donly">${ck("coa", "COA on file")}</span><span class="donly">${ck("rep", "Hide low-rated")}</span><span class="donly">${ck("fill", "Fills your cart")}</span><span class="donly">${ck("ship", "Include shipping")}</span></div></div>${(() => { const on = [["stock", "In stock only"], ["coa", "COA on file"], ["rep", "Hide low-rated"], ["fill", "Fills your cart"], ["ship", "Including shipping"]].filter(([k]) => S[k]);
        return on.length ? `<div class="fbar"><span class="lbl">Your filters</span>${on.map(([k, t]) => `<button class="chip sm" type="button" data-filt="${k}" aria-label="Turn off ${t}">${t} <span aria-hidden="true">✕</span></button>`).join("")}<span class="t2" style="font-size:13px">${list.length < raw.length ? `Showing ${list.length} of ${raw.length} offers.` : `All ${raw.length} offers shown.`}</span>${list.length < raw.length ? `<button class="link" type="button" data-showall>Show all</button>` : ""}</div>` : ""; })()}
        ${list.length ? `<table class="tbl offers"><thead><tr><th>Vendor</th><th>Price</th><th>$/${unitTxt(b.unit)}</th><th>COA</th><th>Rating</th><th>Shipping</th><th></th></tr></thead><tbody>${list.map(r => offerRow(r, multi && r === b)).join("")}</tbody></table>
        <ul class="ocards monly" style="padding:12px">${list.map(r => offerCard(r, multi && r === b)).join("")}</ul>${sizeHint(p, size, g)}` : `<div class="empty"><b>No offers match your filters</b><p>Turn off “In stock only” or “COA on file” to see every vendor.</p><button class="btn" type="button" data-clearf>Clear filters</button></div>`}</div>
      <div class="card panel"><div class="bar"><div><span class="lbl">Price history · 90 days</span><h3 style="margin-top:4px">Lowest ${esc(sizeTxt(size))} offer</h3></div><span class="mono t3" id="chsum" style="font-size:12px"></span></div><div class="chart" id="chart" style="margin-top:12px"><div class="hint">Loading…</div></div></div>
    </div>
    <aside class="rail">
      <div class="card panel notify"><h3>Price alerts for ${esc(sizeTxt(size))}</h3>${pctCtl(p + "|" + size)}<div class="lbl" style="margin:14px 0 6px">Or alert at a price</div><div class="row"><label class="pin">$<input id="tgt" inputmode="decimal" value="${w.target ?? ""}" placeholder="${(b.price * (1 - wPct(p + "|" + size) / 100)).toFixed(2)}" aria-label="Target price"></label><button class="btn" type="button" data-settarget>Set</button></div>
        <div class="row" style="gap:16px">${["drop", "restock", "sale"].map(k => `<button type="button" class="ck" role="checkbox" aria-checked="${w[k] !== false}" data-wk="${k}"><span class="chk">${I.check}</span>${{ drop: "Price drop", restock: "Restock", sale: "Sale" }[k]}</button>`).join("")}</div>${pushCard(true)}</div>
      <div class="card panel"><div class="bar"><h3>Verified buyer reviews</h3><button class="link" type="button" data-review="${esc(b.v)}">Write one</button></div>
        ${rv.length ? `<div class="row" style="gap:14px;margin-top:10px"><b class="mono" style="font-size:34px">${avg.toFixed(1)}</b><div>${stars(avg)}<div class="hint">${rv.length} verified review${rv.length > 1 ? "s" : ""}</div></div></div>${hist(rv)}${rv.slice(0, 4).map(r => reviewItem(r, true)).join("")}` : `<div class="empty" style="padding:18px 0 4px"><span class="ei">${I.shield}</span><b>No reviews for ${esc(short(p))} yet</b><p>Reviews come only from buyers who show a receipt.</p></div>`}</div>
      ${signupBox("product")}
    </aside></div></div>`;
}
function hist(rv) { const d = [5, 4, 3, 2, 1].map(s => rv.filter(r => r.stars === s).length), t = rv.length || 1; return `<div class="hist">${[5, 4, 3, 2, 1].map((s, i) => `<div><span>${s}★</span><i><b style="width:${Math.round(d[i] / t * 100)}%"></b></i><span>${d[i]}</span></div>`).join("")}</div>`; }
function offerRow(r, best) {
  const v = V[r.v];
  return `<tr class="${best ? "best" : ""} ${r.stock ? "" : "oos"} ${FOCUS_V === r.v ? "focus" : ""}" data-ov="${esc(r.v)}"><td><a class="vn" href="#v-${esc(v.id)}">${avatar(v)}<span><b>${esc(v.name)}</b><span class="row" style="gap:4px;margin-top:3px">${best ? `<span class="pill p-best">Best value</span>` : ""}${dealTag(v)}${vBadge(v)}${cartPill(v)}${tiePill(v)}${r.stock ? "" : `<span class="pill p-n">Out of stock</span>`}</span></span></a></td>
    <td class="px">${r.sale && r.reg ? `<s>${money2(r.reg)}</s>` : ""}${money2(r.price)}${r.sale ? ` <span class="pill p-sale">Sale</span>` : ""}${promoOf(v) ? `<div class="dealnote">${esc(dealNote(r))}</div>` : ""}${S.ship && shipCost(v, r.price) ? `<div class="hint">${money2(eff(r))} shipped</div>` : ""}</td>
    <td class="mono">${money2(eff(r) / r.sv)}${promoOf(v) ? `<div class="hint">with deal</div>` : ""}</td><td>${coaB(r, true) || `<span class="t3" title="Not checked yet">—</span>`}</td><td class="mono" style="font-size:13px">${repTxt(v)}${v.finnrick_pct != null ? `<div><a class="link" href="${esc(frUrl(v))}" target="_blank" rel="noopener" title="${esc(frTitle(v))}" style="font-size:12.5px">Lab-tested ${v.finnrick_pct}% ↗</a></div>` : ""}${v.site_reviews_url ? `<div>${theirRev(v)}</div>` : ""}</td><td class="wrap-c">${esc(shipText(v))}</td>
    <td style="text-align:right"><a class="btn sm ${best ? "p" : ""}" href="${esc(r.url || v.url)}" target="_blank" rel="noopener">${r.stock ? "Buy" : "View"} ${I.ext}</a></td></tr>`;
}
function offerCard(r, best) {
  const v = V[r.v];
  return `<li class="card ocard ${best ? "glow" : ""} ${FOCUS_V === r.v ? "focus" : ""}" data-ov="${esc(r.v)}"><a class="t" href="${esc(r.url || v.url)}" target="_blank" rel="noopener">${avatar(v)}<span style="min-width:0"><b>${esc(v.name)}</b><span class="row" style="gap:4px;margin-top:3px">${best ? `<span class="pill p-best">Best value</span>` : ""}${dealTag(v)}${vBadge(v)}${cartPill(v)}${tiePill(v)}${r.stock ? "" : `<span class="pill p-n">Out of stock</span>`}</span></span><span class="px"><b>${money2(r.price)}</b><span>${money2(eff(r) / r.sv)}/${unitTxt(r.unit)}${promoOf(v) ? " with deal" : ""}</span></span></a>${promoOf(v) ? `<div class="dealnote" style="padding:0 14px 10px">${esc(dealNote(r))}</div>` : ""}
    <div class="bt"><span>${I.truck.replace("<svg", '<svg style="width:15px;height:15px;display:inline;vertical-align:-3px;margin-right:4px"')}${esc(shipText(v))}</span><span class="row" style="gap:8px">${r.sale && r.reg ? `<s class="mono">${money2(r.reg)}</s>` : ""}${coaB(r)}<span class="mono">${v.rvN ? "★ " + v.rvAvg.toFixed(1) : v.rep_trustpilot ? "★ " + (+v.rep_trustpilot).toFixed(1) : ""}</span></span></div></li>`;
}
const HCACHE = {};
async function drawChart(p, size) {
  const el = $("#chart"); if (!el) return;
  try {
    HCACHE[p] ??= await rpc("pf_history", { p_peptide: p });
    const cut = Date.now() - 90 * 864e5;
    const h = HCACHE[p].filter(x => x[0] === size && Date.parse(x[1]) >= cut).map(x => ({ d: x[1], v: +x[2] }));
    if (!$("#chart")) return;
    if (h.length < 2) { el.innerHTML = `<p class="hint">We started tracking this size ${h[0] ? "on " + new Date(h[0].d + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " at " + money2(h[0].v) : "today"}. The chart fills in as prices change.</p>`; return; }
    const W = 640, H = 180, pad = 10, lo = Math.min(...h.map(x => x.v)), hi = Math.max(...h.map(x => x.v)), span = hi - lo || 1;
    const pts = h.map((x, i) => [pad + i * (W - 2 * pad) / (h.length - 1), pad + 6 + (1 - (x.v - lo) / span) * (H - 2 * pad - 20)]);
    const line = pts.map(q => q.map(n => n.toFixed(1)).join(",")).join(" "), last = pts[pts.length - 1], id = "ch" + (++gid);
    const ch = h[h.length - 1].v - h[0].v, sumTxt = `Lowest ${sizeTxt(size)} offer ${ch < 0 ? "down " + money2(-ch) : ch > 0 ? "up " + money2(ch) : "unchanged"} over ${h.length} days`;
    $("#chsum").textContent = (ch < 0 ? "▼ " : ch > 0 ? "▲ " : "") + (ch ? money2(Math.abs(ch)) : "flat");
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(sumTxt)}"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--brand);stop-opacity:.28"/><stop offset="1" style="stop-color:var(--brand);stop-opacity:0"/></linearGradient></defs><polygon points="${pts[0][0]},${H} ${line} ${last[0]},${H}" fill="url(#${id})"/><polyline points="${line}" fill="none" style="stroke:var(--data)" stroke-width="2.5" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg><div class="ax"><span>${new Date(h[0].d + "T12:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span><span>Low ${money2(lo)} · High ${money2(hi)}</span><span>Today ${money2(h[h.length - 1].v)}</span></div><p class="sr">${esc(sumTxt)}</p>`;
  } catch { el.innerHTML = `<p class="hint">Price history needs a connection.</p>`; }
}

/* ---------- vendor ---------- */
let vrf = "recent";
function vVendor(id) {
  const v = V[id]; if (!v) return `<div class="wrap"><div class="card empty" style="margin-top:30px"><b>This vendor isn't listed right now</b><a class="btn" href="#vendors">All vendors</a></div></div>`;
  const rows = ROWS.filter(r => r.v === id), g = groupBy(rows);
  const allL = Object.entries(g).map(([p, sz]) => Object.values(sz).map(l => l[0])).flat().sort((a, b) => (b.stock - a.stock) || a.vsMed * dealUnit(a) / a.price - b.vsMed * dealUnit(b) / b.price);
  const soldOut = allL.filter(r => !r.stock).length, listings = S.stock ? allL.filter(r => r.stock) : allL;
  let rv = RV.recent.filter(r => r.v === id);
  const st = RV.stats[id], dist = st?.dist || [0, 0, 0, 0, 0], tot = dist.reduce((a, b) => a + b, 0) || 1;
  if (vrf === "5") rv = rv.filter(r => r.stars === 5); if (vrf === "ship") rv = rv.filter(r => (r.tags || []).some(t => /ship/i.test(t))); if (vrf === "coa") rv = rv.filter(r => (r.tags || []).includes("Matches lab report"));
  const coaRows = rows.filter(r => r.coa === true).sort((a, b) => a.pep.localeCompare(b.pep));
  const following = FOLLOW.has(id), hidden = HIDE.has(id);
  const bk = [["Reviews", v.pts.rep, 40], ["Price", v.pts.price, 30], ["COA", v.pts.coa, 20], ["Shipping", v.pts.ship, 10]];
  return `<section class="vhero"><div class="gridbg"></div><div class="wrap in">${LOGOS.has(v.id) ? `<span class="mono-tile lg"><img src="/logos/${esc(v.id)}.png" alt="${esc(v.name)} logo"></span>` : `<span class="mono-tile">${esc(v.name[0])}</span>`}<div style="flex:1;min-width:240px"><div class="row" style="gap:10px"><h1 class="h1">${esc(v.name)}</h1>${vBadge(v)}${cartPill(v)}${v.coaKnown ? `<span class="coa">COA ${v.coaPct}%</span>` : ""}${v.coaReused ? `<span class="coa bad" title="Report files that also appear at other sellers or for other compounds">⚠ ${v.coaReused} reused report${v.coaReused > 1 ? "s" : ""}</span>` : ""}</div>${tieLine(v)}
      <div class="mono t2" style="font-size:13px;margin-top:6px">${v.count} listings · lowest price on ${v.wins} vials · ${mktTxt(v)}</div>
      <div class="kstats"><div><b>${v.rvN || 0}</b><span class="lbl">Verified reviews</span></div><div><b>${v.rvN ? v.rvAvg.toFixed(1) : v.finnrick_pct != null ? v.finnrick_pct + "%" : "—"}</b><span class="lbl">${v.rvN ? "Avg rating" : "Finnrick tests"}</span></div><div><b>${coaPctTxt(v)}</b><span class="lbl">COA on file</span></div><div><b>${ALERTS.filter(a => a.v === id && a.kind === "restock").length}</b><span class="lbl">Restocks · 7d</span></div></div></div>
    <div class="row" style="gap:16px">${ring(v.score, 72)}<div><div class="lbl">Rank #${v.rank} of ${Object.keys(V).length}</div><div class="row vact" style="margin-top:8px"><button class="btn ${following ? "" : "p"}" type="button" data-follow="${esc(id)}" aria-pressed="${following}">${I.bell} ${following ? "Following sales" : "Alert me on sales"}</button><a class="btn" href="${esc(v.url)}" target="_blank" rel="noopener">Visit store ${I.ext}</a></div></div></div></div></section>
  <div class="wrap"><div class="dgrid"><div style="display:grid;gap:16px;min-width:0">
    ${v.promo_text ? `<div class="promo" style="margin:0"><b>${esc(v.promo_text)}</b><div class="hint" style="margin-top:2px">${esc(v.promo_detail || "")}${v.promo_ends ? " Ends " + new Date(v.promo_ends).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) + "." : ""}${promoOf(v) ? (promoOf(v).type === "bxgy" ? ` Prices below are the store's list price; $/mg, rankings and cart totals count the free vials (${promoOf(v).buy} paid + ${promoOf(v).get} free).` : " $/mg, rankings and cart totals include the discount.") : " Prices on PepSeekr are before this discount."}</div></div>` : ""}
    <div class="card"><div class="phd"><div><span class="lbl">Listings</span><h3 style="font-size:17px;margin-top:4px">Best prices at ${esc(v.name)}</h3></div><span class="mono t3" style="font-size:12px">sorted by vs average</span></div>
      <div class="row" style="gap:10px;padding:0 18px 12px;flex-wrap:wrap">${ck("stock", "In stock only")}<span class="hint">${S.stock ? (soldOut ? `${soldOut} sold-out listing${soldOut === 1 ? "" : "s"} hidden` : "Everything here is in stock") : (soldOut ? `${soldOut} sold out, marked below` : "Everything here is in stock")}</span></div>
      <table class="tbl offers"><thead><tr><th>Peptide</th><th>Price</th><th>$/mg</th><th>vs average</th><th>COA</th><th></th><th></th></tr></thead><tbody>${listings.slice(0, 40).map(r => { const d = Math.round((r.vsMed * dealUnit(r) / r.price - 1) * 100); return `<tr class="${r.stock ? "" : "oos"}"><td><a href="${pHref(r.pep, r.size, r.v)}"><b>${esc(r.pep)}</b> <span class="mono t3">${esc(sizeTxt(r.size))}</span></a></td><td class="px">${r.sale && r.reg ? `<s>${money2(r.reg)}</s>` : ""}${money2(r.price)}${r.stock ? "" : ` <span class="pill p-n">Sold out</span>`}${promoOf(v) ? `<div class="dealnote">${esc(dealNote(r))}</div>` : ""}</td><td class="mono">${money2(eff(r) / r.sv)}</td><td class="mono ${d < 0 ? "data" : d > 2 ? "warn" : ""}">${d < 0 ? "▼ −" + -d : d > 0 ? "▲ +" + d : "0"}%</td><td>${coaB(r) || `<span class="t3">—</span>`}</td><td><a class="btn sm" href="${esc(r.url || v.url)}" target="_blank" rel="noopener" aria-label="Buy ${esc(r.pep)} ${esc(sizeTxt(r.size))} at ${esc(v.name)}">Buy ${I.ext || "↗"}</a></td><td><button class="watch" style="position:static" type="button" data-watch="${esc(r.pep)}" data-size="${esc(r.size)}" aria-pressed="${isW(r.pep, r.size)}" aria-label="Watch ${esc(r.pep)} ${esc(r.size)}">${I.star}</button></td></tr>`; }).join("")}</tbody></table>
      <ul class="ocards monly" style="padding:12px">${listings.slice(0, 20).map(r => `<li class="card ocard"><a class="t" href="${pHref(r.pep, r.size, r.v)}"><span class="vwell" style="width:40px;height:52px">${vial(r.pep, r.size, 48)}</span><span><b>${esc(short(r.pep))}</b><span class="hint" style="display:block">${esc(sizeTxt(r.size))}${r.stock ? "" : ` · <b class="warn">Sold out</b>`}</span></span><span class="px"><b>${money2(r.price)}</b><span class="${r.vsMed < 1 ? "data" : ""}">${r.vsMed < 1 ? "−" + Math.round((1 - r.vsMed) * 100) + "% vs avg" : money2(r.ppu) + "/mg"}</span></span></a><a class="btn sm vbuy" href="${esc(r.url || v.url)}" target="_blank" rel="noopener" aria-label="Buy ${esc(r.pep)} ${esc(sizeTxt(r.size))} at ${esc(v.name)}">Buy ${I.ext || "↗"}</a></li>`).join("")}</ul></div>
    <div class="card panel"><div class="bar"><h3>Verified buyer reviews</h3><button class="btn sm p" type="button" data-review="${esc(id)}">Review ${esc(v.name)}</button></div>
      <div class="row" style="margin:12px 0 4px;gap:8px">${[["recent", "Most recent"], ["5", "5★"], ["ship", "Shipping"], ["coa", "COA match"]].map(([k, t]) => `<button class="chip" type="button" data-vrf="${k}" aria-pressed="${vrf === k}">${t}</button>`).join("")}</div>
      ${v.rvN ? `<div class="row" style="gap:14px;margin-top:10px"><b class="mono" style="font-size:34px">${v.rvAvg.toFixed(1)}</b><div>${stars(v.rvAvg)}<div class="hint">${v.rvN} verified</div></div></div><div class="hist">${[5, 4, 3, 2, 1].map((s, i) => `<div><span>${s}★</span><i><b style="width:${Math.round(dist[i] / tot * 100)}%"></b></i><span>${dist[i]}</span></div>`).join("")}</div>` : ""}
      ${rv.map(r => reviewItem(r)).join("") || `<div class="empty"><span class="ei">${I.shield}</span><b>${v.rvN ? "No reviews match that filter" : "No verified reviews yet"}</b><p>Bought from ${esc(v.name)}? A photo of your receipt keeps every review real.</p></div>`}
      <p class="hint" style="margin-top:12px">Every review comes from a buyer who sent a receipt or order confirmation. We check it, then delete it.${v.finnrick_pct != null ? ` Independent lab testing: <a class="link" href="${esc(frUrl(v))}" target="_blank" rel="noopener">${esc(frTitle(v))} ↗</a>.` : ""}${v.site_reviews > 0 && v.site_rating != null ? ` On their own site: ${(+v.site_rating).toFixed(1)} from ${v.site_reviews} review${v.site_reviews > 1 ? "s" : ""}. The store runs those, so we show them but don't count them in the score.` : ""} ${theirRev(v, "See their reviews")}</p></div>
  </div><aside class="rail">
    <div class="card panel"><div class="bar"><h3>Score breakdown</h3>${ring(v.score, 44)}</div><div class="bk">${bk.map(([t, p, m]) => `<div><div class="r"><span>${t}</span><b>${p} / ${m}</b></div><div class="cbar"><i style="width:${p / m * 100}%"></i></div></div>`).join("")}</div></div>
    <div class="card panel"><div class="bar"><h3>COA library</h3><span class="mono t3" style="font-size:12px">${coaRows.length} listed</span></div><p class="hint" style="margin-top:4px">Lab reports are hosted on ${esc(poss(v.name))} site.</p><div class="coal" style="margin-top:8px">${coaRows.slice(0, 8).map(r => `<a href="${esc(r.coaUrl || r.url || v.url)}" target="_blank" rel="noopener"><span><b style="font-weight:600">${esc(short(r.pep))}</b> <span class="mono t3">${esc(sizeTxt(r.size))}</span></span><span class="coa">${r.lot ? "Lot " + esc(r.lot) : "COA"} ↗</span></a>`).join("") || `<p class="hint">No COAs found on ${esc(poss(v.name))} product pages.</p>`}</div></div>
    <div class="card panel"><h3>Shipping &amp; policies</h3><dl class="pol"><dt>Shipping</dt><dd>${esc(v.shipping_note || shipText(v))}</dd><dt>Lab reports</dt><dd>${esc(v.coa_note || "Not stated")}</dd>${v.specials_note ? `<dt>Deals</dt><dd>${esc(v.specials_note)}</dd>` : ""}${v.rep_note ? `<dt>Notes</dt><dd>${esc(v.rep_note)}</dd>` : ""}</dl>
      <button type="button" class="srow" role="switch" aria-checked="${!hidden}" data-hide="${esc(id)}" style="margin-top:12px;border-top:1px solid var(--border)"><span><b>Follow in my index</b><small>${hidden ? "Hidden from prices, deals and carts" : "Included in prices, deals and carts"}</small></span><span class="tog"><i></i></span></button></div>
  </aside></div></div>`;
}

/* ---------- vendors list, seller log ---------- */
function vVendors() {
  const all = Object.values(V).sort((a, b) => b.score - a.score), nTie = all.filter(v => v.tie_text).length;
  const vs = S.vtie ? all.filter(v => v.tie_text) : all;
  return `<div class="wrap vhead"><div class="sec"><div><h2>Who to buy from</h2><p class="t2" style="margin-top:4px">Score: reviews 40, price 30, lab reports 20, shipping 10. Stores are listed free; none pay for rank. <a class="lnk" href="/method#scores">How we score</a></p></div></div>
    <div class="row" style="gap:8px;margin-top:12px" role="radiogroup" aria-label="Show"><button class="chip" type="button" role="radio" data-vtie="" aria-checked="${!S.vtie}" aria-pressed="${!S.vtie}">All stores <span>${all.length}</span></button><button class="chip" type="button" role="radio" data-vtie="1" aria-checked="${!!S.vtie}" aria-pressed="${!!S.vtie}">${I_MIC}Creator-linked stores <span>${nTie}</span></button></div>
    ${S.vtie ? `<p class="hint" style="margin-top:8px">Stores owned by, or promoted by, a creator or podcaster. Each tie links to where we found it.</p>` : ""}
    <div class="g3c" style="margin-top:14px">${vs.map((v, i) => vendorCard(v, i === 0 && !S.vtie)).join("")}</div>
    <div class="g3c" style="margin-top:36px;grid-template-columns:1fr 1fr">
      <div class="card panel"><span class="kick"><span class="lbl">Suggest a seller</span></span><h3 style="margin-top:10px">Know a vendor we should check?</h3><p class="hint" style="margin-top:4px">We vet every store the same way: a readable catalog, lab reports on product pages, real contact details, and no dosing or health claims.</p>
        <form id="suggest" class="notify" style="margin-top:12px"><input class="field" name="url" placeholder="Store web address" required inputmode="url" autocomplete="off" aria-label="Store web address"><input class="field" name="name" placeholder="Store name (optional)" aria-label="Store name"><div class="seg" role="radiogroup" aria-label="I'm a"><button type="button" role="radio" aria-checked="true" data-kind="buyer">I bought from them</button><button type="button" role="radio" aria-checked="false" data-kind="seller">I run this store</button></div><input class="field" name="email" type="email" placeholder="Email (optional, for the result)" aria-label="Email" autocomplete="email"><button class="btn p" type="submit">Send it in</button></form></div>
      <div class="card panel"><span class="kick"><span class="lbl">Seller log</span></span><h3 style="margin-top:10px">Every listing change, in public</h3><div id="slog" class="coal" style="margin-top:10px"><p class="hint">Loading…</p></div></div></div>
    ${sec("", "Owner tools", "Review queue &amp; stores")}${ownerKey() ? `<p style="margin:-4px 0 12px"><a class="btn" href="#stats">Traffic and store clicks</a></p>` : ""}<div id="owner">${ownerKey() ? `<p class="hint">Loading…</p>` : `<div class="box" style="max-width:460px"><p class="hint">For the site owner. Enter your key to check reviews and manage stores.</p><input class="field" id="adminKey" type="password" autocomplete="off" placeholder="Owner key" aria-label="Owner key"><button class="btn p" id="adminGo" type="button">Unlock</button></div>`}</div></div>`;
}
async function loadLog() {
  const el = $("#slog"); if (!el) return;
  try { const l = await rpc("vs_seller_log"); el.innerHTML = (l || []).slice(0, 12).map(x => `<div class="srow" style="min-height:44px"><span><b style="font-weight:600">${esc(x.name || x.vendor_name || x.domain || "")}</b><small>${esc(x.note || x.reason || x.action || "")}</small></span><span class="mono t3" style="font-size:12px">${x.at ? ago(x.at) : ""}</span></div>`).join("") || `<p class="hint">No changes yet.</p>`; }
  catch { el.innerHTML = `<p class="hint">The log needs a connection.</p>`; }
}

/* ---------- COA library ---------- */
let coaV = "";
function vCoa() {
  const rows = live().filter(r => r.coa === true && (!coaV || r.v === coaV)).sort((a, b) => a.pep.localeCompare(b.pep) || a.sv - b.sv);
  const vs = vendors();
  return `<div class="wrap">${sec("", "COA library", "Lab reports, by vial", `${live().filter(r => r.coa === true).length} listings with a COA on file`)}
    <p class="t2" style="max-width:70ch;margin-top:-6px">Listings where the vendor links a certificate of analysis on the product page. Reports live on each vendor's site; check the lot matches what ships.</p>
    <div class="hs row" style="margin:16px 0;flex-wrap:nowrap;overflow-x:auto"><button class="chip" type="button" data-coav="" aria-pressed="${!coaV}">All vendors</button>${vs.map(v => `<button class="chip" type="button" data-coav="${esc(v.id)}" aria-pressed="${coaV === v.id}">${esc(v.name)} <span class="mono t3">${coaPctTxt(v)}</span></button>`).join("")}</div>
    <div class="card">${rows.length ? `<table class="tbl offers"><thead><tr><th>Peptide</th><th>Size</th><th>Vendor</th><th>Price</th><th>COA</th></tr></thead><tbody>${rows.slice(0, 300).map(r => `<tr><td><a href="${pHref(r.pep, r.size, r.v)}"><b>${esc(r.pep)}</b></a></td><td class="mono">${esc(sizeTxt(r.size))}</td><td><a href="#v-${esc(r.v)}">${esc(V[r.v].name)}</a></td><td class="mono">${money2(r.price)}</td><td>${coaB(r, true)}</td></tr>`).join("")}</tbody></table>
      <ul class="ocards monly" style="padding:12px">${rows.slice(0, 120).map(r => `<li class="card ocard"><a class="t" href="${esc(r.url || V[r.v].url)}" target="_blank" rel="noopener"><span class="vwell" style="width:40px;height:52px">${vial(r.pep, r.size, 48)}</span><span><b>${esc(short(r.pep))} · ${esc(sizeTxt(r.size))}</b><span class="hint" style="display:block">${esc(V[r.v].name)}</span></span><span class="coa">PDF ↗</span></a></li>`).join("")}</ul>` : `<div class="empty"><span class="ei">${I.file}</span><b>No lab reports linked for this vendor</b><p>Pick another vendor, or check their site directly.</p></div>`}</div></div>`;
}
// "30mg is cheaper per mg" line under a product's offer table
function sizeHint(p, size, g) {
  const per = r => r.price / r.sv, cur = (g[size] || []).filter(r => r.stock).sort((a, b) => per(a) - per(b))[0];
  if (!cur) return "";
  let best = null; Object.keys(g).forEach(z => { if (z === size) return; const r = g[z].filter(x => x.stock && x.unit === cur.unit).sort((a, b) => per(a) - per(b))[0]; if (r && (!best || per(r) < per(best))) best = r; });
  if (!best || per(best) > per(cur) * 0.95) return "";
  const pct = Math.round((1 - per(best) / per(cur)) * 100);
  return `<p class="szhint">${esc(sizeTxt(best.size))} is ${money2(per(best))}/${esc(unitTxt(best.unit))} at ${esc(V[best.v].name)}, ${pct}% less per ${esc(unitTxt(best.unit))} than the best ${esc(sizeTxt(size))}. <button class="link" type="button" data-sz="${esc(best.size)}">Show ${esc(sizeTxt(best.size))}</button></p>`;
}

/* ---------- shop my protocol: cart optimizer ---------- */
// Shipping: known flat rate unless the store subtotal clears the free-shipping line. Stores that only show
// shipping at checkout get an estimate so they can be compared fairly; it's always labeled "est."
const SHIP_EST = 10;
function cartShip(v, sub) {
  const free = v.free_ship_over != null ? +v.free_ship_over : null;
  if (free != null && sub >= free) return { amt: 0, est: false };
  if (v.ship_flat != null) return { amt: +v.ship_flat, est: false };
  return { amt: SHIP_EST, est: true };
}
function priceStores(assign) { // assign: [{item, offer}]
  const stores = {};
  assign.forEach(({ item, offer }) => { const s = (stores[offer.v] ??= { sub: 0, items: [] }); s.sub += lineCost(offer, item.qty); s.items.push(item); });
  let ship = 0, est = false;
  Object.entries(stores).forEach(([v, s]) => { const c = cartShip(V[v], s.sub); s.ship = c.amt; s.est = c.est; ship += c.amt; est = est || c.est; });
  const sub = assign.reduce((a, x) => a + lineCost(x.offer, x.item.qty), 0);
  return { stores, sub, ship, est, total: sub + ship };
}
// ---------- routes: every way to buy the list, priced with shipping ----------
// A route is a set of stores. "Nonstop" = one checkout, "1 stop" = two checkouts, and so on.
// Size swaps: if a store doesn't carry the exact vial, the same compound in a size that adds up to the
// same total (e.g. 2 × 5mg for 10mg) counts, but only at stores without the exact size in stock.
const unitOf = s => (s || "").replace(/^[\d.]+/, "");
// what a line actually costs at checkout, with the store's deal
function lineCost(o, qty) {
  const p = promoOf(V[o.v]), units = (o.n || 1) * qty;
  if (!p) return o.price * qty;
  if (p.type === "pct") return o.price * qty * (1 - p.off / 100);
  return paidUnits(o.v, units) * o.row.price;
}
function itemOffers(it, mode, swaps) {
  const need = parseFloat(it.size), unit = unitOf(it.size);
  const rows = live().filter(r => r.pep === it.pep && r.stock && r.unit === unit);
  const byV = {};
  rows.filter(r => r.size === it.size).forEach(r => { if (!byV[r.v] || dealUnit(r) < dealUnit(byV[r.v].row)) byV[r.v] = { v: r.v, price: r.price, n: 1, row: r, med: r.med, cmp: dealUnit(r) }; });
  if (swaps) rows.forEach(r => {
    if (byV[r.v]?.n === 1 || r.size === it.size || !(r.sv > 0)) return;
    const n = need / r.sv;
    if (Math.abs(n - Math.round(n)) > 1e-6 || n < 2 || n > 4) return;
    const o = { v: r.v, price: r.price * n, n: Math.round(n), row: r, med: r.med * n, swap: true };
    if (!byV[r.v] || o.price < byV[r.v].price) byV[r.v] = o;
  });
  let offers = Object.values(byV);
  if (mode === "value") {
    const ok = offers.filter(o => V[o.v].rating >= 3); if (ok.length) offers = ok;
    const c = offers.filter(o => o.row.coa === true && o.row.coaState !== "reused"); if (c.length) offers = c;
  }
  return offers.sort((a, b) => lineCost(a, it.qty || 1) - lineCost(b, it.qty || 1));
}
function* subsets(arr, k, start = 0, pre = []) { if (pre.length) yield pre; if (pre.length === k) return; for (let i = start; i < arr.length; i++) yield* subsets(arr, k, i + 1, [...pre, arr[i]]); }
function buildRoutes(mode, swaps, maxStores) {
  const items = PROT.map(i => ({ ...i, offers: itemOffers(i, mode, swaps), all: live().filter(r => r.pep === i.pep && r.size === i.size) }));
  const buyable = items.filter(x => x.offers.length);
  // Keep the search fast as the store list grows: consider the 10 stores that carry the most of the list
  // (ties go to the one cheapest on those items), plus any store that is the cheapest for some item.
  const allV = [...new Set(buyable.flatMap(x => x.offers.map(o => o.v)))];
  const rank = v => { const os = buyable.map(x => x.offers.find(o => o.v === v)).filter(Boolean); return [os.length, -os.reduce((a, o) => a + lineCost(o, 1), 0)]; };
  const top = allV.sort((a, b) => { const [ca, pa] = rank(a), [cb, pb] = rank(b); return cb - ca || pb - pa; }).slice(0, 10);
  const vids = [...new Set([...top, ...buyable.map(x => x.offers[0].v)])];
  const seen = new Map();
  for (const set of subsets(vids, Math.min(maxStores, vids.length))) {
    const assign = [], missing = [];
    for (const it of buyable) { const o = it.offers.find(o => set.includes(o.v)); if (o) assign.push({ item: it, offer: o }); else missing.push(it); }
    if (!assign.length) continue;
    const used = [...new Set(assign.map(a => a.offer.v))].sort();
    const key = used.join("+"); if (seen.has(key)) continue;
    const p = priceStores(assign); Object.assign(p, { key, assign, missing, n: used.length, mode });
    p.med = assign.reduce((a, x) => a + x.offer.med * x.item.qty, 0); p.save = p.med - p.sub;
    p.swaps = assign.filter(a => a.offer.swap);
    seen.set(key, p);
  }
  return { items, routes: [...seen.values()], unavail: items.filter(x => !x.offers.length) };
}
const stopsTxt = n => n <= 1 ? "Nonstop" : `${n - 1} stop${n > 2 ? "s" : ""}`;
function routePlan() {
  const swaps = S.swaps !== false, one = !!S.one, max = one ? 1 : 5;
  const C = buildRoutes("cheapest", swaps, max), VAL = buildRoutes("value", swaps, max);
  // Only routes that cover as many items as possible are eligible for the named picks, so a route
  // that skips something another route covers is never "Recommended".
  const best = list => { const m = Math.max(0, ...list.map(r => r.assign.length)); return list.filter(r => r.assign.length === m).sort((a, b) => a.total - b.total); };
  const pool = best(C.routes);
  const low = pool[0] || null;
  const few = [...pool].sort((a, b) => a.n - b.n || a.total - b.total)[0] || null;
  const tol = low ? Math.max(10, low.total * 0.05) : 0;
  const rec = low ? pool.filter(r => r.total <= low.total + tol).sort((a, b) => a.n - b.n || a.total - b.total)[0] : null;
  const vpool = best(VAL.routes), val = vpool[0] || null;
  const nonstops = C.routes.filter(r => r.n === 1).sort((a, b) => b.assign.length - a.assign.length || a.total - b.total);
  // one-seller mode: what splitting would get you, so the shopper can see the trade
  let multi = null;
  if (one) { const mp = best(buildRoutes("cheapest", swaps, 5).routes), ml = mp[0]; if (ml) { const mt = Math.max(10, ml.total * 0.05); multi = mp.filter(r => r.total <= ml.total + mt).sort((a, b) => a.n - b.n || a.total - b.total)[0]; } }
  return { C, low, few, rec, val, nonstops, tol, swaps, one, multi };
}
function vProtocol() {
  // Free: lowest price only, no swaps, no one-seller. Pro: every route.
  const pro = isPro(), keep = [S.swaps, S.one]; if (!pro) { S.swaps = false; S.one = false; }
  const R = routePlan(); if (!pro) [S.swaps, S.one] = keep;
  const tab = !pro ? "low" : ["rec", "low", "few", "value"].includes(S.tab) ? S.tab : "rec";
  const pick = { rec: R.rec, low: R.low, few: R.few, value: R.val };
  const sel = (pro && S.open && [R.rec, R.low, R.few, R.val, ...R.nonstops].find(r => r && r.key === S.open && r.mode === (S.openMode || "cheapest"))) || pick[tab];
  const nItems = PROT.length - R.C.unavail.length;
  CUR = sel;
  const same = (a, b) => a && b && a.key === b.key && Math.abs(a.total - b.total) < 0.005;
  const tags = r => [same(r, R.rec) && "Recommended", same(r, R.low) && "Lowest price", same(r, R.few) && "Fewest stops", same(r, R.val) && "Best value"].filter(Boolean);
  // list: the picked route first, then the other named routes and up to two nonstops
  const list = []; const add = r => { if (r && !list.some(x => same(x, r))) list.push(r); };
  add(sel); if (pro) [R.rec, R.low, R.few, R.val, ...R.nonstops.slice(0, 2)].forEach(add);
  const shipLine = (vid, s) => `<li><span>Shipping${s.est ? ` <span class="t3">(est.)</span>` : ""}</span><b>${s.ship ? money2(s.ship) : "Free"}</b></li>`;
  const nudge = (vid, s) => { const f = V[vid].free_ship_over != null ? +V[vid].free_ship_over : null; return f != null && s.ship && f - s.sub <= 75 ? `<div class="hint data" style="margin-top:6px">Add ${money2(f - s.sub)} more for free shipping</div>` : ""; };
  const lineTxt = a => `${esc(short(a.item.pep))} ${esc(sizeTxt(a.item.size))}${a.offer.swap ? ` <span class="swap-pill">⇄ ${a.offer.n} × ${esc(sizeTxt(a.offer.row.size))}</span>` : ""}${a.item.qty > 1 ? ` ×${a.item.qty}` : ""}`;
  const legs = r => Object.entries(r.stores).map(([vid, s], i) => `<div class="leg"><span class="n">${i + 1}</span><div style="min-width:0"><b>${esc(V[vid].name)}</b> ${cartPill(V[vid])} <span class="hint">${repTxt(V[vid])}</span><ul>${r.assign.filter(a => a.offer.v === vid).map(a => `<li><span>${lineTxt(a)}</span><b>${money2(a.offer.price * a.item.qty)}</b></li>`).join("")}${shipLine(vid, s)}</ul>${nudge(vid, s)}</div><div class="rt"><b>${money2(s.sub + s.ship)}</b>${cartBtn(vid)}<a class="link" href="${esc(V[vid].url)}" target="_blank" rel="noopener" style="font-size:13px">Go to ${esc(V[vid].name)} ↗</a></div></div>`).join("");
  const swapBox = r => r.swaps.map(a => `<div class="swapbox"><span class="sw-ic">⇄</span><span class="t"><b>${esc(short(a.item.pep))}: ${a.offer.n} × ${esc(sizeTxt(a.offer.row.size))} (${money2(a.offer.price)})</b> for ${esc(sizeTxt(a.item.size))} <span class="t3">· ${esc(V[a.offer.v].name)} doesn't sell ${esc(sizeTxt(a.item.size))}. Same compound, same total.</span></span></div>`).join("");
  const sumCard = r => `<div class="card glow sum" style="align-self:start"><div class="r"><span>Items</span><b>${money2(r.sub)}</b></div><div class="r"><span>Shipping</span><b>${money2(r.ship)}${r.est ? " est." : ""}</b></div><div class="r" style="font-size:16px"><span><b style="font-family:inherit">Total</b></span><b>${money2(r.total)}</b></div><div class="r"><span class="t2">Average, same items</span><b class="t2">${money2(r.med)}</b></div><div class="save"><span><span class="lbl">You save vs average</span><div class="hint">before shipping</div></span><b>${money2(Math.max(0, r.save))}</b></div>${r.est ? `<p class="hint">“est.” = this store shows shipping only at checkout; we assume ${money(SHIP_EST)} per store.</p>` : ""}${PROT.length ? `<a class="btn pk" href="${pkLink()}" target="_blank" rel="noopener">Ordered these? Add them to PepKeep</a><p class="hint" style="margin-top:6px">Opens PepKeep with these vials ready to set up. Only names, sizes and counts are sent.</p>` : ""}<div class="ruo">For laboratory research use only</div></div>`;
  const why = r => {
    if (same(r, R.rec) && R.low && !same(r, R.low)) { const d = r.total - R.low.total, k = R.low.n - r.n; return `${money2(d)} over the lowest price, ${k} fewer checkout${k > 1 ? "s" : ""}`; }
    if (same(r, R.val) && !same(r, R.rec)) return "Vendors rated ★ 3.0+, COA on file where possible";
    return "";
  };
  const card = r => {
    const open = r === sel, base = sel, d = r.total - base.total, nv = Object.keys(r.stores);
    const t = tags(r);
    return `<div class="card itin" aria-expanded="${open}">
      <button type="button" class="itin-hd" data-itin="${esc(r.key)}|${r.mode}" aria-expanded="${open}">
        <div class="stops">${stopsTxt(r.n)}<small>${r.n} checkout${r.n > 1 ? "s" : ""}</small></div>
        <div style="min-width:0"><div class="path">${nv.map((v, i) => `${i ? `<span class="hop"></span>` : ""}<span class="node"><span class="av">${esc(V[v].name.slice(0, 2))}</span>${esc(V[v].name.replace(/ Peptides?$/i, ""))}</span>`).join("")}</div>
          <div class="sub">${t.map((x, i) => `<span class="pill ${i ? "p-brand" : x === "Recommended" ? "p-best" : "p-brand"}">${x}</span>`).join("")}<span>${r.assign.length} of ${nItems} items</span>${r.swaps.length ? `<span class="swap-pill">⇄ ${r.swaps.length} size swap${r.swaps.length > 1 ? "s" : ""}</span>` : ""}${why(r) ? `<span>${why(r)}</span>` : ""}</div></div>
        <div class="rt"><b>${money2(r.total)}</b>${open ? `<span class="hint">saves ${money2(Math.max(0, r.save))} vs average</span>` : `<span class="mono ${d > 0 ? "t3" : "data"}" style="font-size:13px">${d > 0 ? "+" : d < 0 ? "−" : ""}${money2(Math.abs(d))}</span>`}</div>
      </button>
      ${open ? `<div class="expand"><div>${legs(r)}${r.missing.length ? `<div class="note warn" style="margin-top:8px">Not carried here: ${r.missing.map(m => esc(short(m.pep)) + " " + esc(sizeTxt(m.size))).join(", ")}. Buy separately.</div>` : ""}${r.swaps.length ? `<div style="display:grid;gap:8px;margin-top:10px">${swapBox(r)}</div>` : ""}</div>${sumCard(r)}</div>` : ""}
    </div>`;
  };
  const itemRow = x => `<div class="item"><span class="vwell vw">${vial(x.pep, x.size, 58)}</span><div style="min-width:0"><div><a class="nm" href="#p-${slugOf(x.pep)}">${esc(short(x.pep))}</a> <span class="mono t3" style="font-size:12.5px">${esc(sizeTxt(x.size))}</span><span class="qty" aria-label="Quantity"><button type="button" data-qty="${esc(x.pep)}|${esc(x.size)}|-1" aria-label="One fewer">−</button><span>${x.qty}</span><button type="button" data-qty="${esc(x.pep)}|${esc(x.size)}|1" aria-label="One more">+</button></span></div>
      <div class="hint" style="margin-top:3px">${x.offers.length ? `${x.offers.length} store${x.offers.length > 1 ? "s" : ""} in stock · from ${money2(x.offers[0].price)}` : `<span class="warn">No vendor has this in stock</span>`}</div>
      <div class="row" style="gap:12px;margin-top:4px"><button class="link wst" type="button" data-watch="${esc(x.pep)}" data-size="${esc(x.size)}" aria-pressed="${isW(x.pep, x.size)}" style="font-size:13px">${I.star.replace("<svg", '<svg style="width:15px;height:15px;vertical-align:-2px;margin-right:3px"')}${isW(x.pep, x.size) ? "Watching" : "Watch"}</button><button class="link" type="button" data-swap="${esc(x.pep)}|${esc(x.size)}" style="font-size:13px">${x.all.length > 1 ? x.all.length + " offers ▾" : "Change size"}</button><button class="link" type="button" data-rm="${esc(x.pep)}|${esc(x.size)}" style="font-size:13px;color:var(--text-3)">Remove</button></div></div></div>`;
  const coverNote = () => {
    const have = R.rec ? R.rec.assign.length : 0, missing = R.rec ? R.rec.missing.filter(m => !R.C.unavail.includes(m)) : [];
    if (R.one && R.multi && R.multi.assign.length > have) return `<div class="note warn" style="margin-top:12px">No single store has all ${nItems} items. The best one covers ${have}. Turn off <b>one seller</b> to get all ${R.multi.assign.length} from ${R.multi.n} stores for ${money2(R.multi.total)}.</div>`;
    if (!R.one && missing.length) return `<div class="note warn" style="margin-top:12px">No mix of up to 5 stores has everything. Buy ${missing.map(m => esc(short(m.pep)) + " " + esc(sizeTxt(m.size))).join(" and ")} separately.</div>`;
    return "";
  };
  const tabs = [["rec", "Recommended", R.rec], ["low", "Lowest price", R.low], ["few", "Fewest stops", R.few], ["value", "Best value", R.val]];
  const ctl = `<div class="rtabs" role="radiogroup" aria-label="Route">${tabs.map(([k, t, r]) => `<button class="chip" type="button" role="radio" data-strat="${k}" aria-checked="${tab === k && !S.open}" aria-pressed="${tab === k && !S.open}">${t}${r ? ` <span class="mono">${money2(r.total)}</span>` : ""}</button>`).join("")}</div>
    <div class="row" style="gap:16px;margin-top:10px"><button type="button" class="ck" role="checkbox" aria-checked="${R.swaps}" data-swaps><span class="chk">${I.check}</span>Allow size swaps</button><button type="button" class="ck" role="checkbox" aria-checked="${R.one}" data-one><span class="chk">${I.check}</span>Buy everything from one seller</button></div>`;
  return `<div class="wrap"><div class="sec" style="margin-top:28px"><div><span class="kick"><span class="lbl">My list</span></span><h1 class="h1" style="margin-top:12px">Your protocol, priced.</h1><p class="t2" style="margin-top:8px">${PROT.length ? `${PROT.length} items, checked against ${live().length} offers from ${vendors().length} vendors, shipping included.` : "Check off what you need. We find the cheapest way to buy it, shipping included, from one store or several."}</p></div></div>
    <div class="imp"><button class="card itile" type="button" data-checklist><span class="hd">${I.list} Check off a list</span><span class="hint">Pick everything you need</span></button><button class="card itile" type="button" data-imp="paste"><span class="hd">${I.paste} Paste a list</span><span class="hint">Type or paste names</span></button><label class="card itile"><span class="hd">${I.file} PDF</span><span class="hint">Drop a file</span><input type="file" id="pdfIn" accept="application/pdf" aria-label="Import a PDF"></label></div>
    ${PROT.length && sel ? `<div style="margin-top:16px">${pro ? ctl : lockedCtl(R, tabs)}</div>
    ${coverNote()}
    <div class="itins" style="margin-top:14px">${list.map(card).join("")}</div>
    ${R.C.unavail.length ? `<p class="hint warn" style="margin-top:10px">Not in stock anywhere right now: ${R.C.unavail.map(m => esc(short(m.pep)) + " " + esc(sizeTxt(m.size))).join(", ")}. Add it to your watchlist to hear when it's back.</p>` : ""}
    <div class="card" style="margin-top:16px"><div class="phd"><span class="lbl">Your protocol · ${PROT.length}</span><span class="row" style="gap:16px">${PROT.some(i => !isW(i.pep, i.size)) ? `<button class="link wst" type="button" data-watchall>${I.star.replace("<svg", '<svg style="width:15px;height:15px;vertical-align:-2px;margin-right:3px"')}Watch all</button>` : `<span class="hint">All watched</span>`}<button class="link" type="button" data-checklist>+ Add items</button></span></div><div class="items">${R.C.items.map(itemRow).join("")}</div></div>` :
    PROT.length ? `<div class="card empty" style="margin-top:16px"><span class="ei">${I.list}</span><b>Nothing on your list is in stock</b><p>Try another size, or add these to your watchlist.</p></div><div class="card" style="margin-top:16px"><div class="items">${R.C.items.map(itemRow).join("")}</div></div>` :
    `<div class="card empty" style="margin-top:16px"><span class="ei">${I.list}</span><b>Your list is empty</b><p>Check off the vials you need, paste a list, or drop a PDF. We read names and vial sizes only.</p><button class="btn p" type="button" data-checklist>Check off a list</button></div>`}
    </div>`;
}
let CHK = null;
function checklistSheet() {
  CHK = new Map(PROT.map(i => [i.pep + "|" + i.size, i.qty]));
  openSheet(`<div class="shd"><h2>What do you need?</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div><p class="hint">Tap a size to check it off. Tap again to uncheck.</p>
    <label class="msearch" style="display:flex;height:48px;border:1px solid var(--border-2);border-radius:12px;align-items:center;gap:10px;padding:0 14px;margin-top:10px">${I.search.replace("<svg", '<svg style="width:18px;height:18px"')}<input id="chkQ" type="search" placeholder="Search peptides" style="flex:1;border:0;background:none;outline:none;height:100%;font-size:16px" autocomplete="off" aria-label="Search peptides"></label>
    <div id="chkRes" class="vlist" style="margin-top:8px">${chkRes("")}</div>
    <div style="margin-top:10px">${awBox()}</div><div class="sfoot"><button class="btn" type="button" data-close>Cancel</button><button class="btn p" type="button" data-chkgo id="chkGo">${chkLabel()}</button></div>`, "What do you need?");
}
const chkLabel = () => CHK.size ? `Price ${CHK.size} item${CHK.size > 1 ? "s" : ""}` : "Pick at least one";
function chkRes(q) {
  q = q.toLowerCase().trim();
  const sizesOf = p => [...new Set(live().filter(r => r.pep === p).map(r => r.size))].sort((a, b) => parseFloat(a) - parseFloat(b));
  const row = p => { const sz = sizesOf(p); if (!sz.length) return "";
    return `<div class="crow"><div class="cn"><b>${esc(p)}</b><small>${sz.length} size${sz.length > 1 ? "s" : ""}</small></div><div class="cz">${sz.map(z => { const on = CHK.has(p + "|" + z); return `<button class="szc" type="button" data-chk="${esc(p)}|${esc(z)}" aria-pressed="${on}">${on ? "✓ " : ""}${esc(sizeTxt(z))}</button>`; }).join("")}</div></div>`; };
  if (q) {
    const hits = PEPS.filter(p => p.toLowerCase().includes(q) || short(p).toLowerCase().includes(q) || p.toLowerCase().replace(/[^a-z0-9]/g, "").includes(q.replace(/[^a-z0-9]/g, "")));
    return hits.map(row).join("") || `<p class="hint" style="padding:16px 0">No compounds match "${esc(q)}".</p>`;
  }
  // grouped by compound family, the main families first; everything else sits behind "More compounds"
  const groups = ALLCATS.map(c => [c, PEPS.filter(p => catOf(p) === c).sort((a, b) => a.localeCompare(b))]).filter(([, l]) => l.length);
  const main = groups.filter(([c]) => c !== "Other" && c !== "Blends"), rest = groups.filter(([c]) => c === "Other" || c === "Blends");
  const sec = ([c, l]) => `<div class="cgrp"><div class="lbl">${esc(c)}</div>${l.map(row).join("")}</div>`;
  const restN = rest.reduce((a, [, l]) => a + l.length, 0);
  return main.map(sec).join("") +
    (S.chkMore ? rest.map(sec).join("") : `<button class="btn" type="button" data-chkmore style="width:100%;margin:12px 0">More compounds and blends (${restN})</button>`);
}
function parseList(txt) {
  const names = PEPS.map(p => ({ p, keys: [p, short(p), p.replace(/[-\s]/g, "")].map(k => k.toLowerCase()) })).sort((a, b) => b.p.length - a.p.length);
  const found = [], lines = txt.split(/\n|,|;/);
  lines.forEach(line => {
    const l = line.toLowerCase(), lc = l.replace(/[-\s]/g, "");
    const hit = names.find(n => n.keys.some(k => l.includes(k) || lc.includes(k.replace(/[-\s]/g, "")))); if (!hit) return;
    const m = l.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|iu)\b/);
    const sizes = [...new Set(ROWS.filter(r => r.pep === hit.p).map(r => r.size))];
    let size = m && sizes.find(s => s.toLowerCase() === (m[1] + m[2]).toLowerCase());
    if (!size) { const b = bestOf(ROWS.filter(r => r.pep === hit.p)); size = b ? b.size : sizes[0]; }
    const qm = l.match(/(?:\bx\s*|×\s*|\bqty:?\s*)(\d{1,2})\b|\b(\d{1,2})\s*(?:x|×|vials?)\b(?!\s*\d)/), qty = qm ? Math.min(20, Math.max(1, +(qm[1] || qm[2]))) : 1;
    if (size && !found.some(f => f.pep === hit.p && f.size === size)) found.push({ pep: hit.p, size, qty });
  });
  return found;
}
function addItems(list) {
  const fresh = list.filter(i => !PROT.some(x => x.pep === i.pep && x.size === i.size));
  PROT.push(...fresh); saveP(); autoWatch(fresh); return fresh.length;
}
function autoWatch(items) {
  if (!AUTOW() || !items.length) return;
  const r = watchItems(items);
  if (r.cap) setTimeout(() => toast(`Watching ${r.n ? r.n + " of them. " : ""}Free accounts can watch ${FREE_WATCH} vials; Pro watches your whole list.`, 5000), 3300);
}
async function importPdf(file) {
  toast("Reading the compounds…");
  try {
    const lib = await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs");
    lib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";
    const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise; let txt = "";
    for (let i = 1; i <= Math.min(doc.numPages, 20); i++) { const c = await (await doc.getPage(i)).getTextContent(); let y = null; c.items.forEach(it => { if (y !== null && Math.abs(it.transform[5] - y) > 2) txt += "\n"; txt += it.str + " "; y = it.transform[5]; }); txt += "\n"; }
    const f = parseList(txt); const n = addItems(f);
    toast(f.length ? `Added ${n} item${n === 1 ? "" : "s"} from the PDF` : "We couldn't find any compounds we track in that PDF", 4500); route(true);
  } catch { toast("Couldn't read that PDF. Try pasting the list instead.", 4500); }
}

/* ---------- alerts & watchlist ---------- */
let afilt = "all", aseg = "alerts", openedAt = 0;
function vAlerts(seg) {
  aseg = seg || aseg; const since = openedAt;
  const kinds = { all: () => true, drop: a => a.kind === "drop", restock: a => a.kind === "restock", sale: a => a.kind === "sale" || a.kind === "promo" };
  const seenA = new Set(), list = ALERTS.filter(a => !HIDE.has(a.v)).filter(kinds[afilt]).filter(a => { const k = [a.v, a.pep, a.size, a.kind, a.now].join("|"); if (seenA.has(k)) return false; seenA.add(k); return true; });
  const aall = store.get("pf_aall", false), mine = list.filter(relevant), feed = aall ? list : mine;
  const today = feed.filter(a => Date.now() - Date.parse(a.at) < 864e5), earlier = feed.filter(a => Date.now() - Date.parse(a.at) >= 864e5).slice(0, 60);
  const nw = Object.values(WATCH).filter(w => w.on).length, un = feed.filter(a => Date.parse(a.at) > since).length;
  const segc = `<div class="seg" role="radiogroup" aria-label="View" style="margin-top:14px"><button type="button" role="radio" data-aseg="alerts" aria-checked="${aseg === "alerts"}">Alerts<small>${un} new</small></button><button type="button" role="radio" data-aseg="watchlist" aria-checked="${aseg === "watchlist"}">Watchlist<small>${nw}</small></button></div>`;
  const wk = list.filter(a => Date.now() - Date.parse(a.at) < 7 * 864e5);
  const rail = `<aside class="rail"><div class="card panel"><span class="lbl">This week</span><div class="g3c" style="grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">${[["Drops", wk.filter(a => a.kind === "drop").length], ["Sales", wk.filter(a => a.kind === "sale" || a.kind === "promo").length], ["Restocks", wk.filter(a => a.kind === "restock").length]].map(([t, n]) => `<div><b class="mono" style="font-size:22px">${n}</b><div class="lbl">${t}</div></div>`).join("")}</div></div>
    <div class="card panel"><h3>Notify me about</h3>${[["drop", "Price drops", "Your % per vial, 15% unless you change it"], ["restock", "Restocks", "A watched vial is back"], ["sale", "Sales", "Item and store-wide sales"]].map(([k, t, s]) => `<button type="button" class="srow" role="switch" aria-checked="${store.get("pf_n_" + k, true)}" data-npref="${k}"><span><b style="font-weight:600">${t}</b><small>${s}</small></span><span class="tog m"><i></i></span></button>`).join("")}
      <div class="lbl" style="margin:14px 0 8px">Deliver by</div>${pushCard(false)}</div>
    <div class="card panel monly"><h3>Appearance</h3><div class="seg" role="radiogroup" aria-label="Theme" style="margin-top:10px">${[["system", "System"], ["light", "Light"], ["dark", "Dark"]].map(([k, t]) => `<button type="button" role="radio" data-theme-set="${k}" aria-checked="${themeSel() === k}">${t}</button>`).join("")}</div></div></aside>`;
  const body = aseg === "watchlist" ? watchlist() : `<div class="hs row" style="flex-wrap:nowrap;gap:8px">${[["all", "All · " + feed.length], ["drop", "Price drops"], ["restock", "Restocks"], ["sale", "Sales"]].map(([k, t]) => `<button class="chip" type="button" data-afilt="${k}" aria-pressed="${afilt === k}">${t}</button>`).join("")}</div>
    <p class="hint" style="margin-top:10px">${aall ? `Showing alerts from every store. <button class="lnk" type="button" data-aall="0">Show only my watchlist</button>` : `Showing alerts for vials on your watchlist. <button class="lnk" type="button" data-aall="1">Show alerts from every store</button>`}</p>
    <div class="card feed" style="margin-top:12px">${today.length ? `<div class="gh"><span class="lbl">Today</span></div>${today.map(a => alertItem(a, since)).join("")}` : ""}${earlier.length ? `<div class="gh"><span class="lbl">Earlier this week</span></div>${earlier.map(a => alertItem(a, since)).join("")}` : ""}${!today.length && !earlier.length ? `<div class="empty"><span class="ei">${I.bell}</span><b>${!aall && !nw ? "You're not watching anything yet" : `No ${afilt === "all" ? "" : { drop: "price-drop ", restock: "restock ", sale: "sale " }[afilt]}alerts this week`}</b><p>${!aall && !nw ? "Tap ☆ on a vial to get alerts when its price drops or it comes back in stock." : "We check prices every 2 hours."}</p></div>` : ""}</div>`;
  return `<div class="wrap"><div class="sec" style="margin-top:28px"><div><h1 class="h1">${aseg === "watchlist" ? "Watchlist" : "Alerts"}</h1></div>${aseg === "alerts" ? `<button class="link" type="button" data-markread style="min-height:44px">Mark all read</button>` : `<button class="link" type="button" data-additem="watch" style="min-height:44px">+ Watch a peptide</button>`}</div>${segc}
    <div class="dgrid"><div style="min-width:0">${body}</div>${rail}</div></div>`;
}
function watchlist() {
  const ks = Object.keys(WATCH).filter(k => WATCH[k].on);
  if (!ks.length) return `<div class="card empty"><span class="ei">${I.star}</span><b>Nothing on your watchlist yet</b><p>Tap ☆ on any vial to track its price.</p><a class="btn" href="#search">Browse the catalog</a></div>`;
  return `<div class="card wl"><div class="wr donly" style="padding-top:10px;padding-bottom:10px"><span class="lbl">Peptide</span><span class="lbl">Best now</span><span class="lbl tgc">Alert at</span><span class="lbl spk">30 days</span><span class="sr">Remove</span></div>${ks.map(k => {
    const [p, s] = k.split("|"), w = WATCH[k], b = bestPrice(live().filter(r => r.pep === p && r.size === s)), hit = w.target && b && b.price <= w.target;
    return `<div class="wr"><a href="${pHref(p, s)}" class="row" style="gap:10px;flex-wrap:nowrap;min-width:0"><span class="vwell" style="width:36px;height:46px;flex:none">${vial(p, s, 42)}</span><span style="min-width:0"><b style="font-weight:600">${esc(short(p))}</b> <span class="mono t3">${esc(sizeTxt(s))}</span><span class="hint" style="display:block">${b ? esc(V[b.v].name) : "Out of stock"}</span></span></a>
      <span class="mono wpx"><b>${b ? money2(dealUnit(b)) : "—"}</b>${hit ? ` <span class="pill p-brand">Hit</span>` : ""}${b && promoOf(V[b.v]) ? dealTag(V[b.v]) : ""}</span>
      <button type="button" class="chip sm pctchip tgc" data-pctopen="${esc(k)}" aria-label="Drop alert for ${esc(p)} ${esc(s)}: ${wPct(k)}%${w.target ? " or " + money2(w.target) : ""}. Change">↓${wPct(k)}%${w.target ? ` · ${money2(w.target)}` : ""}</button>
      <span class="spk" data-spark="${esc(k)}"></span>
      <button type="button" class="wrm" data-wrm="${esc(k)}" aria-label="Remove ${esc(short(p))} ${esc(sizeTxt(s))} from watchlist" title="Remove from watchlist"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`; }).join("")}</div>`;
}
async function sparks() {
  for (const el of $$("[data-spark]")) {
    const [p, s] = el.dataset.spark.split("|");
    try { HCACHE[p] ??= await rpc("pf_history", { p_peptide: p }); } catch { continue; }
    const cut = Date.now() - 30 * 864e5, h = HCACHE[p].filter(x => x[0] === s && Date.parse(x[1]) >= cut).map(x => +x[2]);
    if (h.length < 2) { el.innerHTML = `<span class="hint">new</span>`; continue; }
    const lo = Math.min(...h), hi = Math.max(...h), sp = hi - lo || 1;
    el.innerHTML = `<svg width="84" height="24" viewBox="0 0 84 24" role="img" aria-label="30-day trend"><polyline points="${h.map((v, i) => `${(i * 82 / (h.length - 1) + 1).toFixed(1)},${(22 - (v - lo) / sp * 20).toFixed(1)}`).join(" ")}" fill="none" style="stroke:var(--data)" stroke-width="1.8"/></svg>`;
  }
}

/* ---------- sheets ---------- */
function filterSheet() {
  const c = catCounts(), n = vis().length;
  const sw = (k, t, s) => `<button type="button" class="srow" role="switch" aria-checked="${!!S[k]}" data-filt="${k}"><span><b style="font-weight:600">${t}</b><small>${s}</small></span><span class="tog m"><i></i></span></button>`;
  openSheet(`<div class="shd"><h2>Filters</h2><div class="row" style="gap:4px"><button class="link" type="button" data-clearf style="min-height:44px;padding:0 8px">Reset</button><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div></div>
    <div class="ssec"><span class="lbl">Quality</span>${sw("rep", "Hide low-rated stores", "Flagged stores, lab tests under 60%, or poor buyer reviews")}${sw("stock", "In stock only", "Hide sold-out listings")}${sw("coa", "COA on file", "Lab report linked on the listing")}${sw("fill", "Fills your cart", "Stores where we can add your items to the cart for you")}${sw("ship", "Include shipping", "Add known flat shipping to prices")}</div>
    <div class="ssec"><span class="lbl">Category</span><div class="wrapchips">${["All", ...ALLCATS].filter(k => k === "All" || c[k]).map(k => `<button class="chip" type="button" data-cat="${esc(k)}" aria-pressed="${S.cat === k}">${esc(k)}</button>`).join("")}</div></div>
    <div class="ssec"><span class="lbl">Sort by</span><div class="seg" role="radiogroup" aria-label="Sort">${[["ppu", "$/mg"], ["score", "Score"], ["rating", "Rating"]].map(([k, t]) => `<button type="button" role="radio" data-sortopt="${k}" aria-checked="${S.sort === k}">${t}</button>`).join("")}</div></div>
    <div class="ssec"><span class="lbl">Vendors</span><button type="button" class="srow" data-stores><span><b style="font-weight:600">Stores</b><small>${HIDE.size ? HIDE.size + " hidden" : "Following all " + Object.keys(V).length}</small></span>${I.chev.replace("<svg", '<svg style="width:18px;height:18px"')}</button></div>
    <div class="sfoot"><button class="btn" type="button" data-clearf>Clear</button><button class="btn p" type="button" data-close>Show ${n} offers</button></div>`, "Filters");
}
function storesSheet() {
  openSheet(`<div class="shd"><h2>Stores</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div><p class="hint">Hidden stores are left out of the index, deals and protocol carts.</p>
    <div class="ssec">${Object.values(V).sort((a, b) => b.score - a.score).map(v => `<button type="button" class="srow" role="switch" aria-checked="${!HIDE.has(v.id)}" data-hide="${esc(v.id)}"><span class="row" style="gap:12px;flex-wrap:nowrap">${ring(v.score, 40)}<span><b style="font-weight:600">${esc(v.name)}</b><small>${esc(shipText(v))} · ${v.count} listings</small></span></span><span class="tog m"><i></i></span></button>`).join("")}</div>
    <div class="sfoot"><button class="btn p" type="button" data-close>Done</button></div>`, "Stores");
}
function pasteSheet() {
  openSheet(`<div class="shd"><h2>Paste your list</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div><p class="hint">One compound per line, with the vial size if you know it. We read names and sizes only.</p>
    <textarea class="field" id="pasteTxt" style="height:180px;margin-top:12px" placeholder="BPC-157 10mg&#10;TB-500 5mg&#10;Retatrutide 20mg"></textarea><p class="hint" id="pastePrev" style="margin-top:8px"></p><div style="margin-top:6px">${awBox()}</div>
    <div class="sfoot"><button class="btn" type="button" data-close>Cancel</button><button class="btn p" type="button" data-pastego>Add to my list</button></div>`, "Paste your list");
}
function addSheet(mode) {
  openSheet(`<div class="shd"><h2>${mode === "watch" ? "Watch a peptide" : "Add an item"}</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div>
    <label class="msearch" style="display:flex;height:48px;border:1px solid var(--border-2);border-radius:12px;align-items:center;gap:10px;padding:0 14px">${I.search.replace("<svg", '<svg style="width:18px;height:18px"')}<input id="addQ" type="search" placeholder="Search peptides" style="flex:1;border:0;background:none;outline:none;height:100%;font-size:16px" autocomplete="off" aria-label="Search peptides"></label>
    ${mode === "watch" ? "" : `<div style="margin-top:10px">${awBox()}</div>`}<div id="addRes" class="vlist" style="margin-top:8px" data-mode="${mode || "proto"}">${addRes("", mode)}</div>`, "Add an item");
  setTimeout(() => $("#addQ")?.focus(), 60);
}
function addRes(q, mode) {
  q = q.toLowerCase();
  return PEPS.filter(p => !q || p.toLowerCase().includes(q)).slice(0, 30).map(p => { const sizes = [...new Set(live().filter(r => r.pep === p).map(r => r.size))].sort((a, b) => parseFloat(a) - parseFloat(b)); return `<div class="srow"><span><b style="font-weight:600">${esc(p)}</b><small>${esc(catOf(p))}</small></span><span class="row" style="gap:6px;justify-content:flex-end">${sizes.slice(0, 4).map(s => `<button class="chip" type="button" data-addpick="${esc(p)}|${esc(s)}" data-mode="${mode || "proto"}" style="height:36px">${esc(sizeTxt(s))}</button>`).join("")}</span></div>`; }).join("") || `<p class="hint">No peptides match.</p>`;
}
function swapSheet(p, s) {
  const all = live().filter(r => r.pep === p).sort((a, b) => a.sv - b.sv || a.price - b.price);
  openSheet(`<div class="shd"><h2>${esc(short(p))}</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div><p class="hint">Every offer we track. Pick a size to change this item; the cart strategy picks the vendor.</p>
    <div class="ssec">${all.map(r => `<button type="button" class="srow" data-setsize="${esc(p)}|${esc(s)}|${esc(r.size)}"><span><b style="font-weight:600">${esc(V[r.v].name)}</b> <span class="mono t3">${esc(sizeTxt(r.size))}</span><small>${r.stock ? "In stock" : "Out of stock"} · ${repTxt(V[r.v])}${r.coa === true ? " · COA ✓" : ""}</small></span><span class="mono"><b>${money2(r.price)}</b></span></button>`).join("")}</div>`, short(p));
}

/* ---------- carried-over flows: review, owner, install/push ---------- */

/* ---------- boarding: fill a store's cart in a new tab ---------- */
// Woo stores take /?add-to-cart=ID&quantity=N, one item per page load, so we open one tab and step it
// through each item, then land on the store's cart. We can't see inside their site, so the shopper confirms.
let CUR = null, BOARD = null;
const addUrl = (v, id, q) => `${V[v].url.replace(/\/$/, "")}/?add-to-cart=${encodeURIComponent(id)}&quantity=${q}`;
function legItems(r, vid) {
  return r.assign.filter(a => a.offer.v === vid).map(a => {
    const row = a.offer.row, q = a.offer.n * a.item.qty;
    return { label: `${short(a.item.pep)} ${sizeTxt(a.item.size)}${a.offer.swap ? ` (${a.offer.n} × ${sizeTxt(row.size)})` : ""}${a.item.qty > 1 ? ` ×${a.item.qty}` : ""}${gotUnits(vid, q) > q ? ` + ${gotUnits(vid, q) - q} free` : ""}`, qty: q, id: row.cartId, url: row.url || V[vid].url, price: lineCost(a.offer, a.item.qty) };
  });
}
function cartBtn(vid) {
  const m = V[vid].cart_mode || "links", ids = CUR ? legItems(CUR, vid).some(i => i.id) : false;
  if (m !== "links" && ids && !isPro()) return `<span class="cbtns"><button class="btn sm" type="button" data-board="${esc(vid)}">Shop this list</button>${proLock("cart", "Fill my cart")}</span>`;
  const t = m !== "links" && ids ? "Fill my cart" : "Shop this list";
  return `<button class="btn p sm" type="button" data-board="${esc(vid)}">${t}</button>`;
}
function boardSheet(vid) {
  const v = V[vid], items = legItems(CUR, vid), mode = items.some(i => i.id) && isPro() ? (v.cart_mode || "links") : "links";
  const auto = items.filter(i => i.id), hand = mode === "links" ? items : items.filter(i => !i.id);
  const sub = items.reduce((a, i) => a + i.price, 0);
  BOARD = { vid, mode, auto, hand, step: 0, win: null, timer: null, paused: false, done: false, sub };
  const intro = mode === "bag_link" ? `We'll open ${esc(v.name)} with all ${auto.length} item${auto.length === 1 ? "" : "s"} already in your bag.` : mode === "fill" ? `We'll open ${esc(v.name)} in a new tab and add ${auto.length} item${auto.length === 1 ? "" : "s"} to your cart.${v.cart_note ? ` <span class="t3">${esc(v.cart_note)}.</span>` : ""}`
    : mode === "verify_first" ? `${esc(v.name)} asks you to confirm your age or researcher status before anything can go in the cart. Open the store, confirm on their site, then come back here and tap <b>Fill my cart</b>.`
    : `${esc(v.name)} doesn't let us fill the cart for you yet. Each item opens on their site; add it there and check it off here.`;
  openSheet(`<div class="shd"><h2>${mode === "links" ? "Shop at" : "Boarding"} ${esc(v.name)}</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div>
    <p class="t2" style="margin-top:4px">${intro}</p>
    <div class="board" id="boardBox">${boardBody()}</div>
    <p class="hint" style="margin-top:12px">You sign in, confirm your age and pay on ${esc(v.name)}'s site. We never see any of it.</p>`, "Fill my cart");
}
function boardBody() {
  const B = BOARD; if (!B) return "";
  const v = V[B.vid], n = B.auto.length, pct = n ? Math.round(B.step / n * 100) : 100;
  const line = (i, k) => `<li class="${k < B.step ? "ok" : k === B.step && B.timer ? "now" : ""}"><span>${k < B.step ? I.check : `<span class="dot"></span>`}</span><span>${esc(i.label)}</span><b class="mono">${money2(i.price)}</b>${B.done || B.paused ? `<a class="link" href="${esc(B.mode === "bag_link" ? bagUrl(B.vid, [i]) : addUrl(B.vid, i.id, i.qty))}" target="${esc("pk_" + B.vid)}" data-boardone style="font-size:12.5px">Add again</a>` : ""}</li>`;
  const handList = B.hand.length ? `<div class="lbl" style="margin-top:14px">${B.mode === "links" ? "Your items" : "Add these by hand"}</div><ul class="bl">${B.hand.map(i => `<li><label class="ck"><input type="checkbox"><span>${esc(i.label)}</span></label><b class="mono">${money2(i.price)}</b><a class="link" href="${esc(i.url)}" target="_blank" rel="noopener" style="font-size:12.5px">Open ↗</a></li>`).join("")}</ul>` : "";
  if (B.mode === "links") return `${handList}<div class="row" style="justify-content:space-between;margin-top:14px"><span class="t2">About ${money2(B.sub)} before shipping</span><a class="btn p" href="${esc(v.url)}" target="_blank" rel="noopener">Go to ${esc(v.name)} ${I.ext}</a></div>`;
  const status = B.done ? `<b class="data">Your cart is ready at ${esc(v.name)}.</b> You should see ${n} item${n === 1 ? "" : "s"}, about ${money2(B.sub)} before shipping. Missing one? Tap <b>Add again</b> next to it.`
    : B.paused ? `Paused while you were away. Tap <b>Keep going</b> to add the rest.`
    : B.timer ? `Adding ${esc(B.auto[B.step]?.label || "")}… (${Math.min(B.step + 1, n)} of ${n}). Leave the ${esc(v.name)} tab open.`
    : B.mode === "verify_first" && !B.opened ? `Step 1: open ${esc(v.name)} and confirm on their site.` : `Ready to add ${n} item${n === 1 ? "" : "s"}.`;
  const btns = B.done ? `<a class="btn" href="${esc(v.url.replace(/\/$/, ""))}${B.mode === "bag_link" ? "/cart.html" : "/cart/"}" target="${esc("pk_" + B.vid)}">Open my cart ${I.ext}</a><button class="btn p" type="button" data-close>Done</button>`
    : B.paused ? `<button class="btn p" type="button" data-boardgo>Keep going</button>`
    : B.timer ? "" : B.mode === "verify_first" && !B.opened ? `<button class="btn p" type="button" data-boardopen>Open ${esc(v.name)} ${I.ext}</button>`
    : `<button class="btn p" type="button" data-boardgo>Fill my cart</button>`;
  return `<div class="bprog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><span style="width:${pct}%"></span></div>
    <p class="bstat" aria-live="polite">${status}</p>
    ${n ? `<ul class="bl">${B.auto.map(line).join("")}</ul>` : ""}${handList}
    <div class="row" style="justify-content:flex-end;gap:8px;margin-top:14px">${btns}</div>`;
}
const boardPaint = () => { const el = document.getElementById("boardBox"); if (el) el.innerHTML = boardBody(); };
// Stores with their own bag (Patriot) take every item in one link: cart.html?add=KEY:QTY,KEY:QTY
const bagUrl = (vid, items) => `${V[vid].url.replace(/\/$/, "")}/cart.html?add=${items.map(i => encodeURIComponent(i.id) + ":" + i.qty).join(",")}&utm_source=pepseekr&utm_medium=cart`;
function boardGo() {
  const B = BOARD; if (!B) return;
  if (!B.tracked) { B.tracked = true; trackOut(B.vid, null, null, "fill_cart"); }
  if (B.mode === "bag_link") { B.win = window.open(bagUrl(B.vid, B.auto), "pk_" + B.vid); if (!B.win) { toast("Your browser blocked the new tab. Allow pop-ups for PepSeekr and try again."); return; } B.step = B.auto.length; B.done = true; boardPaint(); return; }
  const name = "pk_" + B.vid;
  // must open the tab inside the tap, or the browser blocks it
  if (!B.win || B.win.closed) B.win = window.open(B.step < B.auto.length ? addUrl(B.vid, B.auto[B.step].id, B.auto[B.step].qty) : V[B.vid].url, name);
  else B.win.location = addUrl(B.vid, B.auto[B.step].id, B.auto[B.step].qty);
  if (!B.win) { toast("Your browser blocked the new tab. Allow pop-ups for PepSeekr and try again."); return; }
  B.paused = false;
  const tick = () => {
    B.step++;
    if (B.step >= B.auto.length) { B.timer = null; B.done = true; try { B.win.location = V[B.vid].url.replace(/\/$/, "") + "/cart/"; } catch {} boardPaint(); return; }
    try { B.win.location = addUrl(B.vid, B.auto[B.step].id, B.auto[B.step].qty); } catch {}
    B.timer = setTimeout(tick, 2600); boardPaint();
  };
  B.timer = setTimeout(tick, 2600); boardPaint();
}
function boardOpen() { const B = BOARD; if (!B) return; B.win = window.open(V[B.vid].url, "pk_" + B.vid); B.opened = true; boardPaint(); }

/* ---------- Sales (Black Friday / Cyber Monday ready) ---------- */
function vSales() {
  const on = vis(live().filter(r => r.sale && r.reg > r.price)).map(r => Object.assign({}, r, { off: Math.round((1 - r.price / r.reg) * 100) })).filter(r => r.off >= 3);
  const sort = S.salesort || "off";
  on.sort(sort === "off" ? (a, b) => b.off - a.off : sort === "mg" ? (a, b) => a.price / a.sv - b.price / b.sv : (a, b) => a.price - b.price);
  const promos = Object.values(V).filter(v => v.promo_text && ROWS.some(r => r.v === v.id));
  const cats = [...new Set(on.map(r => catOf(r.pep)))], cat = S.salecat && cats.includes(S.salecat) ? S.salecat : "";
  const list = cat ? on.filter(r => catOf(r.pep) === cat) : on;
  return `<div class="wrap">${sec("", "Sales", `${on.length} vials on sale right now`, `<span class="hint">Checked every 2 hours. "Was" is the store's own regular price.</span>`)}
    ${promos.length ? `<div class="card panel"><h3>Store-wide sales and codes</h3><div class="promos-l">${promos.map(v => `<a class="pr-row" href="#v-${esc(v.id)}">${avatar(v)}<span style="min-width:0"><b>${esc(v.name)}</b><span class="hint">${esc(v.promo_text)}</span></span>${I.chev}</a>`).join("")}</div></div>` : ""}
    ${(() => { const dl = vis(live().filter(r => promoOf(V[r.v]) && r.med > 0)).map(r => Object.assign({}, r, { dOff: Math.round((1 - dealUnit(r) / r.med) * 100) })).filter(r => r.dOff >= 15).sort((a, b) => b.dOff - a.dOff).slice(0, 12);
      return dl.length ? `<div class="card panel" style="margin-top:16px"><h3>Deals that cut the price per vial</h3><p class="hint" style="margin-top:2px">Counting the free vials. Compared with the middle price for the same vial.</p><div class="card sales" style="margin-top:10px;box-shadow:none">${dl.map(r => `<a class="salerow" href="${pHref(r.pep, r.size, r.v)}"><span class="vwell" style="width:36px;height:46px;flex:none">${vial(r.pep, r.size, 42)}</span><span style="min-width:0"><b>${esc(short(r.pep))}</b> <span class="mono t3">${esc(sizeTxt(r.size))}</span><span class="hint" style="display:block">${esc(V[r.v].name)} · ${esc(dealNote(r))}</span></span><span class="mono sp"><b>${money2(dealUnit(r))}</b><span class="hint" style="display:block">a vial</span></span>${dealTag(V[r.v])}</a>`).join("")}</div></div>` : ""; })()}
    <div class="row" style="gap:8px;margin:16px 0 10px;flex-wrap:wrap"><span class="lbl">Sort</span>${[["off", "Biggest % off"], ["price", "Lowest price"], ["mg", "Lowest $/mg"]].map(([k, t]) => `<button class="chip sm" type="button" data-salesort="${k}" aria-pressed="${sort === k}">${t}</button>`).join("")}</div>
    ${cats.length > 1 ? `<div class="hs row" style="gap:8px;flex-wrap:nowrap;margin-bottom:12px"><button class="chip sm" type="button" data-salecat="" aria-pressed="${!cat}">All</button>${cats.map(c => `<button class="chip sm" type="button" data-salecat="${esc(c)}" aria-pressed="${cat === c}">${esc(c)}</button>`).join("")}</div>` : ""}
    ${list.length ? `<div class="card sales">${list.slice(0, 120).map(r => `<a class="salerow" href="${pHref(r.pep, r.size, r.v)}"><span class="vwell" style="width:36px;height:46px;flex:none">${vial(r.pep, r.size, 42)}</span><span style="min-width:0"><b>${esc(short(r.pep))}</b> <span class="mono t3">${esc(sizeTxt(r.size))}</span><span class="hint" style="display:block">${esc(V[r.v].name)}</span></span><span class="mono sp"><s class="t3">${money2(r.reg)}</s> <b>${money2(r.price)}</b></span><span class="pill p-sale">${r.off}% off</span></a>`).join("")}</div>`
      : `<div class="card empty"><b>No vials are marked down right now</b><p>Sales show up here within 2 hours of a store starting one. Watch a vial to get an alert.</p><a class="btn" href="#search">Browse peptides</a></div>`}
    ${signupBox("sales")}</div>`;
}

/* ---------- weekly email sign-up ---------- */
function signupBox(src) {
  if (store.get("pk_subbed", false)) return "";
  return `<div class="card panel signup" style="margin-top:16px"><h3>Price drops and restocks, weekly</h3><p class="hint" style="margin-top:4px">One email a week with the biggest drops, restocks and sales. Unsubscribe anytime.</p>
    <form class="row" data-signup="${esc(src)}" style="gap:8px;margin-top:10px;flex-wrap:nowrap"><input type="email" name="email" required autocomplete="email" placeholder="you@example.com" aria-label="Email address" class="authin" style="height:44px;flex:1;min-width:0"><button class="btn p" type="submit">Sign up</button></form></div>`;
}
function vDoc() { return ""; }

/* ---------- write a review (3 steps) ---------- */
let RW = null;
function openReview(vendor) {
  RW = { step: vendor ? 1 : 0, vendor: vendor || "", stars: 0, tags: [], body: "", peptide: "", file: null, preview: "", order: "", name: store.get("pf_rname", ""), email: "", err: "", busy: false };
  renderReview(); openSheet(null, "Write a review");
}
function renderReview() {
  const r = RW, v = V[r.vendor], steps = 3;
  const prog = `<div class="prog" aria-hidden="true">${[1, 2, 3].map(i => `<i class="${r.step >= i ? "on" : ""}"></i>`).join("")}</div>`;
  let h = "";
  if (r.done) h = `<div class="done"><svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30"/><path d="M20 33l8 8 16-17" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg><h2>Thanks, your review is in</h2><p class="hint" style="max-width:36ch">We'll check your receipt and post the review, usually within a day. Your receipt is deleted after the check.</p><button class="btn p full" type="button" data-rw="close">Done</button></div>`;
  else if (r.step === 0) h = `<h2>Which seller did you buy from?</h2><div class="vlist" style="margin-top:8px">${Object.values(V).sort((a, b) => a.name.localeCompare(b.name)).map(x => `<button type="button" data-rwv="${esc(x.id)}">${avatar(x)}<span>${esc(x.name)}</span></button>`).join("")}</div>`;
  else if (r.step === 1) {
    const peps = [...new Set(ROWS.filter(x => x.v === r.vendor).map(x => x.pep))].sort();
    h = `${prog}<h2>How was your order from ${esc(v.name)}?</h2>
      <div class="starpick" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map(i => `<button type="button" role="radio" aria-checked="${r.stars === i}" aria-label="${i} star${i > 1 ? "s" : ""}" class="${r.stars >= i ? "on" : ""}" data-rws="${i}">${STARF}</button>`).join("")}</div><div class="starword">${STARWORD[r.stars] || "Tap a star"}</div>
      ${r.stars ? `<p class="hint" style="margin:14px 0 8px">Anything stand out? Tap all that fit.</p><div class="toggles">${(r.stars >= 3 ? TAGS_POS.concat(TAGS_NEG) : TAGS_NEG.concat(TAGS_POS)).map(t => `<button type="button" class="chip" data-rwt="${esc(t)}" aria-pressed="${r.tags.includes(t)}">${esc(t)}</button>`).join("")}</div>
      <div style="display:grid;gap:12px;margin-top:16px"><label class="lbl-f">What did you buy? <small>Optional</small><select class="field" id="rwPep"><option value="">Choose a peptide</option>${peps.map(p => `<option ${p === r.peptide ? "selected" : ""}>${esc(p)}</option>`).join("")}</select></label>
      <label class="lbl-f">Tell other buyers about it <small>Optional. Shipping time, packaging, how support treated you.</small><textarea class="field" id="rwBody" maxlength="2000">${esc(r.body)}</textarea></label></div>` : ""}
      <button class="btn p full" type="button" data-rw="next" style="margin-top:16px" ${r.stars ? "" : "disabled"}>Next</button>`;
  } else if (r.step === 2) {
    h = `${prog}<h2>Show us it was your order</h2><p class="hint" style="margin:6px 0 14px">Add a screenshot of the order confirmation email or invoice. We only need the seller's name, the order number and the date, so feel free to cover your address and card details. We delete it after the check.</p>
      <label class="drop ${r.file ? "has" : ""}">${r.preview ? `<img src="${r.preview}" alt="Your receipt">` : r.file ? `<b>${esc(r.file.name)}</b>` : `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg><b>Add a photo or screenshot</b><span class="hint">JPG, PNG or PDF, up to 10 MB</span>`}${r.file ? `<span class="link">Change file</span>` : ""}<input type="file" id="rwFile" accept="image/*,application/pdf"></label>
      <label class="lbl-f" style="margin-top:14px">Order number <small>It's on the confirmation, often near the top.</small><input class="field" id="rwOrder" value="${esc(r.order)}" autocomplete="off" inputmode="text" placeholder="e.g. 10482"></label>
      <div class="row" style="margin-top:16px"><button class="btn" type="button" data-rw="back">Back</button><button class="btn p" style="flex:1" type="button" data-rw="next">Next</button></div>`;
  } else if (r.step === 3) {
    h = `${prog}<h2>Last step</h2>
      <div style="display:grid;gap:12px;margin-top:12px"><label class="lbl-f">Name on your review <small>First name and last initial works well.</small><input class="field" id="rwName" value="${esc(r.name)}" maxlength="40" autocomplete="given-name" placeholder="e.g. Mike W."></label>
      <label class="lbl-f">Email <small>Optional. Only used if we have a question about your receipt. Never shown.</small><input class="field" id="rwEmail" type="email" value="${esc(r.email)}" autocomplete="email" inputmode="email"></label></div>
      <div class="box" style="margin-top:14px;padding:14px"><div>${stars(r.stars)} <b>${esc(v.name)}</b></div>${r.tags.length ? `<div class="hint">${esc(r.tags.join(", "))}</div>` : ""}</div>
      <div class="row" style="margin-top:16px"><button class="btn" type="button" data-rw="back">Back</button><button class="btn p" style="flex:1" type="button" data-rw="submit" ${r.busy ? "disabled" : ""}>${r.busy ? "Sending…" : "Post review"}</button></div>`;
  }
  $("#sheet").innerHTML = `<div class="grab"></div>${h}${r.err ? `<p class="err" role="alert">${esc(r.err)}</p>` : ""}`;
}
function rwCapture() {
  if (!RW) return;
  const g = id => $("#" + id);
  if (g("rwPep")) RW.peptide = g("rwPep").value;
  if (g("rwBody")) RW.body = g("rwBody").value;
  if (g("rwOrder")) RW.order = g("rwOrder").value;
  if (g("rwName")) RW.name = g("rwName").value;
  if (g("rwEmail")) RW.email = g("rwEmail").value;
}
async function rwSubmit() {
  rwCapture(); RW.err = "";
  if (!RW.name.trim()) { RW.err = "Add the name to show on your review."; renderReview(); return; }
  RW.busy = true; renderReview();
  const f = new FormData();
  f.append("vendor", RW.vendor); f.append("stars", RW.stars); f.append("tags", JSON.stringify(RW.tags)); f.append("body", RW.body); f.append("peptide", RW.peptide);
  f.append("order", RW.order); f.append("name", RW.name.trim()); f.append("email", RW.email.trim()); f.append("receipt", RW.file, RW.file.name || "receipt.jpg");
  try { await fnPost(f); store.set("pf_rname", RW.name.trim()); RW.done = true; RW.busy = false; renderReview(); }
  catch (e) { RW.busy = false; RW.err = e.message; renderReview(); }
}
async function shrink(file) {
  // Phone photos can be 5–10 MB; resize images client-side so uploads are quick on cell data.
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1.5e6) return file;
  try {
    const bmp = await createImageBitmap(file); const k = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise(res => c.toBlob(res, "image/jpeg", .85));
    return blob ? new File([blob], "receipt.jpg", { type: "image/jpeg" }) : file;
  } catch { return file; }
}

/* ---------- owner tools ---------- */
const ownerKey = () => store.get("pf_admin", store.get("vs_admin", ""));
function why(st) {
  const s = st.status || "";
  if (!s) return "Waiting for its first price check";
  if (/^ok/.test(s)) return `${st.count ?? 0} listings, checked ${ago(st.at)}`;
  if (/ 40[13]/.test(s)) return "This store blocks automatic price checks";
  if (/ 429/.test(s)) return "Store is limiting requests. Try again later";
  if (/ 404/.test(s)) return "Couldn't find a product catalog at this address";
  if (/ 5\d\d/.test(s)) return "Store's site is down or behind a firewall";
  if (/sending request|dns|connect/i.test(s)) return "Couldn't connect to this store's site";
  if (/non-json/.test(s)) return "Store's catalog isn't in a format we can read";
  return "Couldn't read this store's prices";
}
async function renderOwner() {
  const el = $("#owner"); if (!el) return; const key = ownerKey(); if (!key) return;
  try {
    const [q, sts] = await Promise.all([fnPost({ action: "pending", key }), rpc("vs_store_status", { p_key: key })]);
    el.innerHTML = `<h3 style="margin-bottom:10px">Reviews to check (${q.reviews.length})</h3>
      <div class="queue">${q.reviews.map(r => `<div class="qi"><div>${stars(r.stars)} <b>${esc(r.display_name)}</b> reviewing <b>${esc(V[r.vendor_id]?.name || r.vendor_id)}</b></div>
        ${r.peptide ? `<div class="hint">Bought ${esc(r.peptide)}</div>` : ""}${r.body ? `<p style="margin:0">${esc(r.body)}</p>` : ""}${r.tags?.length ? `<div class="hint">${esc(r.tags.join(", "))}</div>` : ""}
        ${r.receipt_url ? (/\.pdf\?/i.test(r.receipt_url) ? `<a class="link" href="${esc(r.receipt_url)}" target="_blank" rel="noopener">Open receipt (PDF)</a>` : `<a href="${esc(r.receipt_url)}" target="_blank" rel="noopener"><img src="${esc(r.receipt_url)}" alt="Receipt"></a>`) : `<span class="err">No receipt attached</span>`}
        <p class="hint" style="margin:0">Check that the receipt shows ${esc(V[r.vendor_id]?.name || "this seller")}, an order number, and a date.${r.email ? ` Contact: ${esc(r.email)}` : ""}</p>
        <div class="row"><button class="btn" style="flex:1" type="button" data-mod="reject" data-id="${r.id}">Reject</button><button class="btn p" style="flex:1" type="button" data-mod="approve" data-id="${r.id}">Approve</button></div></div>`).join("") || `<div class="hint">Nothing waiting. New reviews show up here.</div>`}</div>
      <h3 style="margin:24px 0 6px">Sellers we check</h3><div class="slist">${sts.map(st => { const bad = st.status && !/^ok/.test(st.status); return `<div class="li" style="grid-template-columns:1fr auto auto"><span><span style="font-weight:600">${esc(st.name)}</span><br><span class="hint" style="${bad ? "color:var(--sale)" : ""}">${esc(why(st))}</span></span>${st.active ? `<button class="btn sm line" type="button" data-recheck="${esc(st.id)}">Check now</button>` : `<span></span>`}<button type="button" role="switch" aria-checked="${!!st.active}" aria-label="Show ${esc(st.name)}" data-store="${esc(st.id)}" data-name="${esc(st.name)}" data-on="${st.active ? 1 : 0}" style="min-height:44px;display:grid;place-items:center"><span class="tog"><i></i></span></button></div>`; }).join("")}</div>
      <form class="box" id="addStore" style="margin-top:14px"><h3>Add a seller</h3><input class="field" id="addName" placeholder="Seller name" required><input class="field" id="addUrl" type="url" inputmode="url" placeholder="https://seller.com" required><button class="btn" type="submit">Add and check prices</button><p class="hint">Works with WooCommerce, Shopify and most custom stores. Some stores block automatic checks; you'll see why here.</p></form>
      <button class="link" type="button" id="adminOut" style="margin-top:12px">Lock owner tools</button>`;
  } catch (e) { if (/authorized/i.test(e.message)) { store.set("pf_admin", ""); store.set("vs_admin", ""); route(true); toast("That key didn't work"); } else el.innerHTML = `<div class="hint">Couldn't load owner tools: ${esc(e.message)}</div>`; }
}
async function watchStore(id, name) {
  // Poll until the scrape for this store finishes (up to ~3 min), then refresh data and tell the owner what happened.
  const key = ownerKey(); let before = null;
  try { before = (await rpc("vs_store_status", { p_key: key })).find(s => s.id === id)?.at || null; } catch {}
  for (let i = 0; i < 18; i++) {
    await new Promise(r => setTimeout(r, 10000));
    let st; try { st = (await rpc("vs_store_status", { p_key: key })).find(s => s.id === id); } catch { continue; }
    if (st && st.at && st.at !== before) {
      await load(); if (HASH() === "#vendors") renderOwner();
      toast(/^ok/.test(st.status || "") ? `${name}: ${st.count} listings added` : `${name}: ${why(st)}`, 6000); return;
    }
  }
  toast(`${name} is taking a while. Pull down to refresh in a few minutes.`, 6000);
}

/* ---------- install & push ---------- */
const isStandalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
let deferredPrompt = null;
addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; });
function installCard() {
  if (isStandalone() || store.get("pf_hide_install", false)) return "";
  return `<section><div class="box"><h3>Add PepSeekr to your home screen</h3>${isIOS() ? `<ol class="steps"><li>Tap <b>Share</b> in Safari</li><li>Choose <b>Add to Home Screen</b></li><li>Open PepSeekr from your home screen to turn on price alerts</li></ol>` : `<p class="hint">Open it like an app and get alerts when prices drop.</p><button class="btn p" id="installBtn" type="button">Install app</button>`}<button class="link" type="button" id="hideInstall" style="justify-self:start">Not now</button></div></section>`;
}
function pushState() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return isIOS() && !isStandalone() ? "needs-install" : "unsupported";
  if (Notification.permission === "denied") return "denied";
  return store.get("pf_push", store.get("vs_push", false)) && Notification.permission === "granted" ? "on" : "off";
}
function pushCard(compact) {
  const st = pushState();
  if (st === "on") return compact ? "" : `<div class="box"><h3>Alerts are on</h3><p class="hint">We'll notify you when a vial on your watchlist drops by your % (15% unless you change it), comes back in stock, or its store runs a sale.</p><div class="row"><button class="btn" id="testPush" type="button">Send a test</button><button class="btn" id="pushOff" type="button">Turn off alerts</button></div></div>`;
  if (st === "needs-install") return `<div class="box"><h3>Get price-drop alerts</h3><p class="hint">On iPhone, alerts work once PepSeekr is on your home screen.</p><ol class="steps"><li>Tap <b>Share</b> in Safari</li><li>Choose <b>Add to Home Screen</b></li><li>Open it from your home screen and come back here</li></ol></div>`;
  if (st === "denied") return `<div class="box"><h3>Notifications are off for PepSeekr</h3><p class="hint">Turn them on in your phone or browser settings under Notifications, then reopen PepSeekr.</p></div>`;
  if (st === "unsupported") return compact ? "" : `<div class="box"><p class="hint">This browser can't get alerts. Use Safari on iPhone (from the home screen) or Chrome on Android.</p></div>`;
  return `<div class="box"><h3>Get price-drop alerts</h3><p class="hint">We'll notify you when a vial on your watchlist drops by your % (15% unless you change it), comes back in stock, or its store runs a sale.</p><button class="btn p" id="pushOn" type="button">Turn on alerts</button></div>`;
}
const b64u = s => { const p = "=".repeat((4 - s.length % 4) % 4), b = atob((s + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(b, c => c.charCodeAt(0)); };
const ab64 = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
async function pushOn() {
  try {
    const perm = await Notification.requestPermission(); if (perm !== "granted") { toast("Notifications weren't allowed"); route(); return; }
    const reg = await navigator.serviceWorker.ready;
    const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(VAPID) });
    await syncSub(sub); store.set("pf_push", true); toast("Alerts are on"); route();
  } catch (e) { toast("Couldn't turn on alerts: " + (e.message || e)); }
}
async function syncSub(sub) {
  sub = sub || await (await navigator.serviceWorker.ready).pushManager.getSubscription(); if (!sub) return;
  const k = sub.toJSON().keys || { p256dh: ab64(sub.getKey("p256dh")), auth: ab64(sub.getKey("auth")) };
  await rpc("pf_subscribe", { p_endpoint: sub.endpoint, p_p256dh: k.p256dh, p_auth: k.auth, p_protocol: Object.keys(WATCH).filter(k => WATCH[k].on).map(k => k + "|" + wPct(k) + (WATCH[k].target ? "|" + WATCH[k].target : "")) });
}
async function pushOff() {
  try { const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription(); if (sub) { await rpc("pf_unsubscribe", { p_endpoint: sub.endpoint }); await sub.unsubscribe(); } } catch {}
  store.set("pf_push", false); store.set("vs_push", false); toast("Alerts turned off"); route();
}
async function testPush() { const reg = await navigator.serviceWorker.ready; reg.showNotification("PepSeekr", { body: "Alerts are working. Deals on your list will show up here.", icon: "/icon-192.png", badge: "/icon-192.png", data: { url: "/#alerts" } }); }

/* ---------- PepSeekr Pro: sign-in, account, sync, gating, upgrade ---------- */
const FREE_WATCH = 3;
const I_USER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.6-3.5 4.5-5 8-5s6.4 1.5 8 5"/></svg>`;
let SBC = null, SESS = null, ME = store.get("pk_me", null), AUTH = { step: "email", email: "", busy: false, err: "" };
function sbc() {
  if (SBC || !window.supabase) return SBC;
  SBC = window.supabase.createClient(SB, KEY, { auth: { flowType: "pkce", persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: "pk_auth" } });
  return SBC;
}
const signedIn = () => !!SESS;
const isPro = () => !!(ME && ME.pro) || !!ownerKey();
async function refreshMe() {
  if (!SESS) { ME = null; store.set("pk_me", null); return; }
  try { const { data, error } = await sbc().rpc("pk_me"); if (!error && data) { ME = data; store.set("pk_me", ME); } } catch {}
}

/* sync: list, watchlist and filters follow the account */
let prefsT = 0, prefsLoaded = false;
function prefsDirty() { if (!SESS || !prefsLoaded) return; clearTimeout(prefsT); prefsT = setTimeout(pushPrefs, 1200); }
async function pushPrefs() {
  if (!SESS) return;
  const data = { list: PROT, watch: WATCH, filters: store.get("pf_filters", {}), at: store.get("pf_prefs_at", 0) || Date.now() };
  try { await sbc().from("pk_prefs").upsert({ user_id: SESS.user.id, data }, { onConflict: "user_id" }); } catch {}
}
async function pullPrefs() {
  if (!SESS) return;
  try {
    const { data } = await sbc().from("pk_prefs").select("data").eq("user_id", SESS.user.id).maybeSingle();
    const R = data && data.data;
    if (R && (R.at || 0) > store.get("pf_prefs_at", 0)) {
      // the newer save wins whole, so removals carry across devices
      PROT.splice(0, PROT.length, ...(R.list || []));
      Object.keys(WATCH).forEach(k => delete WATCH[k]); Object.assign(WATCH, R.watch || {}); purgeW();
      store.set("pf_prefs_at", R.at);
      if (R.filters && !store.get("pf_filters", null)) { store.set("pf_filters", R.filters); Object.assign(S, R.filters); }
      store.set("pf_proto2", PROT); store.set("pf_watch", WATCH);
    }
    prefsLoaded = true; await pushPrefs();
  } catch { prefsLoaded = true; }
}

async function authInit() {
  if (!window.supabase) await new Promise(r => { const el = document.getElementById("sbjs"); if (!el) return r(); el.addEventListener("load", r, { once: true }); el.addEventListener("error", r, { once: true }); setTimeout(r, 15000); });
  const c = sbc(); if (!c) return;
  // the "Sign in on this device" button in our email: #account?th=<token hash>
  const th = (HASH().match(/[?&]th=([^&]+)/) || [])[1];
  if (th) { history.replaceState(null, "", "/account"); route(true); const { error } = await c.auth.verifyOtp({ token_hash: decodeURIComponent(th), type: "magiclink" }); if (error) toast("That sign-in link expired. Enter your email to get a new code.", 6000); }
  else if (HASH() === "#account") route(true);
  try { const { data } = await c.auth.getSession(); SESS = data.session; } catch {}
  if (SESS) { await refreshMe(); await pullPrefs(); route(true); }
  else if (ME) { ME = null; store.set("pk_me", null); route(true); }
  c.auth.onAuthStateChange(async (ev, s) => {
    const was = !!SESS; SESS = s;
    if (s && !was) { await refreshMe(); await pullPrefs(); toast(`Signed in as ${s.user.email}`); afterSignIn(); route(true); }
    if (!s && was) { ME = null; store.set("pk_me", null); prefsLoaded = false; route(true); }
  });
  // back from Stripe checkout: the webhook can take a few seconds
  if (/upgraded=1/.test(HASH())) {
    history.replaceState(null, "", "/account");
    for (let i = 0; i < 8 && !(ME && ME.pro); i++) { await new Promise(r => setTimeout(r, 2000)); await refreshMe(); }
    toast(ME && ME.pro ? "You're on Pro. Routes, swaps and cart fills are unlocked." : "Payment received. Pro turns on in a minute; refresh if it hasn't.", 6000);
    route(true);
  }
  setInterval(() => { if (SESS) refreshMe(); }, 10 * 60 * 1000);
}

/* sign in with an emailed 6-digit code (works inside the home-screen app, which can't see Safari's sign-in) */
async function sendCode(email) {
  AUTH = { step: "email", email, busy: true, err: "" }; paintAuth();
  // our branded email (pk-auth-send); Supabase's own email only as a fallback
  let err = "";
  try {
    const r = await fetch(`${SB}/functions/v1/pk-auth-send`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
    const j = await r.json().catch(() => ({}));
    if (j.len) AUTH.len = j.len;
    if (r.status === 429) err = "We just sent a code to this address. Check your inbox, or wait a minute and send again.";
    else if (r.status === 400) err = "That email address doesn't look right. Check it and try again.";
    else if (!r.ok) { const { error } = await sbc().auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: "https://pepseekr.com/#account" } }); if (error) err = "We couldn't send the email. Try again in a minute."; }
  } catch { err = "Couldn't reach PepSeekr. Check your connection and try again."; }
  const len = AUTH.len;
  AUTH = err && !/just sent/.test(err) ? { step: "email", email, busy: false, err } : { step: "code", email, busy: false, err: err || "", len };
  paintAuth();
}
async function checkCode(code) {
  AUTH.busy = true; AUTH.err = ""; paintAuth();
  // our 6-digit code is checked by pk-auth-send, which hands back a one-time token for the session;
  // a longer code came from Supabase's own fallback email and goes straight to Supabase
  let error = null, msg = "";
  if (code.length === 6) {
    try {
      const r = await fetch(`${SB}/functions/v1/pk-auth-send`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", email: AUTH.email, code }) });
      const j = await r.json().catch(() => ({}));
      if (j.token_hash) ({ error } = await sbc().auth.verifyOtp({ token_hash: j.token_hash, type: "magiclink" }));
      else { error = j.error || "x"; msg = j.error === "expired" ? "That code expired. Send a new one." : j.error === "too_many" ? "Too many wrong tries. Send a new code." : j.error === "wrong" ? `That code didn't match.${j.left > 0 ? ` ${j.left} ${j.left === 1 ? "try" : "tries"} left.` : ""}` : ""; }
    } catch { error = "net"; msg = "Couldn't reach PepSeekr. Check your connection and try again."; }
  } else ({ error } = await sbc().auth.verifyOtp({ email: AUTH.email, token: code, type: "email" }));
  AUTH.busy = false;
  if (error) { AUTH.err = msg || "That code didn't work. Check the newest email, or send a new code."; paintAuth(); return; }
  AUTH = { step: "email", email: "", busy: false, err: "" };
  if ($("#sheet").classList.contains("open") && $("#authBox")) closeSheet?.();
}
function authForm() {
  const A = AUTH;
  if (A.step === "code") return `<form id="codeForm" class="authf"><p class="t2">We sent ${(A.len || 6) === 8 ? "an" : "a"} ${A.len || 6}-digit code to <b>${esc(A.email)}</b> from noreply@pepseekr.com. Enter it here, or tap the button in the email. Not there? Check spam or promotions.</p>
    <input id="authCode" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6,8}" maxlength="8" placeholder="${"0".repeat(A.len || 6)}" aria-label="${A.len || 6}-digit code" class="authin mono" required>
    ${A.err ? `<p class="warn" role="alert">${esc(A.err)}</p>` : ""}
    <div class="row" style="gap:10px;justify-content:space-between"><button class="link" type="button" data-authback>Use a different email</button><button class="btn p" type="submit" ${A.busy ? "disabled" : ""}>${A.busy ? "Checking…" : "Sign in"}</button></div></form>`;
  return `<form id="emailForm" class="authf"><label class="lbl" for="authEmail">Email</label>
    <input id="authEmail" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" value="${esc(A.email)}" class="authin" required>
    ${A.err ? `<p class="warn" role="alert">${esc(A.err)}</p>` : ""}
    <button class="btn p" type="submit" style="width:100%" ${A.busy ? "disabled" : ""}>${A.busy ? "Sending…" : "Email me a sign-in code"}</button>
    <p class="hint">No password. New here? This makes your free account.</p></form>`;
}
function paintAuth() { const b = $("#authBox"); if (b) { b.innerHTML = authForm(); ($("#authCode") || $("#authEmail"))?.focus(); } }
function signInSheet(why) {
  AUTH.err = "";
  openSheet(`<div class="shd"><h2>Sign in to PepSeekr</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div>
    <p class="t2" style="margin-top:4px">${esc(why || "Keep your list and watchlist on every device.")}</p><div id="authBox" style="margin-top:14px">${authForm()}</div>`, "Sign in");
  setTimeout(paintAuth, 30);
}

/* upgrade */
const PRO_PERKS = [
  ["Every route", "Recommended, fewest stops and best value, not just the lowest price"],
  ["Size swaps", "Two 5 mg vials when they beat one 10 mg, worked out for you"],
  ["Fill my cart", "We put your items in the store's cart so you just check out"],
  ["Unlimited watchlist", `Free watches up to ${FREE_WATCH} vials`],
  ["Email alerts", "An email when a watched vial hits your drop %, not just the weekly summary"],
  ["Lab report details", "Lot numbers, lab names and test dates on every COA"]
];
const WHY = { routes: "Compare every way to buy your list.", swaps: "Let us swap sizes when two small vials beat one big one.", cart: "Let us fill your cart at this store.", watch: `Free accounts watch up to ${FREE_WATCH} vials. Pro watches as many as you like.`, lot: "See lot numbers, labs and test dates.", one: "Buy everything from one seller." };
let PENDING_PLAN = null;
function upgradeSheet(reason) {
  openSheet(`<div class="shd"><h2>PepSeekr Pro</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div>
    <p class="t2" style="margin-top:4px">${esc(WHY[reason] || "Find the cheapest way to buy everything on your list.")}</p>
    <ul class="perks">${PRO_PERKS.map(([b, t]) => `<li>${I.check}<span><b>${esc(b)}</b> ${esc(t)}</span></li>`).join("")}</ul>
    <div class="plans"><button class="plan" type="button" data-plan="year"><span class="pl">Yearly</span><b>$49</b><span class="hint">$4.08 a month · save 41%</span></button>
    <button class="plan" type="button" data-plan="month"><span class="pl">Monthly</span><b>$6.99</b><span class="hint">Cancel anytime</span></button></div>
    <p class="hint" style="margin-top:10px;text-align:center"><a class="lnk" href="/pricing">Compare Free and Pro</a></p>
    <p class="hint" style="margin-top:12px">Billed by Stripe. Cancel from your account page in two taps. PepSeekr doesn't sell peptides or take a cut from sellers.</p>`, "PepSeekr Pro");
}
async function billing(action, plan) {
  if (!SESS) { PENDING_PLAN = plan || "portal"; signInSheet("Sign in first, then you'll go straight to checkout."); return; }
  toast(action === "portal" ? "Opening billing…" : "Opening secure checkout…", 6000);
  try {
    const r = await fetch(`${SB}/functions/v1/pk-billing`, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + SESS.access_token, "Content-Type": "application/json" }, body: JSON.stringify({ action, plan }) });
    const j = await r.json().catch(() => ({}));
    if (j.url) { location.href = j.url; return; }
    toast(j.error === "already_pro" ? "You're already on Pro." : "Checkout isn't available yet. Try again in a bit.", 5000);
  } catch { toast("Couldn't reach checkout. Check your connection and try again.", 5000); }
}
function afterSignIn() { const p = PENDING_PLAN; PENDING_PLAN = null; if (!p) return; if (p === "portal") billing("portal"); else if (!isPro()) billing("checkout", p); }

/* gating helpers used by the views */
const proLock = (reason, label) => `<button class="btn sm lockb" type="button" data-upgrade="${reason}">${I_LOCK}${esc(label)}</button>`;
const I_LOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
function watchAllowed() { return isPro() || Object.values(WATCH).filter(w => w.on).length < FREE_WATCH; }

/* account page */
let EMP = null;
async function loadEmailPrefs() {
  const el = $("#emailPrefs"); if (!el || !SESS) return;
  try { const { data } = await sbc().rpc("pk_email_get"); EMP = data || { alerts: true, digest: true }; } catch { EMP = EMP || { alerts: true, digest: true }; }
  const pro = isPro(), sw = (k, t, s, on, lock) => `<button type="button" class="srow" role="switch" aria-checked="${on}" ${lock ? `data-upgrade="watch"` : `data-eml="${k}"`}><span><b style="font-weight:600">${lock ? I_LOCK : ""}${t}</b><small>${s}</small></span><span class="tog m"><i></i></span></button>`;
  el.innerHTML = `<b>Email</b><p class="hint" style="margin-top:4px">Sent to ${esc(SESS.user.email)}. Every email has a one-click unsubscribe.</p>
    ${sw("alerts", "Watchlist alerts", pro ? "When a watched vial hits your drop %, comes back in stock, or its store runs a sale. At most one email every 3 hours." : "Pro: an email the moment a watched vial hits your drop %.", pro && EMP.alerts, !pro)}
    ${sw("digest", "Weekly summary", "Mondays: the best price on each vial you watch, plus the week's biggest sales.", !!EMP.digest, false)}`;
}
function vAccount() {
  setTimeout(loadEmailPrefs, 0);
  const tag = `<div class="sec" style="margin-top:28px"><div><span class="kick"><span class="lbl">Account</span></span><h1 class="h1" style="margin-top:12px">${SESS ? "Your account" : "Sign in"}</h1></div></div>`;
  if (!window.supabase) return `<div class="wrap">${tag}<div class="card empty"><b>Sign-in didn't load</b><p>Check your connection and refresh the page.</p></div></div>`;
  if (!SESS) return `<div class="wrap">${tag}<div class="acct"><div class="card" style="padding:20px"><p class="t2">Sign in to keep your list, watchlist and filters on every device.</p><div id="authBox" style="margin-top:14px">${authForm()}</div></div>${proCard()}</div></div>`;
  const pro = isPro(), src = ME && ME.source, until = ME && ME.until ? mdy(String(ME.until).slice(0, 10)) : "";
  const plan = pro ? (src === "owner" || (!ME?.pro && ownerKey()) ? "Pro (owner)" : ME?.status === "past_due" ? "Pro · payment due" : ME?.status === "canceled" || ME?.cancel ? `Pro until ${until}` : `Pro${until ? " · renews " + until : ""}`) : "Free";
  return `<div class="wrap">${tag}<div class="acct">
    <div class="card" style="padding:20px;display:grid;gap:14px">
      <div class="r2"><span class="t3">Signed in as</span><b>${esc(SESS.user.email)}</b></div>
      <div class="r2"><span class="t3">Plan</span><b>${esc(plan)}</b></div>
      <div class="r2"><span class="t3">Synced</span><span>${PROT.length} list item${PROT.length === 1 ? "" : "s"} · ${Object.values(WATCH).filter(w => w.on).length} watched</span></div>
      ${ME?.status === "past_due" ? `<p class="warn">Your last payment didn't go through. Update your card to keep Pro.</p>` : ""}
      <div class="row" style="gap:10px;flex-wrap:wrap">${ME?.has_billing ? `<button class="btn" type="button" data-billing>Manage billing</button>` : ""}<button class="btn" type="button" data-signout>Sign out</button></div>
    </div>
    <div class="card" style="padding:20px" id="emailPrefs"><b>Email</b><p class="hint" style="margin-top:4px">Loading your email settings…</p></div>
    ${pro ? `<div class="card" style="padding:20px"><b>Pro is on</b><ul class="perks">${PRO_PERKS.map(([b]) => `<li>${I.check}<span>${esc(b)}</span></li>`).join("")}</ul></div>` : proCard()}
  </div></div>`;
}
const proCard = () => `<div class="card glow" style="padding:20px"><b style="font-size:17px">PepSeekr Pro</b><ul class="perks">${PRO_PERKS.map(([b, t]) => `<li>${I.check}<span><b>${esc(b)}</b> ${esc(t)}</span></li>`).join("")}</ul>
  <div class="plans"><button class="plan" type="button" data-plan="year"><span class="pl">Yearly</span><b>$49</b><span class="hint">save 41%</span></button><button class="plan" type="button" data-plan="month"><span class="pl">Monthly</span><b>$6.99</b><span class="hint">cancel anytime</span></button></div></div>`;
const acctBtn = (cls) => `<a class="${cls}" href="#account" aria-label="${SESS ? "Account" : "Sign in"}">${I_USER}${cls === "btn" ? `<span>${SESS ? (isPro() ? "Pro" : "Account") : "Sign in"}</span>` : ""}</a>`;

/* events */
document.addEventListener("click", e => {
  const t = e.target;
  const up = t.closest("[data-upgrade]"); if (up) { e.preventDefault(); e.stopPropagation(); upgradeSheet(up.dataset.upgrade); return; }
  const pl = t.closest("[data-plan]"); if (pl) { e.preventDefault(); billing("checkout", pl.dataset.plan); return; }
  if (t.closest("[data-billing]")) { e.preventDefault(); billing("portal"); return; }
  if (t.closest("[data-signout]")) { e.preventDefault(); sbc()?.auth.signOut(); toast("Signed out. Your list stays on this device."); return; }
  if (t.closest("[data-authback]")) { e.preventDefault(); AUTH = { step: "email", email: AUTH.email, busy: false, err: "" }; paintAuth(); return; }
}, true);
document.addEventListener("submit", e => {
  if (e.target.id === "emailForm") { e.preventDefault(); const v = $("#authEmail").value.trim(); if (v) sendCode(v); }
  if (e.target.id === "codeForm") { e.preventDefault(); const v = $("#authCode").value.replace(/\D/g, ""); if (v.length >= 6) checkCode(v); else { AUTH.err = `Enter all ${AUTH.len || 6} digits.`; paintAuth(); } }
});
document.addEventListener("input", e => { if (e.target.id === "authCode" && e.target.value.replace(/\D/g, "").length === (AUTH.len || 6) && !AUTH.busy) checkCode(e.target.value.replace(/\D/g, "")); });

/* free users see the lowest-price route; the other routes and options show as locked */
function lockedCtl(R, tabs) {
  return `<div class="rtabs" role="group" aria-label="Route">${tabs.map(([k, t, r]) => k === "low"
      ? `<button class="chip" type="button" aria-pressed="true">${t}${r ? ` <span class="mono">${money2(r.total)}</span>` : ""}</button>`
      : `<button class="chip locked" type="button" data-upgrade="routes" aria-label="${t}, Pro">${I_LOCK}${t}</button>`).join("")}</div>
    <div class="row donly" style="gap:16px;margin-top:10px"><button type="button" class="ck locked" data-upgrade="swaps">${I_LOCK}Allow size swaps</button><button type="button" class="ck locked" data-upgrade="one">${I_LOCK}Buy everything from one seller</button></div>
    <p class="hint" style="margin-top:8px">Free shows the lowest price. <button class="link" type="button" data-upgrade="routes">Pro compares every route and size swap</button>.</p>`;
}
/* ---------- first-party analytics: landings, page views, searches, clicks out to stores ----------
   No cookies, no IPs, no third parties. A random id per browser tab session ties a visit together. */
const TRK = (() => {
  const bot = navigator.webdriver || /bot|crawl|spider|slurp|headless|lighthouse|preview/i.test(navigator.userAgent);
  let sid = ""; try { sid = sessionStorage.getItem("pk_sid") || ""; if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("pk_sid", sid); } } catch { sid = "x" + Math.random().toString(36).slice(2); }
  const q = [], mobile = matchMedia("(max-width:760px)").matches;
  let t = 0;
  const flush = () => { clearTimeout(t); if (!q.length) return; const body = JSON.stringify({ p: q.splice(0, 20) });
    try { fetch(`${SB}/rest/v1/rpc/pk_track`, { method: "POST", keepalive: true, headers: { apikey: KEY, "Content-Type": "application/json" }, body }).catch(() => {}); } catch {} };
  const push = e => { if (bot || ownerKey()) return; q.push(Object.assign({ sid, mobile }, e)); clearTimeout(t); t = setTimeout(flush, e.kind === "out" ? 0 : 2500); };
  addEventListener("pagehide", flush); document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  return { push, flush, sid };
})();
// the page a hash route stands for, written as its real URL so reports read the same as Search Console
function routePath() {
  return location.pathname.replace(/\/+$/, "") || "/";
  const h = (HASH() || "").slice(1).split("?")[0];
  if (!h) return location.pathname;
  if (h.startsWith("p-")) return "/peptides/" + h.slice(2);
  if (h.startsWith("v-") || h.startsWith("s-")) return "/vendors/" + h.slice(2);
  return h === "home" ? "/" : "/" + h;
}
let lastView = "";
function trackView() { const p = routePath(); if (p === lastView) return; lastView = p; TRK.push({ kind: "view", path: p }); }
function trackLand() {
  try { if (sessionStorage.getItem("pk_land")) return; sessionStorage.setItem("pk_land", "1"); } catch {}
  const u = new URL(location.href), g = k => u.searchParams.get(k) || "";
  let ref = ""; try { const r = document.referrer && new URL(document.referrer); if (r && r.hostname !== location.hostname) ref = r.hostname.replace(/^www\./, ""); } catch {}
  TRK.push({ kind: "land", path: routePath(), ref, src: g("utm_source") || g("ref") || g("via"), med: g("utm_medium"), camp: g("utm_campaign") });
  // drop tracking params from the address bar once recorded, so shares stay clean
  if (["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "via", "fbclid", "gclid"].some(k => u.searchParams.has(k))) {
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "ref", "via", "fbclid", "gclid"].forEach(k => u.searchParams.delete(k));
    history.replaceState(history.state, "", u.pathname + (u.search || "") + u.hash);
  }
}
let srchT = 0;
function trackSearch(v) { clearTimeout(srchT); v = (v || "").trim(); if (v.length < 3) return; srchT = setTimeout(() => TRK.push({ kind: "search", q: v, path: routePath() }), 1500); }
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
function vendorByUrl(u) { const h = hostOf(u); return h ? Object.values(V).find(v => hostOf(v.url) === h) : null; }
function ctxOf(el) {
  if (el?.closest?.("#sheet")) return BOARD ? "cart_sheet" : "sheet";
  if (el?.closest?.(".leg,.itin")) return "route";
  if (el?.closest?.(".offers,.ocard,.ocards")) return "offers";
  if (el?.closest?.(".vhero")) return "store_page";
  if (el?.closest?.("#mbuy")) return "buy_bar";
  if (el?.closest?.("#seo")) return "seo";
  const h = (HASH() || "#home").slice(1);
  return h.startsWith("p-") ? "product" : h.startsWith("v-") ? "store_page" : h === "protocol" || h === "list" ? "route" : h || "home";
}
function trackOut(vid, pep, size, ctx) { TRK.push({ kind: "out", vendor: vid, pep: pep || null, size: size || null, ctx, path: routePath() }); }
// Tag store links so stores see PepSeekr in their own analytics. Changes the link only as it's clicked.
function tagOut(u, ctx) { try { const x = new URL(u); if (!x.searchParams.has("utm_source")) { x.searchParams.set("utm_source", "pepseekr"); x.searchParams.set("utm_medium", "referral"); x.searchParams.set("utm_campaign", ctx); } return x.href; } catch { return u; } }
document.addEventListener("click", e => {
  const a = e.target.closest?.("a[href^='http']"); if (!a) return;
  const v = vendorByUrl(a.href); if (!v) return;
  const ctx = ctxOf(a), pv = $("[data-pep]"), cand = ROWS.filter(r => r.v === v.id && r.url && (r.url === a.href || a.href.startsWith(r.url)));
  const row = cand.find(r => r.url === a.href) || cand.find(r => pv && r.pep === pv.dataset.pep && r.size === pv.dataset.size) || (cand.length === 1 ? cand[0] : null);
  trackOut(v.id, row?.pep, row?.size, ctx);
  a.href = tagOut(a.href, ctx);
}, true);
document.addEventListener("auxclick", e => { const a = e.target.closest?.("a[href^='http']"); const v = a && vendorByUrl(a.href); if (v) { trackOut(v.id, null, null, ctxOf(a)); a.href = tagOut(a.href, ctxOf(a)); } }, true);
document.addEventListener("input", e => { if (e.target.id === "nq" || e.target.id === "mq") trackSearch(e.target.value); });

/* ---------- owner report ---------- */
let STATS = null, STATS_DAYS = 30;
async function loadStats() {
  try { const [st, ib] = await Promise.all([rpc("pk_stats", { p_key: ownerKey(), p_days: STATS_DAYS }), rpc("pk_owner_inbox", { p_key: ownerKey() }).catch(() => null)]); STATS = st; STATS.inbox = ib; } catch { STATS = { error: true }; }
  if ((HASH() || "") === "#stats") route(true);
}
function vStats() {
  if (!ownerKey()) return `<div class="wrap"><div class="card empty" style="margin-top:30px"><b>Owner only</b><p>Sign in with the owner key on the Vendors page first.</p><a class="btn" href="#vendors">Vendors</a></div></div>`;
  if (!STATS) { loadStats(); return `<div class="wrap"><p class="hint" style="margin-top:40px">Loading traffic…</p></div>`; }
  if (STATS.error) return `<div class="wrap"><div class="card empty" style="margin-top:30px"><b>Couldn't load traffic</b><p>Check the owner key and try again.</p></div></div>`;
  const S2 = STATS, T = S2.totals || {}, n = x => (+x || 0).toLocaleString();
  const tbl = (head, rows) => rows.length ? `<table class="tbl stt"><thead><tr>${head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table>` : `<p class="hint" style="padding:12px 0">Nothing yet.</p>`;
  const vName = id => esc(V[id]?.name || id);
  const max = Math.max(1, ...(S2.by_day || []).map(d => d.visitors));
  const bars = (S2.by_day || []).map(d => `<div class="sbar" title="${esc(d.d)}: ${d.visitors} visitors, ${d.clicks} store clicks"><i style="height:${Math.round(d.visitors / max * 100)}%"></i><b style="height:${Math.round(d.clicks / max * 100)}%"></b></div>`).join("");
  const card = (title, inner, sub = "") => `<div class="card panel"><div class="bar"><h3>${title}</h3>${sub}</div>${inner}</div>`;
  return `<div class="wrap">${sec("", "Owner", "Traffic and store clicks", `<span class="row" style="gap:6px">${[7, 30, 90].map(d => `<button class="chip sm" type="button" data-statdays="${d}" aria-pressed="${STATS_DAYS === d}">${d} days</button>`).join("")}</span>`)}
    <div class="stgrid">${[["Visitors", T.visitors], ["Page views", T.views], ["Store clicks", T.clicks], ["People who clicked out", T.clickers], ["Searches", T.searches], ["On phones", (T.mobile ?? 0) + "%"]].map(([k, v]) => `<div class="card stk"><span class="lbl">${k}</span><b class="mono">${typeof v === "string" ? v : n(v)}</b></div>`).join("")}</div>
    ${bars ? `<div class="card panel" style="margin-top:16px"><div class="bar"><h3>By day</h3><span class="hint"><i class="sw v"></i>visitors <i class="sw c"></i>store clicks</span></div><div class="sbars">${bars}</div></div>` : ""}
    <div class="stcols" style="margin-top:16px">
      ${card("Clicks to each store", tbl(["Store", "Clicks", "People", "Last click"], (S2.vendors || []).map(r => `<tr><td><a href="#v-${esc(r.vendor)}">${vName(r.vendor)}</a></td><td class="mono">${n(r.clicks)}</td><td class="mono">${n(r.people)}</td><td class="t3">${esc(ago(r.last))}</td></tr>`)))}
      ${card("Most-clicked vials", tbl(["Vial", "Store", "Clicks"], (S2.vendor_items || []).slice(0, 25).map(r => `<tr><td>${esc(short(r.pep))} ${esc(sizeTxt(r.size || ""))}</td><td>${vName(r.vendor)}</td><td class="mono">${n(r.clicks)}</td></tr>`)))}
      ${card("Where visitors come from", tbl(["Source", "Visitors"], (S2.sources || []).map(r => `<tr><td>${esc(r.source)}</td><td class="mono">${n(r.visits)}</td></tr>`)), `<span class="hint">Tag your own links: ?utm_source=facebook&amp;utm_campaign=name</span>`)}
      ${card("Campaigns", tbl(["Source", "Medium", "Campaign", "Visitors"], (S2.campaigns || []).map(r => `<tr><td>${esc(r.src || "")}</td><td>${esc(r.med || "")}</td><td>${esc(r.camp)}</td><td class="mono">${n(r.visits)}</td></tr>`)))}
      ${card("Landing pages", tbl(["Page", "Visitors"], (S2.landing || []).map(r => `<tr><td>${esc(r.path)}</td><td class="mono">${n(r.visits)}</td></tr>`)))}
      ${card("Where store clicks happen", tbl(["Place", "Clicks"], (S2.placements || []).map(r => `<tr><td>${esc(r.ctx.replace(/_/g, " "))}</td><td class="mono">${n(r.clicks)}</td></tr>`)))}
      ${card("Top pages", tbl(["Page", "Views"], (S2.pages || []).slice(0, 25).map(r => `<tr><td>${esc(r.path)}</td><td class="mono">${n(r.views)}</td></tr>`)))}
      ${card("What people search for", tbl(["Search", "Times"], (S2.searches || []).slice(0, 25).map(r => `<tr><td>${esc(r.q)}</td><td class="mono">${n(r.n)}</td></tr>`)))}
    </div>
    ${S2.inbox ? `<div class="card panel" style="margin-top:16px"><div class="bar"><h3>Messages</h3><span class="hint">${n(S2.inbox.subscribers)} on the weekly email list</span></div>${(S2.inbox.messages || []).length ? (S2.inbox.messages || []).slice(0, 40).map(m => `<div class="msg"><div class="row" style="gap:8px;flex-wrap:wrap"><span class="pill p-n">${esc(m.kind || "message")}</span><b>${esc(m.subject || "(no subject)")}</b><span class="t3" style="font-size:12.5px">${esc(ago(m.at))}${m.email ? ` · <a href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ""}${m.page ? ` · about ${esc(V[m.page]?.name || m.page)}` : ""}</span></div><p style="margin:6px 0 0;white-space:pre-wrap">${esc(m.body)}</p></div>`).join("") : `<p class="hint" style="padding:12px 0">No messages yet. They come from pepseekr.com/contact and the "Report a correction" links.</p>`}</div>` : ""}
    <p class="hint" style="margin:14px 0 40px">Your own visits aren't counted while the owner key is on this browser. Bots and crawlers are skipped. No cookies or IP addresses are stored.</p></div>`;
}
document.addEventListener("click", e => { const b = e.target.closest?.("[data-statdays]"); if (b) { STATS_DAYS = +b.dataset.statdays; STATS = null; route(true); } });

function reviewItem(r, withVendor) {
  const v = V[r.v];
  return `<div class="rv"><div class="who"><b>${esc(r.name)}</b><span class="pill p-brand">Verified buyer</span><span class="t3">${r.at ? new Date(r.at).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}</span></div>
    <div class="row" style="gap:8px;margin-top:4px">${stars(r.stars)}${withVendor && v ? `<span class="hint">bought from <a class="link" href="#v-${esc(r.v)}">${esc(v.name)}</a></span>` : r.pep ? `<span class="hint">bought ${esc(r.pep)}</span>` : ""}</div>
    ${r.body ? `<p>${esc(r.body)}</p>` : ""}${r.tags?.length ? `<div class="tags">${r.tags.map(t => `<span class="pill ${TAGS_NEG.includes(t) ? "p-n" : "p-brand"}">${esc(t)}</span>`).join("")}</div>` : ""}</div>`;
}

/* ---------- theme ---------- */
function setTheme(t) {
  const root = document.documentElement; root.classList.add("theming");
  if (t === "system") { delete root.dataset.theme; try { localStorage.removeItem("pepseekr-theme"); } catch {} }
  else { root.dataset.theme = t; try { localStorage.setItem("pepseekr-theme", t); } catch {} }
  resolveTheme(); setTimeout(() => root.classList.remove("theming"), 260); route(true);
}
function resolveTheme() {
  const root = document.documentElement, r = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.resolved = r; $$('meta[name="theme-color"]').forEach(m => m.content = r === "dark" ? "#070B14" : "#EEF4FF");
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (!document.documentElement.dataset.theme) { resolveTheme(); route(true); } });

/* ---------- sheet ---------- */
let lastFocus = null;
function openSheet(html, label) {
  lastFocus = document.activeElement; const sh = $("#sheet");
  if (html) sh.innerHTML = `<div class="grab" aria-hidden="true"></div>` + html;
  if (label) sh.setAttribute("aria-label", label);
  sh.classList.add("open"); $("#scrim").classList.add("open"); document.body.style.overflow = "hidden";
  setTimeout(() => sh.querySelector("input,button:not([data-close]),select,textarea")?.focus({ preventScroll: true }), 60);
}
function closeSheet() {
  const sh = $("#sheet"); if (!sh.classList.contains("open")) return;
  const hadPct = !!sh.querySelector(".pctc"); if (hadPct) { clearTimeout(window.__pctT); saveW(); setTimeout(() => route(true), 0); }
  sh.classList.remove("open"); sh.style.transform = ""; $("#scrim").classList.remove("open"); document.body.style.overflow = ""; RW = null;
  lastFocus?.focus?.({ preventScroll: true });
}
(function dragToDismiss() {
  let y0 = null, t0 = 0, dy = 0; const sh = () => $("#sheet");
  addEventListener("pointerdown", e => { if (!isM() || !e.target.closest("#sheet") || (sh().scrollTop > 0 && !e.target.closest(".grab"))) return; if (!e.target.closest(".grab,.shd")) return; y0 = e.clientY; t0 = Date.now(); dy = 0; sh().classList.add("drag"); });
  addEventListener("pointermove", e => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); sh().style.transform = `translateY(${dy}px)`; });
  addEventListener("pointerup", () => { if (y0 === null) return; const v = dy / Math.max(1, Date.now() - t0); sh().classList.remove("drag"); if (dy > sh().offsetHeight * .3 || v > .6) closeSheet(); else sh().style.transform = ""; y0 = null; });
})();
function toast(m, ms = 3200) { const t = $("#toast"); t.textContent = m; t.style.display = "block"; clearTimeout(toast.t); toast.t = setTimeout(() => t.style.display = "none", ms); }

/* ---------- watch & protocol helpers ---------- */
function toggleWatch(p, s) {
  const k = p + "|" + s, w = WATCH[k];
  if (w?.on) { delete WATCH[k]; toast(`Stopped watching ${short(p)} ${sizeTxt(s)}`); }
  else if (!watchAllowed()) { upgradeSheet("watch"); return; }
  else { WATCH[k] = Object.assign({ target: null, drop: true, restock: true, sale: true }, w || {}, { on: true }); toast(`Watching ${short(p)} ${sizeTxt(s)}. We'll alert you on sales and drops.`); }
  saveW(); route(true);
  if (WATCH[k]?.on && !store.get("pf_push_nudged", false) && ["off", "needs-install"].includes(pushState())) { store.set("pf_push_nudged", true); setTimeout(() => { $("#toast").style.display = "none"; } , 590); setTimeout(() => openSheet(`<div class="shd"><h2>Get told when it drops</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div>${pushCard(false)}<p class="hint" style="margin-top:12px">${SESS ? "Email alerts are on your account page." : "Or sign in to get a weekly email with the best price on each vial you watch."}</p>`, "Alerts"), 600); }
}
let syncT = 0;
function syncPush() { if (pushState() !== "on") return; clearTimeout(syncT); syncT = setTimeout(() => syncSub().catch(() => {}), 800); }

/* ---------- search suggestions ---------- */
let sIdx = -1;
function suggest(q) {
  const el = $("#sugg"); if (!el) return; q = q.trim().toLowerCase();
  if (!q) { el.classList.remove("open"); return; }
  const ps = PEPS.filter(p => p.toLowerCase().includes(q) || short(p).toLowerCase().includes(q)).slice(0, 6), vs = Object.values(V).filter(v => v.name.toLowerCase().includes(q) || tieHit(v, q)).slice(0, 4);
  el.innerHTML = ps.map(p => { const b = bestOf(live().filter(r => r.pep === p)); return `<a href="#p-${slugOf(p)}" role="option"><span class="vw">${vial(p, b?.size || "", 34)}</span><span>${esc(p)}<span class="hint" style="display:block">${esc(catOf(p))}</span></span><span class="r">${b ? "from " + money2(dealUnit(b)) + (promoOf(V[b.v]) ? " with deal" : "") : ""}</span></a>`; }).join("") + vs.map(v => `<a href="#v-${esc(v.id)}" role="option"><span class="vw">${avatar(v)}</span><span>${esc(v.name)}<span class="hint" style="display:block">${tieHit(v, q) ? `${v.tie_kind === "owner" ? "Owned by" : "Promoted by"} ${esc(tieHit(v, q))}` : `Vendor · score ${v.score}`}</span></span></a>`).join("") || `<p class="hint" style="padding:10px">Nothing matches “${esc(q)}”.</p>`;
  el.classList.add("open"); sIdx = -1; el.parentElement.setAttribute("aria-expanded", "true");
}
function refreshGrid() {
  if ($("#vmatch")) $("#vmatch").innerHTML = vMatch();
  const r = catalogGrid(HASH() === "#search" ? 0 : 24); if ($("#pgrid")) { $("#pgrid").innerHTML = r.html; $("#catmeta").textContent = `${r.n} peptides · ${r.offers} offers`; }
  $$("[data-cat]").forEach(b => b.tagName === "BUTTON" && b.setAttribute("aria-pressed", b.dataset.cat === S.cat));
}

/* ---------- router ---------- */
let lastRoute = "";
function linkAdd() {
  // PepKeep link: #list?add=Name size*qty;...  (also ?add= in the query). Names and vial sizes only, never doses or who it's for.
  const hm = (HASH() || "").match(/^#list\?(.*)$/), q = new URLSearchParams(hm ? hm[1] : location.search), raw = q.get("add");
  if (raw == null) return;
  const from = (q.get("from") || "").toLowerCase();
  const items = []; raw.split(";").slice(0, 40).forEach(t => { const m = t.match(/^(.*?)\s*\*\s*(\d{1,3})\s*$/), qty = m ? Math.max(1, Math.min(99, +m[2])) : 1; const f = parseList(m ? m[1] : t)[0]; if (f) { const x = items.find(i => i.pep === f.pep && i.size === f.size); x ? x.qty += qty : items.push({ ...f, qty }); } });
  history.replaceState(null, "", "/list");
  if (!items.length) { toast("We couldn't match anything in that list"); return; }
  if (from === "pepkeep") PROT = [];
  items.forEach(i => { const x = PROT.find(p => p.pep === i.pep && i.size === p.size); x ? x.qty = i.qty : PROT.push(i); WATCH[i.pep + "|" + i.size] ??= { target: null, on: true, drop: true, restock: true, sale: true }; });
  saveP(); store.set("pf_watch", WATCH);
  toast(`${from === "pepkeep" ? "Your PepKeep stack: " : "Added "}${items.length} item${items.length === 1 ? "" : "s"}`, 4000);
}
// Sends what the shown route actually buys: a size swap goes as the vials bought (2 × 5mg), not the size on the list.
const pkLink = () => {
  const items = CUR ? CUR.assign.map(a => ({ pep: a.item.pep, size: a.offer.swap ? a.offer.row.size : a.item.size, qty: (a.offer.swap ? a.offer.n : 1) * (a.item.qty || 1) })) : PROT;
  return "https://pepkeep.io/?box=" + encodeURIComponent(items.slice(0, 30).map(i => `${i.pep}~${String(i.size).replace(/\s+/g, "")}*${Math.min(99, i.qty || 1)}`).join(";")) + "&s=pepseekr";
};
function route(keepScroll) {
  if (!D) return;
  linkAdd();
  const hq = new URLSearchParams((HASH().split("?")[1]) || "");
  let h = (HASH() || "").slice(1).split("?")[0] || (document.getElementById("seo")?.dataset.route === "doc" ? "doc" : "home");
  if (h.startsWith("s-")) h = "v-" + h.slice(2);
  if (h === "sellers") h = "vendors";
  if (h === "list") h = "protocol";   // "My list" page; #protocol kept for old links
  if (h === "alerts" || h === "watchlist") { if (lastRoute !== "alerts" && lastRoute !== "watchlist") openedAt = seenAlerts(); }
  const y = scrollY; closeDD();
  chrome();
  if (h.startsWith("p-") && !keepScroll) {
    const pep = PEPS.find(x => slugOf(x) === h.slice(2));
    if (pep && hq.get("s")) curSize[pep] = hq.get("s");
    FOCUS_V = hq.get("v") || null;
  } else if (!h.startsWith("p-")) FOCUS_V = null;
  const view = h.startsWith("p-") ? vProduct(h.slice(2)) : h.startsWith("v-") ? vVendor(h.slice(2)) : h === "vendors" || h === "seller-log" ? vVendors() : h === "coa" ? vCoa() : h === "protocol" ? vProtocol() : h === "alerts" ? vAlerts("alerts") : h === "watchlist" ? vAlerts("watchlist") : h === "search" ? vSearch() : h === "account" ? vAccount() : h === "stats" ? vStats() : h === "sales" ? vSales() : h === "doc" ? vDoc() : vHome();
  $("#view").innerHTML = view;
  document.body.classList.toggle("buybar", h.startsWith("p-") && !!$("[data-pep]"));
  if (h.startsWith("p-")) buyBar();
  paintFresh();
  { const on = $(".sizes.monly [aria-checked=true]"); if (on) on.parentElement.scrollLeft = on.offsetLeft - (on.parentElement.clientWidth - on.offsetWidth) / 2; }
  if (keepScroll && lastRoute === h) scrollTo(0, y); else if (h === "catalog") $("#catalog")?.scrollIntoView(); else if (h === "seller-log") $("#slog")?.scrollIntoView(); else scrollTo(0, 0);
  lastRoute = h;
  // The server-rendered SEO block belongs to the URL's own page; hide it once the app moves elsewhere,
  // and move the address back to "/" so a shared link doesn't pair one page's path with another's view.
  const seo = $("#seo"), own = seo && (seo.dataset.route === h || (seo.dataset.route === "home" && h === "home"));
  if (seo) seo.hidden = !own;
  trackView();
  const pv = $("[data-pep]");
  if (pv) drawChart(pv.dataset.pep, pv.dataset.size);
  if (pv && FOCUS_V && !keepScroll) setTimeout(() => { const el = [...document.querySelectorAll("[data-ov].focus")].find(e => e.offsetParent); el?.scrollIntoView({ block: "center", behavior: "smooth" }); }, 120);
  if (own) {} else
  if (pv) { document.title = `${pv.dataset.pep} prices by vendor | PepSeekr`; }
  else if (h.startsWith("v-") && V[h.slice(2)]) document.title = `${V[h.slice(2)].name}: score, prices, reviews | PepSeekr`;
  else document.title = { vendors: "Vendors", coa: "COA library", list: "My list", alerts: "Alerts", watchlist: "Watchlist", search: "Search" }[h] ? { vendors: "Vendors", coa: "COA library", list: "My list", alerts: "Alerts", watchlist: "Watchlist", search: "Search" }[h] + " | PepSeekr" : "PepSeekr: the peptide price index";
  if (h === "vendors" || h === "seller-log") { loadLog(); if (ownerKey()) renderOwner(); }
  if (h === "watchlist") sparks();
  if (h === "alerts" || h === "watchlist") { store.set("pf_seen_alerts", ALERTS.length ? Math.max(Date.parse(ALERTS[0].at), seenAlerts()) : Date.now()); }
  if (h === "search" && focusQ) { focusQ = false; $("#mq")?.focus(); }
}
let focusQ = false;
function buyBar() {
  const pv = $("[data-pep]"); if (!pv) return;
  const p = pv.dataset.pep, s = pv.dataset.size, list = vis(live().filter(r => r.pep === p && r.size === s)), b = bestPrice(list) || bestPrice(live().filter(r => r.pep === p && r.size === s));
  $("#mbuy").innerHTML = b ? `<button class="mib" type="button" data-watch="${esc(p)}" data-size="${esc(s)}" aria-pressed="${isW(p, s)}" aria-label="${isW(p, s) ? "Stop watching" : "Watch"}" style="color:${isW(p, s) ? "var(--brand)" : "inherit"}">${I.star}</button><div class="bp"><span class="lbl">Best price${promoOf(V[b.v]) ? " with deal" : ""}</span><b>${money2(dealUnit(b))}</b><span>${esc(V[b.v].name)}</span></div><a class="btn p" href="${esc(b.url || V[b.v].url)}" target="_blank" rel="noopener">Buy ${I.chev}</a>` : "";
}
function closeDD() { $("#dd")?.classList.remove("open"); $("#bell")?.setAttribute("aria-expanded", "false"); }

/* ---------- events ---------- */
document.addEventListener("click", async e => {
  const t = e.target;
  if (!t.closest(".nsearch")) $("#sugg")?.classList.remove("open");
  if (t.closest("#bell")) { const dd = $("#dd"), open = !dd.classList.contains("open"); if (open) { bellDD(); dd.classList.add("open"); $("#bell").setAttribute("aria-expanded", "true"); } else closeDD(); return; }
  if (!t.closest(".bellwrap")) closeDD();
  if (t.closest('a[href="#search"]')) focusQ = true;
  const th = t.closest("[data-theme-set]"); if (th) { setTheme(th.dataset.themeSet); return; }
  if (t.closest("[data-back]")) { if (NAVS > 0) { NAVS--; history.back(); } else go("/", true); return; }
  const wt = t.closest("[data-watch]"); if (wt) { e.preventDefault(); toggleWatch(wt.dataset.watch, wt.dataset.size); return; }
  const cat = t.closest("[data-cat]"); if (cat) {
    S.cat = cat.dataset.cat;
    if (cat.tagName === "A") { if (HASH() === "#home" || !HASH()) { e.preventDefault(); refreshGrid(); $("#catalog")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth" }); } return; }
    if (HASH() === "#home" || HASH() === "#search" || !HASH()) { if (isM() && (HASH() || "#home") === "#home" && !$("#sheet").classList.contains("open")) { go("#search"); return; } refreshGrid(); }
    return;
  }
  const fl = t.closest("[data-filt]"); if (fl) { S[fl.dataset.filt] = !S[fl.dataset.filt]; saveS(); $$(`[data-filt="${fl.dataset.filt}"]`).forEach(x => x.setAttribute("aria-checked", S[fl.dataset.filt])); if ($("#sheet").classList.contains("open")) { const b = $("#sheet .sfoot .btn.p"); if (b) b.textContent = `Show ${vis().length} offers`; refreshGrid(); } else route(true); return; }
  if (t.closest("[data-clearf]")) { Object.assign(S, { rep: false, stock: false, coa: false, fill: false, ship: false, vendor: "", cat: "All", q: "" }); saveS(); if ($("#sheet").classList.contains("open")) filterSheet(); route(true); return; }
  const so = t.closest("[data-sortopt]"); if (so) { S.sort = so.dataset.sortopt; saveS(); $$("[data-sortopt]").forEach(x => x.setAttribute("aria-checked", x === so)); refreshGrid(); return; }
  if (t.closest("[data-filters]")) { filterSheet(); return; }
  if (t.closest("[data-stores]")) { storesSheet(); return; }
  if (t.closest("[data-close]") || t.id === "scrim") { if (BOARD?.timer) { clearTimeout(BOARD.timer); BOARD.timer = null; } closeSheet(); route(true); return; }
  const hd = t.closest("[data-hide]"); if (hd) { const id = hd.dataset.hide; HIDE.has(id) ? HIDE.delete(id) : HIDE.add(id); store.set("pf_hidden", [...HIDE]); hd.setAttribute("aria-checked", !HIDE.has(id)); if (!$("#sheet").classList.contains("open")) route(true); return; }
  const sz = t.closest("[data-sz]"); if (sz) { curSize[$("[data-pep]").dataset.pep] = sz.dataset.sz; route(true); return; }
  const fo = t.closest("[data-follow]"); if (fo) { const id = fo.dataset.follow; FOLLOW.has(id) ? FOLLOW.delete(id) : FOLLOW.add(id); store.set("pf_follow", [...FOLLOW]); toast(FOLLOW.has(id) ? `You'll see ${V[id].name}'s sales in Alerts` : `Stopped following ${V[id].name}`); route(true); return; }
  const vr = t.closest("[data-vrf]"); if (vr) { vrf = vr.dataset.vrf; route(true); return; }
  const cv = t.closest("[data-coav]"); if (cv) { coaV = cv.dataset.coav; route(true); return; }
  const po = t.closest("[data-pctopen]"); if (po) { const k = po.dataset.pctopen, [p, sz] = k.split("|"), w = WATCH[k] || {};
    openSheet(`<div class="shd"><h2>${esc(short(p))} ${esc(sizeTxt(sz))}</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div>
      <div style="margin-top:14px">${pctCtl(k)}</div>
      <div class="lbl" style="margin:16px 0 6px">Or alert at a price</div><div class="row" style="gap:8px"><label class="pin">$<input inputmode="decimal" value="${w.target ?? ""}" placeholder="optional" data-tgt="${esc(k)}" aria-label="Target price"></label>${w.target ? `<button class="link" type="button" data-tgtclear="${esc(k)}">Clear</button>` : ""}</div>
      <button class="btn p" type="button" data-close style="width:100%;margin-top:18px">Done</button>`, "Price alert"); return; }
  const pr = t.closest("[data-pctreset]"); if (pr) { const k = pr.dataset.pctreset; if (WATCH[k]) { delete WATCH[k].pct; saveW(); } const c = t.closest(".pctc"); if (c) c.outerHTML = pctCtl(k); if (!$("#sheet.open")) route(true); return; }
  const tc = t.closest("[data-tgtclear]"); if (tc) { const k = tc.dataset.tgtclear; if (WATCH[k]) { WATCH[k].target = null; saveW(); } const i = $(`[data-tgt="${CSS.escape(k)}"]`); if (i) i.value = ""; tc.remove(); return; }
  if (t.closest("[data-settarget]")) { const pv = $("[data-pep]"), k = pv.dataset.pep + "|" + pv.dataset.size, v = parseFloat($("#tgt").value); WATCH[k] = Object.assign({ drop: true, restock: true, sale: true }, WATCH[k] || {}, { on: true, target: isFinite(v) && v > 0 ? v : null }); saveW(); toast(isFinite(v) && v > 0 ? `We'll alert you when ${short(pv.dataset.pep)} ${sizeTxt(pv.dataset.size)} drops below ${money2(v)}` : "Watching for sales and drops"); route(true); return; }
  const wk = t.closest("[data-wk]"); if (wk) { const pv = $("[data-pep]"), k = pv.dataset.pep + "|" + pv.dataset.size; WATCH[k] = Object.assign({ target: null, on: true, drop: true, restock: true, sale: true }, WATCH[k] || {}); WATCH[k][wk.dataset.wk] = !(WATCH[k][wk.dataset.wk] !== false); wk.setAttribute("aria-checked", WATCH[k][wk.dataset.wk]); saveW(); return; }
  const em = t.closest("[data-eml]"); if (em && EMP) { const k = em.dataset.eml; EMP[k] = !EMP[k]; em.setAttribute("aria-checked", EMP[k]); sbc().rpc("pk_email_set", { p_alerts: k === "alerts" ? EMP.alerts : null, p_digest: k === "digest" ? EMP.digest : null }).then(({ error }) => { if (error) { EMP[k] = !EMP[k]; em.setAttribute("aria-checked", EMP[k]); toast("Couldn't save that. Try again."); } else toast(EMP[k] ? "Turned on" : "Turned off"); }); return; }
  const wrm = t.closest("[data-wrm]"); if (wrm) { const k = wrm.dataset.wrm, [p, s] = k.split("|"); delete WATCH[k]; saveW(); route(true); toast(`Removed ${short(p)} ${sizeTxt(s)} from your watchlist`); return; }
  const aa = t.closest("[data-aall]"); if (aa) { store.set("pf_aall", aa.dataset.aall === "1"); route(true); return; }
  const np = t.closest("[data-npref]"); if (np) { const k = "pf_n_" + np.dataset.npref, v = !store.get(k, true); store.set(k, v); np.setAttribute("aria-checked", v); return; }
  if (t.closest("[data-markread]")) { store.set("pf_seen_alerts", Date.now()); openedAt = Date.now(); closeDD(); route(true); return; }
  const af = t.closest("[data-afilt]"); if (af) { afilt = af.dataset.afilt; route(true); return; }
  const as = t.closest("[data-aseg]"); if (as) { go("#" + as.dataset.aseg); return; }
  // protocol
  const im = t.closest("[data-imp]"); if (im) { if (im.tagName === "A") { if (im.dataset.imp === "paste") setTimeout(pasteSheet, 50); else setTimeout(() => $("#pdfIn")?.click(), 120); return; } e.preventDefault(); pasteSheet(); return; }
  if (t.closest("[data-pastego]")) { const f = parseList($("#pasteTxt").value); if (!f.length) { $("#pastePrev").textContent = "We didn't recognize any compounds. Check the spelling, one per line."; return; } const n = addItems(f); closeSheet(); if (HASH() !== "#list") go("#list"); else route(); toast(`Added ${n} item${n === 1 ? "" : "s"} to your list`); return; }
  const ai = t.closest("[data-additem]"); if (ai) { addSheet(ai.dataset.additem); return; }
  const ap = t.closest("[data-addpick]"); if (ap) { const [p, s] = ap.dataset.addpick.split("|"); if (ap.dataset.mode === "watch") { WATCH[p + "|" + s] = { target: null, on: true, drop: true, restock: true, sale: true }; saveW(); toast(`Watching ${short(p)} ${sizeTxt(s)}`); } else { addItems([{ pep: p, size: s, qty: 1 }]); toast(`Added ${short(p)} ${sizeTxt(s)}`); } closeSheet(); route(true); return; }
  const al2 = t.closest("[data-addlist]"); if (al2) { const [p, s] = al2.dataset.addlist.split("|"); if (PROT.some(i => i.pep === p && i.size === s)) { PROT = PROT.filter(i => !(i.pep === p && i.size === s)); saveP(); toast(`Removed ${short(p)} from your list`); } else { addItems([{ pep: p, size: s, qty: 1 }]); toast(`Added ${short(p)} ${sizeTxt(s)}. See the cheapest cart in Protocol.`); } route(true); return; }
  if (t.closest("[data-one]")) { S.one = !S.one; S.open = null; saveS(); route(true); return; }
  if (t.closest("[data-checklist]")) { checklistSheet(); return; }
  const ck2 = t.closest("[data-chk]"); if (ck2) { const k = ck2.dataset.chk; CHK.has(k) ? CHK.delete(k) : CHK.set(k, 1); const on = CHK.has(k); ck2.setAttribute("aria-pressed", on); ck2.textContent = (on ? "✓ " : "") + sizeTxt(k.split("|")[1]); $("#chkGo").textContent = chkLabel(); return; }
  if (t.closest("[data-chkgo]")) { if (!CHK.size) return; const had = new Set(PROT.map(i => i.pep + "|" + i.size)); PROT = [...CHK.entries()].map(([k, q]) => { const [pep, size] = k.split("|"); return { pep, size, qty: q }; }); saveP(); autoWatch(PROT.filter(i => !had.has(i.pep + "|" + i.size))); closeSheet(); if (HASH() !== "#list") go("#list"); else route(); return; }
  const bd = t.closest("[data-board]"); if (bd) { boardSheet(bd.dataset.board); return; }
  if (t.closest("[data-boardgo]")) { boardGo(); return; }
  if (t.closest("[data-boardopen]")) { boardOpen(); return; }
  const vt = t.closest("[data-vtie]"); if (vt) { S.vtie = !!vt.dataset.vtie; route(true); return; }
  if (t.closest("[data-showall]")) { S.stock = false; S.coa = false; S.rep = false; S.fill = false; S.vendor = ""; saveS(); route(true); return; }
  if (t.closest("[data-chkmore]")) { S.chkMore = true; const r = document.getElementById("chkRes"); if (r) r.innerHTML = chkRes(""); return; }
  const st = t.closest("[data-strat]"); if (st) { S.tab = st.dataset.strat; S.open = null; route(true); return; }
  if (t.closest("[data-swaps]")) { S.swaps = S.swaps === false; S.open = null; saveS(); route(true); return; }
  const it = t.closest("[data-itin]"); if (it) { const [k, m] = it.dataset.itin.split("|"); const cur = document.querySelector(".itin[aria-expanded=true] [data-itin]"); if (cur === it) return; S.open = k; S.openMode = m; route(true); return; }
  const q = t.closest("[data-qty]"); if (q) { const [p, s, d] = q.dataset.qty.split("|"); const it = PROT.find(i => i.pep === p && i.size === s); it.qty = Math.max(1, Math.min(20, it.qty + +d)); saveP(); route(true); return; }
  const rm = t.closest("[data-rm]"); if (rm) { const [p, s] = rm.dataset.rm.split("|"); if (isW(p, s)) { openSheet(`<div class="shd"><h2>Remove ${esc(short(p))} ${esc(sizeTxt(s))}?</h2><button class="mib ib" style="border:0" type="button" data-close aria-label="Close">${I.x}</button></div><p class="hint">It's also on your watchlist. Keep getting price alerts for it?</p><div class="sfoot"><button class="btn" type="button" data-rmgo="${esc(p)}|${esc(s)}|0">Keep watching</button><button class="btn p" type="button" data-rmgo="${esc(p)}|${esc(s)}|1">Stop watching too</button></div>`, "Remove item"); return; } PROT = PROT.filter(i => !(i.pep === p && i.size === s)); saveP(); toast(`Removed ${short(p)} ${sizeTxt(s)}`); route(true); return; }
  const rg = t.closest("[data-rmgo]"); if (rg) { const [p, s, also] = rg.dataset.rmgo.split("|"); PROT = PROT.filter(i => !(i.pep === p && i.size === s)); saveP(); if (also === "1") { delete WATCH[p + "|" + s]; saveW(); } closeSheet(); route(true); toast(also === "1" ? `Removed ${short(p)} ${sizeTxt(s)} and stopped watching it` : `Removed ${short(p)} ${sizeTxt(s)}. Still on your watchlist`); return; }
  const aw = t.closest("[data-autow]"); if (aw) { const v = !AUTOW(); store.set("pf_autowatch", v); $$("[data-autow]").forEach(b => b.setAttribute("aria-checked", v)); return; }
  const wa = t.closest("[data-watchall]"); if (wa) { const r = watchItems(PROT); route(true); if (r.cap) upgradeSheet("watch"); else toast(`Watching ${r.n} more vial${r.n === 1 ? "" : "s"} from your protocol`); return; }
  const sw = t.closest("[data-swap]"); if (sw) { const [p, s] = sw.dataset.swap.split("|"); swapSheet(p, s); return; }
  const ss = t.closest("[data-setsize]"); if (ss) { const [p, s, n] = ss.dataset.setsize.split("|"); const it = PROT.find(i => i.pep === p && i.size === s); if (it && !PROT.some(i => i.pep === p && i.size === n && i !== it)) { it.size = n; saveP(); } closeSheet(); route(true); return; }
  // suggest-a-seller kind
  const kd = t.closest("[data-kind]"); if (kd) { $$("[data-kind]").forEach(x => x.setAttribute("aria-checked", x === kd)); return; }
  // review flow
  const rv = t.closest("[data-review]"); if (rv) { openReview(rv.dataset.review); return; }
  const rwv = t.closest("[data-rwv]"); if (rwv) { RW.vendor = rwv.dataset.rwv; RW.step = 1; renderReview(); return; }
  const rws = t.closest("[data-rws]"); if (rws) { rwCapture(); RW.stars = +rws.dataset.rws; renderReview(); return; }
  const rwt = t.closest("[data-rwt]"); if (rwt) { rwCapture(); const tg = rwt.dataset.rwt; RW.tags = RW.tags.includes(tg) ? RW.tags.filter(x => x !== tg) : [...RW.tags, tg]; rwt.setAttribute("aria-pressed", RW.tags.includes(tg)); return; }
  const rw = t.closest("[data-rw]"); if (rw) {
    const a = rw.dataset.rw; rwCapture(); RW.err = "";
    if (a === "close") { closeSheet(); return; }
    if (a === "back") { RW.step--; renderReview(); return; }
    if (a === "next") { if (RW.step === 2) { if (!RW.file) { RW.err = "Add a photo or screenshot of your receipt."; renderReview(); return; } if (RW.order.trim().length < 3) { RW.err = "Add the order number from your receipt."; renderReview(); return; } } RW.step++; renderReview(); return; }
    if (a === "submit") { rwSubmit(); return; }
  }
  // owner
  const md = t.closest("[data-mod]"); if (md) { md.disabled = true; try { await fnPost({ action: md.dataset.mod, key: ownerKey(), id: +md.dataset.id }); toast(md.dataset.mod === "approve" ? "Review posted" : "Review rejected"); await loadReviews(); score(); renderOwner(); } catch (err) { toast(err.message); md.disabled = false; } return; }
  const sw2 = t.closest("[data-store]"); if (sw2) { const on = sw2.dataset.on !== "1", name = sw2.dataset.name; try { await rpc("pf_admin", { p_key: ownerKey(), p_action: on ? "on" : "off", p_id: sw2.dataset.store }); sw2.dataset.on = on ? "1" : "0"; sw2.setAttribute("aria-checked", on); if (on) { toast(`Checking ${name}'s prices. This takes about a minute.`, 5000); watchStore(sw2.dataset.store, name); } else { toast(`${name} hidden`); await load(); renderOwner(); } } catch (err) { toast("Couldn't update: " + err.message); } return; }
  const rc = t.closest("[data-recheck]"); if (rc) { const s2 = rc.dataset.recheck; rc.disabled = true; rc.textContent = "Checking…"; try { await rpc("pf_admin", { p_key: ownerKey(), p_action: "on", p_id: s2 }); watchStore(s2, V[s2]?.name || s2); } catch (err) { toast(err.message); } return; }
  if (t.closest("#pushOn")) { pushOn(); return; }
  if (t.closest("#pushOff")) { pushOff(); return; }
  if (t.closest("#testPush")) { testPush(); return; }
  if (t.closest("#adminGo")) { const k = $("#adminKey").value.trim(); try { await rpc("pf_admin", { p_key: k, p_action: "check", p_id: "-" }); store.set("pf_admin", k); toast("Owner tools unlocked"); route(true); } catch { toast("That key didn't work"); } return; }
  if (t.closest("#adminOut")) { store.set("pf_admin", ""); store.set("vs_admin", ""); route(true); return; }
});
document.addEventListener("change", async e => {
  const t = e.target;
  if (t.id === "vsel") { S.vendor = t.value; route(true); }
  if (t.id === "sortSel") { S.sort = t.value; saveS(); refreshGrid(); }
  if (t.id === "pdfIn" && t.files[0]) importPdf(t.files[0]);
  if (t.dataset.tgt) { const v = parseFloat(t.value); WATCH[t.dataset.tgt].target = isFinite(v) && v > 0 ? v : null; saveW(); route(true); }
  if (t.id === "rwFile" && RW) { const f0 = t.files[0]; if (!f0) return; rwCapture(); RW.file = await shrink(f0); RW.preview = /^image\/(jpeg|png|webp|gif)$/.test(RW.file.type) ? URL.createObjectURL(RW.file) : ""; RW.err = ""; renderReview(); }
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "nq") { S.q = t.value; suggest(t.value); if ((HASH() || "#home") === "#home" || HASH() === "#search") refreshGrid(); }
  if (t.id === "mq") { S.q = t.value; if (HASH() !== "#search") { focusQ = true; go("#search"); } else refreshGrid(); }
  if (t.id === "chkQ") $("#chkRes").innerHTML = chkRes(t.value);
  if (t.id === "addQ") $("#addRes").innerHTML = addRes(t.value, $("#addRes").dataset.mode);
  if (t.id === "pasteTxt") { const f = parseList(t.value); $("#pastePrev").textContent = f.length ? "Found: " + f.map(x => short(x.pep) + " " + sizeTxt(x.size)).join(", ") : ""; }
});
document.addEventListener("submit", async e => {
  if (e.target.id === "suggest") {
    e.preventDefault(); const f = new FormData(e.target), kind = $("[data-kind][aria-checked=true]")?.dataset.kind || "buyer";
    try { const r = await rpc("vs_suggest_seller", { p_url: f.get("url"), p_name: f.get("name") || null, p_kind: kind, p_email: f.get("email") || null, p_note: null }); e.target.reset(); toast(typeof r === "string" ? r : r?.message || (r?.status === "listed" ? "That store is already listed" : "Thanks. We'll vet it and add it if it passes."), 5000); }
    catch (err) { toast("Couldn't send that: " + err.message); }
    return;
  }
  if (e.target.id !== "addStore") return; e.preventDefault();
  const name = $("#addName").value.trim(); let url = $("#addUrl").value.trim().replace(/\/+$/, ""); if (!/^https?:\/\//.test(url)) url = "https://" + url;
  let id; try { id = new URL(url).hostname.replace(/^www\./, "").split(".")[0].replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 24); } catch { toast("Check the web address"); return; }
  try { await rpc("pf_admin", { p_key: ownerKey(), p_action: "add", p_id: id, p_name: name, p_url: url }); toast(`Checking ${name}'s prices. This takes about a minute.`, 5000); renderOwner(); watchStore(id, name); } catch (err) { toast("Couldn't add: " + err.message); }
});
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (isM()) { focusQ = true; go("#search"); } else $("#nq")?.focus(); return; }
  if (e.key === "Escape") { closeSheet(); closeDD(); $("#sugg")?.classList.remove("open"); return; }
  if (e.target.id === "nq" && ["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
    const opts = $$("#sugg a"); if (!opts.length) return;
    if (e.key === "Enter") { e.preventDefault(); go((opts[Math.max(0, sIdx)]).getAttribute("href")); $("#sugg").classList.remove("open"); return; }
    e.preventDefault(); sIdx = (sIdx + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length; opts.forEach((o, i) => o.classList.toggle("on", i === sIdx));
  }
  if (e.key === "Enter" && e.target.id === "mq") e.target.blur();
  if (e.key === "Tab" && $("#sheet").classList.contains("open")) {
    const f = $$("#sheet button,#sheet a[href],#sheet input,#sheet select,#sheet textarea").filter(x => !x.disabled && x.offsetParent); if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
});
addEventListener("hashchange", () => { if (APP_ROUTES.test(location.hash)) { history.replaceState(null, "", toPath(location.hash)); closeSheet(); route(); } });
addEventListener("popstate", () => { closeSheet(); route(); });
// in-app links: same-origin page links navigate without a reload
document.addEventListener("click", e => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest?.("a[href]"); if (!a || a.target || a.hasAttribute("download")) return;
  const href = a.getAttribute("href");
  let path = null;
  if (APP_ROUTES.test(href)) path = toPath(href);
  else if (href.startsWith("/") && !href.startsWith("//") && !/^\/(api|mock)\//.test(href) && !/\.[a-z0-9]{2,5}($|\?)/i.test(href)) path = href;
  if (path === null) return;
  // written pages (how it works, pricing, terms...) come from the server, so load them normally
  if (/^\/(method|about|terms|privacy|contact|pricing)(?=$|[?#])/.test(path)) return;
  e.preventDefault(); go(path);
});
// show real addresses on links (hover, copy, share), not "#p-..." routes
const fixLinks = root => root.querySelectorAll?.('a[href^="#"]').forEach(a => { const h = a.getAttribute("href"); if (APP_ROUTES.test(h)) a.setAttribute("href", toPath(h)); });
new MutationObserver(ms => { for (const m of ms) m.addedNodes.forEach(n => n.nodeType === 1 && (fixLinks(n), n.matches?.('a[href^="#"]') && fixLinks(n.parentNode || n))); }).observe(document.documentElement, { childList: true, subtree: true });
let wasM = isM(); addEventListener("resize", () => { if (isM() !== wasM) { wasM = isM(); route(true); } });
if (window.visualViewport) visualViewport.addEventListener("resize", () => document.body.classList.toggle("kb", isM() && visualViewport.height < innerHeight * .75));

/* ---------- data load ---------- */
async function loadReviews() { try { const r = await rpc("vs_reviews_public"); RV = { stats: r.stats || {}, recent: (r.recent || []) }; store.set("pf_reviews", RV); } catch {} }
async function load() {
  try {
    const [d] = await Promise.all([rpc("market_catalog_json"), loadReviews()]);
    store.set("pf_cache", { at: new Date().toISOString(), d });
    const had = !!D; ingest(d); if (!$("#sheet").classList.contains("open")) route(had);
  } catch {
    const c = store.get("pf_cache", null);
    if (c && !D) { ingest(c.d); route(); toast("Offline. Showing prices from " + ago(c.at)); }
    else if (!D) $("#view").innerHTML = `<div class="wrap"><div class="card empty" style="margin-top:40px"><b>Can't reach PepSeekr</b><p>Check your connection and try again.</p><button class="btn" type="button" onclick="load()">Try again</button></div></div>`;
  }
}
/* ---------- freshness strip: when prices were last checked and when the next check runs ---------- */
// Prices are checked every 2 hours at :17 past even hours UTC (pg_cron "17 */2 * * *"); a full check takes ~3 minutes.
function nextPull(now = Date.now()) {
  const d = new Date(now); d.setUTCMinutes(17, 0, 0);
  if (d.getUTCHours() % 2) d.setUTCHours(d.getUTCHours() + 1);
  while (d.getTime() <= now) d.setUTCHours(d.getUTCHours() + 2);
  return d.getTime();
}
const span = ms => { const m = Math.max(1, Math.round(ms / 60000)); return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`; };
let freshReloadAt = 0;
function paintFresh() {
  const el = $("#fresh"); if (!el || !D) return;
  const now = Date.now(), last = newest(), next = nextPull(now), prev = next - 7200000;
  const running = now - prev < 4 * 60000 && (!last || last < prev);
  const pct = Math.min(100, Math.max(0, (now - prev) / 7200000 * 100));
  el.innerHTML = `<span class="dot${running ? " run" : ""}" aria-hidden="true"></span><span>${running ? "Checking prices now…" : `Prices checked ${last ? span(now - last) + " ago" : "recently"}`}</span><span class="sep" aria-hidden="true">·</span><span>next check in ${span(next - now)}</span><span class="bar" style="width:${pct.toFixed(1)}%" aria-hidden="true"></span>`;
  el.title = `Every store is checked every 2 hours. Next check about ${new Date(next).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`;
  // pick up the new prices a few minutes after a check starts
  if (now > prev + 4 * 60000 && last < prev && freshReloadAt < prev && document.visibilityState === "visible") { freshReloadAt = now; load(); }
}
// Real URLs (/peptides/bpc-157, /vendors/core, /influencers/...) open the matching app view.
function pathBoot() {
  // old links like pepseekr.com/#p-bpc-157 or /#list?add=... (PepKeep, push alerts, emails) move to their clean path
  if (location.hash && APP_ROUTES.test(location.hash)) history.replaceState(null, "", toPath(location.hash));
  if (location.pathname.startsWith("/influencers")) S.vtie = location.pathname === "/influencers";
}
(function boot() {
  pathBoot();   // must run before any route(), or a cached render resets the real URL
  resolveTheme();
  RV = store.get("pf_reviews", RV);
  const c = store.get("pf_cache", null);
  if (c) { ingest(c.d); route(); }
  else $("#view").innerHTML = `<div class="wrap"><div class="empty" style="margin-top:60px"><span class="dot"></span><p>Loading vendors and prices…</p></div></div>`;
  trackLand();
  contactPrefill();
  load();
  authInit();
  setInterval(() => { if (document.visibilityState === "visible") load(); }, 10 * 60 * 1000);
  setInterval(paintFresh, 30 * 1000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && D && Date.now() - Date.parse(store.get("pf_cache", {}).at || 0) > 5 * 60 * 1000) load(); });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
})();
document.addEventListener("input", e => {
  const r = e.target.closest?.("[data-pctr]"); if (!r) return;
  const k = r.dataset.pctr, v = +r.value, c = r.closest(".pctc");
  WATCH[k] = Object.assign({ target: null, on: true, drop: true, restock: true, sale: true }, WATCH[k] || {}, { pct: v, on: true });
  r.setAttribute("aria-valuetext", v + " percent");
  c.querySelector("[data-pctv]").textContent = v + "%";
  const [p, sz] = k.split("|"), b = bestPrice(live().filter(x => x.pep === p && x.size === sz)), d = c.querySelector("[data-pctd]");
  if (b && d) d.innerHTML = `Best now ${money2(b.price)} at ${esc(V[b.v].name)}. ${v}% below is <b>${money2(b.price * (1 - v / 100))}</b>.`;
  clearTimeout(window.__pctT); window.__pctT = setTimeout(saveW, 400);
});
document.addEventListener("change", e => { if (e.target.closest?.("[data-pctr]") && !$("#sheet.open")) route(true); });
// sales sort/filter, weekly email sign-up, contact form
document.addEventListener("click", e => {
  const so = e.target.closest?.("[data-salesort]"); if (so) { S.salesort = so.dataset.salesort; route(true); return; }
  const sc = e.target.closest?.("[data-salecat]"); if (sc) { S.salecat = sc.dataset.salecat; route(true); }
});
document.addEventListener("submit", async e => {
  const f = e.target;
  if (f.matches?.("[data-signup]")) {
    e.preventDefault(); const em = f.email.value.trim(), b = f.querySelector("button"); b.disabled = true;
    try { await rpc("pk_subscribe", { p_email: em, p_src: f.dataset.signup }); store.set("pk_subbed", true); f.closest(".signup").innerHTML = `<h3>You're in</h3><p class="hint" style="margin-top:4px">The first email goes out this week. Every email has an unsubscribe link.</p>`; TRK.push({ kind: "search", q: "__signup:" + f.dataset.signup, path: routePath() }); }
    catch { b.disabled = false; toast("That email didn't work. Check it and try again."); }
  }
  if (f.id === "contactForm") {
    e.preventDefault(); const n = $("#contactNote"), b = f.querySelector("button"); b.disabled = true; n.textContent = "Sending…";
    try { await rpc("pk_contact_send", { p_kind: f.kind.value, p_email: f.email.value, p_subject: f.subject.value, p_body: f.body.value, p_page: new URLSearchParams(location.search).get("about") || "" }); f.reset(); n.textContent = "Thanks. Your message is in, and we'll reply by email if you left one."; }
    catch { n.textContent = "That didn't send. Check your connection and try again."; }
    b.disabled = false;
  }
});
// prefill the contact form from links like /contact?topic=correction&about=gila
function contactPrefill(n = 0) {
  const f = document.getElementById("contactForm"); if (!f) return;
  if (!Object.keys(V).length && n < 20) return setTimeout(() => contactPrefill(n + 1), 500);
  const q = new URLSearchParams(location.search), t = q.get("topic"), a = q.get("about");
  if (t && [...f.kind.options].some(o => o.value === t)) f.kind.value = t;
  if (a && !f.subject.value) f.subject.value = (t === "correction" ? "Correction: " : "") + (V[a]?.name || a);
}
