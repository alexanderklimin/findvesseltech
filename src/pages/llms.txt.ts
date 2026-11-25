import { SITE_NAME, SITE_URL, SITE_TAGLINE } from '../data/site.js';

export function GET() {
  const body = `# ${SITE_NAME}

> ${SITE_TAGLINE}. Reference and service requests for ETOs, deck officers and technical superintendents. Facts cite ITU, IMO and manufacturer sources.

## Tools
- [MMSI lookup](${SITE_URL}/tools/mmsi-lookup/): decode country (MID) and station type of a 9-digit MMSI per ITU-R M.585-10
- [EPIRB hex ID decoder](${SITE_URL}/tools/epirb-hex-id-decoder/): decode a 406 MHz beacon 15 Hex ID (country, protocol, MMSI, serial, TAC) per Cospas-Sarsat C/S T.001
- [GMDSS frequencies](${SITE_URL}/tools/gmdss-frequencies/): distress and safety frequencies from ITU Radio Regulations Appendix 15 (Rev.WRC-23)
- [Survey due dates](${SITE_URL}/tools/survey-due-dates/): time windows for radio survey, EPIRB, VDR and AIS annual tests and EPIRB SBM per HSSC 2025 (A.1207(34)) and MSC.1/Circ.1576
- [NAVTEX stations](${SITE_URL}/tools/navtex-stations/): 271 NAVTEX stations (518/490/4209.5 kHz) with B1, times, range, language, status from IMO GMDSS.1/Circ.22
- [MID codes](${SITE_URL}/tools/mid-codes/): all Maritime Identification Digits by country from the ITU table

## Equipment
- [Radar](${SITE_URL}/equipment/radar/): sensor alarms and fallback modes, X/S-band, requirements by ship size per MSC.192(79)
- [ECDIS](${SITE_URL}/equipment/ecdis/): requirements (SOLAS V/19), performance standard by installation date (MSC.530(106)), software updates and known anomalies (MSC.1/Circ.1503/Rev.2)

## Surveys and annual tests
- [EPIRB annual test](${SITE_URL}/surveys/epirb-annual-test/): checklist per SOLAS IV/15.9 and MSC.1/Circ.1040/Rev.2
- [VDR annual performance test](${SITE_URL}/surveys/vdr-annual-performance-test/): SOLAS V/18.8, MSC.1/Circ.1222/Rev.1
- [AIS annual test](${SITE_URL}/surveys/ais-annual-test/): SOLAS V/18.9, MSC.1/Circ.1252
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
