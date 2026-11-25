// Exact worldwide volumes for a hand-made list (equipment, codes, rules, ports, jobs). Run from /opt/google-ads-mcp with .env.
import { googleAdsRequest } from "/opt/google-ads-mcp/src/googleAdsClient.js";
import { readConfigFromEnv } from "/opt/google-ads-mcp/src/googleAuth.js";
import fs from "node:fs";

const DIR = "/opt/ship-radio/research/";
const CLP = 950;
const c = readConfigFromEnv();

const G = {
  rules: ["gmdss requirements", "gmdss sea areas", "solas chapter iv", "gmdss modernization", "radio survey certificate", "cargo ship safety radio certificate", "epirb test procedure", "sart test procedure", "ssas test procedure", "ais annual test certificate", "vdr requirements", "bnwas requirements", "lrit requirements", "ecdis requirements", "gyro compass error", "magnetic compass deviation card", "compass adjustment", "radio log book", "gmdss radio log", "vhf dsc test", "inmarsat c test", "navtex stations", "epirb registration", "epirb hydrostatic release", "hru replacement", "epirb expiry date", "imo performance standards", "type approval marine equipment", "wheelmark", "med certificate marine"],
  codes: ["furuno radar error codes", "furuno far 2117 alarm", "furuno far 2127", "furuno far 3000 alarm list", "jrc radar alarm list", "jrc jma 9100", "jrc jan 901b", "jrc ecdis alarm", "furuno fea 2107", "furuno felcom 18 manual", "felcom 15 manual", "sailor 6110 manual", "sailor 6222 manual", "sailor 6110 lrit", "furuno fs 1575", "furuno fa 170 manual", "jrc jhs 183", "furuno vr 7000", "danelec vdr", "furuno ft 8900", "jrc jue 87", "sperry navigat x", "anschutz gyro compass alarm", "tokyo keiki gyro", "furuno gp 170", "furuno nx 700", "jrc ncr 333", "sailor 6248", "mcmurdo e5 epirb", "jotron tron 40s", "tron sart20", "kannad safelink", "ecdis error message", "vdr alarm", "bnwas reset"],
  ports: ["marine electronics singapore", "gmdss survey singapore", "radio survey singapore", "furuno singapore", "jrc singapore", "marine electronics rotterdam", "marine electronics hamburg", "marine electronics piraeus", "radio survey piraeus", "marine electronics greece", "marine electronics dubai", "marine electronics fujairah", "marine electronics houston", "marine electronics busan", "marine electronics shanghai", "marine electronics istanbul", "marine electronics panama", "marine electronics antwerp", "marine electronics gibraltar", "marine electronics las palmas", "marine electronics mumbai", "marine electronics china", "marine electronics korea", "ship repair singapore", "ship spares supplier"],
  jobs: ["electro technical officer", "eto jobs", "eto salary", "marine electronics engineer", "marine electronics technician", "radio surveyor", "gmdss radio maintainer", "marine service engineer jobs", "superintendent ship", "technical superintendent", "ship superintendent jobs", "ship manager"],
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
fs.writeFileSync(DIR + "kw_hist_world.csv", "group,keyword,volume_world,bid_high_usd\n" + out.map((x) => `${x.grp},"${x.k}",${x.v},${x.hi}`).join("\n"));
for (const g of Object.keys(G)) {
  const l = out.filter((x) => x.grp === g);
  console.log(`\n[${g}] sum ${l.reduce((s, x) => s + x.v, 0)}`);
  console.log(l.map((x) => `${x.k} ${x.v}${x.hi ? " $" + x.hi : ""}`).join("; "));
}
