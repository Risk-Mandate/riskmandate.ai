# Ten hard questions agree with the site everywhere except where it matters most: the home page says we enforce

> Rendered from docs/briefs/review__ten-hard-questions-and-what-the-site-should-say.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/review__ten-hard-questions-and-what-the-site-should-say/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 2026-10-09 · **Author:** @website-agent
**Trigger:** the lead, 9 October: *"can you review this interview with me, create a new proposed home page (temp live link) and propose other changes to the site?"* The interview: [Ten hard questions for RiskMandate, answered](https://sgit.ai/articles/riskmandate-ten-questions.html) on sgit.ai, site v0.7.13, 9 October 2026, about 53 KB as Markdown: ten questions Nimay Parekh brought back from a conference, answered by the lead in a two-hour interview with Claude acting as a journalist.
**Reads against:** riskmandate.ai v1.38.0 (the home page of v1.36.0 to v1.36.1, the insurance, licence, pricing, *who it's for*, grant-gap and questions pages, the rules of v1.37.0); the interview's own list of three things to fix, each checked against the source on 9 October.

---

## 1. What the interview says, in its own order

1. **One model under every answer.** Four objects for one agent in one deployment, mandate, grant, delta, barriers, and *who does what*: RiskMandate authors and pre-commits the verdict, the customer's own controls enforce, a named executive owns what is left, and logs keep the grant honest (*"reality is the calibrator"*).
2. **The goal of every engagement:** *"the smallest mandate, the smallest reach, the smallest gap"*, and the smallest residual where the agent polices itself.
3. **Ten answers.** Bypass: the $75k order was possible on day one, and the ABP shows that before the action. New powers land as excess, never as authority, because the mandate is locked business logic. Tailoring is full and calibrated against logs; the customer pays for maintenance and trust on an open-source base. Liability stays with the customer; *"the moment of authorisation is the grant, not the mandate."* Enabler, not competitor. The supply chain is a bigger agent. Never enforce. Containment designed in advance; reversal next, through twins. Delegation needs PKI: *"authorisation by encryption, not by privilege."* The headline metric is the reduction in accepted risk.
4. **Three things deliberately not:** not inline, not an insurer, not one button.
5. **An honest maturity table:** live and free, on-ramp, running in our own pipeline, proofs of concept, design, next.
6. **Three things to fix on riskmandate.ai**, found by checking the answers against what is published.

## 2. Where the site already agrees

Almost everywhere. The four objects are the home page's model section and every vault; *never in the request path* is on the grant-gap page (*"Nothing we run sits in the request path"*); the plug profile, the business cases, *accepted is not acceptable*, the licence template and the insurance argument are all linked from the interview as the work behind its answers; the rules of v1.37.0 say on every page that a line is a request, not a control. The interview cites three of them by name.

## 3. Where it does not: the three issues, checked

| The interview says | Checked on 9 October | Proposal |
|---|---|---|
| The home page says *enforced in real time* and shows Blocked and Held cards with *Reply A to approve*, which reads as RiskMandate inline | **Confirmed, and wider.** The hero says *Enforced in real time, with alerts by text and email*; the gate in the stage is labelled *RiskMandate policy*; the alert card and the phone come from *RiskMandate*; the builder shows *Enforcing*; one section is titled *A prompt asks. A policy enforces.* with *In a RiskMandate policy … Held*; another says *Every policy alerts the right person by text and email* | The proposed home page, §4 |
| The insurance page states design as shipped | **Confirmed.** *Continuous attestation mapped to ISO 42001 and the OWASP Agentic Top 10*; *Connector setup is typically under a day*; *A first Index and gap list land inside two weeks*; *Self-hosted and sovereign deployments are available* | Future tense, or a *design* label on each, in one patch |
| Level 1 is £10 on the home and pricing pages and £5 on the licence page | **Confirmed, and in three places, not one.** The level chips on `licence-to-operate.html`, `for-corporate.html` and `for-founders.html` all say *Level 1 · the pack · £5*. The store's price, read for the pricing page, is £10. (`synthetic-users.html` also shows £5, as the price a review recorded at the time; that is a record and stays.) | £10 in all three chips, in one patch |

## 4. The proposed home page

Live, private and unindexed, at **`/home-next.html`**. It is the current home page with the interview's position applied, so the difference is the proposal:

- **The hero** says what the product is and is not: *what each agent can reach, what you authorised it to do, and the gap. Your own controls enforce them. We are never in the request path.* The first button is *Start with one rule*, the funnel of 7 October.
- **The stage keeps its animation and changes its meaning.** The gate is *Your controls, from the ABP*, with a lock rather than our mark; the card is *Your approval flow: Blocked by your gateway*; a line under the stage says the gate is the customer's gateway, proxy or IAM and the approval flow is one the customer stands up with our help.
- **The builder** shows *Your mandate* instead of *Enforcing*: *we write it down; your controls enforce it*.
- **Bring your policy** becomes *we show what can enforce it*: every line becomes a rule, with the control in your stack that would enforce it, or a flag that nothing can.
- **A prompt asks. A boundary enforces.** The right-hand card is *in the ABP, held by your gateway*.
- **Alerts** are *an approval flow your team stands up with our help … it runs in your stack, not ours*; the phone's sender is *your approval bot*.
- **New: the smallest mandate, reach and gap**, with *who does what* in four cards (authoring, decision, enforcement, the risk that is left) and the three things we are deliberately not.
- **New: ten hard questions, answered**, one line each, linking the full interview on sgit.ai, and the maturity table as of 9 October.
- Unchanged: the model section, the four levels with level 3 free for early users, the proof strip, the closing call.

## 5. Other changes proposed, in order of value

1. **Make `/home-next.html` the home page** when the founders sign it off; keep the old one in git as before. *Half an hour.*
2. **The £5 chips to £10** on the three pages. *Ten minutes.* A factual error; recommended before anything else.
3. **The insurance page's tense**: the four sentences above, labelled or moved to the future. *Half an hour.*
4. **The ten questions on the site, not only on sgit.ai.** The questions page answers four questions today, three of them about what we do not do; add the ten with one-paragraph answers and a link to the full interview, so a buyer finds them where they buy. *Two hours.*
5. **Who does what, as a figure, on the ABP and how-it-works pages.** Author, decide, enforce, own: the interview's model diagram, drawn in the site's style, because it answers the question every reader asks second. *Two hours.*
6. **The rules linked from the vault pages**, from each grant row to the rule for its capability (proposed on 8 October, still open). *A day, generated.*
7. **The pricing page above the four levels.** The interview names engagements of £5k to £100k as the plan. If the founders want that on the site, it is one honest line: *larger engagements by conversation*, with no figures until there is a rate card. *The founders' call.*
8. **The interview on the articles page**, as an external card, and on the about page as *the founders answer ten hard questions*. *Half an hour.*
9. **The metric the interview leads with, on the business-cases page:** reduction in accepted risk, and the list of metrics we own and do not own. *An hour.*

## 6. What needs the lead

1. **Sign-off on the proposed home page**, or the lines to change in it.
2. **Whether the two factual fixes (£5 and the insurance tense) go now**, ahead of the home page. Recommended: yes.
3. **Item 7**, whether larger engagements appear on the site at all yet.
4. **The 0.388 figure.** The interview quotes a reproduction precision of 0.388 for recall-optimised agents and its preparer could not locate the source page; nothing on riskmandate.ai uses it. Before it appears here, its source.

## 7. The review page, and the lead's pricing hypothesis, 9 October

The lead asked for the before and after made visual, so that reviewing it is not a spot-the-difference game,
with A/B testing and feedback that comes back to us. Built, private and unindexed:

- **`/home-diff.html`**: every changed section of the home page, now and proposed, three ways. *Side by side*,
  with what left marked in red, what arrived marked in green, numbered, and arrows from each old line to its
  new one. *Slider*, the two screenshots laid one over the other with a handle that wipes from now to
  proposed. *Four steps*, a crossfading sequence that plays when it is on screen: now, what will change
  (pulsing marks), what changed, proposed. Under each section, the changes as a list, *A now / B proposed*,
  and a comment. Then the two new sections, keep or remove; **the prices as A/B/C/D**; every section of the
  proposed page, keep, remove or change, for the content Nimay wants out; and which of the three modes worked.
- **The screenshots and the marks are generated**, by `scripts/review/capture-home-diff.mjs`: element
  screenshots of the same section on both pages at the same width, padded to one size, and the boxes of text
  that is on one page and not the other. Changes are paired by the words they share, then by height.
- **Feedback** is kept in the browser as it happens: opening the page, scroll depth, the sections seen, the
  mode, the slider and the steps, every choice and comment, the reader's name and email. From v1.38.3 it goes
  to **its own vault**, created that day with the access token the lead gave for it: `ao0lynta` on
  dev.send.sgraph.ai, with one append lane, `review`. The page reads `site/assets/review/lane.json` (the
  vault id, the public write-only token, the public key and its fingerprint), encrypts each send in the
  browser to that key with the contact form's envelope, and appends it, when the reader presses *Send
  feedback* and every two minutes while there is something new. The private key is in the vault, encrypted
  with a secret derived from the vault's write key. `scripts/review/read-feedback.mjs` reads the lane
  with `REVIEW_KEY` in the environment, files each send as `.eml` and `.json` under `feedback/` in the vault,
  marks it processed and prints every answer and comment. The vault key was handed to the lead in the
  session and is in no file. Tested end to end on 9 October: one labelled message from the page, through
  the server, decrypted and filed. A download of the record and an email fallback stay on the page.
- **The lead's first feedback, through that lane, 9 October (v1.38.4).** The lead liked the way feedback
  is sent and the new hero text, and found *A · now reads better* confusing: the *now* read as if A had
  changed too. The buttons on each changed section now read *B · is good (proposed)*, first and marked, then
  *A · was better (current)*, then *No difference to me*. Every comment box has its own *Send this comment*
  button and a line saying whether it has gone; it also sends when the reader leaves the box and after eight
  quiet seconds of typing. A screenshot can be pasted or dropped into any box: it is shrunk in the browser to
  1,600 pixels on the long side, kept in the browser, and sent with the next send, two to a message.
  `read-feedback.mjs` writes each one beside its record as an image file. The same day the vault key went to
  the lead's key registry, sealed to its published key on a write-only lane, rather than through the chat.
- **The pricing hypothesis.** The lead: the £10 and £50 levels are not selling; lead with the levels people
  buy and add two engagements that are time with a forward-deployed engineer, £5,000 for a first pass and
  £25,000 for an MVP, delivered by Dinis Cruz. The four variants on the review page: A now; B the lead's
  (£500, £1,500, £5,000, £25,000); C leaner (level 3 free for early users, £5,000, £25,000); D all six.
- **`/engagements.html`**, proposed and private: the two engagements, what each delivers, built only from
  what the interview's maturity table says exists, what they do not commit to (no enforcement, no runtime
  monitoring, no insurance, a first pass and not a programme), and who delivers, named, with a line that
  more consultants will be named before they deliver.
