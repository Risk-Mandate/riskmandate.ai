// The slide engine: one virtual clock per slide, and declarative reveals read from data- attributes, so a slide
// is mostly markup. The player seeks, pauses and replays a slide through postMessage. Apache-2.0.
//
//   <div id="cv" data-end="12">                       the slide's length in seconds; after it the scene is still
//   data-in="1.5"        fade and rise in at t=1.5    data-out="6"    fade out at t=6
//   data-on="2 5"        class "on" between 2 and 5 (no end: from 2 onwards)
//   data-count="82" data-at="2" data-dur="1.6" [data-dec="1"] [data-pre="£"] [data-suf="%"]   count up
//   data-grow="0.05" data-at="2" data-dur="1.2" [data-axis="h"]   width (or height) grows to 5% of its parent
//   data-draw="1 2.5"    an SVG stroke draws itself between 1 and 2.5
//   window.SLIDE_RENDER = function (t, S) { ... }    anything else, every frame, with the helpers in S
//   ?t=4.5 freezes at 4.5 s · ?static freezes at the end · reduced motion shows the end · ?theme=light
//   The talk player's clock contract (ruv.sgit.ai's assets/clock.js, which the player was ported from), answered by this
//   engine's own clock, so the player pauses, speeds up, seeks and steps every slide and every studio piece:
//   window.RuvClock: pause() play() setRate(r) seek(s) elapsed() paused rate · ?ruvt=12.5 starts 12.5 s in · ?ruvpaused
//   starts paused · ?review shows the end · ?once (a slide already plays once) · window.RUV_STEPS = [{ t, label }], the
//   slide's stops in seconds: its own if it sets them, else data-stops="2 12 30" on #cv, else one per reveal (each data-in,
//   -on, -count, -grow or -draw, named by its text), else the beginning and the middle (the player adds the end). team/dev/briefs/2026-10-29__the-player.md
(function () {
  'use strict'
  var Q = new URLSearchParams(location.search)
  document.documentElement.setAttribute('data-theme', Q.get('theme') === 'light' ? 'light' : 'dark')
  var cv, END = 10, els = {}, rate = 1, paused = false, vBase = 0, anchor = performance.now(), freeze = null
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x }
  var seg = function (t, a, b) { return b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1) }
  var ease = function (x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2 }
  var lerp = function (a, b, k) { return a + (b - a) * k }
  var fmt = function (n, dec) { return Number(n).toLocaleString('en-GB', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }) }
  var now = function () { return paused ? vBase : vBase + (performance.now() - anchor) / 1000 * rate }
  var S = { seg: seg, ease: ease, lerp: lerp, clamp: clamp, fmt: fmt, $: function (id) { return document.getElementById(id) } }
  window.SLIDE = S

  function fit() {
    var w = innerWidth, h = innerHeight, k = Math.min(w / 1280, h / 720)
    cv.style.transform = 'translate(' + (w - 1280 * k) / 2 + 'px,' + (h - 720 * k) / 2 + 'px) scale(' + k + ')'
  }
  function nums(el, name) { return (el.getAttribute(name) || '').trim().split(/\s+/).map(Number) }
  function collect() {
    els.in = [].slice.call(cv.querySelectorAll('[data-in]')).map(function (el) { return { el: el, a: +el.dataset.in, o: el.dataset.out ? +el.dataset.out : null, rise: el.dataset.rise ? +el.dataset.rise : 16 } })
    els.on = [].slice.call(cv.querySelectorAll('[data-on]')).map(function (el) { var n = nums(el, 'data-on'); return { el: el, a: n[0], b: n.length > 1 ? n[1] : Infinity } })
    els.count = [].slice.call(cv.querySelectorAll('[data-count]')).map(function (el) { return { el: el, v: +el.dataset.count, a: +(el.dataset.at || 0), d: +(el.dataset.dur || 1.4), dec: +(el.dataset.dec || 0), pre: el.dataset.pre || '', suf: el.dataset.suf || '' } })
    els.grow = [].slice.call(cv.querySelectorAll('[data-grow]')).map(function (el) { return { el: el, v: +el.dataset.grow, a: +(el.dataset.at || 0), d: +(el.dataset.dur || 1.2), h: el.dataset.axis === 'v' } })
    els.draw = [].slice.call(cv.querySelectorAll('[data-draw]')).map(function (el) { var n = nums(el, 'data-draw'), len = 1000; try { len = el.getTotalLength() } catch (e) {} el.style.strokeDasharray = len; return { el: el, a: n[0], b: n[1], len: len } })
  }
  function render(t) {
    els.in.forEach(function (x) {
      var k = ease(seg(t, x.a, x.a + .55)); if (x.o != null) k *= 1 - ease(seg(t, x.o, x.o + .4))
      x.el.style.opacity = k; if (x.rise) x.el.style.translate = '0 ' + ((1 - k) * x.rise).toFixed(1) + 'px'
      x.el.style.visibility = k > 0 ? '' : 'hidden'
    })
    els.on.forEach(function (x) { x.el.classList.toggle('on', t >= x.a && t < x.b) })
    els.count.forEach(function (x) { x.el.textContent = x.pre + fmt(x.v * ease(seg(t, x.a, x.a + x.d)), x.dec) + x.suf })
    els.grow.forEach(function (x) { var v = (100 * x.v * ease(seg(t, x.a, x.a + x.d))) + '%'; if (x.h) x.el.style.height = v; else x.el.style.width = v })
    els.draw.forEach(function (x) { x.el.style.strokeDashoffset = x.len * (1 - ease(seg(t, x.a, x.b))) })
    if (window.SLIDE_RENDER) try { window.SLIDE_RENDER(t, S) } catch (e) { console.error(e) }
    var bar = cv.querySelector('.bar i'); if (bar) bar.style.width = (100 * clamp(t / END, 0, 1)) + '%'
  }
  function frame() {
    var t = freeze != null ? freeze : now()
    render(Math.min(t, END))
    requestAnimationFrame(frame)
  }
  // a step for every reveal (the editor, 16:20: "every little transition to have a step"): the moment each element starts
  // to appear, labelled by its own text; reveals within 0.6 s are one step (the editor, 18:05: steps that close look the same). null when the slide declares no reveals.
  function revealSteps() {
    var marks = []
    var add = function (t, el) { if (t >= 0 && t <= END) marks.push({ t: t, label: (el.getAttribute('aria-label') || (el.innerText || el.textContent || '').split('\n').map(function (l) { return l.trim() }).filter(Boolean)[0] || '').replace(/\s+/g, ' ').slice(0, 32) }) }   // its first visible line
    els.in.forEach(function (x) { add(x.a, x.el) }); els.on.forEach(function (x) { add(x.a, x.el) })
    els.count.forEach(function (x) { add(x.a, x.el) }); els.grow.forEach(function (x) { add(x.a, x.el) }); els.draw.forEach(function (x) { add(x.a, x.el) })
    if (!marks.length) return null
    marks.sort(function (a, b) { return a.t - b.t })
    var out = []
    marks.forEach(function (m) { var l = out[out.length - 1]; if (l && m.t - l.t < 0.6) { if (!l.label && m.label) l.label = m.label } else out.push({ t: m.t, label: m.label }) })
    if (out[0].t > 0.05) out.unshift({ t: 0, label: 'the beginning' })
    out.forEach(function (x, i) { if (!x.label) x.label = 'step ' + (i + 1) })
    return out.length > 1 ? out : null   // one mark is no steps: the beginning and the middle serve better
  }
  function seek(t) { vBase = Math.max(0, +t || 0); anchor = performance.now(); freeze = null }
  window.RuvClock = {
    get paused() { return paused }, get rate() { return rate },
    pause: function () { if (!paused) { vBase = now(); paused = true } },
    play: function () { if (paused) { anchor = performance.now(); paused = false } },
    setRate: function (r) { vBase = now(); anchor = performance.now(); rate = +r || 1 },
    seek: function (t) { seek(t) },
    elapsed: function () { return freeze != null ? freeze : now() }
  }
  addEventListener('message', function (e) {
    var m = e.data && e.data.slide; if (!m) return
    if (m === 'seek') seek(e.data.t)
    else if (m === 'end') seek(END)
    else if (m === 'pause' && !paused) { vBase = now(); paused = true }
    else if (m === 'play' && paused) { anchor = performance.now(); paused = false }
  })
  addEventListener('keydown', function (e) {        // the player owns the keyboard, even when this frame has focus
    if (parent !== window) { e.preventDefault(); parent.postMessage({ slideKey: e.key }, '*') }
  })
  addEventListener('DOMContentLoaded', function () {
    cv = document.getElementById('cv')
    END = +(cv.dataset.end || 10)
    S.END = END
    if (window.SLIDE_INIT) try { window.SLIDE_INIT(S) } catch (e) { console.error(e) }   // may add elements, so before collect
    END = +(cv.dataset.end || END); S.END = END   // SLIDE_INIT may set the length (a showcase's "end"; studio@ 039)
    collect(); fit(); addEventListener('resize', fit)
    var rm = false; try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}
    if (Q.has('t')) freeze = clamp(+Q.get('t') || 0, 0, END)
    else if (Q.has('static') || Q.has('review') || rm) freeze = END
    if (Q.has('ruvt')) { vBase = Math.max(0, +Q.get('ruvt') || 0); anchor = performance.now() }
    if (Q.has('ruvpaused')) { vBase = now(); paused = true }
    if (!Array.isArray(window.RUV_STEPS)) {
      var st = (cv.dataset.stops || '').trim()
      window.RUV_STEPS = st ? st.split(/\s+/).map(Number).filter(function (x) { return x >= 0 }).map(function (x, i) { return { t: x, label: 'stop ' + (i + 1) } })
                            : revealSteps() || [{ t: 0, label: 'the beginning' }, { t: END / 2, label: 'the middle' }]
    }
    requestAnimationFrame(frame)
  })
})()
