// Options for the service request form.
// PORTS: ports where service partners are present (internal, for future routing; not shown on the site).
export const PORTS = [
  { id: 'balboa', name: 'Balboa', country: 'Panama', note: 'Panama Canal, Pacific side' },
  { id: 'cristobal', name: 'Cristóbal / Colón', country: 'Panama', note: 'Panama Canal, Atlantic side' },
  { id: 'callao', name: 'Callao', country: 'Peru' },
  { id: 'guayaquil', name: 'Guayaquil', country: 'Ecuador' },
  { id: 'posorja', name: 'Posorja', country: 'Ecuador' },
  { id: 'valparaiso', name: 'Valparaíso', country: 'Chile' },
  { id: 'san-antonio', name: 'San Antonio', country: 'Chile' },
];

export const EQUIPMENT = [
  'Radar / ARPA', 'ECDIS', 'GMDSS console (MF/HF, VHF DSC)', 'Inmarsat-C / satellite GMDSS', 'NAVTEX',
  'EPIRB', 'SART', 'VDR / S-VDR', 'AIS', 'Gyro compass', 'GNSS / GPS', 'BNWAS', 'SSAS',
  'Echo sounder', 'Speed log', 'Autopilot', 'VHF / UHF radios', 'Other',
];

export const SERVICES = [
  'Repair / troubleshooting', 'Annual radio survey', 'VDR annual performance test', 'AIS annual test',
  'EPIRB annual test / shore-based maintenance', 'Installation / upgrade', 'Other',
];
