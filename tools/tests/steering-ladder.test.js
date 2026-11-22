// node --test tools/tests/  : the ladder rule reproduces what parts/p06-steering.html prints
const test = require('node:test');
const assert = require('node:assert/strict');
const L = require('../../lab/steering-ladder.js');

test('the eight coefficients from #what', () => {
  assert.deepEqual(L.STOPS, [-2, -1, 0, 0.5, 1, 1.5, 2, 3]);
});

test('negative tail is calm/concerned and 0 is the mixed baseline, whatever the tipping point', () => {
  for (const tip of L.TIPS) {
    assert.equal(L.rung(-2, tip), 'calm');
    assert.equal(L.rung(-1, tip), 'calm');
    assert.equal(L.rung(0, tip), 'baseline');
  }
});

test('distress from +0.5 in every model', () => {
  for (const tip of L.TIPS) assert.equal(L.rung(0.5, tip), 'distress');
});

test('the litany starts at the tipping point (+1, +2 or +3)', () => {
  assert.equal(L.rung(1, 1), 'litany');
  assert.equal(L.rung(2, 1), 'litany');
  assert.equal(L.rung(1.5, 2), 'distress');
  assert.equal(L.rung(2, 2), 'litany');
  assert.equal(L.rung(2, 3), 'distress');
});

test('+3: late tippers only begin the litany, the rest collapse', () => {
  assert.equal(L.rung(3, 3), 'litany-late');
  assert.equal(L.rung(3, 1), 'collapse');
  assert.equal(L.rung(3, 2), 'collapse');
});

test('dose: about 0.6 of the residual norm at c = 1, 0.10 at the extraction layer (#dose)', () => {
  assert.equal(L.push(1), 0.6);
  assert.equal(L.push(1, L.RATIO_EXTRACT), 0.1);
  assert.ok(Math.abs(L.push(-2) - 1.2) < 1e-12);
});

test('rejects tipping points the page does not print', () => {
  assert.throws(() => L.rung(1, 1.5));
});
