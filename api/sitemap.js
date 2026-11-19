import { loadCatalog, slugOf, SITE } from "./_lib.js";
export const config = { runtime: "edge" };

export default async function handler() {
  const { V, ROWS, PEPS, INF, at } = await loadCatalog();
  const day = (at || new Date().toISOString()).slice(0, 10);
  const urls = [["/", "1.0"], ["/peptides", "0.9"], ["/vendors", "0.8"], ["/influencers", "0.7"], ["/sales", "0.9"], ["/pricing", "0.6"], ["/method", "0.5"], ["/about", "0.4"], ["/contact", "0.3"], ["/terms", "0.2"], ["/privacy", "0.2"],
    ...PEPS.map(p => ["/peptides/" + slugOf(p), "0.8"]),
    ...Object.keys(V).filter(id => ROWS.some(r => r.v === id)).map(id => ["/vendors/" + id, "0.6"]),
    ...Object.keys(INF).map(s => ["/influencers/" + s, "0.6"])];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, p]) => `<url><loc>${SITE}${u}</loc><lastmod>${day}</lastmod><changefreq>daily</changefreq><priority>${p}</priority></url>`).join("\n")}\n</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "CDN-Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
}
