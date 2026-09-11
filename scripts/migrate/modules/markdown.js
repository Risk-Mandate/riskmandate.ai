'use strict';
// core/markdown.js — minimal, pure Markdown parser for first-party release
// notes. Returns a block-token tree; it NEVER emits HTML. Rendering to DOM is
// done by the component via createElement + textContent, so no markup in the
// source can ever be interpreted — injection is impossible by construction.
// Supports: #/##/### headings, - / * bullet lists, **bold**, _italic_, `code`,
// [links](url), and paragraphs separated by blank lines.
//
// v1.0.0 fixed a wrapping bug and added links. A list item written across
// several lines — which is how every release note in this repository is written
// — used to end the list at the first continuation line and render the rest of
// the item as a paragraph. Continuation lines now fold into the item they
// belong to, which is what the source always meant.

RM.core.markdown = (function () {
  var CONT = /^\s+\S/;           // an indented continuation of the line above
  var ITEM = /^\s*[-*]\s+/;      // a bullet

  /**
   * Split a single line into inline runs.
   * @param {string} line
   * @returns {Array<{t:('text'|'strong'|'em'|'code'|'link'), v:string, href?:string}>}
   */
  function inline(line) {
    var runs = [];
    var re = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|_([^_]+)_)/g;
    var last = 0, m;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) runs.push({ t: 'text', v: line.slice(last, m.index) });
      if      (m[2] !== undefined) runs.push({ t: 'strong', v: m[2] });
      else if (m[3] !== undefined) runs.push({ t: 'code',   v: m[3] });
      else if (m[4] !== undefined) runs.push({ t: 'link',   v: m[4], href: m[5] });
      else                         runs.push({ t: 'em',     v: m[6] });
      last = re.lastIndex;
    }
    if (last < line.length) runs.push({ t: 'text', v: line.slice(last) });
    if (runs.length === 0)  runs.push({ t: 'text', v: '' });
    return runs;
  }

  /**
   * Parse Markdown into block tokens.
   * @param {string} md
   * @returns {Array<{type:string, level?:number, runs?:Array, items?:Array}>}
   */
  function parse(md) {
    var lines  = String(md == null ? '' : md).replace(/\r\n?/g, '\n').split('\n');
    var blocks = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (line.trim() === '') { i++; continue; }

      var h = /^(#{1,3})\s+(.*)$/.exec(line);
      if (h) {
        blocks.push({ type: 'heading', level: h[1].length, runs: inline(h[2].trim()) });
        i++; continue;
      }

      if (ITEM.test(line)) {
        var items = [];
        while (i < lines.length && (ITEM.test(lines[i]) || (items.length && CONT.test(lines[i])))) {
          if (ITEM.test(lines[i])) items.push(lines[i].replace(ITEM, ''));
          else items[items.length - 1] += ' ' + lines[i].trim();
          i++;
        }
        blocks.push({ type: 'list', items: items.map(inline) });
        continue;
      }

      var para = [];
      while (i < lines.length && lines[i].trim() !== '' &&
             !/^#{1,3}\s+/.test(lines[i]) && !ITEM.test(lines[i])) {
        para.push(lines[i].trim());
        i++;
      }
      blocks.push({ type: 'paragraph', runs: inline(para.join(' ')) });
    }
    return blocks;
  }

  return { parse: parse, inline: inline };
})();

