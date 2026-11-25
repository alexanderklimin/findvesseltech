// Expected values come from worked examples published by Cospas-Sarsat (C/S G.007)
// and NOAA (RCC Messages Manual v5.4), not from our own encoder.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decodeHexId, midMap } from './beacon.js';

const mids = midMap(JSON.parse(fs.readFileSync(new URL('../data/mid.json', import.meta.url), 'utf8')));
const d = (x) => decodeHexId(x, mids);
const field = (r, label) => r.fields.find(([k]) => k === label)?.[1];

test('maritime user, Vanuatu, MMSI ...774000', () => {
  const r = d('C809C70A34D34D1');
  assert.equal(r.countryCode, '576');
  assert.equal(r.protocol, 'Maritime user protocol');
  assert.equal(r.mmsi, '576774000');
  assert.match(field(r, 'Beacon number on vessel'), /^0/);
});

test('user-location EPIRB, Egypt, MMSI ...120320', () => {
  const r = d('CDC9D64D41934D1');
  assert.equal(r.countryCode, '622');
  assert.equal(r.mmsi, '622120320');
});

test('serial user, non-float-free EPIRB, Australia, serial 101676', () => {
  const r = d('BEEE4634B00028D');
  assert.equal(r.countryCode, '503');
  assert.equal(r.beaconType, 'Non-float-free EPIRB with serial number');
  assert.equal(field(r, 'Serial number'), '101676');
});

test('serial user EPIRB with TAC 107, serial 65342', () => {
  const r = d('BEEE43FCF8001AD');
  assert.equal(field(r, 'Serial number'), '65342');
  assert.equal(field(r, 'C/S type approval certificate'), 'TAC 107');
});

test('serial user PLB, New Zealand, serial 42334', () => {
  const r = d('C00F429578002C1');
  assert.equal(r.countryCode, '512');
  assert.equal(r.beaconType, 'PLB with serial number');
  assert.equal(field(r, 'Serial number'), '42334');
});

test('serial user EPIRB, USA, TAC 186, serial 201417', () => {
  const r = d('ADCE4C4B24002E9');
  assert.equal(r.countryCode, '366');
  assert.equal(field(r, 'Serial number'), '201417');
  assert.equal(field(r, 'C/S type approval certificate'), 'TAC 186');
});

test('standard location ELT, USA, 24-bit address A9EA32', () => {
  const r = d('2DC753D464FFBFF');
  assert.equal(r.countryCode, '366');
  assert.equal(field(r, 'Aircraft 24-bit address'), 'A9EA32');
  assert.deepEqual(r.notes, []);
});

test('standard location EPIRB serial, Australia, serial 2107', () => {
  const r = d('3EEC7B9076FFBFF');
  assert.equal(r.countryCode, '503');
  assert.equal(r.beaconType, 'EPIRB');
  assert.equal(field(r, 'Serial number'), '2107');
});

test('invalid country code is flagged', () => {
  assert.match(d('7722B4600017491').notes.join(' '), /not an allocated MID/);
});

test('length checks', () => {
  assert.equal(d('ABC').ok, false);
  assert.match(d('9' .repeat(23)).error, /second-generation/);
  assert.equal(d('c809 c70a 34d3 4d1').ok, true);
});
