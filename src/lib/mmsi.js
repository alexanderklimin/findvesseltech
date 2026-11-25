// MMSI decoder based on Recommendation ITU-R M.585-10 (04/2026).
// Pure function, no DOM: used by the MMSI lookup page (client) and by tests.

/** @typedef {{ mid: string, name: string, allocatedTo: string }} MidEntry */

const COAST_SUBTYPES = {
  '1': 'coast station',
  '2': 'port station (harbour radio)',
  '3': 'pilot station',
  '4': 'AIS repeater station',
  '5': 'AIS base station (VDL controlling station)',
};

const AIRCRAFT_SUBTYPES = { '1': 'fixed-wing aircraft', '5': 'helicopter' };

const ATON_SUBTYPES = { '1': 'physical AIS AtoN', '6': 'virtual AIS AtoN', '8': 'mobile AtoN' };

const FREEFORM = {
  '970': { type: 'AIS-SART', label: 'AIS search and rescue transmitter (AIS-SART)' },
  '972': { type: 'MOB', label: 'Man overboard device (MOB-AIS, AMRD Group A)' },
  '974': { type: 'EPIRB-AIS', label: 'AIS locating function of an EPIRB-AIS' },
};

/**
 * Normalise user input: keep digits only. A 10-digit DSC address ending in 0
 * (ITU-R M.493 adds a trailing 0) is reduced to the 9-digit identity.
 * @param {string} raw
 */
export function normalise(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (digits.length === 10 && digits.endsWith('0')) return { digits: digits.slice(0, 9), fromDsc: true };
  return { digits, fromDsc: false };
}

/**
 * @param {string} raw
 * @param {Map<string, MidEntry>} mids
 */
export function decodeMmsi(raw, mids) {
  const { digits, fromDsc } = normalise(raw);
  const notes = [];
  if (fromDsc) notes.push('10-digit DSC address: the trailing 0 added by DSC equipment was removed.');
  if (digits.length !== 9) {
    return { ok: false, digits, error: `An MMSI has exactly 9 digits; you entered ${digits.length}.`, notes };
  }

  const at = (start) => digits.slice(start, start + 3);
  const result = (category, midStart, extra = {}) => {
    const mid = midStart === null ? null : at(midStart);
    const entry = mid ? mids.get(mid) ?? null : null;
    if (mid && !entry) notes.push(`MID ${mid} is not allocated in the ITU MID table.`);
    return { ok: true, digits, category, mid, country: entry, notes, ...extra };
  };

  const d = digits;

  if (d.startsWith('111')) {
    const sub = AIRCRAFT_SUBTYPES[d[6]];
    const group = d.endsWith('000');
    return result('SAR aircraft', 3, {
      format: '111MIDXXX',
      section: 'Annex 1, Section 3',
      detail: group ? 'Group aircraft identity: addresses all SAR aircraft of this administration.' : sub ? `Optional 7th-digit scheme suggests: ${sub}.` : null,
    });
  }
  if (d[0] === '1') {
    return { ok: false, digits, error: 'Identities starting with 1 are only used as 111MIDXXX (SAR aircraft).', notes };
  }

  if (d.startsWith('00')) {
    if (d === '009990000') {
      return { ok: true, digits, category: 'All coast stations', mid: null, country: null, notes, format: '009990000', section: 'Annex 1, Section 2', detail: 'Reserved all-coast-stations identity: addresses all VHF 00XXXXXXX stations (not MF/HF).' };
    }
    const group = d.endsWith('0000');
    const sub = COAST_SUBTYPES[d[5]];
    return result('Coast station', 2, {
      format: '00MIDXXXX',
      section: 'Annex 1, Section 2',
      detail: group ? 'Group coast station identity: addresses all 00MIDXXXX stations of this administration.' : sub ? `Optional 6th-digit scheme suggests: ${sub}. Administrations may use their own scheme.` : null,
    });
  }

  if (d[0] === '0') {
    return result('Group ship station call', 1, {
      format: '0MIDXXXXX',
      section: 'Annex 1, Section 1',
      detail: 'Used to call several ships at once. The MID shows the administration that assigned the group identity, not the flag of every ship in the group.',
    });
  }

  if (d[0] >= '2' && d[0] <= '7') {
    return result('Ship station', 0, {
      format: 'MIDXXXXXX',
      section: 'Annex 1, Section 1',
      detail: 'The MID shows the administration with jurisdiction over the ship station, normally the flag State.',
    });
  }

  if (d[0] === '8') {
    return result('Handheld VHF with DSC and GNSS', 1, {
      format: '8MIDXXXXX',
      section: 'Annex 2, Section 1',
      detail: 'Handheld VHF/DSC with integral GNSS: limited battery and range. Must be registered with the national authority.',
    });
  }

  // d[0] === '9'
  const prefix = d.slice(0, 3);
  if (FREEFORM[prefix]) {
    const maker = d.slice(3, 5);
    const serial = d.slice(5);
    const f = FREEFORM[prefix];
    if (maker === '00') notes.push('Manufacturer ID 00 is reserved for testing.');
    return {
      ok: true, digits, category: f.label, mid: null, country: null, notes,
      format: `${prefix}XXYYYY`, section: 'Annex 2, Section 2',
      manufacturerId: maker, sequence: serial,
      detail: `Not an MMSI and not linked to a country. Manufacturer ID ${maker}, sequence number ${serial}. The full device identity adds a 3-character supplement (MPP) transmitted over AIS.${prefix === '974' ? ' This identifies the beacon, not the ship.' : ''}`,
    };
  }
  if (prefix === '979') {
    return {
      ok: true, digits, category: 'AMRD Group B device', mid: null, country: null, notes,
      format: '979YYYYYY', section: 'Annex 2, Section 2.5.2',
      detail: 'Autonomous maritime radio device (Group B), e.g. a net buoy. Pseudorandom number; duplicates are allowed. Not an MMSI, not linked to a country.',
    };
  }
  if (d.startsWith('98')) {
    return result('Craft associated with a parent ship', 2, {
      format: '98MIDXXXX',
      section: 'Annex 1, Section 5',
      detail: 'Lifeboat, liferaft, rescue boat or tender. Registered separately and linked to the MMSI of the parent ship.',
    });
  }
  if (d.startsWith('99')) {
    const sub = ATON_SUBTYPES[d[5]];
    return result('AIS aid to navigation (AtoN)', 2, {
      format: '99MIDXXXX',
      section: 'Annex 1, Section 4',
      detail: sub ? `Optional 6th-digit scheme suggests: ${sub}.` : 'Buoy, beacon, lighthouse or virtual mark transmitting AIS.',
    });
  }
  return { ok: false, digits, error: `Prefix ${prefix} is not a format defined in ITU-R M.585-10.`, notes };
}

/** @param {{ mids: MidEntry[] }} data */
export function midMap(data) {
  return new Map(data.mids.map((m) => [m.mid, m]));
}
