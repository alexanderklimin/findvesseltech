// Survey and test due-date planner. Pure functions on ISO dates (YYYY-MM-DD, UTC).
// Rules and sources:
// - HSSC 2025, res. A.1207(34), 1.3.2 and 4.4.1: periodical survey of the Cargo Ship Safety Radio
//   Certificate within 3 months before or after each anniversary date; annual/periodical windows
//   are ±3 months; renewal survey within 3 months before expiry. Passenger Ship Safety Certificate
//   is valid max 12 months, so every year is a renewal.
// - "Anniversary date": the day and month of each year corresponding to the certificate expiry date.
// - MSC.1/Circ.1576: annual tests of VDR/S-VDR (V/18.8), AIS (V/18.9) and EPIRB (IV/15.9) within the
//   time window of the relevant survey, not later than completion of that survey.
// - MSC.1/Circ.1252 §3 (AIS) and MSC.1/Circ.1222/Rev.1 §3 (VDR): same windows, tied to the
//   safety equipment survey (cargo) or passenger ship renewal survey.
// - SOLAS IV/15.9 (as quoted in A.1207(34) 4.1.2.13.12) and MSC.1/Circ.1039/Rev.1 §4.2: EPIRB
//   shore-based maintenance at intervals set by the flag, not exceeding five years.

const DAY = 86400000;

export function parse(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso ?? '')) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const t = Date.UTC(y, m - 1, d);
  const dt = new Date(t);
  return dt.getUTCMonth() === m - 1 ? t : null;
}

export function fmt(t) {
  return new Date(t).toISOString().slice(0, 10);
}

/** Add months, clamping to the last day of the target month (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(t, n) {
  const d = new Date(t);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(d.getUTCDate(), last));
}

export function daysBetween(a, b) {
  return Math.round((b - a) / DAY);
}

/**
 * Next survey window for a certificate, as seen from `today`.
 * Returns the first window that has not closed yet.
 * @param {number} expiry certificate expiry (ms)
 * @param {number} today (ms)
 * @param {'cargo'|'passenger'} kind
 */
export function nextWindow(expiry, today, kind) {
  if (kind === 'passenger') {
    // Every year is a renewal: up to 3 months before expiry.
    return { due: expiry, open: addMonths(expiry, -3), close: expiry, renewal: true, expired: expiry < today };
  }
  // Cargo: anniversaries are expiry minus 4, 3, 2, 1 years, then expiry itself (renewal).
  for (let k = 4; k >= 0; k--) {
    const due = addMonths(expiry, -12 * k);
    const renewal = k === 0;
    const open = addMonths(due, -3);
    const close = renewal ? due : addMonths(due, 3);
    if (close >= today) return { due, open, close, renewal, expired: false };
  }
  return { due: expiry, open: addMonths(expiry, -3), close: expiry, renewal: true, expired: true };
}

export function status(win, today) {
  if (win.expired) return 'expired';
  if (today < win.open) return 'upcoming';
  if (today <= win.close) return 'open';
  return 'overdue';
}

/**
 * @param {{ kind: 'cargo'|'passenger', radioExpiry?: string, equipmentExpiry?: string, pssExpiry?: string,
 *   lastSbm?: string, sbmYears?: number, epirbBattery?: string, hru?: string, sartBattery?: string, today: string }} input
 */
export function plan(input) {
  const today = parse(input.today);
  const rows = [];
  const errors = [];
  if (today === null) return { rows, errors: ['Invalid current date.'] };

  const certRow = (label, ref, expiryIso, kind) => {
    const exp = parse(expiryIso);
    if (exp === null) return null;
    const w = nextWindow(exp, today, kind);
    return { label, ref, kind: 'window', open: fmt(w.open), due: fmt(w.due), close: fmt(w.close), renewal: w.renewal, status: status(w, today), daysToClose: daysBetween(today, w.close) };
  };

  let radioWin = null;
  if (input.kind === 'passenger') {
    if (!parse(input.pssExpiry)) errors.push('Enter the expiry date of the Passenger Ship Safety Certificate.');
    else {
      for (const [label, ref] of [
        ['Radio survey (PSSC renewal)', 'HSSC A.1207(34)'],
        ['EPIRB annual test', 'SOLAS IV/15.9, MSC.1/Circ.1040/Rev.2'],
        ['VDR annual performance test', 'SOLAS V/18.8, MSC.1/Circ.1222/Rev.1'],
        ['AIS annual test', 'SOLAS V/18.9, MSC.1/Circ.1252'],
      ]) rows.push(certRow(label, ref, input.pssExpiry, 'passenger'));
      radioWin = rows[0];
    }
  } else {
    const radio = parse(input.radioExpiry);
    const equip = parse(input.equipmentExpiry) ?? radio;
    if (radio === null) errors.push('Enter the expiry date of the Cargo Ship Safety Radio Certificate.');
    else {
      radioWin = certRow('Radio survey (periodical/renewal)', 'HSSC A.1207(34) 4.4.1', input.radioExpiry, 'cargo');
      rows.push(radioWin);
      rows.push({ ...certRow('EPIRB annual test', 'SOLAS IV/15.9, MSC.1/Circ.1576', input.radioExpiry, 'cargo') });
    }
    if (equip !== null) {
      const eIso = fmt(equip);
      rows.push(certRow('VDR annual performance test', 'SOLAS V/18.8, MSC.1/Circ.1222/Rev.1', eIso, 'cargo'));
      rows.push(certRow('AIS annual test', 'SOLAS V/18.9, MSC.1/Circ.1252', eIso, 'cargo'));
    }
  }

  const lastSbm = parse(input.lastSbm);
  if (lastSbm !== null) {
    const years = Math.min(Math.max(Number(input.sbmYears) || 5, 1), 5);
    const due = addMonths(lastSbm, 12 * years);
    rows.push({ label: `EPIRB shore-based maintenance (every ${years} y)`, ref: 'SOLAS IV/15.9, MSC.1/Circ.1039/Rev.1', kind: 'deadline', due: fmt(due), status: due < today ? 'overdue' : 'deadline', daysToClose: daysBetween(today, due) });
  }

  for (const [key, label, ref] of [
    ['epirbBattery', 'EPIRB battery expiry', 'MSC.1/Circ.1040/Rev.2 4.8'],
    ['hru', 'EPIRB hydrostatic release expiry', 'MSC.1/Circ.1040/Rev.2 4.9'],
    ['sartBattery', 'SART battery expiry', 'manufacturer'],
  ]) {
    const t = parse(input[key]);
    if (t === null) continue;
    const row = { label, ref, kind: 'deadline', due: fmt(t), status: t < today ? 'overdue' : 'deadline', daysToClose: daysBetween(today, t) };
    // Flag items that expire before the next radio survey window closes: the surveyor will find them.
    if (radioWin && t >= today && fmt(t) <= radioWin.close) row.beforeSurvey = true;
    rows.push(row);
  }

  return { rows: rows.filter(Boolean), errors };
}

/** Minimal iCalendar export (all-day events on the due/close date). */
export function toIcs(rows, shipName = '') {
  const esc = (s) => String(s).replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//findvesseltech//due-dates//EN', 'CALSCALE:GREGORIAN'];
  rows.forEach((r, i) => {
    const date = (r.kind === 'window' ? r.close : r.due).replace(/-/g, '');
    const next = fmt(parse(r.kind === 'window' ? r.close : r.due) + DAY).replace(/-/g, '');
    const title = `${shipName ? `${shipName}: ` : ''}${r.label}${r.kind === 'window' ? ' — window closes' : ''}`;
    const desc = r.kind === 'window' ? `Window ${r.open} to ${r.close} (due ${r.due}). Ref: ${r.ref}` : `Due ${r.due}. Ref: ${r.ref}`;
    lines.push('BEGIN:VEVENT', `UID:${date}-${i}-${r.label.replace(/\W+/g, '')}@findvesseltech`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${date}`, `DTEND;VALUE=DATE:${next}`, `SUMMARY:${esc(title)}`, `DESCRIPTION:${esc(desc)}`,
      'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${esc(title)}`, 'TRIGGER:-P30D', 'END:VALARM', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
