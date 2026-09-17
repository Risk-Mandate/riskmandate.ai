# Five synthetic users read the new home page: the word is fixed, the vocabulary is split

**Date:** 2026-09-17 · **Author:** @website-agent
**Trigger:** the project lead's instruction of 16 September — *"create a new vault just like this one … where you create 5 synthetic users … get them to read the current RiskMandate.ai home page, and see if they come out with a good understanding of Agent Behaviour Policies, and more importantly, would they want to buy one"* — run a second time after the home page was rebuilt from a business partner's design
**Reads against:** the deployed tree at **v1.25.1**, driven in Chromium; vault `re5nrn3h`, which holds both readings (ten runs, two per persona, sixty screenshots); the first reading at v1.20.1, published as vault `o3q6zhtr`

---

The second reading of riskmandate.ai by the same five invented readers found that the first
reading's headline finding is gone and two new ones took its place. This page is the review; the
runs, the screenshots and the interviews are in the vault, read-only, and the measurements below
were taken from the page rather than from the summary.

## 1. What was measured, both times

| | v1.20.1 | v1.25.1 |
|---|---|---|
| where *Agent Behaviour Policy* first appears | character 5,387 of 9,270 | **character 67 of 6,081** |
| *Agent Behaviour Policy* above the fold | 0 | **1** |
| bare *policy* / *policies* in the page body | 6 above the fold alone | **0** |
| *behaviour policy*, qualified | — | **12** |
| insurance-register words above the fold | 10 | **0** |
| a price above the fold | £5 | £10 |
| screens to the four levels, desktop | — | 4.8 |
| screens to the four levels, on a phone | — | **8.9** |

**Four of five would now spend money, against two of five.** The reader who works in insurance
understood on the first screen what took her three pages before. The reader on a phone, who stalled
last time without ever learning what was for sale, reached a purchase decision at step six. Neither
of those is a sale, and two of the three who would buy said the entry level is cheap enough not to
be a decision — which is a compliment to the pricing rather than to the page.

## 2. The two findings that matter

**The vocabulary is split across pages.** The home page calls the four objects *reach, mandate,
gap, barriers* and carries a note saying the files keep the older names. The pages it links to use
the older words in their own prose: `agent-behaviour-policy.html` says *the grant* and *the delta*,
and `for-corporate.html` says *the grant*. Three readers hit this within two minutes of the home
page. The investor is the expensive case, because the page he intends to forward to three founders
is one of the two: *"I am forwarding this to people who will not chase a footnote."* Either those
pages adopt the new words, or each carries the note the home page carries.

**Every delivery window starts from a reply that has no clock on it.** Levels 3 and 4 say *1 to 3
days* and *1 to 5 days* **from your reply**. The reader who would have paid £1,500 the same day
against a deal worth more than her runway could not: *"one to five days from my reply still depends
on when they reply to me."* The deposit split and the honest window were the two things she trusted
most; the missing first response is what stopped the sale. The step with no time on it is ours.

## 3. Fixed the same day

- Eighteen vault pages said *Buy this policy* on their primary button, and `for-corporate.html`
  said *See a real policy* — the exact phrase two readers took for insurance in the first study.
  Both now say *behaviour policy*; the first is fixed in `build-abp-pages.mjs`, which writes it.
- The home page's one unhedged sentence about somebody else's industry — *"what earns cover back is
  a written record…"* — now reads as `insurance.html` already wrote it: *cover comes back when
  somebody can evidence what each agent can reach*.
- The two dated 2026 facts were stated bare on the home page and sourced on the insurance page.
  The home page now points at the sourced version and says neither is our observation.
- The line the reader from insurance asked for is on the page: **we are not an insurer and place no
  cover**, beside the two admissions the page already volunteers.

## 4. Still open, and who it is for

| what | where | whose call |
|---|---|---|
| the split vocabulary: adopt *reach* / *gap*, or carry the note | `agent-behaviour-policy.html`, `for-corporate.html`, and the vault generator's prose | the lead: it is pinned at abp.sgit.ai and sixteen vaults are built against the old names |
| a first-response time, so a level-3 or level-4 buyer can convert on the page | `index.html#pricing` and the store's own pages | the store's agent and the lead together |
| whether a read key may go to a **customer**, and be revoked after their review | `index.html#leaders` | the lead |
| an investor: no page, no view card, no price for a book of companies | the site as a whole | the lead |
| one sentence saying the document has the same shape every time | `index.html#pricing` | us — the shape exists, sixteen times over |
| the header's primary button: *Get in touch* on the home page, *Book a demo* on three others | the shared chrome | us, once somebody picks one |

## 5. The method, and what it cost to run twice

Each step is: screenshot the viewport at that persona's own window size, hand over **the screenshot
and not the markup**, ask what they see, what they think and what they would do, then move the page
that way. Seven interview questions afterwards, however the run ended. An agent that reads the DOM
finds the buy button every time and therefore finds no confusion, which is the only thing worth
running this for.

Two corrections were needed to run it a second time, both recorded in the vault's `tools/runner.mjs`
and both of which would have falsified the study silently:

- the page grows while its webfonts settle, so a scroll issued too early lands short, clamped
  against a shorter document;
- the site sets `scroll-behavior: smooth`, so `scrollTo` animates and a screenshot 280ms later
  catches the page mid-flight — one step aimed at 4,340px landed at 3,308px and showed a different
  section entirely.

Every step now records the scroll position it actually reached, so a run that lands somewhere other
than where it was aimed is visible in the record rather than silent. That is the same class of
problem as the one the first study found by accident: the screenshots looked plausible, so nothing
else would have caught it.

**Everybody in the vault is invented** and every word attributed to them was written by a model
reading screenshots. It is not user research and no sentence in it is evidence about a real person.
What is evidence: the sixty screenshots, the URLs, the step order, the scroll positions, the
viewport sizes and the word counts, all captured by driving a real browser against the deployed
bytes.

**Read it:** the study page is [`synthetic-users.html`](https://riskmandate.ai/synthetic-users.html) and the
vault opens read-only with
`835a49efea7bd24b0205dd6dd74a08d22539fe5e3bac8dcca073d2e66a74e1fb:re5nrn3h`.
