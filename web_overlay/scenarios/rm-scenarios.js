'use strict';
// rm-scenarios.js — the interactive "How long will you accept this risk?"
// engine. Ported VERBATIM (logic unchanged) from the rm-scenarios content
// vault (dm42qcaw: src/pages/scenarios/components/scenarios.js) so the repo
// owns the code and the vault owns the data (RM.data.scenarios, fetched and
// decrypted at runtime by rm-scenarios-loader.js).
// All content strings render through dom.el text nodes — no innerHTML.

(function () {
  var dom = RM.components.dom;

  function pad(x) { return x < 10 ? '0' + x : '' + x; }
  function ts() {
    var d = new Date();
    return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  function series() { return (RM.data.scenarios && RM.data.scenarios.series) || { buttons: {}, intervals: [] }; }
  function liveScenarios() {
    return ((RM.data.scenarios && RM.data.scenarios.scenarios) || []).filter(function (s) { return s.live; });
  }

  // ---- one scenario card (internal, plain functions + closure state) ----
  function buildCard(sc) {
    var S = series();
    var state = { beat: 0, hook: null, escape: null, interval: null, log: [] };

    var head = dom.el('div', { class: 'sc-head' }, [
      dom.el('span', { class: 'sc-num' }, ['\u2116' + sc.n]),
      dom.el('span', { class: 'sc-domain' }, [sc.domain]),
      dom.el('span', { class: 'sc-dots', 'aria-hidden': 'true' })
    ]);
    var body = dom.el('div', { class: 'sc-body', 'aria-live': 'polite' });
    var logK = dom.el('span', { class: 'sc-log-k' }, ['RECORD']);
    var logV = dom.el('span', { class: 'sc-log-v' }, ['--:--:-- awaiting first decision']);
    var log = dom.el('div', { class: 'sc-log' }, [logK, logV]);
    var card = dom.el('article', { class: 'sc-card', id: 'sc-' + sc.id }, [head, body, log]);

    function stamp(text) {
      state.log.push({ t: ts(), v: text });
      logV.textContent = '';
      state.log.forEach(function (e, i) {
        if (i) logV.appendChild(dom.el('span', { class: 'sc-log-sep' }, [' \u00b7 ']));
        logV.appendChild(dom.el('span', { class: 'sc-log-t' }, [e.t + ' ']));
        logV.appendChild(document.createTextNode(e.v));
      });
    }
    function dots() {
      var d = head.querySelector('.sc-dots');
      d.textContent = '';
      for (var i = 0; i < 4; i++) d.appendChild(dom.el('span', { class: 'sc-dot' + (i <= state.beat ? ' on' : '') }));
    }
    function btn(label, cls, fn) {
      var b = dom.el('button', { type: 'button', class: 'sc-btn ' + (cls || '') }, [label]);
      b.addEventListener('click', fn);
      return b;
    }
    function frame(kids) { body.textContent = ''; kids.forEach(function (k) { body.appendChild(k); }); dots(); }

    function beatHook() {
      state.beat = 0;
      frame([
        dom.el('p', { class: 'sc-q' }, [sc.hook]),
        dom.el('div', { class: 'sc-row' }, [
          btn(S.buttons.no, 'refuse', function () { state.hook = 'refused'; stamp('refused'); beatEscape(); }),
          btn(S.buttons.yes, 'ghost', function () { state.hook = 'complied'; stamp('said yes'); beatEscape(); })
        ])
      ]);
    }
    function beatEscape() {
      state.beat = 1;
      var lead = state.hook === 'refused' ? 'Fair.' : 'Bold.';
      frame([
        dom.el('p', { class: 'sc-lead' }, [lead]),
        dom.el('p', { class: 'sc-q' }, [sc.escape]),
        dom.el('div', { class: 'sc-row' }, [
          btn(S.buttons.deflect, 'ghost', function () { state.escape = 'deflected'; stamp('\u201cnot relevant to me\u201d'); beatReveal(); }),
          btn(S.buttons.admit, 'ghost', function () { state.escape = 'admitted'; stamp('\u201cit might be\u201d'); beatReveal(); })
        ])
      ]);
    }
    function beatReveal() {
      state.beat = 2;
      var lead = state.escape === 'deflected'
        ? 'You said not relevant. But if you\u2019ve ever ' + sc.act + ' \u2014 you already did.'
        : 'Right. If you\u2019ve ever ' + sc.act + ' \u2014 you already did.';
      frame([
        dom.el('span', { class: 'sc-tag red' }, ['Already happening']),
        dom.el('p', { class: 'sc-lead strong' }, [lead]),
        dom.el('p', { class: 'sc-reveal' }, [sc.reveal]),
        dom.el('div', { class: 'sc-row' }, [
          btn('So what\u2019s the real question?', 'refuse', function () { stamp('reveal seen'); beatInterval(); })
        ])
      ]);
    }
    function beatInterval() {
      state.beat = 3;
      var grid = dom.el('div', { class: 'sc-wp' });
      S.intervals.forEach(function (w) {
        var b = dom.el('button', { type: 'button', class: 'sc-opt tone-' + w.tone, 'data-id': w.id }, [
          dom.el('span', { class: 'sc-opt-id' }, [w.id]),
          dom.el('span', { class: 'sc-opt-sev' }, [w.sev])
        ]);
        b.addEventListener('click', function () { state.interval = w; stamp('accepted \u00b7 ' + w.id); beatDone(); });
        grid.appendChild(b);
      });
      frame([
        dom.el('p', { class: 'sc-lead' }, ['So the question was never whether.']),
        dom.el('p', { class: 'sc-q' }, ['How long will you accept it?']),
        grid
      ]);
    }
    function beatDone() {
      var w = state.interval;
      frame([
        dom.el('div', { class: 'sc-done tone-' + w.tone }, [
          dom.el('p', { class: 'sc-done-h' }, [w.sev + ' window \u00b7 ' + w.id]),
          dom.el('p', { class: 'sc-done-d' }, [w.desc]),
          dom.el('div', { class: 'sc-creates' }, [
            dom.el('p', { class: 'sc-creates-k' }, ['YOU JUST CREATED']),
            dom.el('p', { class: 'sc-creates-v' }, ['Owner (you) \u00b7 Expiry (' + w.id + ') \u00b7 A record (below)'])
          ])
        ]),
        dom.el('div', { class: 'sc-row' }, [
          btn('Run it again', 'ghost', function () {
            state.hook = null; state.escape = null; state.interval = null; state.log = [];
            logV.textContent = '--:--:-- awaiting first decision';
            beatHook();
          })
        ])
      ]);
      try {
        window.dispatchEvent(new CustomEvent('rm-scenario-done', {
          detail: { id: sc.id, n: sc.n, title: sc.title, hook: state.hook, escape: state.escape, interval: w.id, sev: w.sev, tone: w.tone, at: ts() }
        }));
      } catch (e) { /* old DOM */ }
    }

    beatHook();
    return card;
  }

  RM.components.Scenarios = class extends HTMLElement {
    connectedCallback() {
      var self = this;
      liveScenarios().forEach(function (sc) { self.appendChild(buildCard(sc)); });
    }
  };

  RM.components.ScenariosRecord = class extends HTMLElement {
    connectedCallback() {
      this._done = {};
      this._list = dom.el('div', { class: 'sr-list' });
      this._empty = dom.el('p', { class: 'sr-empty' }, ['No acceptances yet \u2014 the record fills in as you decide above.']);
      this.appendChild(dom.el('p', { class: 'sr-h' }, ['YOUR RECORD \u00b7 THIS SESSION']));
      this.appendChild(this._list);
      this.appendChild(dom.el('p', { class: 'sr-note' }, ['Held in this page\u2019s memory only. Nothing is stored or sent.']));
      this._list.appendChild(this._empty);
      var self = this;
      this._onDone = function (e) { self._add(e.detail); };
      window.addEventListener('rm-scenario-done', this._onDone);
    }
    disconnectedCallback() { window.removeEventListener('rm-scenario-done', this._onDone); }
    _add(d) {
      this._done[d.id] = d;
      this._list.textContent = '';
      var keys = Object.keys(this._done), self = this;
      keys.forEach(function (k) {
        var e = self._done[k];
        self._list.appendChild(dom.el('div', { class: 'sr-row' }, [
          dom.el('span', { class: 'sr-t' }, [e.at]),
          dom.el('span', { class: 'sr-title' }, ['\u2116' + e.n + ' ' + e.title]),
          dom.el('span', { class: 'sr-int tone-' + e.tone }, [e.interval + ' \u00b7 ' + e.sev])
        ]));
      });
    }
  };

  customElements.define('rm-scenarios', RM.components.Scenarios);
  customElements.define('rm-scenarios-record', RM.components.ScenariosRecord);
})();
