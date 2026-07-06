'use strict';
// rm-dom.js — the RM namespace bootstrap + the `el` DOM helper, ported from
// the website vault's shared runtime (src/.../shared/components/dom.js).
// Text children always go in via createTextNode — vault-derived strings can
// never inject markup. This is the page's XSS boundary; keep it that way.

var RM = window.RM = window.RM || { core: {}, services: {}, components: {}, data: {} };

RM.components.dom = (function () {
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }
  return { el: el };
})();
