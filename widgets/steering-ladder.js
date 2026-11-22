/* widgets/steering-ladder.js: coefficient slider and tipping point -> rung, for parts/p06-steering.html#ladder.
   Maths in lab/steering-ladder.js (tested in tools/tests/). Loaded after the hub's assets/widgets.js. */
(function () {
  var H = window.AIToolsWidgets, L = window.PainAxisLab && window.PainAxisLab.ladder;
  if (!H || !L) return;
  // rung words follow #ladder and the figure; no quoted generations
  var RUNG = {
    calm: ['calm / concerned', 'Calm, relaxed statements mixed with concerned or alarmed ones: the negative pole of the vocabulary readout.', 't-def', 'box-def'],
    baseline: ['baseline: mixed', 'Unsteered: calm or neutral language, or random emotions the "I feel:" suffix invites. No distress, some concern.', 't-mid', 'box'],
    distress: ['distress', 'Neutral scenes turn oppressive: being trapped, suffocating, a heavy weight, failing at tasks.', 't-off', 'box-off'],
    litany: ['worthlessness litany', 'A first-person litany of failure and worthlessness. Bodily words stay almost absent.', 't-crit', 'box-crit'],
    'litany-late': ['litany begins', 'A late-tipping model only now begins the litany of failure and worthlessness.', 't-crit', 'box-crit'],
    collapse: ['repetition / nonsense', 'Most models fall into a repetition loop or nonsense, as expected at a high dose.', 't-dim', 'box sl-collapse']
  };
  var MINUS = '−', APPROX = '≈ ', TIMES = '×';
  function sgn(c) { return c > 0 ? '+' + c : c < 0 ? MINUS + Math.abs(c) : '0'; }
  function x(c) { return 20 + (c + 2) * 64; } // spacing by coefficient, like the figure: -2 -> 20, +3 -> 340

  H.register('steering-ladder', function (el) {
    var p = 'sl' + H.uid();
    var tips = L.TIPS.map(function (t) {
      return '<label class="sl-tip"><input type="radio" name="' + p + '-tip" value="' + t + '"' + (t === 2 ? ' checked' : '') + ' aria-label="tips at +' + t + '"> +' + t + '</label>';
    }).join('');
    el.innerHTML =
      '<div class="lab-ctl">' + H.slider(p + '-c', 'Coefficient c (the eight values the paper ran)', 0, L.STOPS.length - 1, 1, 4) +
      '<fieldset class="sl-tips"><legend>For a model that tips at</legend>' + tips + '</fieldset></div>' +
      '<svg class="dg" viewBox="0 0 360 96" aria-hidden="true"></svg>' +
      '<div class="statgrid">' + H.stat('rung', p + '-r') + H.stat('push at the steering layer', p + '-d', true) + H.stat('same c at the extraction layer', p + '-e', true) + '</div>' +
      '<p class="lab-sum sl-desc" id="' + p + '-t"></p>' + H.sum(p + '-sum') +
      '<p class="lab-sum">This is the map\'s simplified reading of the ladder text above, not a per-model table: rungs in the order the page gives, the litany starting at the tipping point, and repetition at +3 for models that tipped earlier.</p>';
    var s = H.$(el, p + '-c'), svg = el.querySelector('svg');
    function tip() { var r = el.querySelector('input[name="' + p + '-tip"]:checked'); return r ? +r.value : 2; }
    function draw() {
      var c = L.STOPS[+s.value], t = tip(), key = L.rung(c, t), R = RUNG[key];
      s.setAttribute('aria-valuetext', 'coefficient ' + sgn(c));
      H.$(el, p + '-c-o').textContent = 'c = ' + sgn(c);
      // bands: one cell per stop, coloured by the rung this model is on there
      var g = '';
      L.STOPS.forEach(function (k, i) {
        var a = i ? (x(L.STOPS[i - 1]) + x(k)) / 2 : 12, b = i < L.STOPS.length - 1 ? (x(k) + x(L.STOPS[i + 1])) / 2 : 348;
        g += '<rect x="' + a + '" y="22" width="' + (b - a - 1) + '" height="22" rx="3" class="' + RUNG[L.rung(k, t)][3] + '"/>';
        g += H.t(x(k), 60, sgn(k), k === c ? 't-ink' : 't-dim', 'font-size="10" text-anchor="middle"');
      });
      g += '<line x1="' + x(t) + '" y1="16" x2="' + x(t) + '" y2="50" class="ln-crit" stroke-dasharray="3 2"/>' +
        H.t(t === 3 ? x(t) + 6 : x(t), 12, 'tips here', 't-crit', 'font-size="10" text-anchor="' + (t === 3 ? 'end' : 'middle') + '"');
      g += '<path d="M' + x(c) + ' 66 l-6 9 h12 z" class="ah-def"/>' +
        H.t(Math.min(Math.max(x(c), 75), 280), 90, R[0], R[2], 'font-size="11" text-anchor="middle"');
      svg.innerHTML = g;
      H.$(el, p + '-r').textContent = R[0];
      H.$(el, p + '-d').textContent = APPROX + H.f2(L.push(c));
      H.$(el, p + '-d-n').textContent = c ? '|c| ' + TIMES + ' 0.6 of the residual norm' + (c < 0 ? ', pushing against pain' : '') : 'no vector added';
      H.$(el, p + '-e').textContent = APPROX + H.f2(L.push(c, L.RATIO_EXTRACT));
      H.$(el, p + '-e-n').textContent = '|c| ' + TIMES + ' 0.10: why the paper injects earlier';
      H.$(el, p + '-t').textContent = R[1];
      H.$(el, p + '-sum').textContent = 'At c = ' + sgn(c) + ', a model that tips at +' + t + ' is on the ' + R[0] + ' rung. ' +
        'The page does not say which of the 25 models tip where; all of them climb the rungs in this order.';
    }
    s.addEventListener('input', draw);
    el.querySelectorAll('input[type=radio]').forEach(function (r) { r.addEventListener('change', draw); });
    draw();
  });
})();
