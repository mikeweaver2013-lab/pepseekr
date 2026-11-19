// Server-rendered SEO pages: real URLs with titles, descriptions, structured data and crawlable
// links, wrapped around the normal app shell. The app boots on top and shows the same view.
//   /                      home       /peptides            all peptides      /peptides/:slug    one peptide
//   /vendors               all stores /vendors/:id         one store
//   /influencers           creators   /influencers/:slug   one creator's stores vs the market
import { loadCatalog, slugOf, short, sizeTxt, money, esc, catOf, CATS, SITE } from "./_lib.js";
export const config = { runtime: "edge" };

const med = a => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : NaN; };
const num = s => parseFloat(s) || 0;
const fmtDate = iso => new Date(iso).toUTCString().replace(/:\d\d GMT/, " UTC");
const pct = (a, b) => Math.round((1 - a / b) * 100);

export default async function handler(req) {
  const u = new URL(req.url), t = u.searchParams.get("t") || "home", s = (u.searchParams.get("s") || "").toLowerCase();
  const [shell, C] = await Promise.all([fetch(new URL("/shell.html", u.origin)).then(r => r.text()), loadCatalog()]);
  const page = build(t, s, C);
  // /vendors/:id/reviews: the same store page, titled and described for sharing its reviews
  if (page && t === "v" && u.searchParams.get("r") === "1") Object.assign(page, { path: page.path + "/reviews", title: `${page.vname} reviews from verified buyers | PepSeekr`, desc: `Read verified buyer reviews of ${page.vname}, or leave your own. Every review on PepSeekr is checked against a receipt. No store can pay for rank.` });
  if (!page) return html(inject(shell, { title: "Page not found | PepSeekr", desc: "This page isn't on PepSeekr.", path: u.pathname, noindex: true, body: `<h1>Page not found</h1><p><a href="/peptides">Browse every peptide</a> or <a href="/vendors">every store</a>.</p>`, route: "home" }), 404);
  return html(inject(shell, page), 200);
}
function html(body, status) {
  return new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate", "CDN-Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" } });
}

function inject(shell, p) {
  const url = SITE + p.path;
  const head = `<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
${p.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta property="og:site_name" content="PepSeekr"><meta property="og:type" content="website"><meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.desc)}"><meta property="og:image" content="${SITE}/og.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}"><meta name="twitter:description" content="${esc(p.desc)}"><meta name="twitter:image" content="${SITE}/og.png">
${(p.ld || []).map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n")}`;
  return shell
    .replace(/<title>[\s\S]*?<\/title>\s*/, "")
    .replace(/<meta name="description"[^>]*>\s*/, "")
    .replace("</head>", head + "\n</head>")
    .replace('<footer class="foot" id="foot">', `<section id="seo" class="seo" data-route="${esc(p.route)}"><div class="wrap">${p.body}</div></section>\n<footer class="foot" id="foot">`);
}

const crumbs = list => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: list.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE + path })) });
const pLink = p => `<a href="/peptides/${slugOf(p)}">${esc(p)}</a>`;
const vLink = v => `<a href="/vendors/${esc(v.id)}">${esc(v.name)}</a>`;
const note = at => `<p class="seo-note">Prices are pulled from each store's own site every 2 hours. Last check: ${esc(fmtDate(at))}. PepSeekr doesn't sell peptides, and no store can pay for placement or rank. Products listed are sold by stores as research compounds; confirm price, stock and lab reports on the store's site.</p>`;

const howTo = p => `<h3>How to compare ${esc(p)} listings</h3><ol class="seo-steps">
  <li><b>Start with price per mg.</b> It makes different vial sizes comparable.</li>
  <li><b>Add shipping.</b> A low vial price with a high shipping fee can cost more than a higher price with free shipping. Your list on PepSeekr adds shipping for you.</li>
  <li><b>Open the lab report.</b> Look for the lab name, a lot number that matches the vial, and a recent test date.</li>
  <li><b>Check stock.</b> Sold-out prices are shown but marked, so you don't chase a price you can't get.</li>
  <li><b>Set an alert.</b> Watch the vial and pick how big a drop you want to hear about.</li></ol>`;
const faqHtml = faqs => `<h3>Frequently asked questions</h3><div class="seo-faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>`;
const DOCS = {
  method: ["How PepSeekr works", "How PepSeekr collects prices, compares stores and scores them. Rankings are never for sale.", `
    <h2>How PepSeekr works</h2>
    <p>PepSeekr compares research peptide prices across online stores. Here's exactly where the numbers come from and what we do and don't claim.</p>
    <h3>Prices</h3><p>Every 2 hours, around the clock, we read each store's public product listings: price, sizes, stock and any linked lab report. Each page shows when prices were last checked. If a store blocks automated reads or hides prices behind a login, we say so instead of guessing.</p>
    <h3>Price per mg and the cheapest cart</h3><p>Price per mg is the vial price divided by the amount in the vial. Your list adds each store's shipping rules so the total reflects what you'd actually pay.</p>
    <h3>Lab reports (COAs)</h3><p>We link the certificate a store publishes and flag reports that look reused across products or stores, or that are more than 12 months old. <b>PepSeekr does not test products.</b> Independent lab-test pass rates shown on store pages come from Finnrick's public results and link to the source.</p>
    <h3 id="scores">Store scores</h3><p>Every store gets a score out of 100, worked out the same way for everyone, recalculated every time prices are checked. Each store page shows its own breakdown.</p>
    <table class="seo-t"><thead><tr><th>Part</th><th>Points</th><th>How it's worked out</th></tr></thead><tbody>
      <tr><td>Lab results and reviews</td><td>45</td><td>Scaled to what real stores achieve: a 50% independent lab-test pass rate (or lower) earns 0 points, and 90% or better, about the best in the market, earns all 45. It starts from the store's pass rate on Finnrick, and verified PepSeekr buyer reviews pull it up or down as they come in. Stores with no published independent tests start below the middle of the tested stores, so a store that pays for testing comes out ahead of one that doesn't.</td></tr>
      <tr><td>Price</td><td>25</td><td>The store's typical vial price compared with the middle price for the same vial everywhere else, counting any running deal. At the middle price a store earns 12.5; 25% or more below the middle earns all 25; 25% or more above earns 0. Lab results count for more than price on purpose: independent testing costs stores money, so close calls go to the better-tested store.</td></tr>
      <tr><td>Lab reports</td><td>20</td><td>The share of the store's product pages with a current certificate of analysis. Reports more than 12 months old count half, and reports that look reused across products or stores count nothing. If a store keeps its reports in a public library instead, we match each product to its report there. Pages we can't open (a login wall or a site that's down) count as halfway, and a store we can't check at all sits at 10.</td></tr>
      <tr><td>Shipping</td><td>10</td><td>Free shipping from $150 or less earns 10, from $250 or less earns 8, and a higher threshold earns 6. A store whose rates only show at checkout earns 7, and a store with a known flat rate and no free shipping earns 5.</td></tr>
    </tbody></table>
    <p><b>What the numbers mean:</b> 80 and up is Excellent, 65 to 79 Good, 50 to 64 Fair, and under 50 Weak. Excellent takes strong independent lab results, fair prices, lab reports on its product pages and reachable free shipping, all at once. No store is there yet; it's meant to be earned.</p>
    <p>Prices and trust are shown separately too, so the cheapest store is never presented as the most trustworthy one, or the reverse.</p>
    <h3>Creator ties</h3><p>Where a store is owned by, or promoted by, a creator or podcaster, we say so on the store page with the date we checked and a link to the source. If a tie is wrong or out of date, <a href="/contact?topic=correction">tell us</a> and we'll review it.</p>
    <h3 id="stores">How we pick stores</h3><p>We keep looking for the most reliable stores and leave out the ones that aren't. Twice a week we check for new stores, and a store is only added if it clears our bar: independent lab tests at 70% or better across at least 3 tests (or a current lab report on most of its products), a real storefront with visible prices and normal checkout, real contact details, and no health or dosing claims. Copycats of closed brands and stores with scam flags are left out. We recheck the stores we list against the same bar and remove the ones that fall below it.</p>
    <h3>For stores: how to raise your score</h3><p>Every point comes from things a store controls. Get products tested independently (Finnrick tests samples, including ones buyers send in). Put a current, batch-matched lab report on every product page. Keep prices competitive with the same vial elsewhere. Offer free shipping at a reachable order size. And encourage buyers to leave verified reviews on PepSeekr. Paying us is not one of the ways; there isn't one.</p>
    <h3 id="money">How PepSeekr makes money</h3><p>PepSeekr doesn't sell peptides and doesn't accept payment for placement. <b>Rankings are never for sale.</b> Some store links are affiliate links: if you buy through them, the store may pay PepSeekr a commission. That never changes prices, scores, the order stores appear in or which store we recommend, and a store that pays us is marked on its page. When a store gives us a discount code for our visitors, we show it and count it in the price. PepSeekr Pro is a paid subscription for extra features; it never changes prices, scores or order.</p>`],
  about: ["About PepSeekr", "PepSeekr is an independent price comparison for research peptides, updated every 2 hours.", `
    <h2>About PepSeekr</h2>
    <p>PepSeekr shows research peptide prices from every store we can read, side by side, with price per mg, stock, shipping and lab reports, refreshed every 2 hours.</p>
    <p>We built it because the same vial can cost three times as much from one store to the next, and comparing by hand means a dozen tabs and a calculator.</p>
    <p>PepSeekr doesn't sell anything or test products, and no store can pay for placement or rank. See <a href="/method">how it works</a>, or <a href="/contact">get in touch</a>.</p>`],
  terms: ["Terms of use", "The terms for using PepSeekr.", `
    <h2>Terms of use</h2><p class="seo-note">Last updated November 18, 2026.</p>
    <p>By using pepseekr.com you agree to these terms.</p>
    <h3>What PepSeekr is</h3><p>PepSeekr is an information service that compares prices and listings published by third-party stores. We don't sell, make, test, ship or recommend any product. Listings are for products sold by stores as research compounds. Nothing on PepSeekr is medical advice, and nothing here is intended for human or animal use.</p>
    <h3>Accuracy</h3><p>Prices, stock, lab reports and other details come from stores' own sites and can change at any time. We check every 2 hours but can't guarantee accuracy. Always confirm details on the store's site before buying. Your purchase is between you and the store.</p>
    <h3>Accounts and PepSeekr Pro</h3><p>You can sign in with an emailed code. PepSeekr Pro is a subscription billed by Stripe; you can cancel any time from your account page and keep Pro until the end of the paid period. We may change features or prices with notice.</p>
    <h3>Reviews and submissions</h3><p>Reviews and messages you send must be honest and lawful. We may remove content that isn't.</p>
    <h3>Liability</h3><p>PepSeekr is provided as is. To the extent the law allows, we aren't liable for losses from using it, including purchases made from stores listed here.</p>
    <h3>Contact</h3><p>Questions: <a href="/contact">contact us</a>.</p>`],
  privacy: ["Privacy", "What PepSeekr collects and why.", `
    <h2>Privacy</h2><p class="seo-note">Last updated November 18, 2026.</p>
    <h3>Without an account</h3><p>Your list, watchlist and filters are stored in your browser. We count visits, searches and clicks to stores to see what's useful. That record has no cookies, no IP addresses and no name, just a random ID that lasts until you close the tab.</p>
    <h3>If you sign in</h3><p>We keep your email address so you can sign in with a code, and we sync your list, watchlist and filters to your account. Sign-in emails are sent by Resend.</p>
    <h3>Price alerts</h3><p>If you turn on notifications, your browser gives us a push address so we can send alerts. You can turn them off in your browser or phone settings at any time.</p>
    <h3>Email updates</h3><p>If you sign up for the weekly email, we keep your address to send it. Every email has an unsubscribe link.</p>
    <h3>Payments</h3><p>PepSeekr Pro payments are handled by Stripe. We never see or store your card number.</p>
    <h3>Sharing</h3><p>We don't sell your information. We share it only with the services that run PepSeekr (hosting, database, email and payments) so they can do that job.</p>
    <h3>Your choices</h3><p>To delete your account or data, <a href="/contact?topic=privacy">contact us</a> and we'll do it.</p>`],
  contact: ["Contact PepSeekr", "Send PepSeekr a question, a correction or a store suggestion.", `
    <h2>Contact PepSeekr</h2>
    <p>Corrections, store suggestions, questions about your account, or anything else. We read every message.</p>
    <form id="contactForm" class="seo-form">
      <label>Topic<select name="kind"><option value="question">Question</option><option value="correction">Correction</option><option value="store">Suggest or list a store</option><option value="privacy">Privacy or account</option><option value="other">Something else</option></select></label>
      <label>Your email (so we can reply)<input name="email" type="email" autocomplete="email" placeholder="you@example.com"></label>
      <label>Subject<input name="subject" maxlength="200"></label>
      <label>Message<textarea name="body" rows="6" required minlength="5" maxlength="4000"></textarea></label>
      <button class="btn p" type="submit">Send message</button>
      <p class="seo-note" id="contactNote" role="status"></p>
    </form>`],
};

function build(t, s, C) {
  const { V, ROWS, PEPS, INF, at } = C;
  const live = ROWS.filter(r => r.stock);
  const lowFor = p => live.filter(r => r.pep === p).sort((a, b) => a.price / a.sv - b.price / b.sv)[0];
  const sizesOf = p => [...new Set(ROWS.filter(r => r.pep === p).map(r => r.size))].sort((a, b) => num(a) - num(b));
  const nV = Object.keys(V).filter(id => ROWS.some(r => r.v === id)).length;

  if (t === "doc") {
    const d = DOCS[s]; if (!d) return null;
    return { path: "/" + s, route: "doc", title: `${d[0]} | PepSeekr`, desc: d[1], body: d[2], ld: [crumbs([["PepSeekr", "/"], [d[0], "/" + s]])] };
  }
  if (t === "pricing") {
    const Y = "✓", N = "<span class=\"prc-no\">—</span>";
    const rows = [
      ["Compare prices", [
        ["Prices, $/mg and stock from every store", Y, Y],
        ["Deal math (Buy 1 Get 2, % off) counted in every price", Y, Y],
        ["Sales page and store-wide deals", Y, Y],
        ["Store scores, lab reports and creator ties", Y, Y],
        ["Lab report details: lot number, lab and test date", N, Y]]],
      ["Your protocol", [
        ["Build it: check off, paste, drop a PDF or send from PepKeep", N, Y],
        ["Saved and synced across your devices", N, Y],
        ["Cheapest way to buy it, shipping included", N, "Every route"],
        ["Fewest stops, best value and one-seller routes", N, Y],
        ["Size swaps (two 5 mg when they beat one 10 mg)", N, Y],
        ["Fill my cart at stores that allow it", N, Y]]],
      ["Watchlist and alerts", [
        ["Vials on your watchlist", "3", "Unlimited"],
        ["Your own drop % per vial (15% to start)", Y, Y],
        ["In-app alerts", Y, Y],
        ["Home-screen alerts on your phone", Y, Y],
        ["Weekly email: best price on each vial you watch, plus the week's sales", Y, Y],
        ["Email when a watched vial hits your drop %", N, Y]]],
    ];
    const faqs = [
      ["Does Pro change prices, scores or rankings?", "No. Every store is listed for free and none pay for placement. Pro adds tools for you; it never changes what a store pays, what you pay a store, or the order stores appear in."],
      ["Do I need an account to use PepSeekr?", "No. Prices, deals, store pages and lab reports are open to everyone. A free account saves your watchlist across devices and adds the weekly email. Protocols are part of Pro."],
      ["How do watchlist alerts work?", "Star a vial and set how far it has to drop, 15% unless you change it. We check every store every 2 hours. Free watches 3 vials with in-app and home-screen alerts. Pro watches as many as you like and also emails you, at most once every 3 hours."],
      ["What is Fill my cart?", "At stores that allow it, PepSeekr puts the items from your protocol into that store's own cart, so you land on their checkout with everything added. You still check out and pay on the store's site."],
      ["How do I cancel?", "From your account page, any time. Pro stays on until the end of the period you paid for, then your account goes back to Free. Your protocol is kept for when you come back, and your first 3 watched vials stay active."],
      ["How do I pay?", "By card through Stripe. PepSeekr never sees or stores your card number."],
    ];
    const body = `<div class="prc">
      <nav class="seo-crumbs"><a href="/">PepSeekr</a> › Pricing</nav>
      <h2 class="prc-h">Free to compare. Pro to buy smarter.</h2>
      <p class="prc-lede">Every price, deal and lab report is free for everyone. Pro is for people who buy a full protocol: every way to buy it, carts filled for you, and an email the moment a vial you watch drops.</p>
      <div class="prc-plans">
        <div class="prc-plan"><div class="prc-name">Free</div><div class="prc-amt"><b>$0</b></div><p class="prc-for">Compare prices and keep an eye on a few vials.</p>
          <ul class="prc-list"><li>Every price, deal and lab report</li><li>Watch 3 vials, with in-app and phone alerts</li><li>Weekly email with your best prices</li></ul>
          <a class="btn prc-cta" href="/peptides">Start comparing</a></div>
        <div class="prc-plan pro"><div class="prc-name">Pro</div><div class="prc-amt"><b>$6.99</b><span>a month</span></div><p class="prc-for">Or $49 a year, which works out to $4.08 a month.</p>
          <ul class="prc-list"><li>Everything in Free</li><li>Your protocol: import it, price it every way, track every vial</li><li>Every route: fewest stops, best value, one seller</li><li>Size swaps and Fill my cart</li><li>Unlimited watchlist with email alerts</li><li>Lot numbers, labs and test dates on lab reports</li></ul>
          <div class="prc-btns"><button class="btn p prc-cta" type="button" data-plan="year">Get Pro yearly · $49</button><button class="btn prc-cta" type="button" data-plan="month">Monthly · $6.99</button></div>
          <p class="prc-fine">Cancel any time from your account.</p></div>
      </div>
      <h3 class="prc-sub">Compare plans</h3>
      <table class="prc-t"><thead><tr><th scope="col"><span class="sr">Feature</span></th><th scope="col">Free</th><th scope="col">Pro</th></tr></thead>
        ${rows.map(([g, l]) => `<tbody><tr class="prc-g"><th scope="rowgroup" colspan="3">${esc(g)}</th></tr>${l.map(([f, a, b]) => `<tr><th scope="row">${esc(f)}</th><td>${a}</td><td>${b}</td></tr>`).join("")}</tbody>`).join("")}
      </table>
      <h3 class="prc-sub">Questions</h3>
      <div class="seo-faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>
      <p class="prc-fine" style="margin-top:18px">Prices in US dollars. PepSeekr doesn't sell peptides, and no store can pay for placement or rank. <a href="/method">How PepSeekr works</a></p>
    </div>`;
    const ld = [crumbs([["PepSeekr", "/"], ["Pricing", "/pricing"]]),
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      { "@context": "https://schema.org", "@type": "Product", name: "PepSeekr Pro", description: "Every route to buy your peptide protocol, size swaps, Fill my cart, unlimited watchlist with email alerts.", brand: { "@type": "Brand", name: "PepSeekr" },
        offers: [{ "@type": "Offer", price: "6.99", priceCurrency: "USD", url: SITE + "/pricing", name: "Monthly" }, { "@type": "Offer", price: "49.00", priceCurrency: "USD", url: SITE + "/pricing", name: "Yearly" }] }];
    return { path: "/pricing", route: "doc", title: "Pricing: Free and Pro | PepSeekr", desc: "PepSeekr is free to compare peptide prices, deals and lab reports. Pro ($6.99 a month or $49 a year) adds every route to buy your protocol, Fill my cart, and email alerts on your watchlist.", body, ld };
  }
  if (t === "sales") {
    const on = ROWS.filter(r => r.stock && r.sale && r.reg > r.price).map(r => ({ ...r, off: Math.round((1 - r.price / r.reg) * 100) })).filter(r => r.off >= 3).sort((a, b) => b.off - a.off);
    const promos = Object.values(V).filter(v => v.promo_text && ROWS.some(r => r.v === v.id));
    const body = `<nav class="seo-crumbs"><a href="/">PepSeekr</a> › Sales</nav><h2>Peptide sales today: ${on.length} vials marked down${promos.length ? `, ${promos.length} store-wide deals` : ""}</h2>
      <p>Every research peptide currently marked down at the stores PepSeekr checks, biggest discount first, plus store-wide sales and codes. Checked every 2 hours, so Black Friday and Cyber Monday prices show up as they change. "Was" is the regular price the store itself lists.</p>
      ${promos.length ? `<h3>Store-wide sales and codes</h3><ul>${promos.map(v => `<li>${vLink(v)}: ${esc(v.promo_text)}</li>`).join("")}</ul>` : ""}
      ${on.length ? `<h3>Marked-down vials</h3><table class="seo-t"><thead><tr><th>Vial</th><th>Store</th><th>Was</th><th>Now</th><th>Off</th></tr></thead><tbody>${on.slice(0, 80).map(r => `<tr><td>${pLink(r.pep)} ${esc(sizeTxt(r.size))}</td><td>${vLink(V[r.v])}</td><td>${money(r.reg)}</td><td>${money(r.price)}</td><td>${r.off}%</td></tr>`).join("")}</tbody></table>` : "<p>No vials are marked down right now. Check back after the next price check.</p>"}
      ${note(at)}`;
    return { path: "/sales", route: "sales", title: `Peptide sales today: ${on.length} markdowns${on[0] ? `, up to ${on[0].off}% off` : ""} | PepSeekr`, desc: `Every research peptide on sale right now across ${nV} stores, biggest discount first, plus store-wide codes. Updated every 2 hours through Black Friday and Cyber Monday.`, body, ld: [crumbs([["PepSeekr", "/"], ["Sales", "/sales"]])] };
  }
  if (t === "home" || t === "peps") {
    const groups = [...CATS.map(c => c[0]), "Blends", "Other"].map(c => [c, PEPS.filter(p => catOf(p) === c)]).filter(([, l]) => l.length);
    const body = `<h2>${t === "home" ? "Peptide prices from every store, side by side" : "Every peptide we track"}</h2>
      <p>PepSeekr compares ${ROWS.length.toLocaleString()} listings for ${PEPS.length} research peptides across ${nV} online stores: price per vial and per mg, stock, lab reports (COAs) and shipping. Pick a peptide to see every store's price by vial size.</p>
      ${groups.map(([c, l]) => `<h3>${esc(c)}</h3><ul class="seo-cols">${l.map(p => { const b = lowFor(p); return `<li>${pLink(p)}${b ? ` <span>from ${money(b.price)} (${esc(sizeTxt(b.size))})</span>` : ""}</li>`; }).join("")}</ul>`).join("")}
      <h3>Stores</h3><ul class="seo-cols">${Object.values(V).filter(v => ROWS.some(r => r.v === v.id)).sort((a, b) => a.name.localeCompare(b.name)).map(v => `<li>${vLink(v)}</li>`).join("")}</ul>
      ${Object.keys(INF).length ? `<h3>Creator-linked stores</h3><ul class="seo-cols">${Object.values(INF).map(i => `<li><a href="/influencers/${i.slug}">${esc(i.name)}</a> <span>${i.stores.map(v => esc(v.name)).join(", ")}</span></li>`).join("")}</ul>` : ""}
      <p><a href="/sales">Today's sales</a> · <a href="/method">How PepSeekr works</a> · <a href="/about">About</a> · <a href="/contact">Contact</a></p>
      ${note(at)}`;
    return t === "home"
      ? { path: "/", route: "home", title: "PepSeekr: compare research peptide prices across every store", desc: `Compare ${PEPS.length} research peptides across ${nV} stores: price per mg, lab reports, stock and shipping. BPC-157, retatrutide, tirzepatide, GHK-Cu and more, checked every 2 hours.`, body,
          ld: [{ "@context": "https://schema.org", "@type": "WebSite", name: "PepSeekr", url: SITE + "/" }, { "@context": "https://schema.org", "@type": "Organization", name: "PepSeekr", url: SITE, logo: SITE + "/icon-512.png" }] }
      : { path: "/peptides", route: "search", title: `All ${PEPS.length} research peptides: prices compared | PepSeekr`, desc: `Every research peptide PepSeekr tracks, with the lowest in-stock price for each across ${nV} stores.`, body, ld: [crumbs([["PepSeekr", "/"], ["Peptides", "/peptides"]])] };
  }

  if (t === "p") {
    const p = PEPS.find(x => slugOf(x) === s); if (!p) return null;
    const rows = ROWS.filter(r => r.pep === p), stock = rows.filter(r => r.stock), sizes = sizesOf(p);
    const vendorsN = new Set(rows.map(r => r.v)).size, cat = catOf(p);
    const bySize = sizes.map(z => { const l = rows.filter(r => r.size === z).sort((a, b) => (b.stock - a.stock) || a.price - b.price); return [z, l, med(l.map(r => r.price))]; });
    const main = bySize.slice().sort((a, b) => b[1].length - a[1].length)[0];
    const mb = main && main[1].find(r => r.stock);
    const prices = stock.map(r => r.price);
    const lead = mb ? `The lowest in-stock price for ${short(p)} ${sizeTxt(main[0])} is ${money(mb.price)} at ${V[mb.v].name}${main[2] > mb.price ? `, ${pct(mb.price, main[2])}% below the ${money(main[2])} middle price` : ""}.` : `No store has ${short(p)} in stock right now.`;
    const related = PEPS.filter(x => x !== p && catOf(x) === cat).slice(0, 12);
    const perMg = stock.map(r => r.price / r.sv).sort((a, b) => a - b), cheapest = mb ? `${money(mb.price)} for ${sizeTxt(main[0])} at ${V[mb.v].name}` : null;
    const faqs = [
      [`Where can I compare ${p} prices?`, `PepSeekr lists ${p} from ${vendorsN} online store${vendorsN === 1 ? "" : "s"} in ${sizes.length} size${sizes.length === 1 ? "" : "s"}.${cheapest ? ` As of the last price check, the lowest in-stock price for ${sizeTxt(main[0])} is ${cheapest}.` : ""} Prices are pulled from each store's own site every 2 hours.`],
      [`What does price per mg mean for ${p}?`, `It's the vial price divided by the amount in the vial, so different sizes can be compared fairly.${perMg.length ? ` In-stock ${p} listings currently run from ${money(perMg[0])} to ${money(perMg[perMg.length - 1])} per ${rows[0].unit || "mg"}.` : ""}`],
      [`How do I check a ${p} lab report (COA)?`, "Open the certificate on the store's page and check that it names the lab that ran it, that the lot number matches the vial you'd receive, that the test date is recent, and that it's for this exact compound and size. PepSeekr marks listings with a linked report and flags reports that look reused or old, but doesn't test products itself."],
      ["How often are prices updated?", "Every 2 hours, around the clock. Each page shows when prices were last checked."],
      ["Does PepSeekr sell peptides or test them?", "No. PepSeekr is a price comparison. It doesn't sell anything or test products. Some store links may earn a commission, but rankings are never for sale and no store can pay to move up."],
    ];
    const body = `<nav class="seo-crumbs"><a href="/">PepSeekr</a> › <a href="/peptides">Peptides</a> › ${esc(p)}</nav>
      <h2>${esc(p)} prices: ${vendorsN} store${vendorsN === 1 ? "" : "s"} compared</h2>
      <p>${vendorsN} store${vendorsN === 1 ? "" : "s"} list ${esc(p)} in ${sizes.length} size${sizes.length === 1 ? "" : "s"} (${sizes.map(sizeTxt).map(esc).join(", ")}). ${esc(lead)} Compare price per mg, stock and lab reports below, or add it to your list to find the cheapest cart with shipping.</p>
      ${bySize.map(([z, l, m]) => `<h3>${esc(p)} ${esc(sizeTxt(z))}</h3><table class="seo-t"><thead><tr><th>Store</th><th>Price</th><th>Per ${esc(l[0].unit || "mg")}</th><th>vs middle</th><th>Stock</th></tr></thead><tbody>${l.slice(0, 12).map(r => `<tr><td>${vLink(V[r.v])}</td><td>${money(r.price)}</td><td>${money(r.price / r.sv)}</td><td>${m && r.price !== m ? (r.price < m ? "−" : "+") + Math.abs(pct(r.price, m)) + "%" : "—"}</td><td>${r.stock ? "In stock" : "Sold out"}</td></tr>`).join("")}</tbody></table>${l.length > 12 ? `<p>${l.length - 12} more stores list this size.</p>` : ""}`).join("")}
      ${howTo(p)}
      ${faqHtml(faqs)}
      ${related.length ? `<h3>Related: ${esc(cat)}</h3><ul class="seo-cols">${related.map(x => `<li>${pLink(x)}</li>`).join("")}</ul>` : ""}
      ${note(at)}`;
    const desc = `Compare ${p} prices at ${vendorsN} stores${mb ? `: ${sizeTxt(main[0])} from ${money(mb.price)} at ${V[mb.v].name}` : ""}. Price per mg, stock, lab reports and shipping, checked every 2 hours.`;
    const ld = [crumbs([["PepSeekr", "/"], ["Peptides", "/peptides"], [p, "/peptides/" + s]]), { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }];
    if (prices.length) ld.push({ "@context": "https://schema.org", "@type": "Product", name: p, category: cat, description: `${p} research peptide, ${sizes.map(sizeTxt).join(", ")} vials. Prices compared across ${vendorsN} stores.`, offers: { "@type": "AggregateOffer", priceCurrency: "USD", lowPrice: Math.min(...prices).toFixed(2), highPrice: Math.max(...prices).toFixed(2), offerCount: stock.length, availability: "https://schema.org/InStock" } });
    return { path: "/peptides/" + s, route: "p-" + s, title: `${p} price comparison${mb ? `: ${sizeTxt(main[0])} from ${money(mb.price)}` : ""} | PepSeekr`, desc, body, ld };
  }

  if (t === "vendors" || t === "infs") {
    if (t === "infs") {
      const list = Object.values(INF).sort((a, b) => a.name.localeCompare(b.name));
      const body = `<nav class="seo-crumbs"><a href="/">PepSeekr</a> › Creator-linked stores</nav><h2>Peptide stores linked to creators and podcasters</h2>
        <p>Some peptide stores are owned by, or promoted by, YouTubers, podcasters and doctors with large audiences. A tie isn't an endorsement of the store by PepSeekr, or of PepSeekr by anyone listed. If something here is wrong, <a href="/contact?topic=correction">tell us</a>. Here's each one with how their prices compare to the rest of the market. Each tie links to the source we found it in.</p>
        <ul>${list.map(i => `<li><a href="/influencers/${i.slug}">${esc(i.name)}</a>: ${i.stores.map(v => `${vLink(v)} (${v.tie_kind === "owner" ? "owned" : "promoted"})`).join(", ")}</li>`).join("")}</ul>${note(at)}`;
      return { path: "/influencers", route: "vendors", title: "Peptide stores owned or promoted by influencers | PepSeekr", desc: `Which peptide stores are tied to creators and podcasters, and how their prices compare. ${list.map(i => i.name).slice(0, 5).join(", ")} and more.`, body, ld: [crumbs([["PepSeekr", "/"], ["Creator-linked stores", "/influencers"]])] };
    }
    const vs = Object.values(V).filter(v => ROWS.some(r => r.v === v.id)).sort((a, b) => a.name.localeCompare(b.name));
    const body = `<nav class="seo-crumbs"><a href="/">PepSeekr</a> › Stores</nav><h2>${vs.length} research peptide stores compared</h2>
      <p>Every store PepSeekr checks, with how many listings we track and how their prices compare to the middle price for the same vial.</p>
      <ul class="seo-cols">${vs.map(v => { const l = ROWS.filter(r => r.v === v.id); return `<li>${vLink(v)} <span>${l.length} listings</span></li>`; }).join("")}</ul>${note(at)}`;
    return { path: "/vendors", route: "vendors", title: `${vs.length} peptide stores compared: prices, lab tests, reviews | PepSeekr`, desc: `Compare ${vs.length} research peptide stores on price, lab reports, independent lab tests, shipping and buyer reviews.`, body, ld: [crumbs([["PepSeekr", "/"], ["Stores", "/vendors"]])] };
  }

  if (t === "v" || t === "i") {
    const stores = t === "v" ? (V[s] && ROWS.some(r => r.v === s) ? [V[s]] : []) : (INF[s]?.stores || []);
    if (!stores.length) return null;
    const medOf = new Map(); ROWS.forEach(r => { const k = r.pep + "|" + r.size; (medOf.get(k) || medOf.set(k, []).get(k)).push(r); });
    const storeTable = v => {
      const l = ROWS.filter(r => r.v === v.id).sort((a, b) => a.pep.localeCompare(b.pep) || num(a.size) - num(b.size));
      let sum = 0, alt = 0, n = 0;
      const tr = l.slice(0, 80).map(r => {
        const others = (medOf.get(r.pep + "|" + r.size) || []).filter(o => o.v !== v.id && o.stock).sort((a, b) => a.price - b.price), o = others[0];
        if (o && r.stock) { sum += r.price; alt += Math.min(o.price, r.price); n++; }
        return `<tr><td>${pLink(r.pep)} ${esc(sizeTxt(r.size))}</td><td>${money(r.price)}${r.stock ? "" : " (sold out)"}</td><td>${o ? `${money(o.price)} at ${vLink(V[o.v])}` : "Only here"}</td></tr>`;
      }).join("");
      const save = sum > 0 ? Math.round((1 - alt / sum) * 100) : 0;
      return { l, html: `<table class="seo-t"><thead><tr><th>Vial</th><th>${esc(v.name)}</th><th>Cheapest elsewhere</th></tr></thead><tbody>${tr}</tbody></table>${l.length > 80 ? `<p>${l.length - 80} more listings.</p>` : ""}`, save, n };
    };
    if (t === "v") {
      const v = stores[0], T = storeTable(v);
      const facts = [v.finnrick_pct != null ? `independent lab tests pass ${v.finnrick_pct}% (Finnrick, ${v.finnrick_tests} tests)` : "", v.site_reviews > 0 && v.site_rating != null ? `${(+v.site_rating).toFixed(1)}★ from ${v.site_reviews} reviews on their site` : "", v.free_ship_over != null ? `free shipping over ${money(v.free_ship_over)}` : ""].filter(Boolean);
      const body = `<nav class="seo-crumbs"><a href="/">PepSeekr</a> › <a href="/vendors">Stores</a> › ${esc(v.name)}</nav>
        <h2>${esc(v.name)} prices, lab tests and reviews</h2>
        <p>We track ${T.l.length} listings at ${esc(v.name)}.${facts.length ? " " + esc(facts.join("; ")) + "." : ""}${T.n ? ` Across the ${T.n} in-stock vials another store also carries, the cheapest alternative is ${T.save > 0 ? `${T.save}% lower in total` : "the same or higher"}.` : ""}</p>
        ${v.tie_text ? `<p>${esc(v.tie_text)}.${v.tie_url ? ` <a href="${esc(v.tie_url)}" rel="nofollow noopener">Source</a>` : ""}${v.tie_checked ? ` Checked ${esc(v.tie_checked)}.` : ""} <a href="/contact?topic=correction&amp;about=${esc(v.id)}">Report a correction</a></p>` : ""}
        ${T.html}${note(at)}`;
      return { vname: v.name, path: "/vendors/" + v.id, route: "v-" + v.id, title: `${v.name} review: prices, lab tests & cheaper alternatives | PepSeekr`, desc: `${v.name}: ${T.l.length} research peptide listings compared with every other store${v.finnrick_pct != null ? `, ${v.finnrick_pct}% lab-test pass rate` : ""}. See where each vial is cheaper.`, body, ld: [crumbs([["PepSeekr", "/"], ["Stores", "/vendors"], [v.name, "/vendors/" + v.id]])] };
    }
    const I = INF[s], parts = stores.map(v => ({ v, T: storeTable(v) }));
    const body = `<nav class="seo-crumbs"><a href="/">PepSeekr</a> › <a href="/influencers">Creator-linked stores</a> › ${esc(I.name)}</nav>
      <h2>${esc(I.name)} peptides: ${stores.map(v => esc(v.name)).join(" and ")} compared</h2>
      ${parts.map(({ v, T }) => `<h3>${vLink(v)}</h3><p>${esc(v.tie_text || "")}.${v.tie_url ? ` <a href="${esc(v.tie_url)}" rel="nofollow noopener">Source</a>` : ""} ${T.n ? `Across ${T.n} in-stock vials another store also carries, the cheapest alternative is ${T.save > 0 ? `${T.save}% lower in total` : "the same or higher"}.` : ""}</p>${T.html}`).join("")}
      ${note(at)}`;
    return { path: "/influencers/" + s, route: "v-" + stores[0].id, title: `${I.name} peptides: ${stores.map(v => v.name).join(" & ")} prices compared | PepSeekr`, desc: `${I.name} is linked to ${stores.map(v => v.name).join(" and ")}. See their peptide prices next to the cheapest store for each vial.`, body, ld: [crumbs([["PepSeekr", "/"], ["Creator-linked stores", "/influencers"], [I.name, "/influencers/" + s]])] };
  }
  // /compare/a-vs-b: two stores side by side (list prices; the app adds deal math, scores and the protocol)
  if (t === "cmp") {
    const [a, b] = s.split("-vs-"), A = V[a], B = V[b];
    if (!A || !B || a === b) return null;
    const best = id => { const m = {}; live.filter(r => r.v === id).forEach(r => { const k = r.pep + "|" + r.size; if (!m[k] || r.price < m[k].price) m[k] = r; }); return m; };
    const pa = best(a), pb = best(b), keys = Object.keys(pa).filter(k => pb[k]).sort();
    const nA = keys.filter(k => pa[k].price < pb[k].price).length, nB = keys.filter(k => pb[k].price < pa[k].price).length;
    const tr = keys.slice(0, 120).map(k => `<tr><td>${pLink(pa[k].pep)} ${esc(sizeTxt(pa[k].size))}</td><td>${money(pa[k].price)}</td><td>${money(pb[k].price)}</td></tr>`).join("");
    const body = `<nav class="seo-crumbs"><a href="/">PepSeekr</a> › <a href="/vendors">Stores</a> › ${esc(A.name)} vs ${esc(B.name)}</nav>
      <h2>${esc(A.name)} vs ${esc(B.name)}: prices, lab tests and shipping</h2>
      <p>${keys.length ? `Both stores have ${keys.length} of the same vials in stock. ${vLink(A)} is cheaper on ${nA} and ${vLink(B)} on ${nB}, at list price.` : `${vLink(A)} and ${vLink(B)} don't have any of the same vials in stock right now.`} ${Object.keys(pa).length - keys.length} vials are only at ${esc(A.name)} and ${Object.keys(pb).length - keys.length} only at ${esc(B.name)}.</p>
      ${keys.length ? `<table class="seo-t"><thead><tr><th>Vial</th><th>${esc(A.name)}</th><th>${esc(B.name)}</th></tr></thead><tbody>${tr}</tbody></table>` : ""}${note(at)}`;
    return { path: "/compare/" + a + "-vs-" + b, route: "c-" + a + "-vs-" + b, title: `${A.name} vs ${B.name}: prices, scores, shipping | PepSeekr`, desc: `${A.name} vs ${B.name}: ${keys.length} shared vials compared at list price, plus lab tests, reviews, shipping and deals. Updated every 2 hours.`, body, ld: [crumbs([["PepSeekr", "/"], ["Stores", "/vendors"], [`${A.name} vs ${B.name}`, "/compare/" + a + "-vs-" + b]])] };
  }
  return null;
}
