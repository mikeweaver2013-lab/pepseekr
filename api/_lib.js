// Shared by the SEO page renderer and the sitemap. Mirrors the catalog clean-up in build/app-core.js
// (ingest + ALIAS + spelling fold + one row per store/compound/size) so slugs and prices match the app.
export const SB = "https://vddteufnmnkqqndzepbk.supabase.co";
export const KEY = "sb_publishable_cj-yQOK0b1fdMqzOHmA4KQ_LhPFKE0t";
export const SITE = "https://pepseekr.com";

export const slugOf = s => s.toLowerCase().replace(/\+/g, "plus").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const short = p => p.replace(/ \(no DAC\)/, " no DAC").replace(/ \(.*\)/, "").replace("BPC-157 + TB-500", "BPC + TB").replace("CJC-1295 + Ipamorelin", "CJC + Ipa").replace("Retatrutide + Cagrilintide", "Reta + Cagri");
export const sizeTxt = s => (s || "").replace(/iu$/, " IU");
export const money = n => "$" + (+n).toFixed(2);
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const CATS = [
  ["GLP & amylin analogs", ["Retatrutide", "Tirzepatide", "Semaglutide", "Cagrilintide", "Survodutide", "Mazdutide", "Retatrutide + Cagrilintide"]],
  ["BPC, TB & thymic peptides", ["BPC-157", "TB-500", "BPC-157 + TB-500", "GLOW (BPC/TB/GHK)", "KLOW (BPC/TB/GHK/KPV)", "BPC-157 + TB-500 + Cartalax", "Thymosin Alpha-1"]],
  ["GH secretagogues", ["CJC-1295 (no DAC)", "CJC-1295 (DAC)", "CJC-1295 + Ipamorelin", "Ipamorelin", "Tesamorelin", "Tesamorelin + Ipamorelin", "Sermorelin", "GHRP-2", "GHRP-6", "Hexarelin", "MK-677", "HGH 191AA", "AOD-9604", "Fragment 176-191"]],
  ["Copper & cosmetic peptides", ["GHK-Cu", "AHK-Cu", "Pal-GHK", "Snap-8", "Matrixyl", "GHK-Cu + KPV"]],
  ["Neuropeptides", ["Selank", "Semax", "Semax + Selank", "DSIP", "Dihexa", "P21", "Adamax", "Cerebrolysin", "PE-22-28", "Pinealon", "Oxytocin"]],
  ["Bioregulators", ["Epitalon", "Thymalin", "Thymagen", "Thymogen", "Cartalax", "Cardiogen", "Crystagen", "Testagen", "Prostamax", "Vesugen", "Vesilut", "Pancragen", "Bronchogen", "Ovagen", "Cortagen", "Livagen", "Chonluten"]],
  ["Mitochondrial peptides", ["MOTS-c", "SS-31", "Humanin"]],
  ["Melanocortins", ["Melanotan I", "Melanotan II", "PT-141"]],
  ["Growth factors", ["IGF-1 LR3", "IGF-1 DES", "MGF", "PEG-MGF", "Follistatin"]],
];
export const catOf = p => (CATS.find(c => c[1].includes(p)) || [])[0] || (/ \+ /.test(p) ? "Blends" : "Other");

const ALIAS = { "CJC-1295 + DAC": "CJC-1295 (DAC)", "CJC 1295 + O Dac + Ipamorelin": "CJC-1295 + Ipamorelin", "Acetyl Hexapeptide, Raw": "Acetyl Hexapeptide-3", "NAD+ , Mots-c , 5-amino-1mq": "NAD+ + MOTS-c + 5-Amino-1MQ", "MOTS-c + 5-AMINO 1MQ": "MOTS-c + 5-Amino-1MQ", "Reta": "Retatrutide", "Tirz": "Tirzepatide", "Sema": "Semaglutide", "Gp-cag": "Cagrilintide", "GP-CAG": "Cagrilintide", "Selank + Semax": "Semax + Selank" };

export async function loadCatalog() {
  const r = await fetch(`${SB}/rest/v1/rpc/market_catalog_json`, { method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: "{}" });
  if (!r.ok) throw new Error("catalog " + r.status);
  const d = await r.json();
  const V = {}; (d.vendors || []).forEach(v => V[v.id] = v);
  let ROWS = (d.products || []).map(a => ({ v: a[0], pep: a[1], size: a[2], sv: +a[3], unit: a[4], price: +a[5], stock: !!a[8], coa: a[9], url: a[10] }))
    .filter(r => V[r.v] && r.price > 0 && r.sv > 0 && r.pep && /[a-z]/i.test(r.pep) && /^[a-z0-9]/i.test(r.pep) && !/tadalafil/i.test(r.pep) && !(r.sv >= 100 && new RegExp("\\b" + r.sv + "\\b").test(r.pep)));
  ROWS.forEach(r => { if (ALIAS[r.pep]) r.pep = ALIAS[r.pep]; });
  const keyOf = n => n.toLowerCase().replace(/\bno\b|\bw\/o\b|without/g, "no").replace(/[^a-z0-9+]/g, "");
  const spell = new Map(); ROWS.forEach(r => { const k = keyOf(r.pep), m = spell.get(k) || new Map(); m.set(r.pep, (m.get(r.pep) || 0) + 1); spell.set(k, m); });
  const pick = new Map([...spell].map(([k, m]) => [k, [...m].sort((a, b) => b[1] - a[1] || (b[0].includes("-") - a[0].includes("-")) || b[0].length - a[0].length)[0][0]]));
  ROWS.forEach(r => r.pep = pick.get(keyOf(r.pep)) || r.pep);
  const best = new Map(); ROWS.forEach(r => { const k = r.v + "|" + r.pep + "|" + r.size, o = best.get(k);
    if (!o || (r.stock && !o.stock) || (r.stock === o.stock && r.price < o.price)) best.set(k, r); });
  ROWS = [...best.values()];
  const PEPS = [...new Set(ROWS.map(r => r.pep))].sort((a, b) => a.localeCompare(b));
  // influencers: one page per named person, slug from the name without titles
  const INF = {};
  Object.values(V).forEach(v => (v.tie_people || []).forEach(n => {
    const name = n.replace(/^Dr\.?\s+/i, ""), s = slugOf(name);
    (INF[s] ??= { slug: s, name, stores: [] });
    if (!INF[s].stores.some(x => x.id === v.id) && ROWS.some(r => r.v === v.id)) INF[s].stores.push(v);
  }));
  Object.keys(INF).forEach(k => { if (!INF[k].stores.length) delete INF[k]; });
  return { V, ROWS, PEPS, INF, at: d.generated_at };
}
