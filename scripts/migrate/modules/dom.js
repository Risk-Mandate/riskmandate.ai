'use strict';
// components/dom.js — tiny DOM helpers shared by components. `el` builds an
// element with attributes and children; text children always go in via
// textContent. `renderMarkdownInto` turns core/markdown tokens into real DOM
// nodes (never an HTML string), so fetched release notes cannot inject markup.

RM.components.dom = (function () {
  // A link in a markdown note may only go somewhere harmless: same-document,
  // same-origin relative, https, or mailto. Anything else — javascript:, data:,
  // a protocol-relative host — renders as the text it was, and goes nowhere.
  var SAFE = /^(?:https:\/\/|mailto:|#|[^:/?#]*(?:[/?#]|$))/i;

  /**
   * @param {string} tag
   * @param {Object<string,string>} [attrs]
   * @param {Array<Node|string>} [children]
   * @returns {HTMLElement}
   */
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

  /** Render inline runs into a parent element. */
  function appendRuns(parent, runs) {
    runs.forEach(function (run) {
      if      (run.t === 'strong') parent.appendChild(el('strong', null, [run.v]));
      else if (run.t === 'em')     parent.appendChild(el('em',     null, [run.v]));
      else if (run.t === 'code')   parent.appendChild(el('code',   null, [run.v]));
      else if (run.t === 'link')   parent.appendChild(SAFE.test(run.href)
        ? el('a', { href: run.href }, [run.v])
        : document.createTextNode(run.v));
      else parent.appendChild(document.createTextNode(run.v));
    });
  }

  /**
   * Render markdown block tokens into a container as DOM nodes.
   * @param {HTMLElement} container
   * @param {Array} blocks  output of RM.core.markdown.parse
   */
  function renderMarkdownInto(container, blocks) {
    blocks.forEach(function (b) {
      if (b.type === 'heading') {
        var h = el('h' + (b.level + 1)); // ## release title -> h3, etc.
        appendRuns(h, b.runs);
        container.appendChild(h);
      } else if (b.type === 'list') {
        var ul = el('ul');
        b.items.forEach(function (runs) {
          var li = el('li');
          appendRuns(li, runs);
          ul.appendChild(li);
        });
        container.appendChild(ul);
      } else {
        var p = el('p');
        appendRuns(p, b.runs);
        container.appendChild(p);
      }
    });
  }

  return { el: el, appendRuns: appendRuns, renderMarkdownInto: renderMarkdownInto };
})();

