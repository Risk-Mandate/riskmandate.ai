<!-- Generated from agents.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — For Agents

Machine-readable access to RiskMandate's content: llms.txt, a full-text markdown export, and a structured agent-content manifest. A product about governing agent access, publishing a clean one.

Source: https://riskmandate.ai/agents.html

---

# Machine-readable by design.

This site is JavaScript-rendered inside an isolated frame — great for humans, opaque to a crawler. So the content is also published as plain text an LLM agent can read directly: a curated index, a full-text export, and a structured manifest. A product about governing what agents may access should publish a clean, honest access surface of its own.

## Three artifacts, one source of truth.

All three are generated from the same content at build time, so they never drift from the site. Fetch whichever fits your agent. Paths are stable and served from the domain root.

## Fetch, don't scrape.

The rendered pages carry no crawlable content. Point your agent at the text artifacts instead.

```
# 1. The index — cheap, orients the agent
curl -s https://riskmandate.ai/llms.txt

# 2. Everything, as one Markdown document
curl -s https://riskmandate.ai/llms-full.txt

# 3. Structured, for deterministic parsing
curl -s https://riskmandate.ai/.well-known/agent-content.json | jq .
```

Content licence: the concept library is CC BY 4.0 — reuse it, attribute RiskMandate. The artifacts are regenerated on every release, so a cached copy is a point-in-time snapshot; re-fetch for the current version.

## The access surface is the point.

RiskMandate governs the right to act: what a system is authorised to do, granted by whom, for how long. An access surface that is explicit, scoped, and honest is exactly what we ask of every mandate on the platform. Publishing one for our own content is the smallest possible version of the thing the product does.

No dark patterns, no cloaking, no serving agents different content than humans. The text artifacts say precisely what the site says.
