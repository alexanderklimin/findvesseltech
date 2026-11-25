import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decodeMmsi, midMap } from './mmsi.js';

const mids = midMap(JSON.parse(fs.readFileSync(new URL('../data/mid.json', import.meta.url), 'utf8')));
const d = (x) => decodeMmsi(x, mids);

test('MID table looks complete', () => {
  assert.ok(mids.size > 280);
  assert.equal(mids.get('538').name, 'Marshall Islands');
  assert.equal(mids.get('636').name, 'Liberia');
  assert.equal(mids.get('370').name, 'Panama');
});

test('ship station', () => {
  const r = d('538 001 234');
  assert.equal(r.category, 'Ship station');
  assert.equal(r.country.name, 'Marshall Islands');
});

test('10-digit DSC address is accepted', () => {
  const r = d('5380012340');
  assert.equal(r.digits, '538001234');
  assert.equal(r.category, 'Ship station');
});

test('wrong length', () => {
  assert.equal(d('12345').ok, false);
});

test('coast station and group', () => {
  assert.equal(d('002320001').category, 'Coast station');
  assert.equal(d('002320001').country.name, 'United Kingdom');
  assert.match(d('002320000').detail, /Group coast/);
  assert.equal(d('009990000').category, 'All coast stations');
});

test('group ship call', () => {
  const r = d('036612345');
  assert.equal(r.category, 'Group ship station call');
  assert.equal(r.country.name, 'United States');
});

test('SAR aircraft', () => {
  const r = d('111232501');
  assert.equal(r.category, 'SAR aircraft');
  assert.match(r.detail, /helicopter/);
  assert.equal(d('112345678').ok, false);
});

test('handheld, craft, AtoN', () => {
  assert.equal(d('823212345').category, 'Handheld VHF with DSC and GNSS');
  assert.equal(d('982321234').category, 'Craft associated with a parent ship');
  const aton = d('992351001');
  assert.equal(aton.category, 'AIS aid to navigation (AtoN)');
  assert.match(aton.detail, /physical/);
});

test('freeform devices have no country', () => {
  const sart = d('970011234');
  assert.match(sart.category, /AIS-SART/);
  assert.equal(sart.country, null);
  assert.equal(sart.manufacturerId, '01');
  assert.match(d('974001234').notes.join(' '), /testing/);
  assert.match(d('979123456').category, /AMRD/);
  assert.equal(d('975123456').ok, false);
});

test('unallocated MID is reported', () => {
  const r = d('200123456');
  assert.equal(r.country, null);
  assert.match(r.notes.join(' '), /not allocated/);
});
