// Check Gemini's claims: port×service long tail (EN) and Spanish LatAm demand. Run from /opt/google-ads-mcp with .env.
import { googleAdsRequest } from "/opt/google-ads-mcp/src/googleAdsClient.js";
import { readConfigFromEnv } from "/opt/google-ads-mcp/src/googleAuth.js";
import fs from "node:fs";

const DIR = "/opt/ship-radio/research/";
const c = readConfigFromEnv();
const PORTS = ["valparaiso", "san antonio", "callao", "balboa", "panama", "santos", "guayaquil", "manzanillo", "cartagena", "buenos aires", "singapore", "rotterdam", "piraeus", "houston", "fujairah"];
const SERV = ["gmdss radio survey", "radio survey", "marine electronics", "vdr annual performance test", "epirb shore based maintenance", "marine radar repair"];
const EN = PORTS.flatMap((p) => SERV.map((s) => `${s} ${p}`));
const ES = ["radiobaliza", "epirb", "radiobaliza epirb", "revision radio gmdss", "inspeccion gmdss", "gmdss", "sistema gmdss", "tecnico radar marino", "radar marino", "reparacion radar marino", "electronica marina", "electronica naval", "mantenimiento ais", "ais marino", "ecdis", "girocompas", "navtex", "sart", "vhf marino", "radio vhf marina", "operador gmdss", "curso gmdss", "certificado gmdss", "electronica marina chile", "electronica marina peru", "electronica marina ecuador", "electronica marina mexico", "furuno chile", "furuno peru", "radar furuno", "sonar pesca", "ecosonda", "electronica marina valparaiso", "electronica marina callao", "electronica marina guayaquil"];
const ES_GEO = [2152, 2604, 2218, 2484, 2032, 2170, 2724, 2591].map((g) => `geoTargetConstants/${g}`); // CL PE EC MX AR CO ES PA

async function hist(kws, lang, geos) {
  const out = [];
  for (let i = 0; i < kws.length; i += 100) {
    const body = { keywords: kws.slice(i, i + 100), language: `languageConstants/${lang}`, keywordPlanNetwork: "GOOGLE_SEARCH" };
    if (geos) body.geoTargetConstants = geos;
    const r = await googleAdsRequest(c, { method: "POST", path: "/customers/6962355647:generateKeywordHistoricalMetrics", body });
    for (const x of r.results || []) out.push({ k: x.text, v: +(x.keywordMetrics?.avgMonthlySearches || 0) });
    await new Promise((z) => setTimeout(z, 2000));
  }
  return out.sort((a, b) => b.v - a.v);
}
const en = await hist(EN, 1000);
const es = await hist(ES, 1003, ES_GEO);
fs.writeFileSync(DIR + "kw_port_service_en.csv", "keyword,volume_world\n" + en.map((x) => `"${x.k}",${x.v}`).join("\n"));
fs.writeFileSync(DIR + "kw_spanish_latam.csv", "keyword,volume_es_latam\n" + es.map((x) => `"${x.k}",${x.v}`).join("\n"));
console.log(`EN port×service: ${en.length} combos, sum ${en.reduce((s, x) => s + x.v, 0)}, non-zero ${en.filter((x) => x.v > 0).length}`);
console.log(en.filter((x) => x.v > 0).map((x) => `${x.k} ${x.v}`).join("; "));
console.log(`\nES (CL PE EC MX AR CO ES PA): sum ${es.reduce((s, x) => s + x.v, 0)}`);
console.log(es.map((x) => `${x.k} ${x.v}`).join("; "));
