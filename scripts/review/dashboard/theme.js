// ── theme.js: four themes, one attribute, one storage key ───────────────────
// Copied from the Threat-sized security vault (zwlqqvkm); only the storage key changed.
//
// Sets html[data-theme] before the first paint, so there is no flash: the
// bundle inlines this script as the first element of <head>, before the
// stylesheets, and it does nothing slow. The value comes from localStorage
// under this vault's key, or, when nothing is stored, from the reader's
// prefers-color-scheme (dark: Night, light: Day, as data/themes.json says).
// Inside the vault host the frame's localStorage may throw; there the host's
// sg.state (device-local, namespaced per app) is read once the page has
// loaded, and a stored choice is applied then. Every element with
// data-theme-pick is a picker button; aria-pressed follows the theme. A pick
// is announced as bw:theme on document. The colours themselves are in
// app/themes.css; this file never names one. Mechanism copied from
// secrets.sgit.ai's assets/theme.js.

;(function () {
    'use strict'
    const CONFIG   = { default: 'night', whenPreferringLight: 'day', ids: ['night', 'day', 'paper', 'ember'] }
    const KEY      = 'riskmandate.review-dashboard.ui.theme'
    const KNOWN    = new Set(CONFIG.ids)
    const root     = document.documentElement
    let   explicit = false                                                                  // a reader's choice beats prefers-color-scheme

    function stored() {
        try { return window.localStorage.getItem(KEY) } catch (error) { return null }       // storage blocked (sandboxed frame): the theme still applies for this page
    }
    function preferred() {
        const light = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
        return light ? CONFIG.whenPreferringLight : CONFIG.default
    }
    function mark(name) {
        for (const button of document.querySelectorAll('[data-theme-pick]')) {
            button.setAttribute('aria-pressed', button.dataset.themePick === name ? 'true' : 'false')
        }
    }
    function apply(name) {
        if (!KNOWN.has(name)) name = CONFIG.default
        if (root.dataset.theme === name) { mark(name); return }
        root.dataset.theme = name
        mark(name)
        document.dispatchEvent(new CustomEvent('bw:theme', { detail: { id: name }, bubbles: true, composed: true }))
    }
    function choose(name) {
        if (!KNOWN.has(name)) return
        explicit = true
        apply(name)
        try { window.localStorage.setItem(KEY, name) } catch (error) { /* not stored here; sg.state below */ }
        try { if (window.sg && window.sg.state && window.sg.state.set) Promise.resolve(window.sg.state.set(KEY, name)).catch(() => {}) } catch (error) { /* no host */ }
    }

    const first = stored()
    explicit = KNOWN.has(first)
    apply(explicit ? first : preferred())

    document.addEventListener('click', (event) => {
        const button = event.target.closest && event.target.closest('[data-theme-pick]')
        if (!button) return
        choose(button.dataset.themePick)
    })
    window.addEventListener('storage', (event) => {                                         // another tab chose: follow it
        if (event.key === KEY && KNOWN.has(event.newValue)) { explicit = true; apply(event.newValue) }
    })
    try {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (!explicit) apply(preferred()) })
    } catch (error) { /* old engines: no live follow */ }
    document.addEventListener('DOMContentLoaded', () => {
        mark(root.dataset.theme)
        try {
            if (!window.sg || !window.sg.state || !window.sg.state.get) return
            Promise.resolve(window.sg.state.get(KEY)).then((name) => {
                if (KNOWN.has(name) && name !== root.dataset.theme) { explicit = true; apply(name) }
            }).catch(() => {})
        } catch (error) { /* no host */ }
    })
}())
