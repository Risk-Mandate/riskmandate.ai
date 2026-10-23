// desk.js — the LinkedIn desk: the items in order on the left, the selected one on the right, ready to paste.
// Reads assets/linkedin/items.json (written by scripts/linkedin/build.mjs from scripts/linkedin/items.mjs).
// Copying uses the Clipboard API: an article goes as text/html with text/plain beside it, so LinkedIn's editor
// takes the headings, lists, links and pictures; a picture goes as image/png. Which items are done is kept in this
// browser only, as a convenience; the record of what went out is the item's `published` and `url`, committed.
(async function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var KEY = 'rm-linkedin-desk-v1';
  var mine = (function () { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (_) { return {}; } })();
  var keep = function () { try { localStorage.setItem(KEY, JSON.stringify(mine)); } catch (_) {} };
  var d; try { d = await (await fetch('assets/linkedin/items.json', { cache: 'no-store' })).json(); } catch (e) { $('#li-item').textContent = 'The items did not load: ' + e.message; return; }
  var ON_SITE = location.hostname === 'riskmandate.ai';
  var local = function (u) { return ON_SITE ? u : u.replace('https://riskmandate.ai/', '/'); };     // preview the pictures before they are live
  var WHO = { page: 'the RiskMandate page', dinis: 'Dinis', nimay: 'Nimay' };
  var done = function (it) { return !!(it.published || (mine[it.id] && mine[it.id].done)); };

  function list() {
    var day = null;
    $('#li-list').innerHTML = d.items.map(function (it) {
      var dd = (it.when || '').split(',')[0], h = dd !== day ? '<div class="li-day">' + esc(dd) + '</div>' : ''; day = dd;
      return h + '<button type="button" class="li-pick' + (done(it) ? ' done' : '') + '" data-id="' + it.id + '"><span class="n">' + it.seq + '</span><span><b>' + esc(it.title) + '</b><small><span class="li-chip ' + it.kind + '">' + it.kind + '</span>' + esc(WHO[it.who]) + (done(it) ? ' · done' : '') + '</small></span></button>';
    }).join('');
    $('#li-todo').innerHTML = d.todo.length ? d.todo.map(function (t) { return '<li><a href="' + esc(t.file) + '">' + esc(t.label) + '</a></li>'; }).join('') : '<li>Every article has a LinkedIn item.</li>';
  }

  async function copyRich(html, text) {
    if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([text], { type: 'text/plain' }) })]);
    } else { var el = document.createElement('div'); el.contentEditable = 'true'; el.innerHTML = html; document.body.appendChild(el); var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); document.execCommand('copy'); s.removeAllRanges(); el.remove(); }
  }
  async function copyText(t) { if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(t); else { var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); } }
  async function copyImage(url) {      // the clipboard takes PNG: draw the JPEG on a canvas first
    var im = new Image(); im.crossOrigin = 'anonymous'; im.src = local(url); await im.decode();
    var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0);
    var blob = await new Promise(function (ok) { c.toBlob(ok, 'image/png'); });
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  }
  var plainOf = function (html) { var el = document.createElement('div'); el.innerHTML = html.replace(/<li>/g, '<li>• '); return el.innerText.replace(/\n{3,}/g, '\n\n').trim(); };
  function said(btn, t) { var o = $('.li-ok', btn.closest('.li-item')); if (o) { o.textContent = t; clearTimeout(o._t); o._t = setTimeout(function () { o.textContent = ''; }, 4000); } }

  function show(id) {
    var it = d.items.filter(function (x) { return x.id === id; })[0] || d.items[0];
    $$('.li-pick').forEach(function (b) { b.setAttribute('aria-current', String(b.getAttribute('data-id') === it.id)); });
    var img = function (i) { var u = 'https://riskmandate.ai/assets/linkedin/' + i.file; return '<div class="li-img"><img src="' + esc(local(u)) + '" alt="' + esc(i.alt) + '" loading="lazy"><div><span>' + esc(i.cover ? 'Cover, 1280 × 720' : i.alt) + '</span><button type="button" class="li-mini" data-copyimg="' + esc(u) + '">Copy picture</button><a class="li-mini" href="' + esc(local(u)) + '" download="' + esc(i.file) + '">Download</a></div></div>'; };
    var h = '<div class="li-meta"><span class="li-chip ' + it.kind + '">' + it.kind + '</span><span>' + it.seq + ' of ' + d.items.length + ' · ' + esc(it.when) + ' · for ' + esc(WHO[it.who]) + '</span>' + (it.chars ? '<span class="li-cnt">' + it.chars + ' characters' + (it.words ? ', about ' + it.words + ' words' : '') + (it.kind === 'post' ? ' of 3,000' : '') + '</span>' : '') + '</div>' +
            '<h2>' + esc(it.title) + '</h2><p class="li-why">' + esc(it.why || '') + '</p>';
    if (it.kind === 'article') {
      h += '<div class="li-acts"><button type="button" class="pri" data-act="rich">Copy the article</button><button type="button" data-act="title">Copy the title</button><button type="button" data-act="src">Copy the HTML</button><button type="button" data-act="plain">Copy as plain text</button></div><p class="li-ok"></p>' +
           '<div class="li-h">How to paste it</div><p class="li-why">On the page: <b>Create → Write article</b>. Upload the cover first (below), paste the title, then click into the body and paste the article. If a picture does not come through, use its own Copy picture button and paste it where the article says.</p>' +
           '<div class="li-h">Pictures, cover first</div><div class="li-imgs">' + it.images.map(img).join('') + '</div>' +
           '<div class="li-h">The article, as it will paste</div><div class="li-prev">' + it.html.replace(/https:\/\/riskmandate\.ai\//g, ON_SITE ? 'https://riskmandate.ai/' : '/') + '</div>' +
           '<div class="li-h">The HTML</div><textarea class="li-src" readonly>' + esc(it.html) + '</textarea>';
    } else if (it.kind === 'post') {
      h += '<div class="li-acts"><button type="button" class="pri" data-act="text">Copy the post</button>' + (it.images.length ? '<button type="button" data-copyimg="https://riskmandate.ai/assets/linkedin/' + esc(it.images[0].file) + '">Copy the picture</button>' : '') + '</div><p class="li-ok"></p>' +
           '<div class="li-h">How to paste it</div><p class="li-why">' + (it.who === 'page' ? 'On the page: <b>Create → Start a post</b>.' : 'From ' + esc(WHO[it.who]) + '\'s own profile: <b>Start a post</b>.') + ' Paste the text, then paste or upload the picture. LinkedIn turns the first link into a preview card; remove the card if the picture is there.</p>' +
           '<div class="li-h">The post</div><pre class="li-post">' + esc(it.text) + '</pre>' +
           (it.images.length ? '<div class="li-h">The picture</div><div class="li-imgs">' + it.images.map(img).join('') + '</div>' : '');
    } else {
      h += '<p class="li-ok"></p><div class="li-h">How to paste it</div><p class="li-why">On the profile: <b>Add profile section → Position</b>. Copy each field into the form.</p>' +
           '<table class="li-fields">' + it.fields.map(function (f, i) { return '<tr><th>' + esc(f[0]) + '</th><td>' + esc(f[1]) + '<span class="li-cnt">' + f[1].length + '</span><button type="button" class="li-mini" data-field="' + i + '">Copy</button></td></tr>'; }).join('') + '</table>';
    }
    h += '<div class="li-h">What it retells</div><ul class="li-sources">' + (it.sources || []).map(function (s) { return '<li><a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a></li>'; }).join('') + '</ul>';
    var m = mine[it.id] || {};
    h += '<div class="li-done">' + (it.published ? 'Published ' + esc(it.published) + (it.url ? ': <a href="' + esc(it.url) + '" target="_blank" rel="noopener">' + esc(it.url) + '</a>' : '') :
         '<label><input type="checkbox" data-done' + (m.done ? ' checked' : '') + '> Done, in this browser</label><input type="url" data-url placeholder="the post\'s address, to record in items.mjs" value="' + esc(m.url || '') + '">') + '</div>';
    var box = $('#li-item'); box.innerHTML = h; box._it = it;
    try { history.replaceState(null, '', '#' + it.id); } catch (_) {}
  }

  document.addEventListener('click', async function (e) {
    var p = e.target.closest('.li-pick'); if (p) { show(p.getAttribute('data-id')); if (innerWidth < 900) $('#li-item').scrollIntoView({ behavior: 'smooth' }); return; }
    var box = $('#li-item'), it = box._it; if (!it || !box.contains(e.target)) return;
    var b = e.target.closest('[data-act],[data-copyimg],[data-field]'); if (!b) return;
    try {
      var a = b.getAttribute('data-act');
      if (a === 'rich') { await copyRich(it.html, plainOf(it.html)); said(b, 'Copied, with its pictures. Paste it into the article body.'); }
      else if (a === 'title') { await copyText(it.title); said(b, 'Title copied.'); }
      else if (a === 'src') { await copyText(it.html); said(b, 'HTML copied.'); }
      else if (a === 'plain') { await copyText(plainOf(it.html)); said(b, 'Plain text copied.'); }
      else if (a === 'text') { await copyText(it.text); said(b, 'Post copied.'); }
      else if (b.hasAttribute('data-copyimg')) { await copyImage(b.getAttribute('data-copyimg')); said(b, 'Picture copied. Paste it into LinkedIn.'); }
      else if (b.hasAttribute('data-field')) { await copyText(it.fields[+b.getAttribute('data-field')][1]); said(b, it.fields[+b.getAttribute('data-field')][0] + ' copied.'); }
    } catch (err) { said(b, 'This browser would not copy (' + (err && err.message || err) + '). Select the text and copy it by hand.'); }
  });
  document.addEventListener('change', function (e) {
    var it = $('#li-item')._it; if (!it) return;
    if (e.target.matches('[data-done]')) { mine[it.id] = Object.assign(mine[it.id] || {}, { done: e.target.checked, at: new Date().toISOString() }); keep(); list(); show(it.id); }
    if (e.target.matches('[data-url]')) { mine[it.id] = Object.assign(mine[it.id] || {}, { url: e.target.value.trim() }); keep(); }
  });
  list(); show((location.hash || '').slice(1) || (d.items.filter(function (x) { return !done(x); })[0] || d.items[0]).id);
})();
