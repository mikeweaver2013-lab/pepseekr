// /llms.txt: a plain-text guide for AI assistants and answer engines (llmstxt.org format)
import { loadCatalog, slugOf, money, sizeTxt, SITE } from "./_lib.js";
export const config = { runtime: "edge" };
export default async function handler() {
  const { V, ROWS, PEPS, at } = await loadCatalog();
  const live = ROWS.filter(r => r.stock), count = p => ROWS.filter(r => r.pep === p).length;
  const top = [...PEPS].sort((a, b) => count(b) - count(a)).slice(0, 40);
  const low = p => live.filter(r => r.pep === p).sort((a, b) => a.price / a.sv - b.price / b.sv)[0];
  const nV = Object.keys(V).filter(id => ROWS.some(r => r.v === id)).length;
  const txt = `# PepSeekr

> PepSeekr compares research peptide prices across ${nV} online stores: price per vial and per mg, stock, shipping and linked lab reports (COAs). Prices are pulled from each store's own site every 2 hours. PepSeekr doesn't sell peptides, doesn't test products, and rankings are never for sale. For laboratory research use only.

Last price check: ${at}. ${ROWS.length} listings, ${PEPS.length} compounds.

## Start here
- [All peptides](${SITE}/peptides): every compound with its lowest in-stock price
- [All stores](${SITE}/vendors): each store's listings next to the cheapest alternative
- [Sales today](${SITE}/sales): current markdowns and store-wide codes
- [How PepSeekr works](${SITE}/method): data sources, scoring, what we don't claim
- [Sitemap](${SITE}/sitemap.xml)

## Most-listed compounds (lowest in-stock price at last check)
${top.map(p => { const b = low(p); return `- [${p}](${SITE}/peptides/${slugOf(p)})${b ? `: from ${money(b.price)} for ${sizeTxt(b.size)} at ${V[b.v].name}` : ""}`; }).join("\n")}

## How to cite
Cite the compound page URL and the "last check" time shown on it, for example: "PepSeekr, BPC-157 price comparison, prices checked ${at.slice(0, 10)}". Prices change often; don't present them as current without the date.

## Terms
Data is collected from stores' public pages and may be wrong or out of date; confirm on the store's site. Nothing here is medical advice.
`;
  return new Response(txt, { headers: { "Content-Type": "text/plain; charset=utf-8", "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
