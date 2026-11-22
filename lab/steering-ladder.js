/* lab/steering-ladder.js: the steering-ladder rule from parts/p06-steering.html, no DOM.
   Stops, rungs and doses are the ones printed in #what, #dose and #ladder (§4.2, Fig. 7).
   The rung rule is this map's simplification of the page's prose, not a per-model table:
   the paper does not say which of the 25 models tip at which coefficient. */
(function (root) {
  // c ∈ {−2, −1, 0, +0.5, +1, +1.5, +2, +3} (#what); no rungs between +2 and +3 (#ladder figure)
  var STOPS = [-2, -1, 0, 0.5, 1, 1.5, 2, 3];
  var TIPS = [1, 2, 3]; // "some models collapse at +1 and others hold until +2 or +3" (#ladder)
  var RATIO = 0.6;       // vector norm / residual norm at coefficient 1, calibrated layer (#dose)
  var RATIO_EXTRACT = 0.10; // the same ratio at the extraction layer (#dose)

  // which rung a model that tips at `tip` is on at coefficient c
  function rung(c, tip) {
    if (TIPS.indexOf(tip) < 0) throw new Error('tip must be 1, 2 or 3');
    if (c < 0) return 'calm';
    if (c === 0) return 'baseline';
    if (c < tip) return 'distress';           // "From +0.5: distress"
    if (c === 3 && tip < 3) return 'collapse'; // "+3: ... most fall into a repetition loop or nonsense"
    return c === 3 ? 'litany-late' : 'litany'; // "A few late-tipping models only begin the litany here"
  }
  // relative push: |c·v| / |h| ≈ |c| × ratio, because v is the raw vector and the layer is set so ratio ≈ 0.6 at c = 1
  function push(c, ratio) { return Math.abs(c) * (ratio === undefined ? RATIO : ratio); }

  var api = { STOPS: STOPS, TIPS: TIPS, RATIO: RATIO, RATIO_EXTRACT: RATIO_EXTRACT, rung: rung, push: push };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PainAxisLab = Object.assign(root.PainAxisLab || {}, { ladder: api });
})(this);
