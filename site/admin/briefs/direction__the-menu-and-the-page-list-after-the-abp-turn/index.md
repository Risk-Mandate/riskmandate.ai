# The menu after the ABP turn: five entries, one product first, and eleven pages out of the nav

> Rendered from docs/briefs/direction__the-menu-and-the-page-list-after-the-abp-turn.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/direction__the-menu-and-the-page-list-after-the-abp-turn/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 2026-09-18 · **Author:** @website-agent
**Trigger:** the project lead, on the home page carrying two menus — *"I don't think we need that menu / Also can you suggest a refactoring of the top menu and pages (for example we don't need the Lisbon link any more)"*
**Reads against:** `site/pages.json` at v1.25.3 (69 entries, 34 of them in the menu, 7 top-level); the editorial inbound-link count for every listed page, computed from the deployed tree; the [synthetic-user study](https://riskmandate.ai/synthetic-users.html), which walked five readers through the site twice

---

## 1. What is there now, and what it costs

Seven top-level entries, which is the cap the header can hold at 1100px: **Policies (5) · Who it's
for (3) · Insurance (8) · Live demos (7) · Lisbon 2026 (1) · Pricing (1) · More (11)**.

The menu is the artefact of a site that argued for insurability first and only started selling
Agent Behaviour Policies later. Counted rather than asserted — inbound links from the body of other
pages, ignoring the menu itself:

| page | group | editorial inbound links |
|---|---|---|
| `agents.html` | Policies | **0** |
| `acceptance.html` | Insurance | **0** |
| `demo-risk-graph-explorer.html` | Live demos | **0** |
| `demo-agentic-browser-isolation.html` | Live demos | **0** |
| `demo-risk-mandate-field.html` | Live demos | **0** |
| `demo-file-security.html` | Live demos | **0** |
| `feedback.html` | More | **0** |
| `grant-gap.html`, `statics.html`, `demo-agent-permission-games.html` | Insurance / Live demos | 1 each |
| `acceptable.html`, `questions.html`, `partners.html` | Insurance / More | 2 each |

Eleven listed pages are reachable only through the menu. That is not an argument for deleting them —
several are good, and one, `grant-gap.html`, is squarely product material filed under Insurance. It
is an argument that the menu is carrying the site's history rather than its shape.

Two further specifics:

- **Two entries are called almost the same thing.** *Agent Behaviour Policy* (`abp.html`) and *Agent
  Behaviour Policies* (`agent-behaviour-policy.html`) sit four rows apart in the same group. A
  reader cannot tell which is the explanation and which is the sixteen examples.
- **Lisbon 2026 was 17–18 September 2026.** It is a dated record from today onwards, not a
  destination.

## 2. What unlisting actually does

`unlisted: true` in `site/pages.json` removes a page from the menu and **nothing else**:
`generate.mjs` filters `unlisted` only when it builds the menu data, so the page keeps its URL, its
markdown twin, its place in `sitemap.xml` and `llms.txt`, and stays indexable. `private: true` is
the different thing — no twin, noindex, disallowed in `robots.txt`. Every proposal below unlists;
none deletes and none makes anything private.

## 3. The proposal: five entries, product first

| | group | holds | changed how |
|---|---|---|---|
| 1 | **Behaviour policies** | the sixteen examples (`agent-behaviour-policy.html`) · what one is (`abp.html`, relabelled) · how it works · Licence to Operate · the grant is not the mandate (`grant-gap.html`) | `grant-gap.html` moves in from Insurance; `agents.html` unlisted; the two ABP labels are separated |
| 2 | **Pricing** | `pricing.html`, which links the store | unchanged |
| 3 | **Who it's for** | the three audience pages, and an investor page when it exists | unchanged; the study found the investor is the one named audience with nowhere to land |
| 4 | **Insurance** | `insurance.html` · Who can pull the plug · Risk scenarios · RAMM | `acceptable.html`, `acceptance.html` and `statics.html` unlisted and linked from `insurance.html` as the reading behind it |
| 5 | **More** | Questions · The Lab · Live demos (`demos.html`, one entry) · Library · Partners · Brand · Admin | the six demo pages unlisted — `demos.html` already indexes them; the Brief register, Working with us, Give feedback, After payment and Synthetic users move under Admin, where they are already linked |

That is **five top-level entries and 19 pages in the menu**, from seven and 34. Eleven pages leave
the nav and none leaves the site.

**Labels to settle, because they are the reader-facing half of this:** *Behaviour policies* rather
than *Policies* (on this site *policy* is also the insurance instrument, and the study measured two
readers taking the bare word for insurance). Under it, *What an ABP is* for `abp.html` and *The
sixteen examples* for `agent-behaviour-policy.html`, which is the distinction the current pair
hides.

## 4. Two alternatives, for the record

**B — the partner's shape, four entries.** *Behaviour policies · Pricing · Who it's for · More*,
with Insurance demoted to a single page inside More. It matches the home page the partner designed
and is the most honest description of what is for sale today. It also buries the *make your agents
insurable* argument, which is the positioning the lead has been clear is worth keeping.

**C — prune only.** Keep the seven groups; drop Lisbon, split the two ABP labels, collapse the demos
to one entry, and cut More from eleven to six. Half an hour of work, no information-architecture
decision, and the Insurance group still carries eight pages in front of a reader who came to buy.

## 5. Done already, because it was asked for directly

- **The home page's second menu is gone.** The partner's design carried its own in-page anchor strip
  with a *Buy* button in it, so under the shared menu the page had two navigation bars and the buy
  action twice above the fold. The strip and its CSS are removed; the hero and the closing panel
  still carry *Buy an Agent Behaviour Policy*, which is once at each end of a long page. The section
  ids stay, so `briefs.html → index.html#parts` still lands.
- **Lisbon 2026 is unlisted.** The page, the twin and the sitemap entry are untouched.

## 6. Built — A, on 18 September 2026

The lead picked **A**, and it shipped in [v1.26.0](https://riskmandate.ai/versions.html). Five
top-level entries, 21 pages in the menu, 13 pages out of it and none deleted. Two departures from
§3 as written, both because the counted inbound links said so:

- **Give feedback stays in the menu.** It is linked from nothing but `404.html`, so unlisting it
  would have orphaned a page that invites a reader to write to us.
- **The three Insurance essays got a home before they lost their menu row.** `insurance.html` now
  carries *Three pages this argument is built on* — `acceptable.html`, `acceptance.html` and
  `statics.html` as three named links, above the FAQ. That was §6's open question, decided the way
  it was decided because two of the three had no editorial inbound link at all.

The rest went as written: `grant-gap.html` moved into the product group, the two look-alike labels
became *The sixteen examples* and *What an ABP is*, the six demo pages come off the menu and are
reached from `demos.html`, which links every one of them, and the operational pages — the brief
register, Working with us, After payment and the synthetic-user study — are reached from the
console, which already linked all four.

Measured after: the header is 1,076px of content inside its 1,100px cap, the mobile drawer holds
all five groups without scrolling sideways, and `sitemap.xml` still lists 68 pages.

## 7. The question §3 left open, and how it was answered

Whether the essays under Insurance — *Accepted is not acceptable*, *You own the risk*, *Static
scenarios* — belong in a reading list on `insurance.html` or in the Library. Both work; the Library
is the honest place for writing that is not selling anything, and `insurance.html` is where somebody
following the argument already is. It was **the lead's call** and it was made: A, with the essays on `insurance.html` rather than in the Library.
