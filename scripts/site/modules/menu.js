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
    // A page that lives in a folder (site/stories/) sets RM.data.base to "/" so that the one
    // shared page list, whose files are named from the site root, still resolves from there.
    // A folder's index page is linked as the folder: /stories/, not /stories/index.html.
    _href(file) {
      if (/^https:\/\//.test(file)) return file;   // the code on GitHub: an address, not a page here
      var base = (RM.data && RM.data.base) || '';
      return base + file.replace(/(^|\/)index\.html$/, '$1');
    }

    _section(s) {
      var home = !(RM.data && RM.data.currentPage);
      var a = dom.el('a', { class: 'seclink', href: home ? '#' + s.to : this._href('index.html') + '#' + s.to }, [s.label]);
      if (home) a.addEventListener('click', function (e) {
        e.preventDefault();
        RM.components.nav.scrollTo(document, s.to);
      });
      return a;
    }

    _pagelink(p, extra) {
      var active = p.name === (RM.data && RM.data.currentPage);
      var attrs  = { class: 'pagelink' + (extra ? ' ' + extra : '') + (active ? ' active' : ''), href: this._href(p.file) };
      if (active) attrs['aria-current'] = 'page';
      if (/^https:\/\//.test(p.file)) { attrs.target = '_blank'; attrs.rel = 'noopener'; }
      return dom.el('a', attrs, [p.label]);
    }

    _group(name, members) {
      var self    = this;
      var current = RM.data && RM.data.currentPage;
      var active  = members.some(function (m) { return m.name === current; });
      var car     = dom.el('span',   { class: 'navgroup-car', 'aria-hidden': 'true' }, ['▾']);
      var btn     = dom.el('button', { class: 'navgroup-btn' + (active ? ' active' : ''), type: 'button', 'aria-haspopup': 'true', 'aria-expanded': 'false' }, [name, car]);
      var panel   = dom.el('div',    { class: 'navmenu' + (members.some(function (m) { return m.section; }) ? ' navwide' : '') }, this._columns(members));
      var wrap    = dom.el('span',   { class: 'navgroup' + (active ? ' active' : '') }, [btn, panel]);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = wrap.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      return wrap;
    }

    // A dropdown whose pages name a `section` is drawn as columns, one per section, each under
    // its heading: the 3 November review kept the header to three entries, so the rest of the site
    // sits one level down instead of being dropped. Without sections it is the plain list it was.
    _columns(members) {
      var self = this;
      if (!members.some(function (m) { return m.section; })) return members.map(function (m) { return self._pagelink(m, 'navchild'); });
      var cols = [], last = null;
      members.forEach(function (m) {
        if (m.section !== last) { cols.push({ name: m.section, items: [] }); last = m.section; }
        cols[cols.length - 1].items.push(self._pagelink(m, 'navchild'));
      });
      return [dom.el('div', { class: 'navcols' }, cols.map(function (c) {
        return dom.el('div', { class: 'navcol' }, [dom.el('span', { class: 'navsec' }, [c.name])].concat(c.items));
      }))];
    }

    // The columns' few rules live here, with the code that draws them, so that one module carries
    // them to every page; each page's own CSS still styles the bar, the panel and the links.
    _style() {
      if (document.getElementById('rm-menu-css')) return;
      var css = '.navmenu.navwide{min-width:0;padding:10px}' +
        '.navcols{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(190px,250px);gap:4px 12px}' +
        '.navcol{display:flex;flex-direction:column;gap:2px;min-width:0}' +
        '.navcols .navchild{white-space:normal;line-height:1.35}' +
        '.navsec{display:block;padding:8px 12px 4px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--green,#1A7F5A)}' +
        '@media (min-width:901px){.navmenu.navwide{left:auto;right:0;transform:none}}' +
        '@media (min-width:901px) and (max-width:1180px){.navcols{grid-auto-flow:row;grid-template-columns:repeat(2,minmax(190px,250px))}}' +
        '@media (max-width:900px){.navcols{display:flex;flex-direction:column}.navsec{padding:12px 14px 4px}}';
      var st = document.createElement('style'); st.id = 'rm-menu-css'; st.textContent = css; document.head.appendChild(st);
    }

    _render() {
      this._style();
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
