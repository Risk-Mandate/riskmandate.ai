'use strict';
// components/io.js — RM.services.siteIo. Reading a file that ships beside the page.
//
// v1.0.0 reduced this to one line of real work. Up to v0.14 the site ran inside
// a host frame whose srcdoc document could not reach the SG bridge and whose
// relative fetch() resolved against the wrong base, so this service tried three
// readers in order — the sg.vfs bridge, a postMessage RPC to the host, then
// plain fetch. There is no frame and no host now: the page is served from the
// same origin as its assets, so a relative fetch() is correct and is the whole
// implementation. The name changed with it — nothing here reads a vault.
//
// Loaded before the components that use it (page components are ordered by
// filename, and "io" precedes "library"/"media").

RM.services.siteIo = (function () {
  function rel(path) { return String(path).replace(/^\//, ''); }

  function read(path, binary) {
    return fetch(rel(path), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('fetch ' + rel(path) + ' -> ' + r.status);
      return binary ? r.arrayBuffer() : r.text();
    });
  }

  return {
    readText  : function (path) { return read(path, false); },
    readBinary: function (path) { return read(path, true); },
    /** Resolve a file to a URL usable as img/iframe src. */
    url: function (path) { return Promise.resolve(rel(path)); }
  };
})();
