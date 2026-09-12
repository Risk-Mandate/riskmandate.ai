'use strict';
// components/nav.js — the behaviour on a page that is *not* a link.
//   [data-to]   → smooth in-page scroll to an element id (no hash routing).
//   [data-demo] → open a pre-filled demo enquiry email.
//
// v1.0.0 removed everything else that used to live here. Up to v0.14 the site
// ran inside a host <iframe> and every navigation was a postMessage — rm-nav,
// rm-back, rm-manifest, rm-read. A <button> is not a link, so nothing could be
// deep-linked, bookmarked, opened in a new tab, or crawled. Now each page is
// the document the server sent and each navigation is an <a href>, so the only
// things left to wire are the two that genuinely are not navigation.
//
// The mobile drawer is still injected rather than templated: one file gives
// every page a working menu below the header breakpoint, where .navlinks is
// hidden by CSS.

RM.components.nav = (function () {
  // Every "Book a demo" control opens a mail client with a subject and a
  // starting message. One place to change when booking becomes a real form.
  var DEMO = {
    to     : 'nrparekh@gmail.com',
    subject: 'RiskMandate — demo request',
    body   : [
      'Hi,',
      '',
      'I would like to see a plug profile for one of the agents we already run.',
      '',
      'A little about us:',
      '  • Organisation:',
      '  • Roughly how many agents we are running:',
      '  • The agent we would want to look at first:',
      '  • Anything already in place (register, IdP, detection tooling):',
      '',
      'Thanks,'
    ].join('\n')
  };

  function demoHref() {
    return 'mailto:' + DEMO.to +
      '?subject=' + encodeURIComponent(DEMO.subject) +
      '&body='    + encodeURIComponent(DEMO.body);
  }

  function openDemo() { window.location.href = demoHref(); }

  function scrollTo(doc, id) {
    var t = doc.getElementById(id);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Inject the hamburger toggle and wire the drawer open/close. Idempotent.
  function wireMobileNav(doc) {
    var top = doc.querySelector('.top');
    if (!top) return;
    var wrap  = top.querySelector('.wrap');
    var links = top.querySelector('.navlinks');
    if (!wrap || !links || top.querySelector('.navtoggle')) return;

    var burger = doc.createElement('button');
    burger.className = 'navtoggle';
    burger.setAttribute('type', 'button');
    burger.setAttribute('aria-label', 'Toggle navigation');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-controls', 'sitenav');
    for (var i = 0; i < 3; i++) burger.appendChild(doc.createElement('span'));
    links.id = links.id || 'sitenav';
    var demo = wrap.querySelector('.demo');
    if (demo) wrap.insertBefore(burger, demo); else wrap.appendChild(burger);

    function set(open) {
      top.classList.toggle('nav-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      set(!top.classList.contains('nav-open'));
    });
    // Following a real nav link closes the drawer; the group header does not.
    links.addEventListener('click', function (e) {
      var b = e.target.closest('button, a');
      if (b && !b.classList.contains('navgroup-btn')) set(false);
    });
    doc.addEventListener('click', function (e) {
      if (top.classList.contains('nav-open') && !top.contains(e.target)) set(false);
    });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    var view = doc.defaultView || window;
    view.addEventListener('resize', function () { if (view.innerWidth > 980) set(false); });
  }

  /** @param {Document} doc */
  function wire(doc) {
    doc.querySelectorAll('[data-to]').forEach(function (elm) {
      elm.addEventListener('click', function () { scrollTo(doc, elm.getAttribute('data-to')); });
    });
    doc.querySelectorAll('[data-demo], .demo').forEach(function (elm) {
      elm.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); openDemo(); });
    });
    wireMobileNav(doc);
  }

  return { wire: wire, scrollTo: scrollTo, demoHref: demoHref, openDemo: openDemo };
})();
