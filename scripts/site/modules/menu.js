'use strict';
// components/menu.js — <rm-menu>. The one shared header menu, on every page, so
// the nav is built by a single piece of code. Renders the homepage's section
// links first, then the top-level pages, marking the current page active.
//
// A run of contiguous pages sharing a `group` string collapses into one entry:
// a hover/click dropdown labelled by the group, with the members as children. A
// single-member group renders flat — no dropdown for one item.
//
// v1.0.0: every entry is an <a href>. The old menu emitted <button> elements
// that asked a host frame to swap an iframe's srcdoc, which meant the links did
// not exist as far as a crawler, a bookmark or a middle-click was concerned.
// The group header stays a <button> because it opens a panel rather than going
// anywhere — that is the one control here that is genuinely not a link.

(function () {
  var dom = RM.components.dom;

  RM.components.Menu = class extends HTMLElement {
    connectedCallback() {
      var self = this;
      this._onDocClick = function (e) {
        self.querySelectorAll('.navgroup.open').forEach(function (g) {
          if (!g.contains(e.target)) g.classList.remove('open');
        });
      };
      document.addEventListener('click', this._onDocClick);
      this._render();
    }
    disconnectedCallback() {
      document.removeEventListener('click', this._onDocClick);
    }

    // On the homepage a section link scrolls; on any other page it is a link
    // back to the homepage at that anchor. Same markup either way.
    _section(s) {
      var home = !(RM.data && RM.data.currentPage);
      var a = dom.el('a', { class: 'seclink', href: home ? '#' + s.to : 'index.html#' + s.to }, [s.label]);
      if (home) a.addEventListener('click', function (e) {
        e.preventDefault();
        RM.components.nav.scrollTo(document, s.to);
      });
      return a;
    }

    _pagelink(p, extra) {
      var active = p.name === (RM.data && RM.data.currentPage);
      var attrs  = { class: 'pagelink' + (extra ? ' ' + extra : '') + (active ? ' active' : ''), href: p.file };
      if (active) attrs['aria-current'] = 'page';
      return dom.el('a', attrs, [p.label]);
    }

    _group(name, members) {
      var self    = this;
      var current = RM.data && RM.data.currentPage;
      var active  = members.some(function (m) { return m.name === current; });
      var car     = dom.el('span',   { class: 'navgroup-car', 'aria-hidden': 'true' }, ['▾']);
      var btn     = dom.el('button', { class: 'navgroup-btn' + (active ? ' active' : ''), type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' }, [name, car]);
      var panel   = dom.el('div',    { class: 'navmenu' }, members.map(function (m) { return self._pagelink(m, 'navchild'); }));
      var wrap    = dom.el('span',   { class: 'navgroup' + (active ? ' active' : '') }, [btn, panel]);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = wrap.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      return wrap;
    }

    _render() {
      var sections = (RM.data && RM.data.sections) || [];
      var pages    = (RM.data && RM.data.pages)    || [];
      var self     = this;
      this.textContent = '';
      sections.forEach(function (s) { self.appendChild(self._section(s)); });
      var i = 0;
      while (i < pages.length) {
        var p = pages[i];
        if (!p.group) { self.appendChild(self._pagelink(p)); i++; continue; }
        var g = p.group, members = [];
        while (i < pages.length && pages[i].group === g) { members.push(pages[i]); i++; }
        if (members.length === 1) self.appendChild(self._pagelink(members[0]));
        else                      self.appendChild(self._group(g, members));
      }
    }
  };

  customElements.define('rm-menu', RM.components.Menu);
})();
