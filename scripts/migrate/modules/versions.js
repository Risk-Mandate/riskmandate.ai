'use strict';
// components/versions.js — <rm-versions>. The version record for the site,
// rendered from the files that are the record: versions/index.json lists every
// release, and versions/<version>.md holds that release's notes.
//
// Nothing is inlined. The old release log baked all 35 notes into the page at
// build time, which made a 97KB document whose contents you could only read by
// reading the document. Here the index is fetched, each entry names the file it
// came from, and that file is one click away as plain markdown — so whatever
// this renders, you can go and check.
//
// Notes load on demand: the newest release is expanded on arrival, the rest
// fetch when opened.

(function () {
  var dom   = RM.components.dom;
  var io    = RM.services.siteIo;
  var BASE  = 'versions/';
  var INDEX = BASE + 'index.json';

  RM.components.Versions = class extends HTMLElement {
    connectedCallback() {
      var self = this;
      this._list   = dom.el('div', { class: 'rel-list' });
      this._status = dom.el('p',   { class: 'rel-status' }, ['Loading the version record…']);
      this.appendChild(this._status);
      this.appendChild(this._list);

      io.readText(INDEX)
        .then(function (txt) { self._render(JSON.parse(txt)); })
        .catch(function (err) {
          self._status.textContent = 'The version record could not be loaded.';
          if (window.console) console.error('versions: load failed', err);
        });
    }

    _render(data) {
      var self     = this;
      var releases = data.releases || [];
      this._status.remove();
      if (!releases.length) { this._list.textContent = 'No releases yet.'; return; }
      releases.forEach(function (rel, i) { self._list.appendChild(self._entry(rel, i === 0)); });
    }

    _entry(rel, open) {
      var self = this;
      var body = dom.el('div', { class: 'rel-body' });
      var meta = [dom.el('a', { class: 'rel-src', href: BASE + rel.file }, [rel.file])];
      if (rel.commit) meta.push(dom.el('span', { class: 'rel-commit' }, ['built from ' + rel.commit]));
      if (rel.reconstructed) meta.push(dom.el('span', { class: 'rel-flag' }, ['reconstructed, not recorded']));

      var summary = dom.el('summary', { class: 'rel-head' }, [
        dom.el('span', { class: 'rel-ver'   }, ['v' + rel.version]),
        dom.el('span', { class: 'rel-date'  }, [rel.date  || '']),
        dom.el('span', { class: 'rel-title' }, [rel.title || ''])
      ]);
      var article = dom.el('details', { class: 'rel' }, [
        summary, dom.el('div', { class: 'rel-meta' }, meta), body
      ]);
      if (open) article.open = true;

      var loaded = false;
      function load() {
        if (loaded) return;
        loaded = true;
        io.readText(BASE + rel.file)
          .then(function (md) { dom.renderMarkdownInto(body, RM.core.markdown.parse(md)); })
          .catch(function () { body.textContent = 'These notes could not be loaded.'; });
      }
      article.addEventListener('toggle', function () { if (article.open) load(); });
      if (open) load();
      return article;
    }
  };

  customElements.define('rm-versions', RM.components.Versions);
})();

