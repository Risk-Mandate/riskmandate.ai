'use strict';
// core/markdown.js — minimal, pure Markdown parser for first-party release
// notes. Returns a block-token tree; it NEVER emits HTML. Rendering to DOM is
// done by the component via createElement + textContent, so no markup in the
// source can ever be interpreted — injection is impossible by construction.
// Supports: #/##/### headings, - / * bullet lists, **bold**, _italic_ and
// *italic*, `code`, [links](url), and paragraphs separated by blank lines.
//
// v1.0.0 fixed a wrapping bug and added links. A list item written across
// several lines — which is how every release note in this repository is written
// — used to end the list at the first continuation line and render the rest of
// the item as a paragraph. Continuation lines now fold into the item they
// belong to, which is what the source always meant.
//
// v1.2.1 made the inline runs nest. Emphasis carried a flat string, so a link
// or a code span inside **bold** was never parsed and a reader saw the markdown
// source — brackets, parentheses and all — on a published page. Emphasis now
// carries child runs and the parser recurses into them.

RM.core.markdown = (function () {
  var CONT  = /^\s+\S/;          // an indented continuation of the line above
  var ITEM  = /^\s*[-*]\s+/;     // a bullet
  var DEPTH = 4;                 // emphasis inside emphasis inside emphasis is nobody's release note

  /**
   * Split a single line into inline runs. Emphasis runs carry `runs` (parsed
   * children); code, link and text runs carry `v` (a literal string).
   * @param {string} line
   * @param {number} [depth]
   * @returns {Array<{t:('text'|'strong'|'em'|'code'|'link'), v?:string, runs?:Array, href?:string}>}
   */
  function inline(line, depth) {
    var d = depth || 0;
    var runs = [];
    var re = /(\*\*([\s\S]+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|_([^_]+)_|\*([^*\n]+)\*)/g;
    var last = 0, m;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) runs.push({ t: 'text', v: line.slice(last, m.index) });
      if      (m[3] !== undefined) runs.push({ t: 'code', v: m[3] });
      else if (m[4] !== undefined) runs.push({ t: 'link', v: m[4], href: m[5] });
      else {
        // emphasis: recurse, so a link or a code span inside it is still parsed
        var inner = m[2] !== undefined ? m[2] : (m[6] !== undefined ? m[6] : m[7]);
        var kind  = m[2] !== undefined ? 'strong' : 'em';
        runs.push(d < DEPTH ? { t: kind, runs: inline(inner, d + 1) } : { t: kind, v: inner });
      }
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
        blocks.push({ type: 'list', items: items.map(function (x) { return inline(x); }) });
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
