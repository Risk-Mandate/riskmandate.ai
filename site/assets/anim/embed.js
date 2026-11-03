// The animations, embedded: each <figure class="anim"> holds a same-origin <iframe> of one slide from assets/anim/.
// The slide starts paused (?ruvpaused) and plays from the beginning the first time half of it is on screen; it pauses
// when it scrolls away and carries on when it comes back. "Replay" starts it again. A figure with chapter buttons
// ([data-anim-src]) is a player: a button loads its slide into the one frame and shows its caption ([data-anim-cap]
// with the same index). The slide engine answers {slide:'seek',t} and {slide:'play'|'pause'}; nothing leaves this
// origin. Reduced motion: the engine shows the last frame and these messages change nothing.
(function () {
  'use strict'
  var send = function (f, m) { try { f.contentWindow.postMessage(m, location.origin) } catch (e) {} }
  var start = function (f) { send(f, { slide: 'seek', t: 0 }); send(f, { slide: 'play' }) }
  ;[].slice.call(document.querySelectorAll('figure.anim')).forEach(function (fig) {
    var f = fig.querySelector('iframe'); if (!f) return
    var seen = false, ready = false, visible = false, chosen = false
    f.addEventListener('load', function () {
      ready = true
      if (chosen || (visible && !seen)) { seen = true; chosen = false; start(f) }
      else if (visible) send(f, { slide: 'play' })
    })
    var b = fig.querySelector('[data-anim-replay]')
    if (b) b.addEventListener('click', function () { seen = true; start(f) })
    var chs = [].slice.call(fig.querySelectorAll('[data-anim-src]')), caps = [].slice.call(fig.querySelectorAll('[data-anim-cap]'))
    var full = fig.querySelector('[data-anim-full]')
    chs.forEach(function (c, i) {
      c.addEventListener('click', function () {
        chs.forEach(function (x, j) { x.setAttribute('aria-pressed', j === i ? 'true' : 'false') })
        caps.forEach(function (x, j) { x.hidden = j !== i })
        if (full) full.href = c.dataset.animSrc
        ready = false; chosen = true; f.title = c.dataset.animTitle || f.title
        f.src = c.dataset.animSrc + '?ruvpaused'
      })
    })
    if (!('IntersectionObserver' in window)) { visible = true; return }
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        visible = e.intersectionRatio >= 0.5
        if (!ready) return
        if (visible && !seen) { seen = true; start(f) }
        else if (visible) send(f, { slide: 'play' })
        else send(f, { slide: 'pause' })
      })
    }, { threshold: [0, 0.5] }).observe(f)
  })
})()
