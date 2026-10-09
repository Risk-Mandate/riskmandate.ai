// app.js — the review feedback dashboard, a vault app in the review vault.
//
// What it shows comes from window.RV_DATA, inlined by scripts/review/build-dashboard.mjs each time the lane is
// drained (read-feedback.mjs runs it): every message the review pages sent, with its signature check, and every
// browser's pinned keys. Screenshots stay as files in feedback/ and are read through the vault bridge
// (sg.vfs.read) when shown, or by a plain URL when the vault is served as files. Nothing here writes to the
// vault and nothing leaves the page. Routing is in memory, never through location.hash (the vault host's frame
// would re-navigate), and the page posts sg-app-ready once it has drawn.
;(function () {
  'use strict'
  const D = window.RV_DATA || { records: [], browsers: {} }
  const $ = (s, r) => (r || document).querySelector(s)
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s))
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
  const day = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : ''
  const time = (iso) => iso ? new Date(iso).toTimeString().slice(0, 5) : ''
  const when = (iso) => iso ? day(iso) + ', ' + time(iso) : ''
  const secs = (ms) => ms >= 60000 ? Math.round(ms / 60000) + ' min' : Math.round(ms / 1000) + ' s'

  // ------------------------------------------------------------------ the model
  const TITLES = Object.assign({ pricing: 'The prices: A, B, C or D', mode: 'Which way of showing a change', page: 'Anything else about the page' }, D.titles || {})
  const title = (id) => id.startsWith('inv-') ? 'Keep or remove · ' + (D.inventory && D.inventory[id.slice(4)] || id.slice(4)) : (TITLES[id] || id)
  const CHOICE = { B: 'B · proposed is good', A: 'A · current was better', same: 'No difference', keep: 'Keep', remove: 'Remove', change: 'Change' }
  const choiceLabel = (q, v) => q === 'pricing' ? 'Prices ' + v : q === 'mode' ? ({ A: 'Side by side', B: 'Slider', C: 'Four steps' }[v] || v) : (CHOICE[v] || v)
  const ORDER = (D.order || []).concat(['roles', 'questions', 'pricing', 'mode', 'page'])
  const rank = (id) => { const i = ORDER.indexOf(id); return id.startsWith('inv-') ? 500 + (D.inventoryOrder || []).indexOf(id.slice(4)) : i < 0 ? 400 : i }

  const recs = (D.records || []).slice().sort((a, b) => a.received.localeCompare(b.received))
  const people = new Map()
  for (const r of recs) {
    const key = r.browser || 's-' + r.sid
    let p = people.get(key)
    if (!p) { p = { key, browser: r.browser || null, sids: new Set(), who: {}, sends: [], events: [], answers: {}, comments: {}, shots: [], sig: new Set(), pages: new Set(), first: r.received }; people.set(key, p) }
    p.sids.add(r.sid); p.sends.push(r); p.last = r.received; p.sig.add(r.sig || 'unsigned'); if (r.page) p.pages.add(r.page)
    if (r.who && (r.who.name || r.who.email)) p.who = r.who
    Object.assign(p.answers, r.answers || {}); Object.assign(p.comments, r.comments || {})
    for (const e of r.events || []) if (typeof e.at === 'string') p.events.push(Object.assign({ sid: r.sid }, e))   // before v1.38.6 a slider event's value overwrote its time; those are left out
    for (const s of r.shots || []) p.shots.push(Object.assign({ received: r.received, who: p.who }, s))
  }
  for (const p of people.values()) {
    const seen = new Set()
    p.events = p.events.sort((a, b) => a.at.localeCompare(b.at)).filter((e) => { const k = e.at + e.type + JSON.stringify(e); if (seen.has(k)) return false; seen.add(k); return true })
    for (const k of Object.keys(p.answers)) if (!p.answers[k]) delete p.answers[k]
    for (const k of Object.keys(p.comments)) if (!p.comments[k]) delete p.comments[k]
  }
  const P = Array.from(people.values()).sort((a, b) => b.last.localeCompare(a.last))
  const name = (p) => p.who.name || p.who.email || (p.browser ? 'browser ' + p.browser.slice(0, 9) : 'session ' + [...p.sids][0])
  const sigPill = (p) => { const s = [...p.sig]; const bad = s.find((x) => x.startsWith('bad')); return bad ? '<span class="pill bad">' + esc(bad) + '</span>' : s.includes('signed') ? '<span class="pill">signed</span>' : '<span class="pill dim">unsigned</span>' }
  const allEvents = P.flatMap((p) => p.events.map((e) => Object.assign({ person: p }, e)))
  const allComments = P.flatMap((p) => Object.entries(p.comments).map(([q, text]) => ({ p, q, text, shots: p.shots.filter((s) => s.on === q) })))
  const lonelyShots = P.flatMap((p) => p.shots.filter((s) => !p.comments[s.on]).map((s) => ({ p, q: s.on, text: '', shots: [s] })))

  // ------------------------------------------------------------------ charts, in SVG, coloured only by token classes
  function bars(items, opts) {      // items: [{label, n}]
    const max = Math.max(1, ...items.map((i) => i.n))
    return items.map((i) => '<div class="bar-row"><span title="' + esc(i.label) + '">' + esc(i.label) + '</span><div><div class="b" style="width:' + (i.n / max * 100).toFixed(1) + '%"></div></div><span class="n">' + i.n + '</span></div>').join('') || '<p class="none">' + esc((opts && opts.none) || 'Nothing yet.') + '</p>'
  }
  function timeline(list) {          // sends per day, or per hour when it all fits in two days
    if (!list.length) return '<p class="none">Nothing received yet.</p>'
    const t0 = new Date(list[0].received), t1 = new Date(list[list.length - 1].received)
    const hourly = (t1 - t0) < 2 * 864e5, step = hourly ? 36e5 : 864e5
    const start = Math.floor(t0 / step) * step, n = Math.max(1, Math.floor((t1 - start) / step) + 1)
    const counts = new Array(n).fill(0); list.forEach((r) => { counts[Math.floor((new Date(r.received) - start) / step)]++ })
    const W = 720, H = 150, bw = W / n, max = Math.max(...counts)
    let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + (H + 22) + '" role="img" aria-label="Messages received per ' + (hourly ? 'hour' : 'day') + '"><line class="axis" x1="0" y1="' + H + '" x2="' + W + '" y2="' + H + '"/>'
    counts.forEach((c, i) => {
      const h = c / max * (H - 16), x = i * bw
      if (c) s += '<rect class="bar" x="' + (x + bw * 0.12).toFixed(1) + '" y="' + (H - h).toFixed(1) + '" width="' + (bw * 0.76).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3"><title>' + c + '</title></rect><text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - h - 4).toFixed(1) + '" text-anchor="middle">' + c + '</text>'
      if (i % Math.ceil(n / 8) === 0) { const d = new Date(start + i * step); s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H + 15) + '" text-anchor="middle">' + (hourly ? d.toTimeString().slice(0, 5) : day(d.toISOString())) + '</text>' }
    })
    return s + '</svg><p class="muted" style="margin:6px 0 0;font-size:12px">Messages received per ' + (hourly ? 'hour' : 'day') + '.</p>'
  }
  const MARK = { answer: 1, comment: 2, mode: 3, slider: 4, 'slider-grab': 4, steps: 4, shot: 5, csend: 2, send: 2, link: 3 }
  function scrollChart(evs) {        // one session: where the reader was on the page, over time, with what they did
    const pts = evs.filter((e) => e.type === 'scroll-rest' || e.type === 'scroll' || e.type === 'open')
    if (evs.length < 2) return '<p class="none">Too few events to draw.</p>'
    const t0 = new Date(evs[0].at), t1 = new Date(evs[evs.length - 1].at), span = Math.max(1, t1 - t0)
    const W = 720, H = 180, X = (iso) => (new Date(iso) - t0) / span * W
    let depth = 0, d = ''
    for (const e of pts) {
      const y = e.type === 'scroll-rest' ? Math.min(1, (e.y + (e.vh || 0)) / (e.of || 1)) : e.type === 'scroll' ? e.depth / 100 : 0
      depth = y; d += (d ? ' L' : 'M') + X(e.at).toFixed(1) + ' ' + (H - depth * H).toFixed(1)
    }
    if (d) d += ' L' + W + ' ' + (H - depth * H).toFixed(1)
    let s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + (H + 24) + '" role="img" aria-label="Scroll position over the session"><line class="axis" x1="0" y1="' + H + '" x2="' + W + '" y2="' + H + '"/><line class="axis" x1="0" y1="0" x2="0" y2="' + H + '"/>'
    s += '<text x="4" y="12">bottom of the page</text><text x="4" y="' + (H - 4) + '">top</text>'
    if (d) s += '<path class="line" d="' + d + '"/>'
    evs.forEach((e) => { const c = MARK[e.type]; if (c) s += '<circle class="c' + c + '" cx="' + X(e.at).toFixed(1) + '" cy="' + (H + 10) + '" r="4"><title>' + esc(time(e.at) + ' ' + e.type + ' ' + brief(e)) + '</title></circle>' })
    s += '<text x="0" y="' + (H + 24) + '">' + time(evs[0].at) + '</text><text x="' + W + '" y="' + (H + 24) + '" text-anchor="end">' + time(evs[evs.length - 1].at) + ' · ' + secs(span) + '</text></svg>'
    return s + '<div class="key"><span><i class="k1"></i>a choice</span><span><i class="k2"></i>a comment or a send</span><span><i class="k3"></i>a mode or a link</span><span><i class="k4"></i>slider and steps</span><span><i class="k5"></i>a screenshot</span></div>'
  }
  function brief(e) { const o = {}; for (const k of Object.keys(e)) if (!['at', 'type', 'sid', 'person'].includes(k)) o[k] = e[k]; const s = JSON.stringify(o); return s === '{}' ? '' : s.slice(1, -1).replace(/"([a-z_]+)":/gi, '$1: ').replace(/"/g, '') }
  function shotsHtml(list) {
    if (!list.length) return ''
    return '<div class="shots">' + list.map((s) => '<button type="button" data-shot="' + esc(s.file) + '"><img data-src="feedback/' + esc(s.file) + '" alt="Screenshot on ' + esc(title(s.on)) + '"><span class="cap">' + esc(s.w + '×' + s.h + ' · ' + when(s.at || s.received)) + '</span></button>').join('') + '</div>'
  }
  async function loadImages(root) {
    for (const img of $$('img[data-src]', root)) {
      const path = img.getAttribute('data-src'); img.removeAttribute('data-src')
      try {
        if (window.sg && sg.vfs && sg.vfs.read) {
          const b = await sg.vfs.read(path)
          const blob = b instanceof Blob ? b : new Blob([b instanceof ArrayBuffer || ArrayBuffer.isView(b) ? b : new Uint8Array(b)], { type: /\.png$/.test(path) ? 'image/png' : /\.jpe?g$/.test(path) ? 'image/jpeg' : 'image/webp' })
          img.src = URL.createObjectURL(blob)
        } else img.src = path
      } catch (_) { img.alt = 'Could not read ' + path }
    }
  }

  // ------------------------------------------------------------------ the views
  const answersFor = (q) => P.filter((p) => p.answers[q]).map((p) => ({ p, v: p.answers[q] }))
  const questions = () => [...new Set(P.flatMap((p) => Object.keys(p.answers)))].sort((a, b) => rank(a) - rank(b))
  const V = {}
  V.overview = () => {
    const nEv = allEvents.length, nShots = P.reduce((n, p) => n + p.shots.length, 0)
    let h = '<div class="tiles">' + [[recs.length, 'messages received'], [P.length, 'readers (browsers)'], [allComments.length, 'comments'], [questions().length, 'questions answered'], [nShots, 'screenshots'], [nEv, 'events']].map((t) => '<div class="tile"><b>' + t[0] + '</b><span>' + t[1] + '</span></div>').join('') + '</div>'
    h += '<div class="grid2"><div class="card"><h2>When it arrived</h2>' + timeline(recs) + '</div>'
    h += '<div class="card"><h2>What readers did</h2><p class="lede">Events by type, every reader together.</p>' + bars(countBy(allEvents, (e) => e.type).slice(0, 12)) + '</div></div>'
    h += '<div class="card"><h2>The latest comments</h2>' + (allComments.length ? allComments.slice(0, 4).map(commentHtml).join('') + '<p style="margin:8px 0 0"><button type="button" class="chip ver" data-go="comments">All the comments</button></p>' : '<p class="none">No comments yet.</p>') + '</div>'
    return h
  }
  function countBy(list, f) { const m = new Map(); for (const x of list) { const k = f(x); m.set(k, (m.get(k) || 0) + 1) } return [...m].map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n) }
  V.choices = () => {
    const qs = questions(); if (!qs.length) return '<p class="none">No choices yet.</p>'
    const groups = [['The changed sections and the new ones', qs.filter((q) => !q.startsWith('inv-') && q !== 'pricing' && q !== 'mode')], ['The prices, and this page', qs.filter((q) => q === 'pricing' || q === 'mode')], ['Keep or remove', qs.filter((q) => q.startsWith('inv-'))]]
    return groups.filter((g) => g[1].length).map((g) => '<div class="card"><h2>' + esc(g[0]) + '</h2>' + g[1].map((q) => {
      const a = answersFor(q), c = countBy(a, (x) => x.v), tot = a.length
      return '<div class="q"><span class="t">' + esc(title(q)) + '</span><div class="stack">' + c.map((x, i) => '<span class="k' + (i % 5 + 1) + '" style="width:' + (x.n / tot * 100) + '%" title="' + esc(choiceLabel(q, x.label) + ': ' + x.n) + '">' + x.n + '</span>').join('') + '</div>' +
             '<span class="who">' + c.map((x, i) => '<i class="k' + (i % 5 + 1) + '" style="display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px"></i>' + esc(choiceLabel(q, x.label)) + ': ' + a.filter((y) => y.v === x.label).map((y) => esc(name(y.p))).join(', ')).join(' · ') + '</span></div>'
    }).join('') + '</div>').join('') + '<p class="muted" style="font-size:12px">Each reader counts once per question, with their latest choice.</p>'
  }
  const commentHtml = (c) => '<div class="cm"><div class="meta"><b>' + esc(name(c.p)) + '</b> on <b>' + esc(title(c.q)) + '</b>' + (c.p.answers[c.q] ? ' · chose ' + esc(choiceLabel(c.q, c.p.answers[c.q])) : '') + ' · ' + esc(when(c.p.last)) + '</div>' + (c.text ? '<p>' + esc(c.text) + '</p>' : '') + shotsHtml(c.shots) + '</div>'
  V.comments = () => {
    const all = allComments.concat(lonelyShots).sort((a, b) => rank(a.q) - rank(b.q))
    if (!all.length) return '<p class="none">No comments or screenshots yet.</p>'
    const by = new Map(); all.forEach((c) => { by.set(c.q, (by.get(c.q) || []).concat([c])) })
    return [...by].map(([q, list]) => '<div class="card"><h2>' + esc(title(q)) + '</h2>' + list.map(commentHtml).join('') + '</div>').join('')
  }
  V.readers = () => P.length ? '<div class="card wrapx"><table class="t"><thead><tr><th>Reader</th><th>Browser</th><th>Signature</th><th>Messages</th><th>Events</th><th>Answers</th><th>First</th><th>Last</th></tr></thead><tbody>' + P.map((p) =>
    '<tr class="go" data-person="' + esc(p.key) + '"><td><b>' + esc(name(p)) + '</b>' + (p.who.email && p.who.name ? '<br><span class="muted">' + esc(p.who.email) + '</span>' : '') + '</td><td class="mono">' + esc(p.browser || 'none (before v1.38.5)') + '</td><td>' + sigPill(p) + '</td><td>' + p.sends.length + '</td><td>' + p.events.length + '</td><td>' + (Object.keys(p.answers).length + Object.keys(p.comments).length) + '</td><td>' + esc(when(p.first)) + '</td><td>' + esc(when(p.last)) + '</td></tr>').join('') + '</tbody></table></div><p class="muted" style="font-size:12px">Select a reader to replay their sessions.</p>' : '<p class="none">No readers yet.</p>'
  let sel = P[0] && P[0].key, filt = null
  V.sessions = () => {
    if (!P.length) return '<p class="none">No sessions yet.</p>'
    const p = people.get(sel) || P[0]
    let h = '<div class="toolbar"><label>Reader <select id="pick">' + P.map((x) => '<option value="' + esc(x.key) + '"' + (x === p ? ' selected' : '') + '>' + esc(name(x)) + ' · ' + x.events.length + ' events</option>').join('') + '</select></label>' + sigPill(p) + '</div>'
    const pin = p.browser && D.browsers && D.browsers[p.browser]
    h += '<div class="card"><h2>' + esc(name(p)) + '</h2><p class="lede">' + (p.browser ? 'Browser <span class="mono">' + esc(p.browser) + '</span>' + (pin ? ', keys pinned ' + esc(when(pin.first_seen)) + ', reply key <span class="mono">' + esc(pin.box_fp) + '</span>' : '') : 'No browser key: sent before v1.38.5') + ' · pages ' + esc([...p.pages].join(', ')) + '</p>'
    const opens = p.events.filter((e) => e.type === 'open'), last = opens[opens.length - 1]
    if (last) h += '<p class="lede">Window ' + esc(last.w + '×' + last.h) + (p.events.some((e) => e.type === 'resize') ? ', resized during the session' : '') + '.</p>'
    h += '</div>'
    for (const sid of [...p.sids]) {
      const evs = p.events.filter((e) => e.sid === sid); if (!evs.length) continue
      const dwell = countDwell(evs)
      h += '<div class="card"><h2>Session ' + esc(sid) + ' · ' + esc(when(evs[0].at)) + '</h2><p class="lede">' + evs.length + ' events. The line is how far down the page the reader was; the dots are what they did.</p>' + scrollChart(evs)
      if (dwell.length) h += '<h3>Time on each section</h3>' + bars(dwell.map((d) => ({ label: d.label, n: Math.round(d.ms / 1000) })), {}) + '<p class="muted" style="font-size:12px;margin:4px 0 0">Seconds, while a third or more of the section was on screen.</p>'
      h += '<h3>Every event</h3>' + evs.map(evRow).join('') + '</div>'
    }
    return h
  }
  function countDwell(evs) { const m = new Map(); evs.filter((e) => e.type === 'dwell').forEach((e) => m.set(e.section, (m.get(e.section) || 0) + e.ms)); return [...m].map(([s, ms]) => ({ label: s.replace(/^sec-/, ''), ms })).sort((a, b) => b.ms - a.ms) }
  const HI = new Set(['answer', 'comment', 'csend', 'send', 'shot', 'mode', 'reply-read', 'identity'])
  const evRow = (e) => '<div class="ev' + (HI.has(e.type) ? ' hi' : '') + '"><time>' + time(e.at) + ':' + new Date(e.at).toTimeString().slice(6, 8) + '</time><b>' + esc(e.type) + '</b><span>' + esc(brief(e)) + '</span></div>'
  V.events = () => {
    const types = countBy(allEvents, (e) => e.type)
    const list = allEvents.filter((e) => !filt || e.type === filt).sort((a, b) => b.at.localeCompare(a.at)).slice(0, 400)
    return '<div class="card"><h2>By type</h2>' + bars(types) + '</div><div class="card"><h2>The latest ' + list.length + (filt ? ' ' + esc(filt) : '') + ' events</h2><div class="toolbar filters"><button type="button" data-filt="" aria-pressed="' + !filt + '">all</button>' + types.map((t) => '<button type="button" data-filt="' + esc(t.label) + '" aria-pressed="' + (filt === t.label) + '">' + esc(t.label) + '</button>').join('') + '</div>' +
      list.map((e) => evRow(Object.assign({}, e, { who: name(e.person) }))).join('') + '</div>'
  }
  V.sends = () => recs.length ? '<div class="card wrapx"><table class="t"><thead><tr><th>Received</th><th>Reader</th><th>Why</th><th>Seq</th><th>Events</th><th>Shots</th><th>Signature</th><th>File</th></tr></thead><tbody>' + recs.slice().reverse().map((r) =>
    '<tr><td>' + esc(when(r.received)) + '</td><td>' + esc((r.who && (r.who.name || r.who.email)) || r.browser || r.sid) + '</td><td>' + esc(r.send || '') + '</td><td>' + esc(r.seq || '') + '</td><td>' + (r.events || []).length + '</td><td>' + (r.shots || []).length + '</td><td>' + (r.sig === 'signed' ? '<span class="pill">signed</span>' : String(r.sig || '').startsWith('bad') ? '<span class="pill bad">' + esc(r.sig) + '</span>' : '<span class="pill dim">unsigned</span>') + '</td><td class="mono">' + esc(r.file) + '</td></tr>').join('') + '</tbody></table></div>' : '<p class="none">Nothing drained yet.</p>'
  V.about = () => '<div class="card prose"><h2>What this vault is</h2><p>riskmandate.ai\'s private review pages (the first is <span class="mono">home-diff.html</span>) send what each reader does and says, encrypted in their browser to this vault\'s lane key, onto the <span class="mono">review</span> append lane of this vault. The private key that opens them is kept in this vault, encrypted with a secret derived from the vault\'s write key.</p>' +
    '<h2>How it is drained</h2><p>A browser cannot drain this lane: the vault bridge lists a lane with an enum key derived from the read key, and this lane\'s is derived from the write key, as the agent-contact pattern on sgit.ai does. So it is drained the way the games\' telemetry is: a script that lists the lane, decrypts each message, files it in <span class="mono">feedback/</span>, marks it processed, and rebuilds this page with the data inlined. Then commit and push.</p>' +
    '<pre class="code">REVIEW_KEY=&lt;this vault\'s key&gt; node scripts/review/read-feedback.mjs --vault &lt;a clone of this vault&gt;\ncd &lt;the clone&gt; &amp;&amp; sgit commit -m "@Agent review feedback: n received" &amp;&amp; sgit push</pre>' +
    '<p>Each send since v1.38.5 is signed by the reader\'s browser. The drain checks the signature, checks that the browser id is its signing key\'s fingerprint, and pins the browser\'s keys in <span class="mono">review-lane/browsers/</span>. <span class="mono">scripts/review/reply.mjs</span> encrypts a note to a pinned reply key; the site publishes it and only that browser can read it.</p>' +
    '<h2>This build</h2><p>Built ' + esc(when(D.built)) + ' from ' + recs.length + ' messages. Version ' + esc(D.version || '') + '.</p>' + (D.versions || []).map((v) => '<p><b>' + esc(v.version) + '</b> · ' + esc(v.date) + ' · ' + esc(v.note) + '</p>').join('') + '</div>'

  // ------------------------------------------------------------------ the shell: nav, title, previous and next
  const I = { overview: '<path d="M3 13h4v8H3zM10 8h4v13h-4zM17 3h4v18h-4z"/>', choices: '<path d="M4 6h16M4 12h10M4 18h6"/>', comments: '<path d="M4 5h16v11H8l-4 4z"/>', readers: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.6c1.9.7 3.1 2.6 3.5 5.4"/>', sessions: '<path d="M3 17l5-6 4 3 4-7 5 5"/>', events: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>', sends: '<path d="M4 4h16v16H4zM4 9h16M9 9v11"/>', about: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>' }
  const ROUTES = [
    { id: 'overview', g: 1, label: 'Overview', title: 'What the review pages received', sub: 'Every message drained from the review lane, by every reader, at a glance.', count: () => recs.length },
    { id: 'choices', g: 1, label: 'Choices', title: 'Which version each reader chose', sub: 'For each question, the latest choice of each reader.', count: () => questions().length },
    { id: 'comments', g: 1, label: 'Comments', title: 'What readers wrote, and showed', sub: 'Every comment, by section, with the screenshots pasted into it.', count: () => allComments.length },
    { id: 'readers', g: 2, label: 'Readers', title: 'Who sent feedback', sub: 'One row per browser: its key, its signature check, and how much it sent.', count: () => P.length },
    { id: 'sessions', g: 2, label: 'Sessions', title: 'The page as the reader saw it', sub: 'Where they were on the page, minute by minute, and everything they did.', count: () => [...people.values()].reduce((n, p) => n + p.sids.size, 0) },
    { id: 'events', g: 3, label: 'Events', title: 'Every action, every reader', sub: 'The events the pages recorded, by type and in order.', count: () => allEvents.length },
    { id: 'sends', g: 3, label: 'Drain log', title: 'Every message, as it came off the lane', sub: 'When it arrived, why the page sent it, and whether its signature held.', count: () => recs.length },
    { id: 'about', g: 4, label: 'How this works', title: 'How this vault works', sub: 'The lane, the drain, the signatures and the replies.', count: () => '' }
  ]
  const GROUPS = { 1: 'Read', 2: 'People', 3: 'Signals', 4: 'About' }
  $('#nav').innerHTML = Object.keys(GROUPS).map((g) => '<div class="gb"><div class="grp"><span class="n">0' + g + '</span><span class="t">' + GROUPS[g] + '</span></div><ul>' + ROUTES.filter((r) => String(r.g) === g).map((r) => '<li><button type="button" data-go="' + r.id + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + I[r.id] + '</svg>' + r.label + '<span class="count">' + r.count() + '</span></button></li>').join('') + '</ul></div>').join('')
  $('#built-chip').textContent = 'built ' + when(D.built)
  let cur = 'overview'
  function go(id, focus) {
    const i = ROUTES.findIndex((r) => r.id === id), r = ROUTES[i < 0 ? 0 : i]; cur = r.id
    $('#crumb').textContent = 'Review feedback / ' + GROUPS[r.g] + ' / ' + r.label
    $('#title').textContent = r.title; $('#sub').textContent = r.sub; document.title = r.label + ' · Review feedback'
    $$('#nav [data-go]').forEach((b) => { if (b.getAttribute('data-go') === r.id) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current') })
    const pv = ROUTES[ROUTES.indexOf(r) - 1], nx = ROUTES[ROUTES.indexOf(r) + 1]
    $('#prev').hidden = !pv; $('#next').hidden = !nx
    if (pv) { $('#prev').textContent = '← ' + pv.label; $('#prev').dataset.go = pv.id }
    if (nx) { $('#next').textContent = nx.label + ' →'; $('#next').dataset.go = nx.id }
    const v = $('#view'); v.innerHTML = V[r.id](); loadImages(v)
    if (focus) { scrollTo(0, 0); $('#title').focus() }
  }
  document.addEventListener('click', (e) => {
    const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); go(g.getAttribute('data-go'), true); return }
    const p = e.target.closest('[data-person]'); if (p) { sel = p.getAttribute('data-person'); go('sessions', true); return }
    const f = e.target.closest('[data-filt]'); if (f) { filt = f.getAttribute('data-filt') || null; go('events'); return }
    const s = e.target.closest('[data-shot]'); if (s) { const img = $('img', s); const z = document.createElement('div'); z.className = 'zoom'; z.innerHTML = '<img alt="">'; $('img', z).src = img.src; z.addEventListener('click', () => z.remove()); document.body.appendChild(z); return }
  })
  document.addEventListener('change', (e) => { if (e.target.id === 'pick') { sel = e.target.value; go('sessions') } })
  go('overview')
  try { window.parent && window.parent !== window && window.parent.postMessage({ type: 'sg-app-ready' }, '*') } catch (_) {}
}())
