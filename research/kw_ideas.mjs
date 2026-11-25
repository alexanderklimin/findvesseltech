// Ship radio/navigation service demand (Google Keyword Planner, read-only). Run from /opt/google-ads-mcp with .env loaded.
import { googleAdsRequest } from "/opt/google-ads-mcp/src/googleAdsClient.js";
import { readConfigFromEnv } from "/opt/google-ads-mcp/src/googleAuth.js";
import fs from "node:fs";

const DIR = "/opt/ship-radio/research/";
const CLP = 950; // account currency CLP → USD
const c = readConfigFromEnv();
const call = (p, body) => googleAdsRequest(c, { method: "POST", path: `/customers/6962355647:${p}`, body });

const SEEDS = [
  ["gmdss", "radio survey ship", "annual radio survey", "gmdss survey", "gmdss equipment", "gmdss radio"],
  ["epirb shore based maintenance", "epirb battery replacement", "epirb", "sart", "navtex", "inmarsat c"],
  ["vdr annual performance test", "voyage data recorder", "ais annual test", "lrit conformance test", "ssas test", "bnwas"],
  ["marine radar repair", "ship radar service", "furuno radar", "jrc radar", "ecdis", "gyro compass"],
  ["marine electronics repair", "marine electronics service", "ship electronics", "marine radio repair", "navigation equipment ship", "magnetic compass adjustment"],
  ["furuno service", "jrc service", "sperry marine service", "kongsberg service", "sailor 6000", "furuno error code"],
];

const rows = new Map();
for (const s of SEEDS) {
  const r = await call("generateKeywordIdeas", { language: "languageConstants/1000", keywordPlanNetwork: "GOOGLE_SEARCH", keywordSeed: { keywords: s }, pageSize: 1000 });
  for (const x of r.results || []) {
    const m = x.keywordIdeaMetrics || {};
    rows.set(x.text, {
      k: x.text,
      v: +(m.avgMonthlySearches || 0),
      comp: m.competition || "",
      lo: +(+(m.lowTopOfPageBidMicros || 0) / 1e6 / CLP).toFixed(2),
      hi: +(+(m.highTopOfPageBidMicros || 0) / 1e6 / CLP).toFixed(2),
    });
  }
  await new Promise((z) => setTimeout(z, 2000));
}
const all = [...rows.values()].sort((a, b) => b.v - a.v);
fs.writeFileSync(DIR + "kw_ideas_world.json", JSON.stringify(all, null, 1));
fs.writeFileSync(DIR + "kw_ideas_world.csv", "keyword,volume_world,competition,bid_low_usd,bid_high_usd\n" + all.map((x) => `"${x.k}",${x.v},${x.comp},${x.lo},${x.hi}`).join("\n"));
console.log("ideas", all.length, "sum", all.reduce((s, x) => s + x.v, 0));
for (const x of all.slice(0, 150)) console.log(x.v, `$${x.lo}-${x.hi}`, x.k);
