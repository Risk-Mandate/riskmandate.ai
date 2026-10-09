// envelope.js — sgit's hybrid envelope (v2), built in the browser with Web Crypto.
// Matches sgit_ai/crypto/PKI__Crypto.hybrid_encrypt: a fresh AES-256-GCM key, a 12-byte IV,
// the key wrapped with RSA-OAEP (SHA-256, MGF1-SHA-256) to the recipient's public key;
// {v:2, w, i, c} as base64 fields; the .enc text is base64 of that JSON; the lane payload
// is base64 of the .enc text's bytes (encoded twice, as the API page documents).
// Unsigned: a person filling in a form holds no key. The drain files such messages as web-form kind.
(function (root) {
  'use strict';
  var te = new TextEncoder();
  function b64(bytes) { var s = ''; bytes = new Uint8Array(bytes); for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]); return btoa(s); }
  function pemToDer(pem) { var b = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, ''); var bin = atob(b); var out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out.buffer; }
  async function fingerprint(pem) { var h = await crypto.subtle.digest('SHA-256', pemToDer(pem)); return 'sha256:' + Array.prototype.map.call(new Uint8Array(h), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, 16); }
  async function encrypt(recipientPem, plaintext) {
    var pub = await crypto.subtle.importKey('spki', pemToDer(recipientPem), { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    var aes = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
    var raw = await crypto.subtle.exportKey('raw', aes);
    var iv  = crypto.getRandomValues(new Uint8Array(12));
    var c   = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv, tagLength: 128 }, aes, te.encode(plaintext));
    var w   = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, pub, raw);
    var enc = btoa(JSON.stringify({ v: 2, w: b64(w), i: b64(iv), c: b64(c) }));   // the .enc text
    return { enc: enc, payload: btoa(enc) };                                         // payload = base64(bytes of .enc)
  }
  root.SgEnvelope = { encrypt: encrypt, fingerprint: fingerprint };
})(typeof window !== 'undefined' ? window : globalThis);
