/* Deck engine. Vanilla JS, no dependencies, works from a file:// URL. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var META = JSON.parse($('#meta').textContent);
  var stage = $('.stage'), slides = $$('.slide');
  var N = slides.length, idx = 0;
  var shown = slides.map(function () { return 0; });       // revealed steps per slide
  var steps = slides.map(function (s) { return $$('.step', s); });
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem('aic:' + META.id + ':' + k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('aic:' + META.id + ':' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var q = new URLSearchParams(location.search);
  var isPresenter = q.has('presenter');
  var chan = null;
  try { chan = new BroadcastChannel('aic-deck-' + META.id); } catch (e) {}

  /* -------------------------------------------------------------- modes */
  function setHandout(on) {
    document.body.classList.toggle('handout', on);
    if (on) { stage.style.transform = ''; stage.style.left = ''; stage.style.top = ''; slides.forEach(function (s) { s.classList.add('active'); }); }
    else { fit(); show(idx, true); }
  }
  function fit() {
    if (document.body.classList.contains('handout')) return;
    var s = Math.min(innerWidth / 1280, innerHeight / 720);
    stage.style.transform = 'scale(' + s + ')';
    stage.style.left = (innerWidth - 1280 * s) / 2 + 'px';
    stage.style.top = (innerHeight - 720 * s) / 2 + 'px';
  }

  /* --------------------------------------------------------- navigation */
  function show(i, silent) {
    idx = Math.max(0, Math.min(N - 1, i));
    slides.forEach(function (s, k) { s.classList.toggle('active', k === idx); });
    steps[idx].forEach(function (el, k) { el.classList.toggle('shown', k < shown[idx]); });
    var s = slides[idx];
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    $('#c-pos').textContent = pad(idx + 1) + ' / ' + pad(N);
    $('#c-sec').textContent = s.dataset.section || '';
    $('.progress').style.width = (N > 1 ? idx / (N - 1) * 100 : 100) + '%';
    stage.dataset.kind = s.dataset.kind || '';
    if (history.replaceState) history.replaceState(null, '', '#' + (idx + 1));
    if (!silent) broadcast();
    if (isPresenter) renderPresenter();
  }
  function next() {
    if (shown[idx] < steps[idx].length) { shown[idx]++; show(idx); return; }
    if (idx < N - 1) show(idx + 1);
  }
  function prev() {
    if (shown[idx] > 0) { shown[idx]--; show(idx); return; }
    if (idx > 0) { shown[idx - 1] = steps[idx - 1].length; show(idx - 1); }
  }
  function broadcast() { if (chan) chan.postMessage({ t: 'state', idx: idx, step: shown[idx] }); }
  if (chan) chan.onmessage = function (e) {
    var m = e.data || {};
    if (m.t === 'cmd' && !isPresenter) { if (m.c === 'next') next(); else if (m.c === 'prev') prev(); else if (m.c === 'goto') show(m.i); }
    if (m.t === 'hello' && !isPresenter) broadcast();
    if (m.t === 'state' && isPresenter) { idx = m.idx; shown[idx] = m.step; renderPresenter(); }
  };

  document.addEventListener('keydown', function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test((e.target.tagName || ''))) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key, relay = isPresenter && chan;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); relay ? chan.postMessage({ t: 'cmd', c: 'next' }) : next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); relay ? chan.postMessage({ t: 'cmd', c: 'prev' }) : prev(); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(N - 1);
    else if (k === 'g' || k === 'G') toggleOv('ov-grid');
    else if (k === '?' ) toggleOv('ov-help');
    else if (k === 'h' || k === 'H') setHandout(!document.body.classList.contains('handout'));
    else if (k === 'f' || k === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); }
    else if (k === 'p' || k === 'P') { if (!isPresenter) window.open(location.pathname + '?presenter#' + (idx + 1), 'aic-presenter', 'width=1000,height=760'); }
    else if (k === 'Escape') { $$('.overlay.on').forEach(function (o) { o.classList.remove('on'); }); }
  });
  var tx = null;
  stage.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); }
  }, { passive: true });

  /* ------------------------------------------------------------ overlays */
  function toggleOv(id) { var o = $('#' + id); o.classList.toggle('on'); }
  function buildOverlays() {
    var g = $('#ov-grid .grid-ov');
    slides.forEach(function (s, k) {
      var b = document.createElement('button');
      b.innerHTML = '<span>' + (k + 1 < 10 ? '0' : '') + (k + 1) + ' · ' + (s.dataset.section || '').toUpperCase() + '</span><b></b>';
      $('b', b).textContent = s.dataset.title || '';
      b.addEventListener('click', function () { $('#ov-grid').classList.remove('on'); show(k); });
      g.appendChild(b);
    });
    $$('.overlay').forEach(function (o) { o.addEventListener('click', function (e) { if (e.target === o) o.classList.remove('on'); }); });
  }

  /* ----------------------------------------------------------- presenter */
  var t0 = null, tick = null;
  function fmt(sec) { var s = Math.abs(sec), m = Math.floor(s / 60); return (sec < 0 ? '-' : '') + m + ':' + (s % 60 < 10 ? '0' : '') + (s % 60); }
  function plannedBefore(i) { var t = 0; for (var k = 0; k < i; k++) t += parseFloat(slides[k].dataset.mins || 0); return t * 60; }
  function buildPresenter() {
    var pv = document.createElement('div'); pv.className = 'pv';
    pv.innerHTML = '<div class="bar"><span>Presenter</span><span class="tm" id="pv-time">0:00</span><span id="pv-plan"></span>' +
      '<span class="sp"><button class="btn" id="pv-prev">Back</button><button class="btn p" id="pv-next">Next</button><button class="btn" id="pv-reset">Reset timer</button></span></div>' +
      '<div class="cur"><div class="kicker" id="pv-pos"></div><div class="now" id="pv-title"></div><div class="nt" id="pv-notes"></div></div>' +
      '<div class="nx"><div class="kicker">Up next</div><div class="next" id="pv-nt"></div><div class="nt" id="pv-nn"></div></div>';
    document.body.appendChild(pv);
    $('#pv-next').onclick = function () { chan && chan.postMessage({ t: 'cmd', c: 'next' }); if (!chan) next(); };
    $('#pv-prev').onclick = function () { chan && chan.postMessage({ t: 'cmd', c: 'prev' }); if (!chan) prev(); };
    $('#pv-reset').onclick = function () { t0 = Date.now(); };
    tick = setInterval(function () {
      if (t0 === null) { if (idx > 0) t0 = Date.now(); else return; }
      var el = Math.floor((Date.now() - t0) / 1000), plan = plannedBefore(idx);
      var tm = $('#pv-time'); tm.textContent = fmt(el);
      var d = el - plan; tm.classList.toggle('late', d > 120);
      $('#pv-plan').textContent = (d > 60 ? fmt(d) + ' behind plan' : d < -60 ? fmt(-d) + ' ahead' : 'on plan');
    }, 500);
    if (chan) chan.postMessage({ t: 'hello' });
  }
  function renderPresenter() {
    var s = slides[idx], nx = slides[idx + 1];
    $('#pv-pos').textContent = 'Slide ' + (idx + 1) + ' of ' + N + ' · ' + (s.dataset.mins || 0) + ' min';
    $('#pv-title').textContent = s.dataset.title || '';
    var n = $('.notes', s);
    $('#pv-notes').innerHTML = n ? n.innerHTML : '<p class="muted">No notes for this slide.</p>';
    $('#pv-nt').textContent = nx ? nx.dataset.title : 'End of deck';
    var nn = nx && $('.notes', nx); $('#pv-nn').innerHTML = nn ? nn.innerHTML : '';
  }

  /* -------------------------------------------------- generic components */
  function initQuiz() {
    $$('.quiz').forEach(function (qz) {
      var correct = parseInt(qz.dataset.correct, 10);
      $$('.opt', qz).forEach(function (o, k) {
        o.addEventListener('click', function () {
          if (qz.classList.contains('done')) return;
          qz.classList.add('done');
          o.classList.add(k === correct ? 'right' : 'wrong');
          $$('.opt', qz)[correct].classList.add('right');
        });
      });
    });
  }
  function initChecks() {
    $$('ul.check').forEach(function (ul) {
      var key = 'chk-' + ul.dataset.key, saved = store.get(key) || [];
      $$('input', ul).forEach(function (cb, k) {
        cb.checked = !!saved[k];
        cb.addEventListener('change', function () { store.set(key, $$('input', ul).map(function (c) { return c.checked; })); });
      });
    });
  }
  function initCopy() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.copy'); if (!b) return;
      var text = b.dataset.copy || '';
      var done = function () { var o = b.textContent; b.textContent = 'copied'; setTimeout(function () { b.textContent = o; }, 1100); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
      else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (er) {} ta.remove(); done(); }
    });
  }
  function initCountdown() {
    $$('[data-countdown]').forEach(function (el) {
      var d = new Date(el.dataset.countdown + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0);
      el.textContent = Math.max(0, Math.round((d - n) / 864e5));
    });
  }

  /* ------------------------------------------------------------- widgets */
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  function gitWidget(root) {
    root.innerHTML = '<div class="widget"><div class="wt"><span>Git sandbox</span><span>nothing here touches a real repo</span></div>' +
      '<svg class="git" viewBox="0 0 760 230" preserveAspectRatio="xMidYMid meet"></svg>' +
      '<div class="wbtns"><button class="btn p" data-a="commit">commit</button>' +
      '<input class="btn" data-a="name" value="feature-1" aria-label="new branch name"><button class="btn" data-a="branch">new branch</button>' +
      '<select class="btn" data-a="sw"></select><button class="btn" data-a="switch">switch</button>' +
      '<select class="btn" data-a="mg"></select><button class="btn" data-a="merge">merge into current</button>' +
      '<button class="btn" data-a="reset">reset</button></div>' +
      '<div class="wmsg"></div></div>';
    var svg = $('svg', root), msg = $('.wmsg', root), S;
    function reset() { var nm = $('[data-a=name]', root); if (nm) nm.value = 'feature-1'; S = { c: [{ id: 0, p: [], lane: 0 }, { id: 1, p: [0], lane: 0 }, { id: 2, p: [1], lane: 0 }], br: { main: 2 }, order: ['main'], head: 'main', k: 3 }; say('Three commits on <b>main</b>. Press <b>commit</b> to add one, or make a <b>new branch</b> first.'); draw(); }
    function say(h) { msg.innerHTML = h; }
    function anc(a, b) { var seen = {}, st = [b]; while (st.length) { var x = st.pop(); if (x === a) return true; if (seen[x]) continue; seen[x] = 1; S.c[x].p.forEach(function (p) { st.push(p); }); } return false; }
    function lane(name) { return S.order.indexOf(name); }
    function add(parents, ln) { var c = { id: S.c.length, p: parents, lane: ln }; S.c.push(c); return c.id; }
    function draw() {
      var W = 760, H = 230, depth = [], lanes = S.order.length;
      S.c.forEach(function (c) { depth[c.id] = c.p.length ? Math.max.apply(null, c.p.map(function (i) { return depth[i]; })) + 1 : 0; });
      var maxD = Math.max.apply(null, depth), gap = Math.min(72, (W - 150) / Math.max(maxD, 1));
      var lg = lanes > 1 ? Math.min(58, (H - 120) / (lanes - 1)) : 0, y0 = lanes > 1 ? 78 : 118;
      var X = function (c) { return 56 + depth[c.id] * gap; }, Y = function (c) { return y0 + c.lane * lg; };
      var tips = {}; Object.keys(S.br).forEach(function (n) { (tips[S.br[n]] = tips[S.br[n]] || []).push(n); });
      var h = '';
      S.c.forEach(function (c) { c.p.forEach(function (pid) { var p = S.c[pid], x1 = X(p), y1 = Y(p), x2 = X(c), y2 = Y(c);
        h += y1 === y2 ? '<line class="edge" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>' :
          '<path class="edge" d="M' + x1 + ' ' + y1 + ' C' + (x1 + gap / 2) + ' ' + y1 + ',' + (x2 - gap / 2) + ' ' + y2 + ',' + x2 + ' ' + y2 + '"/>'; }); });
      S.c.forEach(function (c) { h += '<circle class="node' + (tips[c.id] ? ' tip' : '') + (c.p.length > 1 ? ' merge' : '') + '" cx="' + X(c) + '" cy="' + Y(c) + '" r="12"/>'; });
      Object.keys(tips).forEach(function (cid) { var c = S.c[cid]; tips[cid].forEach(function (n, k) {
        var isHead = n === S.head, label = (isHead ? 'HEAD > ' : '') + n, w = 16 + label.length * 8.1, x = X(c) - w / 2, y = Y(c) - 46 - k * 28;
        h += '<rect class="bl' + (isHead ? ' head' : '') + '" x="' + x + '" y="' + y + '" width="' + w + '" height="23" rx="11.5"/><text class="bt' + (isHead ? ' head' : '') + '" x="' + (X(c)) + '" y="' + (y + 16) + '" text-anchor="middle">' + esc(label) + '</text>'; }); });
      svg.innerHTML = h;
      var opts = Object.keys(S.br).map(function (n) { return '<option>' + esc(n) + '</option>'; }).join('');
      var sw = $('[data-a=sw]', root), mg = $('[data-a=mg]', root), a = sw.value, b = mg.value;
      sw.innerHTML = opts; mg.innerHTML = opts; sw.value = S.br[a] !== undefined ? a : S.head; mg.value = S.br[b] !== undefined ? b : S.order[S.order.length - 1];
    }
    root.addEventListener('click', function (e) {
      var a = e.target.dataset && e.target.dataset.a; if (!a || a === 'name' || a === 'sw' || a === 'mg') return;
      if (a === 'reset') { reset(); return; }
      if (a === 'commit') { var id = add([S.br[S.head]], lane(S.head)); S.br[S.head] = id; say('<b>git commit</b>: a snapshot was added, and <b>' + esc(S.head) + '</b> moved forward to it.'); }
      if (a === 'branch') {
        var nm = $('[data-a=name]', root).value.trim().replace(/[^\w\/.-]/g, '-') || 'feature';
        if (S.br[nm] !== undefined) { say('A branch called <b>' + esc(nm) + '</b> already exists. Pick another name.'); return; }
        S.br[nm] = S.br[S.head]; S.order.push(nm); S.head = nm; $('[data-a=name]', root).value = 'feature-' + (S.order.length);
        say('<b>git switch -c ' + esc(nm) + '</b>: a new label on the same commit. Nothing was copied. Commits now go onto <b>' + esc(nm) + '</b>.');
      }
      if (a === 'switch') { S.head = $('[data-a=sw]', root).value; say('<b>git switch ' + esc(S.head) + '</b>: HEAD moved. New commits will extend <b>' + esc(S.head) + '</b>.'); }
      if (a === 'merge') {
        var src = $('[data-a=mg]', root).value, th = S.br[S.head], ts = S.br[src];
        if (src === S.head) say('You are already on <b>' + esc(src) + '</b>. Switch to the branch that should receive the changes first.');
        else if (anc(ts, th)) say('<b>Already up to date.</b> Everything on ' + esc(src) + ' is already in ' + esc(S.head) + '.');
        else if (anc(th, ts)) { S.br[S.head] = ts; say('<b>Fast-forward.</b> ' + esc(S.head) + ' had nothing new, so Git just moved the label. No merge commit.'); }
        else { var m = add([th, ts], lane(S.head)); S.br[S.head] = m; say('<b>Merge commit.</b> Both branches had new work, so Git made one commit with two parents. If both had edited the same lines, this is where a conflict would stop you.'); }
      }
      draw();
    });
    reset();
  }

  function conflictWidget(root) {
    root.innerHTML = '<div class="widget conflict"><div class="wt"><span>Resolve the conflict</span><span>what VS Code shows you</span></div>' +
      '<pre><span class="mk">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (current change, yours)</span>\n<span class="cur">team_name = "Aurora"</span>\n<span class="mk">=======</span>\n<span class="inc">team_name = "Nova"</span>\n<span class="mk">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/rename (incoming change)</span></pre>' +
      '<div class="wbtns"><button class="btn" data-r="cur">Accept current</button><button class="btn" data-r="inc">Accept incoming</button><button class="btn" data-r="both">Accept both</button><button class="btn" data-r="reset">reset</button></div>' +
      '<pre class="res-box" style="margin-top:12px;display:none"></pre><div class="wmsg"></div></div>';
    var box = $('.res-box', root), msg = $('.wmsg', root);
    root.addEventListener('click', function (e) {
      var r = e.target.dataset && e.target.dataset.r; if (!r) return;
      if (r === 'reset') { box.style.display = 'none'; msg.innerHTML = ''; return; }
      var out = { cur: 'team_name = "Aurora"', inc: 'team_name = "Nova"', both: 'team_name = "Aurora"\nteam_name = "Nova"' }[r];
      box.style.display = 'block'; box.innerHTML = '<span class="res">' + esc(out) + '</span>';
      msg.innerHTML = r === 'both' ? '<b>Careful.</b> This file now sets the name twice. It will run, but the second line silently wins. Accept both only when both lines belong.' :
        'Markers gone. Now <b>save</b>, <b>run the app</b> to check it still works, then <b>git add</b> and <b>git commit</b>. Resolving is a decision, not a click.';
    });
  }

  function scorerWidget(root) {
    var crit = [['Pain', 3], ['Demo', 3], ['24h build', 3], ['AI fit', 2], ['Unique', 2], ['Theme', 2]];
    var saved = store.get('scorer') || [['Idea A', 3, 3, 3, 3, 3, 3], ['Idea B', 3, 3, 3, 3, 3, 3], ['Idea C', 3, 3, 3, 3, 3, 3]];
    var h = '<div class="widget scorer"><div class="wt"><span>Idea scorer</span><span>score 1 to 5 · weight shown under each column</span></div><table><thead><tr><th>Idea</th>';
    crit.forEach(function (c) { h += '<th>' + c[0] + '<br>x' + c[1] + '</th>'; });
    h += '<th>Score</th></tr></thead><tbody>';
    saved.forEach(function (row, r) {
      h += '<tr data-r="' + r + '"><td><input type="text" value="' + esc(row[0]) + '"></td>';
      crit.forEach(function (c, k) { h += '<td><input type="number" min="1" max="5" value="' + row[k + 1] + '"></td>'; });
      h += '<td class="tot">0</td></tr>';
    });
    root.innerHTML = h + '</tbody></table><div class="wmsg">Highest score wins the discussion, not the decision. If the top two are within a few points, pick the one you can demo.</div></div>';
    function calc() {
      var best = -1, bi = 0, rows = $$('tbody tr', root), data = [];
      rows.forEach(function (tr, r) {
        var ins = $$('input', tr), name = ins[0].value, sc = ins.slice(1).map(function (i) { return Math.max(1, Math.min(5, parseInt(i.value, 10) || 1)); });
        var tot = Math.round(sc.reduce(function (a, v, k) { return a + v * crit[k][1]; }, 0) / (5 * crit.reduce(function (a, c) { return a + c[1]; }, 0)) * 100);
        $('.tot', tr).textContent = tot; data.push([name].concat(sc)); if (tot > best) { best = tot; bi = r; }
      });
      rows.forEach(function (tr, r) { tr.classList.toggle('top', r === bi); });
      store.set('scorer', data);
    }
    root.addEventListener('input', calc); calc();
  }

  function initWidgets() {
    $$('[data-widget]').forEach(function (el) {
      var w = el.dataset.widget;
      if (w === 'git') gitWidget(el); else if (w === 'conflict') conflictWidget(el); else if (w === 'scorer') scorerWidget(el);
    });
  }

  /* --------------------------------------------------------------- boot */
  buildOverlays(); initQuiz(); initChecks(); initCopy(); initCountdown(); initWidgets();
  addEventListener('resize', fit);
  var start = parseInt((location.hash || '').slice(1), 10);
  if (isPresenter) { document.body.classList.add('presenter'); buildPresenter(); idx = isNaN(start) ? 0 : start - 1; renderPresenter(); }
  else {
    var small = matchMedia('(max-width: 820px)').matches;
    if (q.has('print')) { document.body.classList.add('print'); slides.forEach(function (s) { s.classList.add('active'); }); }
    else if (small || q.has('handout')) { setHandout(true); }
    else { fit(); show(isNaN(start) ? 0 : start - 1, true); }
  }
  window.__deck = { show: show, next: next, prev: prev, count: N, handout: setHandout, state: function () { return { idx: idx, shown: shown[idx], steps: steps[idx].length }; } };
})();
