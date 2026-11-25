// Phase-1 "helper" demand: tests, troubleshooting, tools, manuals (worldwide, English). Run from /opt/google-ads-mcp with .env.
import { googleAdsRequest } from "/opt/google-ads-mcp/src/googleAdsClient.js";
import { readConfigFromEnv } from "/opt/google-ads-mcp/src/googleAuth.js";
import fs from "node:fs";

const DIR = "/opt/ship-radio/research/";
const CLP = 950;
const c = readConfigFromEnv();

const G = {
  tests: ["gmdss daily test", "gmdss weekly test", "gmdss monthly test", "gmdss tests", "epirb test", "epirb self test", "sart test", "dsc test call", "vhf dsc test call", "inmarsat c pv test", "inmarsat c link test", "ssas test", "bnwas test", "navtex test", "radar performance monitor", "gmdss battery test", "reserve source of energy gmdss", "gmdss checklist", "radio survey checklist", "vdr apt checklist"],
  trouble: ["false distress alert", "false distress alert cancellation", "epirb accidental activation", "cancel false dsc alert", "radar magnetron replacement", "magnetron life hours", "radar no picture", "inmarsat c not logged in", "inmarsat c login", "navtex not receiving", "gps no fix", "ais not transmitting", "gyro compass alarm", "gyro compass settling time", "ecdis chart permits", "ecdis update charts", "ecdis alarms", "vdr capsule", "vdr data download", "bnwas alarm reset"],
  tools: ["mmsi lookup", "mmsi number", "mmsi decoder", "maritime identification digits", "mid code", "mmsi country code", "dsc frequencies", "gmdss frequencies", "distress frequencies", "vhf channels marine", "marine vhf channels list", "navtex station list", "navtex frequencies", "hf frequencies marine", "phonetic alphabet", "q codes", "inmarsat ocean regions", "gmdss sea area map", "epirb hex id", "epirb hex id decoder"],
  manuals: ["furuno manual", "jrc manual", "sailor manual", "furuno far 2117 manual", "furuno far 2127 manual", "furuno far 3000 manual", "jrc jma 5300 manual", "jrc jan 901b manual", "furuno fs 1575 manual", "furuno fm 8900s manual", "furuno gp 170 manual", "furuno fa 170 manual", "jrc jue 87 manual", "jrc ncr 333 manual", "sailor 6310 manual", "jotron tron 60s manual", "mcmurdo smartfind e5 manual", "transas ecdis manual", "navi sailor 4000 manual", "anschutz standard 22 manual"],
};

const out = [];
for (const [grp, kws] of Object.entries(G)) {
  const r = await googleAdsRequest(c, { method: "POST", path: "/customers/6962355647:generateKeywordHistoricalMetrics", body: { keywords: kws, language: "languageConstants/1000", keywordPlanNetwork: "GOOGLE_SEARCH" } });
  for (const x of r.results || []) {
    const m = x.keywordMetrics || {};
    out.push({ grp, k: x.text, v: +(m.avgMonthlySearches || 0), hi: +(+(m.highTopOfPageBidMicros || 0) / 1e6 / CLP).toFixed(2) });
  }
  await new Promise((z) => setTimeout(z, 2000));
}
out.sort((a, b) => a.grp.localeCompare(b.grp) || b.v - a.v);
fs.writeFileSync(DIR + "kw_helper_world.csv", "group,keyword,volume_world,bid_high_usd\n" + out.map((x) => `${x.grp},"${x.k}",${x.v},${x.hi}`).join("\n"));
for (const g of Object.keys(G)) {
  const l = out.filter((x) => x.grp === g);
  console.log(`\n[${g}] sum ${l.reduce((s, x) => s + x.v, 0)}`);
  console.log(l.map((x) => `${x.k} ${x.v}`).join("; "));
}
