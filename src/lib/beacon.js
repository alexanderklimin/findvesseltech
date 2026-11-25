// 406 MHz first-generation beacon (FGB) 15 Hex ID decoder.
// Source: Cospas-Sarsat C/S T.001, Issue 4 Rev. 7 (March 2021), Annex A.
// The 15 Hex ID is bits 26..85 of PDF-1 (60 bits). Bit numbers below follow T.001.

// Modified-Baudot code, Table A3.
const BAUDOT = {
  '111000': 'A', '110011': 'B', '101110': 'C', '110010': 'D', '110000': 'E', '110110': 'F', '101011': 'G',
  '100101': 'H', '101100': 'I', '111010': 'J', '111110': 'K', '101001': 'L', '100111': 'M', '100110': 'N',
  '100011': 'O', '101101': 'P', '111101': 'Q', '101010': 'R', '110100': 'S', '100001': 'T', '111100': 'U',
  '101111': 'V', '111001': 'W', '110111': 'X', '110101': 'Y', '110001': 'Z',
  '100100': ' ', '011000': '-', '010111': '/',
  '001101': '0', '011101': '1', '011001': '2', '010000': '3', '001010': '4', '000001': '5', '010101': '6',
  '011100': '7', '001100': '8', '000011': '9',
};

const AUX = { '00': 'none', '01': '121.5 MHz homing', '10': '9 GHz SART', '11': 'other radio-locating device' };

const SERIAL_TYPES = {
  '000': 'ELT with serial number',
  '001': 'ELT with aircraft operator designator and serial number',
  '010': 'Float-free EPIRB with serial number',
  '100': 'Non-float-free EPIRB with serial number',
  '110': 'PLB with serial number',
  '011': 'ELT with aircraft 24-bit address',
};

/** Normalise input: hex characters only, upper case. */
export function cleanHex(raw) {
  return String(raw ?? '').toUpperCase().replace(/[^0-9A-F]/g, '');
}

function toBits(hex) {
  return [...hex].map((c) => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
}

/**
 * @param {string} raw 15 hex characters
 * @param {Map<string, {name: string}>} mids
 */
export function decodeHexId(raw, mids) {
  const hex = cleanHex(raw);
  if (hex.length === 23) {
    return { ok: false, hex, error: 'This looks like a 23-character ID of a second-generation beacon (SGB, C/S T.018). This tool decodes 15-character IDs of first-generation beacons.' };
  }
  if (hex.length !== 15) {
    return { ok: false, hex, error: `A 406 MHz beacon 15 Hex ID has 15 characters (0–9, A–F); you entered ${hex.length}.` };
  }
  const bitsStr = toBits(hex);
  // b(n, m): bits n..m inclusive, T.001 numbering (bit 26 = index 0).
  const b = (n, m = n) => bitsStr.slice(n - 26, m - 26 + 1);
  const num = (n, m) => parseInt(b(n, m), 2);
  const baudot = (n, count) => {
    let s = '';
    for (let i = 0; i < count; i++) s += BAUDOT[b(n + i * 6, n + i * 6 + 5)] ?? '?';
    return s;
  };

  const countryCode = String(num(27, 36)).padStart(3, '0');
  const country = mids.get(countryCode) ?? null;
  const fields = [];
  const notes = [];
  const add = (label, value) => fields.push([label, value]);
  if (!country) notes.push(`Country code ${countryCode} is not an allocated MID: check the ID for typing errors.`);

  const protocolFlag = b(26);
  let protocol;
  let beaconType = null;
  let mmsi = null;

  if (protocolFlag === '1') {
    const pc = b(37, 39);
    const aux = AUX[b(84, 85)];
    switch (pc) {
      case '010': {
        protocol = 'Maritime user protocol';
        beaconType = 'EPIRB';
        const id = baudot(40, 6);
        if (/^\d{6}$/.test(id)) {
          mmsi = countryCode + id;
          add('MMSI', mmsi);
          add('Encoded', 'MID from the country code + last 6 digits of the MMSI');
        } else {
          add('Radio call sign', id.trim() || '(blank)');
        }
        add('Beacon number on vessel', describeBeaconNo(BAUDOT[b(76, 81)]));
        add('Auxiliary locating device', aux);
        break;
      }
      case '110': {
        protocol = 'Radio call sign user protocol';
        beaconType = 'EPIRB';
        let cs = baudot(40, 4);
        for (let i = 0; i < 3; i++) {
          const v = num(64 + i * 4, 67 + i * 4);
          cs += v <= 9 ? String(v) : ' ';
        }
        add('Radio call sign', cs.trim());
        add('Beacon number on vessel', describeBeaconNo(BAUDOT[b(76, 81)]));
        add('Auxiliary locating device', aux);
        break;
      }
      case '001':
        protocol = 'Aviation user protocol';
        beaconType = 'ELT';
        add('Aircraft registration', baudot(40, 7).trim());
        add('ELT number on aircraft', String(num(82, 83) + 1));
        add('Auxiliary locating device', aux);
        break;
      case '011': {
        protocol = 'Serial user protocol';
        const t = b(40, 42);
        beaconType = SERIAL_TYPES[t] ?? `Spare beacon type ${t}`;
        const certFlag = b(43) === '1';
        if (t === '011') {
          add('Aircraft 24-bit address', num(44, 67).toString(16).toUpperCase().padStart(6, '0'));
          add('ELT number on aircraft', String(num(68, 73) + 1));
        } else if (t === '001') {
          add('Aircraft operator designator', baudot(44, 3));
          add('Serial number', String(num(62, 73)));
        } else {
          add('Serial number', String(num(44, 63)));
          if (!certFlag && num(64, 73) !== 0) add('National use (bits 64–73)', String(num(64, 73)));
        }
        add('C/S type approval certificate', certFlag ? `TAC ${num(74, 83)}` : 'not encoded (national use)');
        add('Auxiliary locating device', aux);
        break;
      }
      case '111':
        protocol = 'Test user protocol';
        beaconType = 'Test beacon';
        notes.push('Test protocol: not used in an operational beacon.');
        break;
      case '000':
        protocol = 'Orbitography protocol';
        beaconType = 'Orbitography (system reference) beacon';
        break;
      case '100':
        protocol = 'National user protocol';
        beaconType = 'Nationally defined';
        notes.push('Identification bits are defined by the national administration.');
        break;
      case '101':
        protocol = 'Reserved for second-generation beacons';
        notes.push('Protocol code 101 belongs to SGB. Decode the 23 Hex ID instead.');
        break;
    }
  } else {
    const pc = b(37, 40);
    const stdDefault = b(65, 85) === '0111111111' + '01111111111';
    const natDefault = b(59, 85) === '0111111100000' + '01111111100000';
    const rlsDefault = b(67, 85) === '011111111' + '0111111111';
    const checkDefault = (ok) => { if (!ok) notes.push('Position bits are not at their default values. A 15 Hex ID normally carries the default position; check you copied the ID, not a full message.'); };

    switch (pc) {
      case '0010':
        protocol = 'Standard location protocol: EPIRB-MMSI';
        beaconType = 'EPIRB';
        mmsi = countryCode + String(num(41, 60)).padStart(6, '0');
        add('MMSI', mmsi);
        add('Beacon number on vessel', String(num(61, 64)));
        checkDefault(stdDefault);
        break;
      case '1100':
        protocol = 'Standard location protocol: ship security (SSAS)';
        beaconType = 'Ship security alert system (SSAS)';
        mmsi = countryCode + String(num(41, 60)).padStart(6, '0');
        add('MMSI', mmsi);
        notes.push('SSAS alerts are covert: they go to the company and flag State, not to a rescue centre for SAR.');
        checkDefault(stdDefault);
        break;
      case '0011':
        protocol = 'Standard location protocol: ELT 24-bit address';
        beaconType = 'ELT';
        add('Aircraft 24-bit address', num(41, 64).toString(16).toUpperCase().padStart(6, '0'));
        checkDefault(stdDefault);
        break;
      case '0100': case '0110': case '0111':
        protocol = 'Standard location protocol: serial';
        beaconType = { '0100': 'ELT', '0110': 'EPIRB', '0111': 'PLB' }[pc];
        add('C/S type approval certificate', `TAC ${num(41, 50)}`);
        add('Serial number', String(num(51, 64)));
        checkDefault(stdDefault);
        break;
      case '0101': {
        protocol = 'Standard location protocol: ELT aircraft operator';
        beaconType = 'ELT';
        let op = '';
        for (let i = 0; i < 3; i++) op += BAUDOT['1' + b(41 + i * 5, 45 + i * 5)] ?? '?';
        add('Aircraft operator designator', op);
        add('Serial number', String(num(56, 64)));
        checkDefault(stdDefault);
        break;
      }
      case '1110':
        protocol = 'Standard test location protocol';
        beaconType = 'Test beacon';
        notes.push('Test protocol: not used in an operational beacon.');
        break;
      case '1000': case '1010': case '1011': case '1111':
        protocol = pc === '1111' ? 'National test location protocol' : 'National location protocol';
        beaconType = { '1000': 'ELT', '1010': 'EPIRB', '1011': 'PLB', '1111': 'Test beacon' }[pc];
        add('National serial number', String(num(41, 58)));
        checkDefault(natDefault);
        break;
      case '1101': {
        protocol = 'RLS location protocol (Galileo return link)';
        const t = b(41, 42);
        if (b(43, 46) === '1111') {
          beaconType = { '00': 'EPIRB (first on vessel)', '01': 'EPIRB (second on vessel)', '10': 'PLB', '11': 'RLS location test' }[t];
          mmsi = countryCode + String(num(47, 66)).padStart(6, '0');
          add('MMSI', mmsi);
        } else {
          beaconType = { '00': 'ELT', '01': 'EPIRB', '10': 'PLB', '11': 'RLS location test' }[t];
          const series = { '00': 2000, '01': 1000, '10': 3000 }[t];
          const tac = num(43, 52);
          add(tac >= 920 && tac <= 949 ? 'National RLS number' : 'C/S RLS type approval certificate', series ? `TAC ${series + tac}` : String(tac));
          add('Serial number', String(num(53, 66)));
        }
        checkDefault(rlsDefault);
        break;
      }
      case '1001': {
        protocol = 'ELT(DT) location protocol';
        beaconType = 'Distress tracking ELT';
        const t = b(41, 42);
        add('Identity type', { '00': 'aircraft 24-bit address', '01': 'aircraft operator designator + serial', '10': 'TAC + serial number', '11': 'reserved' }[t]);
        if (/^(0{24}|1{24})$/.test(b(43, 66))) notes.push('ELT(DT) location test protocol.');
        else if (t === '00') add('Aircraft 24-bit address', num(43, 66).toString(16).toUpperCase().padStart(6, '0'));
        checkDefault(rlsDefault);
        break;
      }
      default:
        protocol = `Spare protocol code ${pc}`;
        notes.push('Protocol codes 0000 and 0001 are spare: check the ID for typing errors.');
    }
  }

  return { ok: true, hex, countryCode, country, protocolFlag, protocol, beaconType, mmsi, fields, notes };
}

function describeBeaconNo(ch) {
  if (ch === undefined) return 'invalid';
  if (ch === '0') return '0 (first or only float-free beacon)';
  return `${ch} (additional beacon)`;
}

/** @param {{ mids: {mid: string, name: string}[] }} data */
export function midMap(data) {
  return new Map(data.mids.map((m) => [m.mid, m]));
}
