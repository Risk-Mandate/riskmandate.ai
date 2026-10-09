// review.js — the before and after of the home page, three ways, and the feedback that goes with it.
// Needs envelope.js (SgEnvelope, the lane's encryption) and identity.js (RMIdentity, this browser's own keys).
// Reads assets/review/home-diff/diff.json (written by scripts/review/capture-home-diff.mjs): one pair of
// screenshots per changed section, padded to one size, with the boxes of text that left and arrived.
// Feedback is kept in localStorage as it happens and sent, encrypted in this browser to the review lane's
// public key (assets/review/lane.json), into the `review` lane of a private vault, with the contact form's envelope.
// Every comment box sends itself: on its button, when it loses focus, and after eight quiet seconds of typing.
// Screenshots pasted or dropped into a box are shrunk here, kept in this browser, and go with the next send.
// Every action is an event, so a session can be replayed: where the reader rested and which way they moved,
// what they opened, dragged, played, chose and typed. Each send is signed with this browser's own key, and
// carries its public keys, so a reply can be published that only this browser can read (assets/review/replies/).
// The debug column (the Debug button, or ?debug=1) shows all of it: the keys, the lane, every send and its
// answer, the events, the replies and the state.
(async function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var BASE = 'assets/review/home-diff/';
  var KEY = 'rm-review-home-v1';
  var WHY = {
    hero: 'The hero said the policies are enforced in real time. The interview’s first fix: we write the rules, your controls enforce them, and we are never in the request path. The first button now starts the funnel, one rule.',
    stage: 'The gate in the middle was labelled as RiskMandate, which reads as us sitting inline. It is now your controls, with a lock rather than our mark, and the card is your approval flow.',
    builder: '“Enforcing” said the same thing again. The builder now shows the mandate you are writing down, and says your controls enforce it.',
    byo: 'We do not make a policy enforceable; we show which control in your stack would enforce each line, or that nothing can.',
    prompt: 'The point of the section stands, a prompt asks and a control enforces, but the control is a boundary in your stack, held by your gateway, not a RiskMandate policy.',
    alerts: 'The alerts were presented as ours. They are an approval flow your team stands up with our help, and it runs in your stack.'
  };
  var SECTIONS = [
    ['hero', 'The hero: give agents access, not free rein'], ['stage', 'The stage: six agents and the gate'], ['systems', 'One policy for each system'],
    ['builder', 'Pick a system, set the rules'], ['byo', 'Bring your policy'], ['prompt', 'A prompt asks, a boundary enforces'],
    ['alerts', 'Know the moment an agent steps out of line'], ['levels', 'The four levels'], ['model', 'Know what your agents can do: the gap figure, four parts, four views, three steps'],
    ['roles', 'The smallest mandate, reach and gap: who does what'], ['questions', 'Ten hard questions, answered'], ['proof', 'The proof strip'], ['close', 'Start with the agent that worries you most']
  ];

  // ---------------------------------------------------------------- state, kept in this browser
  var store = { get: function () { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; } },
                put: function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (_) {} } };
  var st = store.get() || { sid: Math.random().toString(16).slice(2, 10), started: new Date().toISOString(), who: {}, answers: {}, comments: {}, events: [], sent: 0 };
  var save = function () { store.put(st); count(); dbgSoon(); };
  var log = function (type, data) {
    st.events.push(Object.assign({ at: new Date().toISOString(), type: type }, data || {}, { at: new Date().toISOString(), type: type }));   // the time and type always win over a field of the same name
    if (st.events.length > 800) { var k = st.events.length - 800; st.events.splice(0, k); st.sent = Math.max(0, st.sent - k); }
    save();
  };
  st.sends = st.sends || []; st.seq = st.seq || 0;
  log('open', { w: innerWidth, h: innerHeight, returning: st.events.length > 0 });
  st.csent = st.csent || {};
  // this browser's keys: made once, kept in IndexedDB; the id is the signing key's fingerprint
  var ME = null, REPLIES = null, LANE = null, LANEFP = null;
  var meP = (window.RMIdentity ? RMIdentity.load() : Promise.reject(new Error('identity.js did not load'))).then(function (m) {
    ME = m; if (st.browser !== m.id) { st.browser = m.id; log('identity', { browser: m.id, kept: m.kept, created: m.created }); } else dbgSoon(); return m;
  }).catch(function (e) { log('identity-error', { error: String(e && e.message || e) }); return null; });
  var laneP = fetch('/assets/review/lane.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(async function (l) {
    LANE = l; LANEFP = window.SgEnvelope ? await SgEnvelope.fingerprint(l.encrypt_pem) : null; dbgSoon(); return l;
  }).catch(function () { return null; });
  var SHOTS = KEY + '-shots', MAXSHOT = 700000, PERSEND = 2;
  var shots = (function () { try { return JSON.parse(localStorage.getItem(SHOTS) || '[]'); } catch (_) { return []; } })();
  var keepShots = function () { try { localStorage.setItem(SHOTS, JSON.stringify(shots)); } catch (_) { /* too big for this browser: kept in memory until sent */ } };

  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  // ---------------------------------------------------------------- the reviewer
  // a name, and a device or reference: the device is guessed from the browser as a default, and can be changed
  function guessDevice() {
    var u = navigator.userAgent || '';
    if (/iPhone/.test(u)) return 'iPhone';
    if (/iPad/.test(u) || (/Macintosh/.test(u) && navigator.maxTouchPoints > 1)) return 'iPad';   // iPadOS reports itself as a Mac
    if (/Android/.test(u)) return 'Android';
    return /Mobi/.test(u) ? '' : (innerWidth >= 1600 ? 'Desktop' : 'Laptop');
  }
  delete st.who.email;   // no longer asked for (v1.38.8)
  if (st.who.ref === undefined) { st.who.ref = guessDevice(); st.who.refGuessed = true; }
  var nameEl = $('#rv-name'), refEl = $('#rv-ref');
  nameEl.value = st.who.name || ''; refEl.value = st.who.ref || '';
  function markRef() { $$('[data-ref]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ref') === st.who.ref)); }); }
  markRef();
  nameEl.addEventListener('change', function () { st.who.name = nameEl.value.trim(); log('who', { field: 'name' }); });
  refEl.addEventListener('change', function () { st.who.ref = refEl.value.trim(); st.who.refGuessed = false; markRef(); log('who', { field: 'ref', ref: st.who.ref }); });
  $$('[data-ref]').forEach(function (b) { b.addEventListener('click', function () { st.who.ref = refEl.value = b.getAttribute('data-ref'); st.who.refGuessed = false; markRef(); log('who', { field: 'ref', ref: st.who.ref, picked: true }); }); });
  var whoLine = function () { return [st.who.name, st.who.ref].filter(Boolean).join(' · '); };

  // ---------------------------------------------------------------- the data
  var d;
  // a screenshot that fails to load is tried twice more, and every failure is an event, so it shows in Debug
  document.addEventListener('error', function (e) {
    var im = e.target; if (!im || im.tagName !== 'IMG' || !im.closest || !im.closest('.rv-img')) return;
    var src = (im.getAttribute('src') || '').split('?')[0], n = +(im.getAttribute('data-tries') || 0);
    log('img-error', { src: src.split('/').pop(), tries: n, online: navigator.onLine });
    if (n < 2) { im.setAttribute('data-tries', n + 1); setTimeout(function () { im.src = src + '?retry=' + (n + 1); }, 700 * (n + 1)); }
  }, true);
  document.addEventListener('load', function (e) {
    var im = e.target; if (im && im.tagName === 'IMG' && im.getAttribute('data-tries')) log('img-retry-ok', { src: (im.getAttribute('src') || '').split('?')[0].split('/').pop(), tries: +im.getAttribute('data-tries') });
  }, true);
  try { d = await (await fetch(BASE + 'diff.json', { cache: 'no-store' })).json(); }
  catch (e) { $('#rv-changes').textContent = 'The screenshots did not load: ' + e.message; return; }
  var W = d.width;

  // pair each box that left with the arrival nearest in height on the page, for the arrows and the list
  // pair each box that left with the arrival that shares most of its words, then the nearest in height
  var words = function (t) { return (t || '').toLowerCase().split(/[^a-z0-9£$]+/).filter(function (w) { return w.length > 2; }); };
  function overlap(a, b) { var A = words(a), B = words(b); if (!A.length || !B.length) return 0; var n = A.filter(function (w) { return B.indexOf(w) >= 0; }).length; return n / Math.max(A.length, B.length); }
  function pairsOf(p) {
    var used = {}, out = [], bs = p.beforeBoxes || [], as = p.afterBoxes || [];
    var cand = [];
    bs.forEach(function (b, i) { as.forEach(function (a, j) { var o = overlap(b.text, a.text); if (o >= 0.25) cand.push([o, i, j]); }); });
    cand.sort(function (x, y) { return y[0] - x[0]; });
    var bTo = {};
    cand.forEach(function (c) { if (bTo[c[1]] === undefined && !used[c[2]]) { bTo[c[1]] = c[2]; used[c[2]] = true; } });
    bs.forEach(function (b, i) {
      if (bTo[i] === undefined) {
        var best = -1, dist = 1e9;
        as.forEach(function (a, j) { var dd = Math.abs((a.y + a.h / 2) - (b.y + b.h / 2)); if (!used[j] && dd < dist && dd < 120) { dist = dd; best = j; } });
        if (best >= 0) { bTo[i] = best; used[best] = true; }
      }
      out.push({ b: b, a: bTo[i] !== undefined ? as[bTo[i]] : null });
    });
    as.forEach(function (a, j) { if (!used[j]) out.push({ b: null, a: a }); });
    out.sort(function (x, y) { return ((x.b || x.a).y) - ((y.b || y.a).y); });
    out.forEach(function (x, i) { x.n = i + 1; });
    return out;
  }
  var pct = function (v, of) { return (v / of * 100).toFixed(3) + '%'; };
  function boxes(p, side, pairs) {
    return pairs.filter(function (x) { return x[side]; }).map(function (x) {
      var b = x[side];
      return '<span class="rv-box ' + (side === 'b' ? 'gone' : 'came') + '" data-n="' + x.n + '" style="left:' + pct(b.x - 6, W) + ';top:' + pct(b.y - 6, p.h) + ';width:' + pct(b.w + 12, W) + ';height:' + pct(b.h + 12, p.h) + '"><i>' + x.n + '</i></span>';
    }).join('');
  }
  var img = function (p, side) { return '<img src="' + BASE + p.id + '-' + side + '.webp" width="' + W + '" height="' + p.h + '" alt="' + esc(p.title) + ', ' + (side === 'before' ? 'now' : 'proposed') + '" loading="lazy">'; };

  // ---------------------------------------------------------------- the three modes
  function side(p, pairs) {
    return '<div class="rv-side"><figure><figcaption>Now</figcaption><div class="rv-img">' + img(p, 'before') + boxes(p, 'b', pairs) + '</div></figure>' +
           '<figure><figcaption>Proposed</figcaption><div class="rv-img">' + img(p, 'after') + boxes(p, 'a', pairs) + '</div></figure><svg class="rv-arrows" aria-hidden="true"></svg></div>';
  }
  function slider(p, pairs) {
    return '<div class="rv-slider" style="--x:50%"><div class="rv-img base">' + img(p, 'before') + boxes(p, 'b', pairs) + '</div>' +
           '<div class="rv-img top">' + img(p, 'after') + boxes(p, 'a', pairs) + '</div>' +
           '<span class="rv-handle" aria-hidden="true"><b></b></span><span class="rv-tag l">Now</span><span class="rv-tag r">Proposed</span>' +
           '<input type="range" min="0" max="100" value="50" aria-label="Wipe from now to proposed"></div>';
  }
  var CAPS = ['Now', 'What will change', 'What changed', 'Proposed'];
  function steps(p, pairs) {
    var f = function (k, sd, marks) { return '<div class="rv-frame' + (k === 0 ? ' on' : '') + (marks ? ' marks' : '') + '" data-k="' + k + '"><div class="rv-img">' + img(p, sd) + (marks ? boxes(p, sd === 'before' ? 'b' : 'a', pairs) : '') + '</div></div>'; };
    return '<div class="rv-steps"><div class="rv-stack" style="aspect-ratio:' + W + '/' + p.h + '">' + f(0, 'before', false) + f(1, 'before', true) + f(2, 'after', true) + f(3, 'after', false) + '</div>' +
           '<div class="rv-ctl"><button type="button" data-act="prev" aria-label="Previous step">‹</button><button type="button" data-act="play" aria-label="Play or pause">Pause</button><button type="button" data-act="next" aria-label="Next step">›</button>' +
           CAPS.map(function (c, k) { return '<button type="button" class="dot' + (k === 0 ? ' on' : '') + '" data-k="' + k + '">' + (k + 1) + ' · ' + c + '</button>'; }).join('') + '</div></div>';
  }

  // ---------------------------------------------------------------- render
  var mode = st.mode || 'side', marks = st.marks !== false;
  var changed = d.pairs.filter(function (p) { return !p.isNew; }), fresh = d.pairs.filter(function (p) { return p.isNew; });
  var PAIRS = {};
  function changeList(pairs) {
    return '<ol class="rv-list">' + pairs.map(function (x) {
      return '<li><i>' + x.n + '</i>' + (x.b ? '<span class="was">' + esc(x.b.text) + '</span>' : '<span class="was none">nothing here</span>') + '<span class="arr">→</span>' + (x.a ? '<span class="now">' + esc(x.a.text) + '</span>' : '<span class="now none">removed</span>') + '</li>';
    }).join('') + '</ol>';
  }
  function ask(id, opts) {
    var a = st.answers[id];
    return '<div class="rv-ask" data-ask="' + id + '">' + opts.map(function (o) { return '<button type="button" data-choice="' + o[0] + '" class="' + (o[2] ? 'pri' : '') + (a === o[0] ? ' on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>' +
           commentBox(id, 'Why, or what you would change', 2);
  }
  // a comment box: the text, its screenshots, and a send button with a line saying where it is
  function shotsHtml(id) {
    return shots.filter(function (s) { return s.on === id; }).map(function (s) {
      return '<figure class="rv-shot" data-shot="' + s.id + '"><img src="' + s.data + '" alt="screenshot ' + esc(s.name || '') + '"><button type="button" class="rv-unshot" data-unshot="' + s.id + '" aria-label="Remove this screenshot">\u00d7</button>' + (s.sent ? '<figcaption>sent</figcaption>' : '') + '</figure>';
    }).join('');
  }
  function cstate(id) {
    var c = (st.comments[id] || ''), mine = shots.filter(function (s) { return s.on === id; }), pend = mine.filter(function (s) { return !s.sent; }).length;
    var at = [st.csent[id] && st.csent[id].at].concat(mine.map(function (s) { return s.sent; })).filter(function (x) { return typeof x === 'string'; }).sort().pop();
    if (!c && !mine.length && !st.csent[id]) return 'Paste or drop a screenshot here too.';
    if (!pend && (!c || (st.csent[id] && st.csent[id].text === c)) && at) return 'Sent at ' + new Date(at).toLocaleTimeString() + '.';
    return 'Not sent yet. It sends when you leave the box, or press the button.';
  }
  function commentBox(id, label, rows) {
    return '<div class="rv-cbox" data-cbox="' + id + '"><label class="rv-comment">' + label + '<textarea data-comment="' + id + '" rows="' + rows + '" placeholder="Type, or paste a screenshot">' + esc(st.comments[id] || '') + '</textarea></label>' +
           '<div class="rv-shots">' + shotsHtml(id) + '</div><div class="rv-cfoot"><button type="button" class="rv-csend" data-csend="' + id + '">Send this comment</button><span class="rv-cstate" aria-live="polite">' + cstate(id) + '</span></div></div>';
  }
  function refreshBox(id) {
    var b = $('[data-cbox="' + id + '"]'); if (!b) return;
    $('.rv-shots', b).innerHTML = shotsHtml(id); $('.rv-cstate', b).textContent = cstate(id);
  }
  $('#rv-changes').innerHTML = changed.map(function (p, i) {
    var pairs = PAIRS[p.id] = pairsOf(p);
    return '<article class="rv-sec" id="sec-' + p.id + '" data-id="' + p.id + '"><header><span class="n">' + String(i + 1).padStart(2, '0') + '</span><div><h3>' + esc(p.title) + '</h3><p>' + esc(WHY[p.id] || '') + '</p></div></header>' +
           '<div class="rv-vis"></div>' + changeList(pairs) +
           ask(p.id, [['B', 'B · is good (proposed)', true], ['A', 'A · was better (current)'], ['same', 'No difference to me']]) + '</article>';
  }).join('');
  $('#rv-new').innerHTML = fresh.map(function (p) {
    return '<article class="rv-sec" id="sec-' + p.id + '" data-id="' + p.id + '"><header><span class="n new">New</span><div><h3>' + esc(p.title.replace(' (new)', '')) + '</h3></div></header>' +
           '<div class="rv-img single">' + img(p, 'after') + '</div>' + ask(p.id, [['keep', 'Keep it'], ['remove', 'Remove it'], ['change', 'Keep it, changed']]) + '</article>';
  }).join('');
  $('#rv-inventory').innerHTML = SECTIONS.map(function (s) {
    var id = 'inv-' + s[0], a = st.answers[id];
    return '<div class="rv-inv-row"><span>' + esc(s[1]) + '</span><div class="rv-ask" data-ask="' + id + '">' + [['keep', 'Keep'], ['remove', 'Remove'], ['change', 'Change']].map(function (o) { return '<button type="button" data-choice="' + o[0] + '" class="' + (a === o[0] ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') +
           '</div><input type="text" data-comment="' + id + '" placeholder="why, in a line" value="' + esc(st.comments[id] || '') + '"></div>';
  }).join('');
  $$('.rv-variants').forEach(function (v) { var a = st.answers[v.getAttribute('data-ask')]; $$('.rv-var', v).forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-choice') === a); }); });
  $$('label.rv-comment > textarea[data-comment="pricing"],label.rv-comment > textarea[data-comment="page"]').forEach(function (t) {
    var id = t.getAttribute('data-comment'), l = t.parentNode, txt = l.firstChild.textContent;
    var w = document.createElement('div'); w.innerHTML = commentBox(id, esc(txt), 3); l.parentNode.replaceChild(w.firstChild, l);
  });

  function draw() {
    changed.forEach(function (p) { var v = $('#sec-' + p.id + ' .rv-vis'); v.innerHTML = mode === 'side' ? side(p, PAIRS[p.id]) : mode === 'slider' ? slider(p, PAIRS[p.id]) : steps(p, PAIRS[p.id]); });
    document.body.classList.toggle('rv-nomarks', !marks);
    $$('.rv-modes [data-mode]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-mode') === mode); b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode)); });
    if (mode === 'side') { $$('.rv-side img').forEach(function (i) { i.addEventListener('load', arrowsSoon); }); arrowsSoon(); }
    if (mode === 'steps') startSteps();
  }

  // arrows from each mark on the left to its partner on the right
  var arrowT;
  function arrowsSoon() { clearTimeout(arrowT); arrowT = setTimeout(arrows, 60); }
  function arrows() {
    $$('.rv-side').forEach(function (g) {
      var svg = $('.rv-arrows', g), gr = g.getBoundingClientRect(); if (!svg) return;
      svg.setAttribute('viewBox', '0 0 ' + gr.width + ' ' + gr.height); svg.setAttribute('width', gr.width); svg.setAttribute('height', gr.height);
      if (getComputedStyle(g).gridTemplateColumns.split(' ').length < 2) { svg.innerHTML = ''; return; }
      var html = '<defs><marker id="rv-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1A7F5A"/></marker></defs>';
      $$('.rv-box.gone', g).forEach(function (b) {
        var n = b.getAttribute('data-n'), a = $('.rv-box.came[data-n="' + n + '"]', g); if (!a) return;
        var br = b.getBoundingClientRect(), ar = a.getBoundingClientRect();
        var x1 = br.right - gr.left, y1 = br.top + br.height / 2 - gr.top, x2 = ar.left - gr.left, y2 = ar.top + ar.height / 2 - gr.top, mx = (x1 + x2) / 2;
        html += '<path class="rv-arrow" d="M' + x1 + ' ' + y1 + ' C' + mx + ' ' + y1 + ' ' + mx + ' ' + y2 + ' ' + (x2 - 2) + ' ' + y2 + '" marker-end="url(#rv-ah)"/>';
      });
      svg.innerHTML = html;
    });
  }
  addEventListener('resize', arrowsSoon);

  // the slider
  document.addEventListener('input', function (e) {
    var r = e.target.closest('.rv-slider input[type=range]'); if (!r) return;
    var s = r.closest('.rv-slider'); s.style.setProperty('--x', r.value + '%');
    var sid = s.closest('.rv-sec').getAttribute('data-id'), value = +r.value;
    clearTimeout(s._t); s._t = setTimeout(function () { log('slider', { section: sid, value: value }); }, 900);
  });

  // the four steps: play when in view, one step every 2.2 s
  var stepIO;
  function show(st4, k) {
    $$('.rv-frame', st4).forEach(function (f) { f.classList.toggle('on', +f.getAttribute('data-k') === k); });
    $$('.dot', st4).forEach(function (b) { b.classList.toggle('on', +b.getAttribute('data-k') === k); });
    st4._k = k;
  }
  function startSteps() {
    if (stepIO) stepIO.disconnect();
    stepIO = new IntersectionObserver(function (ents) { ents.forEach(function (en) { var s = en.target; s._vis = en.isIntersecting; }); }, { threshold: 0.4 });
    $$('.rv-steps').forEach(function (s) {
      s._k = 0; s._play = true; stepIO.observe(s);
      clearInterval(s._iv); s._iv = setInterval(function () { if (s._play && s._vis && document.visibilityState === 'visible') show(s, (s._k + 1) % 4); }, 2200);
    });
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.rv-ctl button'); if (!c) return;
    var s = c.closest('.rv-steps'), act = c.getAttribute('data-act'), id = s.closest('.rv-sec').getAttribute('data-id');
    if (act === 'play') { s._play = !s._play; c.textContent = s._play ? 'Pause' : 'Play'; }
    else if (act === 'prev') { s._play = false; $('[data-act=play]', s).textContent = 'Play'; show(s, (s._k + 3) % 4); }
    else if (act === 'next') { s._play = false; $('[data-act=play]', s).textContent = 'Play'; show(s, (s._k + 1) % 4); }
    else { s._play = false; $('[data-act=play]', s).textContent = 'Play'; show(s, +c.getAttribute('data-k')); }
    log('steps', { section: id, act: act || 'step', k: s._k });
  });

  // mode and marks
  $$('.rv-modes [data-mode]').forEach(function (b) { b.addEventListener('click', function () { mode = st.mode = b.getAttribute('data-mode'); log('mode', { mode: mode }); draw(); }); });
  $('#rv-marks').checked = marks;
  $('#rv-marks').addEventListener('change', function (e) { marks = st.marks = e.target.checked; log('marks', { on: marks }); document.body.classList.toggle('rv-nomarks', !marks); });

  // answers and comments
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ask] [data-choice]'); if (!b) return;
    var g = b.closest('[data-ask]'), id = g.getAttribute('data-ask'), v = b.getAttribute('data-choice');
    st.answers[id] = st.answers[id] === v ? undefined : v;
    $$('[data-choice]', g).forEach(function (x) { x.classList.toggle('on', x.getAttribute('data-choice') === st.answers[id]); });
    log('answer', { ask: id, choice: st.answers[id] || null });
  });
  function note(t) { var id = t.getAttribute('data-comment'), v = t.value.trim(); if (st.comments[id] === v) return id; st.comments[id] = v; log('comment', { on: id, chars: v.length }); return id; }
  var typing = {};
  document.addEventListener('input', function (e) {
    var t = e.target.closest('[data-comment]'); if (!t) return;
    var id = t.getAttribute('data-comment'); clearTimeout(typing[id]);
    var s = t.closest('[data-cbox]'); if (s) $('.rv-cstate', s).textContent = 'Typing… it sends after a pause.';
    typing[id] = setTimeout(function () { note(t); send('pause'); }, 8000);
  });
  document.addEventListener('change', function (e) {
    var t = e.target.closest('[data-comment]'); if (!t) return;
    clearTimeout(typing[t.getAttribute('data-comment')]); note(t); send('left-box');
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-csend]');
    if (b) { var id = b.getAttribute('data-csend'), t = $('[data-comment="' + id + '"]'); clearTimeout(typing[id]); if (t) note(t); log('csend', { on: id }); $('.rv-cstate', b.parentNode).textContent = 'Encrypting and sending…'; send('comment-button'); return; }
    var u = e.target.closest('[data-unshot]');
    if (u) { var sid = u.getAttribute('data-unshot'), s = shots.filter(function (x) { return x.id === sid; })[0]; if (!s) return; shots = shots.filter(function (x) { return x.id !== sid; }); keepShots(); log('unshot', { on: s.on, shot: sid, wasSent: !!s.sent }); refreshBox(s.on); }
  });
  // screenshots: shrunk to 1600 px on the long side, webp where the browser can, under 700 KB
  function shrink(file) {
    return new Promise(function (ok, no) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas');
        c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
        var d = c.toDataURL('image/webp', 0.82); if (d.indexOf('data:image/webp') !== 0) d = c.toDataURL('image/jpeg', 0.82);
        for (var q = 0.7; d.length > MAXSHOT && q > 0.3; q -= 0.15) d = c.toDataURL('image/jpeg', q);
        if (d.length > MAXSHOT) { no(new Error('too large')); return; }
        ok({ data: d, w: c.width, h: c.height });
      };
      im.onerror = function () { URL.revokeObjectURL(u); no(new Error('not an image')); };
      im.src = u;
    });
  }
  async function addShots(id, files) {
    files = files.filter(function (f) { return /^image\//.test(f.type); }); if (!files.length) return false;
    var s = $('[data-cbox="' + id + '"]');
    for (var i = 0; i < files.length; i++) {
      try {
        var r = await shrink(files[i]), sh = { id: Math.random().toString(16).slice(2, 10), on: id, name: files[i].name || 'pasted', type: r.data.slice(5, r.data.indexOf(';')), w: r.w, h: r.h, at: new Date().toISOString(), data: r.data, sent: false };
        shots.push(sh); keepShots(); log('shot', { on: id, shot: sh.id, w: r.w, h: r.h, kb: Math.round(r.data.length * 3 / 4 / 1024) });
      } catch (err) { if (s) $('.rv-cstate', s).textContent = 'That image could not be added (' + err.message + ').'; }
    }
    refreshBox(id); send('shot'); return true;
  }
  document.addEventListener('paste', function (e) {
    var b = e.target.closest && e.target.closest('[data-cbox]'); if (!b || !e.clipboardData) return;
    var fs = Array.prototype.slice.call(e.clipboardData.files || []);
    if (!fs.length) fs = Array.prototype.slice.call(e.clipboardData.items || []).filter(function (it) { return it.kind === 'file'; }).map(function (it) { return it.getAsFile(); }).filter(Boolean);
    if (fs.some(function (f) { return /^image\//.test(f.type); })) { e.preventDefault(); addShots(b.getAttribute('data-cbox'), fs); }
  });
  document.addEventListener('dragover', function (e) { var b = e.target.closest && e.target.closest('[data-cbox]'); if (b) { e.preventDefault(); b.classList.add('drop'); } });
  document.addEventListener('dragleave', function (e) { var b = e.target.closest && e.target.closest('[data-cbox]'); if (b) b.classList.remove('drop'); });
  document.addEventListener('drop', function (e) {
    var b = e.target.closest && e.target.closest('[data-cbox]'); if (!b || !e.dataTransfer) return;
    e.preventDefault(); b.classList.remove('drop'); addShots(b.getAttribute('data-cbox'), Array.prototype.slice.call(e.dataTransfer.files || []));
  });

  // where the reader went: scroll depth and the sections seen
  var depth = 0;
  addEventListener('scroll', function () {
    var h = document.documentElement, p = Math.round((h.scrollTop + innerHeight) / h.scrollHeight * 100);
    [25, 50, 75, 100].forEach(function (m) { if (p >= m && depth < m) { depth = m; log('scroll', { depth: m }); } });
  }, { passive: true });
  var seen = {}, inAt = {};
  var io = new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      var id = en.target.id;
      if (en.isIntersecting) { inAt[id] = Date.now(); if (!seen[id]) { seen[id] = true; log('view', { section: id }); } }
      else if (inAt[id]) { var ms = Date.now() - inAt[id]; inAt[id] = 0; if (ms >= 1500) log('dwell', { section: id, ms: ms }); }
    });
  }, { threshold: 0.35 });
  $$('.rv-sec, .psection').forEach(function (s) { if (s.id) io.observe(s); });

  // every action, so the session can be replayed
  var lastY = Math.round(scrollY), restT;
  function topSection() { var best = null; $$('.rv-sec, .psection').forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= innerHeight * 0.4 && r.bottom > innerHeight * 0.4) best = s.id; }); return best; }
  addEventListener('scroll', function () {
    clearTimeout(restT); restT = setTimeout(function () {
      var y = Math.round(scrollY); if (Math.abs(y - lastY) < 40) return;
      log('scroll-rest', { y: y, of: document.documentElement.scrollHeight, vh: innerHeight, dir: y > lastY ? 'down' : 'up', by: y - lastY, section: topSection() }); lastY = y;
    }, 700);
  }, { passive: true });
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href]'); if (a) log('link', { href: a.getAttribute('href'), text: (a.textContent || '').trim().slice(0, 60) }); }, true);
  document.addEventListener('focusin', function (e) { var t = e.target.closest && e.target.closest('[data-comment],#rv-name,#rv-ref'); if (t) log('focus', { on: t.getAttribute('data-comment') || t.id }); });
  document.addEventListener('copy', function () { var s = String(getSelection() || ''); log('copy', { chars: s.length, text: s.slice(0, 120) }); });
  document.addEventListener('pointerdown', function (e) { var r = e.target.closest && e.target.closest('.rv-slider input[type=range]'); if (r) log('slider-grab', { section: r.closest('.rv-sec').getAttribute('data-id'), from: +r.value }); });
  var rsT; addEventListener('resize', function () { clearTimeout(rsT); rsT = setTimeout(function () { log('resize', { w: innerWidth, h: innerHeight }); }, 800); });
  document.addEventListener('visibilitychange', function () { log('visibility', { state: document.visibilityState }); });
  addEventListener('error', function (e) { log('error', { message: String(e.message || '').slice(0, 200), where: (e.filename || '').split('/').pop() + ':' + e.lineno }); });

  // ---------------------------------------------------------------- what you have said, and sending it
  function answered() { return Object.keys(st.answers).filter(function (k) { return st.answers[k]; }).length + Object.keys(st.comments).filter(function (k) { return st.comments[k]; }).length; }
  function count() { var n = answered(); var c = $('#rv-count'); if (c) c.textContent = n ? n + ' answer' + (n === 1 ? '' : 's') + ' and comments so far' : 'Nothing answered yet'; }
  function summary() {
    var L = ['Review of the proposed home page', 'Reviewer: ' + (whoLine() || '(no name)'), 'Session: ' + st.sid + ', started ' + st.started, ''];
    Object.keys(st.answers).forEach(function (k) { if (st.answers[k]) L.push('Choice ' + k + ': ' + st.answers[k]); });
    Object.keys(st.comments).forEach(function (k) { if (st.comments[k]) L.push('Comment ' + k + ': ' + st.comments[k]); });
    return L.join('\n');
  }
  function pendingShots() { return shots.filter(function (s) { return !s.sent; }).slice(0, PERSEND); }
  function payload(out) { return JSON.stringify({ type: 'riskmandate/review/v1', page: location.pathname, sid: st.sid, seq: st.seq + 1, started: st.started,
    from: ME ? { browser: ME.id, sign_fp: ME.signFp, sign_pub: ME.signPub, box_fp: ME.boxFp, box_pub: ME.boxPub, keys_created: ME.created } : null, who: st.who, answers: st.answers, comments: st.comments, mode: st.mode || 'side', events: st.events.slice(st.sent),
    shots: out.map(function (s) { return { id: s.id, on: s.on, name: s.name, type: s.type, w: s.w, h: s.h, at: s.at, data: s.data }; }) }); }
  $('#rv-download').addEventListener('click', function () { this.href = URL.createObjectURL(new Blob([JSON.stringify(Object.assign({}, st, { shots: shots }), null, 1)], { type: 'application/json' })); log('download'); });
  var say = function (t, cls) { var s = $('#rv-status'); s.textContent = t; s.className = cls || ''; };
  var sending = false, again = null;
  async function send(why) {
    if (sending) { again = again || why; return; }
    var out = pendingShots();
    if (why !== 'button' && st.events.length <= st.sent && !out.length) return;
    sending = true; var upto = st.events.length, t0 = Date.now();
    var ent = { seq: st.seq + 1, at: new Date().toISOString(), why: why, events: [st.sent, upto], shots: out.length, status: 'sending' };
    st.sends.push(ent); if (st.sends.length > 200) st.sends.splice(0, st.sends.length - 200); dbgSoon();
    if (why === 'button') say('Encrypting…');
    try {
      if (!window.crypto || !crypto.subtle || !window.SgEnvelope) throw new Error('This browser cannot encrypt here.');
      var ln = await (await fetch('/assets/review/lane.json', { cache: 'no-store' })).json(); LANE = ln;
      if (!ln || ln.status !== 'open' || !ln.append_token) throw new Error('The review lane is not open.');
      var fp = LANEFP = await SgEnvelope.fingerprint(ln.encrypt_pem);
      if (fp !== ln.encrypt_to) throw new Error('The key does not match its fingerprint.');
      await meP;
      var rec = payload(out), sig = ME ? await RMIdentity.sign(rec) : '';
      var id = 'rm-review-' + st.sid + '-' + Date.now() + '@riskmandate.ai';
      var eml = ['From: web form <site@riskmandate.ai>', 'To: agent <agent@riskmandate.ai>',
        'Subject: Review of the proposed home page: ' + (whoLine() || 'session ' + st.sid).replace(/[\r\n]+/g, ' '),
        'Date: ' + new Date().toUTCString(), 'Message-ID: <' + id + '>', 'X-EmailFS-Kind: notification', 'X-RM-Form: review',
        'X-RM-Page: ' + location.pathname, 'X-RM-Send: ' + why, 'X-RM-Seq: ' + ent.seq,
        'X-RM-Browser: ' + (ME ? ME.id : 'none'), 'X-RM-Signature: ' + (sig ? 'ecdsa-p256-sha256 ' + sig : 'none'), 'Content-Type: text/plain; charset=utf-8'].join('\r\n') +
        '\r\n\r\n' + (summary() + (out.length ? '\n' + out.length + ' screenshot(s) attached in the record.' : '') + '\n\n--- the record, as JSON ---\n' + rec).replace(/\r?\n/g, '\r\n');
      var env = await SgEnvelope.encrypt(ln.encrypt_pem, eml);
      var body = JSON.stringify({ append_token: ln.append_token, payload: env.payload });
      ent.kb = Math.round(body.length / 1024); ent.signed = !!sig;
      var w = await fetch(ln.endpoint + '/api/vault/append/write/' + ln.vault, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: why === 'hidden' && body.length < 60000 });   // a send as the tab goes away outlives the page, if small enough
      var j = null, jt = ''; try { jt = await w.text(); j = JSON.parse(jt); } catch (_) {}
      ent.status = w.status; ent.answer = jt.slice(0, 120); ent.ms = Date.now() - t0;
      if (!w.ok || !j || j.ok !== true) throw new Error('The vault host answered ' + w.status + '.');
      ent.ok = true; st.seq = ent.seq; st.sent = upto; st.lastSent = new Date().toISOString();
      Object.keys(st.comments).forEach(function (k) { if (st.comments[k]) st.csent[k] = { text: st.comments[k], at: st.lastSent }; });
      out.forEach(function (s) { s.sent = st.lastSent; }); keepShots(); save();
      $$('[data-cbox]').forEach(function (b) { refreshBox(b.getAttribute('data-cbox')); });
      if (pendingShots().length) again = again || 'more-shots';
      say(why === 'button' ? 'Sent, encrypted, at ' + new Date().toLocaleTimeString() + '. Thank you.' : 'Saved to the vault at ' + new Date().toLocaleTimeString() + '.', 'ok');
    } catch (err) {
      if (why === 'button') {
        var m = $('#rv-mailto'); m.href = 'mailto:agent@riskmandate.ai?subject=' + encodeURIComponent('Review of the proposed home page') + '&body=' + encodeURIComponent(summary().slice(0, 1800)); m.hidden = false;
        say(String(err && err.message || err) + ' Your answers are saved in this browser; download them, or send them as an email.', 'warn');
      }
      $$('[data-cbox] .rv-cstate').forEach(function (c) { c.textContent = 'Not sent: ' + String(err && err.message || err) + ' It is kept in this browser and will try again.'; });
      ent.ok = false; ent.error = String(err && err.message || err); ent.ms = Date.now() - t0; if (ent.status === 'sending') ent.status = 'not sent'; save();
    } finally { sending = false; if (again) { var w2 = again; again = null; setTimeout(function () { send(w2); }, 400); } }
  }
  $('#rv-send').addEventListener('click', function () { log('send'); send('button'); });
  setInterval(function () { send('auto'); }, 30000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') send('hidden'); });

  // ---------------------------------------------------------------- replies, for this browser only
  // assets/review/replies/index.json names the browsers with notes; <browser id>.json holds envelopes encrypted to that browser's reply key
  async function replies() {
    var m = await meP; if (!m) return;
    var r, ix; try { ix = await (await fetch('/assets/review/replies/index.json', { cache: 'no-store' })).json(); } catch (_) { ix = null; }
    st.repliesChecked = new Date().toISOString();
    if (!ix || !ix.browsers || !ix.browsers[m.id]) { REPLIES = []; dbgSoon(); return; }
    try { r = await fetch('/assets/review/replies/' + m.id + '.json', { cache: 'no-store' }); } catch (_) { return; }
    if (!r.ok) { REPLIES = []; dbgSoon(); return; }
    var j = await r.json(), got = [];
    if (j.box_fp && j.box_fp !== m.boxFp) { REPLIES = []; log('reply-key-mismatch', { expected: j.box_fp, have: m.boxFp }); return; }
    for (var i = 0; i < (j.messages || []).length; i++) {
      var x = j.messages[i];
      try { got.push(Object.assign({ id: x.id, at: x.at }, JSON.parse(await RMIdentity.open(x.enc)))); }
      catch (e) { got.push({ id: x.id, at: x.at, error: String(e && e.message || e) }); }
    }
    REPLIES = got; var rr = st.repliesRead || (st.repliesRead = {});
    got.forEach(function (g) { if (!g.error && !rr[g.id]) { rr[g.id] = new Date().toISOString(); log('reply-read', { reply: g.id }); } });
    var ok = got.filter(function (g) { return !g.error; }); if (!ok.length) { dbgSoon(); return; }
    var box = document.createElement('section'); box.className = 'rv-replies'; box.id = 'rv-replies';
    box.innerHTML = '<span class="rv-rtag">For this browser only</span><h2>' + (ok.length === 1 ? 'A note' : ok.length + ' notes') + ' from RiskMandate, after your feedback</h2>' +
      ok.map(function (g) { return '<article><p class="rv-rmeta">' + esc(g.from || 'RiskMandate') + ' · ' + esc(new Date(g.at).toLocaleString()) + (g.about ? ' · about <a href="#sec-' + esc(g.about) + '">' + esc(g.about) + '</a>' : '') + '</p><p>' + esc(g.text || '').replace(/\n/g, '<br>') + '</p></article>'; }).join('') +
      '<p class="rv-rnote">Encrypted to a key this browser made and has never sent anywhere. Anyone can download the file it came in; only this browser can read it.</p>';
    var at = $('.phero .rv-who'); if (at) at.parentNode.insertBefore(box, at);
    dbgSoon();
  }

  // ---------------------------------------------------------------- the debug column
  var dbgT, dbgW = st.dbgW || 420;
  function dbgSoon() { clearTimeout(dbgT); dbgT = setTimeout(dbg, 200); }
  function dbgOn(on) {
    st.debug = on; document.documentElement.classList.toggle('rv-dbg-on', on); document.documentElement.style.setProperty('--dbg-w', dbgW + 'px');
    var b = $('#rv-dbg-btn'); if (b) b.setAttribute('aria-pressed', String(on)); save(); dbg(); arrowsSoon();
  }
  var hhmmss = function (iso) { return iso ? new Date(iso).toTimeString().slice(0, 8) : ''; };
  var row = function (k, v) { return '<tr><th>' + k + '</th><td>' + v + '</td></tr>'; };
  function brief(e) { var o = {}; Object.keys(e).forEach(function (k) { if (k !== 'at' && k !== 'type') o[k] = e[k]; }); var s = JSON.stringify(o); return s === '{}' ? '' : s.slice(1, -1).replace(/"([a-z_]+)":/gi, '$1: '); }
  function dbg() {
    var p = $('#rv-debug'); if (!p || !st.debug) return;
    var keep = p.scrollTop, unsent = st.events.length - st.sent, pend = shots.filter(function (s) { return !s.sent; }).length;
    var base = Math.max(0, st.events.length - 300), evs = st.events.slice(base);
    var h = '<div class="rv-dbg-grip" title="Drag to resize"></div><header><b>Debug</b><span>what this page knows, and every send</span><button type="button" data-dbg="close" aria-label="Close the debug column">\u00d7</button></header>';
    h += '<section><h4>This browser</h4><table>' + (ME ? row('id', '<code>' + ME.id + '</code>') + row('signing key', 'ECDSA P-256 · ' + ME.signFp) + row('reply key', 'RSA-OAEP 4096 · ' + ME.boxFp) + row('made', esc(ME.created)) + row('kept in', esc(ME.kept)) : row('keys', 'making them…')) +
         row('session', esc(st.sid) + ' · since ' + esc(st.started)) + row('reader', esc(whoLine()) || 'not given') + '</table></section>';
    h += '<section><h4>The lane</h4><table>' + (LANE ? row('host', esc(LANE.endpoint)) + row('vault', esc(LANE.vault) + ' · lane ' + esc(LANE.lane)) + row('encrypts to', esc(LANE.encrypt_to) + (LANEFP === LANE.encrypt_to ? ' <span class="ok">matches the key</span>' : ' <span class="err">does not match</span>')) + row('status', esc(LANE.status)) : row('lane', 'not loaded')) + '</table></section>';
    h += '<section><h4>Now</h4><table>' + row('events', st.events.length + ' kept · ' + unsent + ' not sent yet') + row('screenshots', shots.length + ' · ' + pend + ' waiting') + row('answers', answered() + ' choices and comments') +
         row('next send', sending ? 'sending…' : (unsent || pend) ? 'within 30 s, on leaving a box, or now' : 'nothing new to send') + row('last sent', esc(st.lastSent || 'never')) + '</table>' +
         '<div class="rv-dbg-act"><button type="button" data-dbg="flush">Send now</button><button type="button" data-dbg="copy">Copy the state</button><button type="button" data-dbg="replies">Check for replies</button></div></section>';
    h += '<section><h4>Sends <small>' + st.sends.length + ', newest first</small></h4>' + (st.sends.length ? '<ol class="rv-dbg-sends">' + st.sends.slice().reverse().map(function (s) {
      var cls = s.ok ? 'ok' : s.status === 'sending' ? 'wait' : 'err';
      return '<li class="' + cls + '"><b>#' + s.seq + '</b> ' + hhmmss(s.at) + ' · ' + esc(s.why) + ' · events ' + s.events[0] + '–' + s.events[1] + (s.shots ? ' · ' + s.shots + ' shot' + (s.shots > 1 ? 's' : '') : '') + (s.kb != null ? ' · ' + s.kb + ' KB' : '') + (s.ms != null ? ' · ' + s.ms + ' ms' : '') + (s.signed ? ' · signed' : '') +
             '<br><span class="' + cls + '">' + (s.ok ? 'HTTP ' + s.status + ' ' + esc(s.answer || '') : s.status === 'sending' ? 'sending…' : esc((s.status !== 'not sent' ? 'HTTP ' + s.status + ' · ' : '') + (s.error || ''))) + '</span></li>';
    }).join('') + '</ol>' : '<p class="rv-dbg-none">Nothing sent yet.</p>') + '</section>';
    h += '<section><h4>Replies</h4>' + (REPLIES === null ? '<p class="rv-dbg-none">Not checked yet.</p>' : !REPLIES.length ? '<p class="rv-dbg-none">None for this browser (checked ' + hhmmss(st.repliesChecked) + ').</p>' :
         '<ol class="rv-dbg-sends">' + REPLIES.map(function (r) { return '<li class="' + (r.error ? 'err' : 'ok') + '"><b>' + esc(r.id) + '</b> ' + esc(r.at) + '<br>' + esc(r.error ? 'could not open: ' + r.error : (r.text || '').slice(0, 200)) + '</li>'; }).join('') + '</ol>') + '</section>';
    h += '<section><h4>Events <small>' + (base ? 'the last 300, ' : '') + 'newest first · <i class="dot"></i> not sent yet</small></h4><ol class="rv-dbg-ev">' + evs.map(function (e, i) {
      return '<li class="' + (base + i >= st.sent ? 'unsent' : '') + '"><time>' + hhmmss(e.at) + '</time><b>' + esc(e.type) + '</b> <span>' + esc(brief(e)) + '</span></li>';
    }).reverse().join('') + '</ol></section>';
    h += '<section><h4>State</h4><details><summary>who, answers, comments, as kept in this browser</summary><pre>' + esc(JSON.stringify({ who: st.who, answers: st.answers, comments: st.comments, mode: st.mode, sent: st.sent, seq: st.seq }, null, 1)) + '</pre></details></section>';
    p.innerHTML = h; p.scrollTop = keep;
  }
  (function () {
    var p = document.createElement('aside'); p.id = 'rv-debug'; p.setAttribute('aria-label', 'Debug'); document.body.appendChild(p);
    var b = document.createElement('button'); b.type = 'button'; b.id = 'rv-dbg-btn'; b.className = 'rv-dbg-btn'; b.textContent = 'Debug'; b.setAttribute('aria-pressed', 'false');
    var bar = $('.rv-bar'); if (bar) bar.insertBefore(b, $('#rv-download', bar));
    b.addEventListener('click', function () { dbgOn(!st.debug); log('debug', { on: st.debug }); });
    p.addEventListener('click', function (e) {
      var a = e.target.closest('[data-dbg]'); if (!a) return; var act = a.getAttribute('data-dbg');
      if (act === 'close') { dbgOn(false); log('debug', { on: false }); }
      else if (act === 'flush') { log('flush'); send('debug-button'); }
      else if (act === 'replies') { replies(); }
      else if (act === 'copy') { try { navigator.clipboard.writeText(JSON.stringify(Object.assign({}, st, { browser: ME && { id: ME.id, signFp: ME.signFp, boxFp: ME.boxFp } }), null, 1)); a.textContent = 'Copied'; } catch (_) {} }
    });
    p.addEventListener('pointerdown', function (e) {
      if (!e.target.classList.contains('rv-dbg-grip')) return; e.preventDefault();
      var mv = function (ev) { dbgW = Math.max(280, Math.min(innerWidth - 320, innerWidth - ev.clientX)); document.documentElement.style.setProperty('--dbg-w', dbgW + 'px'); };
      var up = function () { removeEventListener('pointermove', mv); removeEventListener('pointerup', up); st.dbgW = dbgW; save(); arrowsSoon(); };
      addEventListener('pointermove', mv); addEventListener('pointerup', up);
    });
    if (/[?&]debug(=1|&|$)/.test(location.search)) st.debug = true;
    if (st.debug) dbgOn(true);
  })();

  count(); draw(); replies();
})();
