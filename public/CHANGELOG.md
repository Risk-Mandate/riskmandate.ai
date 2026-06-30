# Risk Mandate — Website · Changelog

Versioning: **v0.{major}.{minor}**. **Every commit to this vault increases the minor.**
v0.1.0 is the baseline; changes build from here.

## v0.1.0 — 2026-06-29 · Baseline

- Rebased the site on the partner's Risk Mandate version: navigation **Category · Trifecta · Acceptance · Certs · Pricing** plus **Book a demo**.
- Hero "Agents act. You own *the risk.*" with the blast-radius / business-owner / time-bound-decision (accept, fund, or fix) sub, compliance badges (NIST SP 800-53, EU AI Act Art.14, FedRAMP Ready, ISO 27001), and the live risk ticker.
- Interactive **risk queue** (LIVE) — click a record, then **Accept for 1 Week** or **Request Info**; the queue advances and clears, with the AI recommendation per record.
- Sections: the category ("agent risk is the missing one"), the **Lethal Trifecta**, the Four Pillars (map · accept · fund · reduce), **Hope vs. Enforce** risk acceptance, **Capability Certificates** (owner · justification · expiry · funding), and four pricing tiers.
- Self-contained vault HTML (inline CSS/JS/SVG) — portable straight to riskmandate.ai.
- Versioning system added: `version.json` (version file), this changelog, the version shown in the footer (read at runtime), and a rendered changelog page at `/changelog.html`.
