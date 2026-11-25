import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkImo } from './imo.js';

test('valid IMO numbers', () => {
  // Example from the IMO numbering scheme: 9074729 (9*7+0*6+7*5+4*4+7*3+2*2 = 139 -> 9).
  assert.equal(checkImo('9074729').ok, true);
  assert.equal(checkImo('IMO 9074729').ok, true);
});

test('invalid IMO numbers', () => {
  assert.equal(checkImo('9074728').ok, false);
  assert.equal(checkImo('123').ok, false);
});
