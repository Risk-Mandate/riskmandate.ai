// identity.js — this browser's own keys, for the review pages.
//
// On first use the browser makes two key pairs and keeps them in IndexedDB, private halves not extractable:
//   sign  ECDSA P-256: every send is signed with it, so the reader can tell one browser's sends apart from
//         another's and see that they were not altered on the way;
//   box   RSA-OAEP 4096 (SHA-256), as sgit's own identities: what RiskMandate sends back is encrypted to it, in the same v2 envelope as
//         the lane (AES-256-GCM, the key wrapped with RSA-OAEP), so only this browser can read it.
// The browser's id is the fingerprint of its signing key, 'b' + the first 16 hex of SHA-256 over the SPKI DER.
// No name or email is part of it. Clearing the site's data in the browser makes a new one.
// Where IndexedDB is not available (some private windows) the keys last for the tab and `kept` says so.
(function (root) {
  'use strict';
  var te = new TextEncoder(), td = new TextDecoder();
  function b64(bytes) { var s = ''; bytes = new Uint8Array(bytes); for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  function unb64(t) { var bin = atob(t), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }
  function pem(der, label) { return '-----BEGIN ' + label + '-----\n' + b64(der).replace(/.{1,64}/g, '$&\n') + '-----END ' + label + '-----\n'; }
  async function fp(der) { var h = new Uint8Array(await crypto.subtle.digest('SHA-256', der)); return Array.prototype.map.call(h, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, 16); }

  function db() {
    return new Promise(function (ok, no) {
      var r = indexedDB.open('rm-review', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('keys'); };
      r.onsuccess = function () { ok(r.result); }; r.onerror = function () { no(r.error); };
    });
  }
  function io(d, mode, fn) {
    return new Promise(function (ok, no) { var t = d.transaction('keys', mode), s = t.objectStore('keys'), r = fn(s); t.oncomplete = function () { ok(r && r.result); }; t.onerror = function () { no(t.error); }; });
  }

  var me = null;
  async function load() {
    if (me) return me;
    var d = null, rec = null, kept = 'this browser (IndexedDB)';
    try { d = await db(); rec = await io(d, 'readonly', function (s) { return s.get('me'); }); } catch (_) { d = null; kept = 'this tab only: the browser would not keep keys'; }
    if (!rec) {
      var sign = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign', 'verify']);
      var box = await crypto.subtle.generateKey({ name: 'RSA-OAEP', modulusLength: 4096, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, false, ['encrypt', 'decrypt']);
      rec = { sign: sign, box: box, created: new Date().toISOString() };
      if (d) { try { await io(d, 'readwrite', function (s) { return s.put(rec, 'me'); }); } catch (_) { kept = 'this tab only: the browser would not keep keys'; } }
    }
    var sd = await crypto.subtle.exportKey('spki', rec.sign.publicKey), bd = await crypto.subtle.exportKey('spki', rec.box.publicKey);
    var sfp = await fp(sd), bfp = await fp(bd);
    me = { id: 'b' + sfp, signFp: 'sha256:' + sfp, boxFp: 'sha256:' + bfp, signPub: pem(sd, 'PUBLIC KEY'), boxPub: pem(bd, 'PUBLIC KEY'), created: rec.created, kept: kept, _k: rec };
    return me;
  }
  // ECDSA P-256 with SHA-256 over the UTF-8 bytes; the signature is the 64-byte r||s, base64
  async function sign(text) { var m = await load(); return b64(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, m._k.sign.privateKey, te.encode(text))); }
  // open a v2 envelope (.enc text) sent to this browser's box key
  async function open(enc) {
    var m = await load(), e = JSON.parse(atob(enc));
    if (e.v !== 2) throw new Error('envelope v' + e.v);
    var raw = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, m._k.box.privateKey, unb64(e.w));
    var k = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt']);
    return td.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(e.i), tagLength: 128 }, k, unb64(e.c)));
  }
  root.RMIdentity = { load: load, sign: sign, open: open };
})(typeof window !== 'undefined' ? window : globalThis);
