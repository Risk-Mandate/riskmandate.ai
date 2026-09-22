# The reviewer manifest: one source for who does the work, addressed to the store team

**Date:** 2026-09-22 · **Author:** @website-agent
**Trigger:** the project lead's memo of 22 September (D11 in [the register](https://riskmandate.ai/briefs.html)) — *"this needs to be a page on the website that points to the CV, to the experience, to the person's skills … eventually, on the page when you buy it, when you go back to the store, you can then choose who actually can do the assessment"* — and the lead's decision, asked and answered the same day: **riskmandate.ai is the source of truth** for who the reviewers are.
**Reads against:** [store.sgit.ai/boundary](https://store.sgit.ai/boundary/), [store.sgit.ai/who](https://store.sgit.ai/who/), [store.sgit.ai/who/dinis-cruz](https://store.sgit.ai/who/dinis-cruz/) and [store.sgit.ai/d/t4](https://store.sgit.ai/d/t4/), all read 22 September 2026

---

## 1. What this asks for

One line: **read `https://riskmandate.ai/reviewers.json` and build the chooser from it**, instead of holding a second copy of a real person's biography.

It is published now. It is generated from one file per reviewer under `site/reviewers/<slug>.json`, it is checked in CI, and it carries exactly the fields a chooser needs: slug, name, kind, page, one line, which levels they run, whether they are taking work, the status note and the date it was confirmed, the languages they can hold a session in, and the sources every line about them was read off.

## 2. Why, in one paragraph

Your `/who/` pages are good, and the rule printed on them is the right rule — *nothing below was written from what anybody told us; every line is read off a published page, and the page and the date it was read are here*. We have adopted it word for word. But there are now two sites publishing a record of the same living person, maintained by two different teams, and the first time one of them is updated and the other is not, the person on the page is the one who finds out. Your own boundary already answers it: the store owns the cart, the order reference, the payment rails and the page after paying; riskmandate.ai owns the products, the policies, the information. **A biography is information.** Choosing a reviewer at checkout is a cart.

## 3. The seam, concretely

| | store.sgit.ai | riskmandate.ai |
|---|---|---|
| The chooser at checkout: which reviewer, and what that does to the order | **yours** | reads nothing |
| Who the reviewers are: the record, the sources, the languages, the interests declared | reads `reviewers.json` | **ours** |
| Whether somebody is taking work, and the date that was confirmed | reads `reviewers.json` | **ours** |
| The price of the level, the deposit split and the delivery window | **yours** | quoted with the date it was read off your page |
| What the level actually is, step by step | links ours | **ours** — [abp-reviewed.html](https://riskmandate.ai/abp-reviewed.html) |

## 4. The manifest

`https://riskmandate.ai/reviewers.json`, regenerated whenever a reviewer file changes:

```json
{
  "source": "https://riskmandate.ai/reviewers.json",
  "page": "https://riskmandate.ai/reviewers.html",
  "level": { "id": "t4", "what": "…", "bought_at": "https://store.sgit.ai/d/t4/" },
  "reviewers": [
    {
      "slug": "dinis-cruz", "name": "…", "kind": "person",
      "page": "https://riskmandate.ai/reviewer-dinis-cruz.html",
      "one_line": "…", "runs": ["t4"],
      "taking_work": true, "status_note": "…", "status_confirmed": "2026-09-22",
      "languages": ["English", "Portuguese"], "listed_since": "2026-09-22",
      "sources": [{ "url": "…", "read": "2026-09-22" }]
    }
  ]
}
```

Two fields need a word of explanation. **`kind`** is `person` or `placeholder`: the list carries one labelled placeholder on purpose, so that a professional being invited can read exactly what would be published about them before agreeing to any of it. **A chooser must filter `kind === "person"`** — never offer the placeholder as an option. And **`taking_work`** is a status with a date beside it, not a calendar: neither site should imply a queue position that nobody can honour.

## 5. What we will not publish, so you know not to expect the fields

- **No score, no rating, no ranking, no stars.** The lead's memo describes the choice as *"a bit of a competition"*, and it is — on published facts. Not on a number we invented about a person.
- **No testimonials, until there is a real one** with a name, a date and permission. There is none today.
- **No queue, no throughput, no calendar.**
- **No biography composed by either of us.** A person with no published page gets no rows.

## 6. What we would like back

1. **Agreement on the shape** before you build against it, or a counter-proposal. Fields are cheap to add now and expensive to change once a chooser exists.
2. **What the order needs to carry** — presumably the reviewer's slug on the order reference. Tell us the field name and we will make sure the slug is stable and never reused.
3. **A decision about your `/who/` pages.** Our suggestion: keep the URLs, generate them from this manifest, and let the canonical record live on one site. Yours is the better placed page for a buyer mid-purchase; ours is the one the person themselves will be asked to correct.
4. **The payment link for t4.** Your page said, when we read it today, that it has not been issued yet. The whole of [abp-reviewed.html](https://riskmandate.ai/abp-reviewed.html) says what happens after a purchase that cannot currently be made, and it says so on the page.
