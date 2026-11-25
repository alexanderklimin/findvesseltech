import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addMonths, parse, fmt, nextWindow, plan, toIcs } from './due.js';

const m = (iso, n) => fmt(addMonths(parse(iso), n));

test('month arithmetic clamps to month end', () => {
  assert.equal(m('2026-01-31', 1), '2026-02-28');
  assert.equal(m('2028-05-31', -3), '2028-02-29');
  assert.equal(m('2026-11-25', -3), '2026-08-25');
  assert.equal(parse('2026-02-30'), null);
});

test('cargo radio: ±3 months around each anniversary', () => {
  // Certificate expires 2029-06-15 -> anniversaries 15 June each year.
  const w = nextWindow(parse('2029-06-15'), parse('2026-11-25'), 'cargo');
  assert.equal(fmt(w.due), '2027-06-15');
  assert.equal(fmt(w.open), '2027-03-15');
  assert.equal(fmt(w.close), '2027-09-15');
  assert.equal(w.renewal, false);
});

test('cargo: window still open after the anniversary', () => {
  const w = nextWindow(parse('2029-10-01'), parse('2026-11-25'), 'cargo');
  assert.equal(fmt(w.due), '2026-10-01');
  assert.equal(fmt(w.close), '2027-01-01');
});

test('cargo renewal year: window closes at expiry', () => {
  const w = nextWindow(parse('2027-02-01'), parse('2026-11-25'), 'cargo');
  assert.equal(w.renewal, true);
  assert.equal(fmt(w.open), '2026-11-01');
  assert.equal(fmt(w.close), '2027-02-01');
});

test('passenger: 3 months before expiry only', () => {
  const r = plan({ kind: 'passenger', pssExpiry: '2027-03-10', today: '2026-11-25' });
  assert.equal(r.rows.length, 4);
  assert.equal(r.rows[0].open, '2026-12-10');
  assert.equal(r.rows[0].close, '2027-03-10');
  assert.equal(r.rows[0].status, 'upcoming');
});

test('cargo plan with separate SE certificate and expiries', () => {
  const r = plan({ kind: 'cargo', radioExpiry: '2029-06-15', equipmentExpiry: '2028-12-20', lastSbm: '2022-05-01', sbmYears: 5,
    epirbBattery: '2027-05-01', hru: '2028-01-01', today: '2026-11-25' });
  const by = Object.fromEntries(r.rows.map((x) => [x.label.split(' (')[0], x]));
  assert.equal(by['VDR annual performance test'].due, '2026-12-20');
  assert.equal(by['VDR annual performance test'].status, 'open');
  assert.equal(by['EPIRB shore-based maintenance'].due, '2027-05-01');
  assert.equal(by['EPIRB battery expiry'].beforeSurvey, true);
  assert.equal(by['EPIRB hydrostatic release expiry'].beforeSurvey, undefined);
});

test('expired passenger certificate and missing input', () => {
  assert.equal(plan({ kind: 'passenger', pssExpiry: '2026-01-01', today: '2026-11-25' }).rows[0].status, 'expired');
  assert.equal(plan({ kind: 'cargo', today: '2026-11-25' }).errors.length, 1);
});

test('SBM interval never above five years', () => {
  const r = plan({ kind: 'cargo', radioExpiry: '2029-06-15', lastSbm: '2024-01-01', sbmYears: 9, today: '2026-11-25' });
  assert.equal(r.rows.find((x) => x.label.startsWith('EPIRB shore')).due, '2029-01-01');
});

test('ics export', () => {
  const r = plan({ kind: 'cargo', radioExpiry: '2029-06-15', today: '2026-11-25' });
  const ics = toIcs(r.rows, 'MV Test, 1');
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /DTSTART;VALUE=DATE:20270915/);
  assert.match(ics, /MV Test\\, 1/);
});
