<!-- Generated from synthetic-users.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# Synthetic users — five people who do not exist, reading this site

Five invented readers were walked through riskmandate.ai one screenshot at a time and interviewed at the end. Thirty screenshots, eleven unanswered questions, twelve findings, two of them blocking a sale.

Source: https://riskmandate.ai/synthetic-users.html

---

# Five people who do not exist, reading this site twice.

Five invented readers were walked through riskmandate.ai one screenshot at a time, asked what they made of each screen, and interviewed at the end. Every one of them starts every run knowing nothing about RiskMandate, Agent Behaviour Policies, or what is for sale. The site has now been read twice — **v1.20.1 on 16 September and v1.25.1 on 17 September**, the same five readers both times: **60 screenshots, 60 steps, 37 questions the site did not answer, 29 places somebody got lost, and 32 findings.** The second run is the one worth reading, because it says which of the first run’s findings survived.

## The key is the whole credential.

Nothing in the vault is a secret: no real person, no customer data, no credential. It is published read-only so the method can be checked rather than described.

Derived one way from a vault key that is not published and never will be. The read key opens the vault and cannot change it. This vault, `re5nrn3h`, holds **both** readings — ten runs, two per reader — so the comparison is inside one vault rather than across two. The first study was published as its own vault and is still there, read-only, at `a41174009cf6f3019147040ef0c759b6c84c86ffa37eb54af06011c161a12332:o3q6zhtr`.

## Everybody in it is invented, and the vault says so before you can scroll past it.

The personas are fictional, the names are fictional, and every word attributed to them was written by a language model reading screenshots. **It is not user research**, and no sentence in it is evidence about a real person.

What _is_ evidence is the part a machine produced: the thirty screenshots, the URLs, the step order, the scroll positions, the viewport sizes, the measured word counts, and the page errors — all captured by driving Chromium against this site’s deployed tree at **v1.20.1**. Both halves are labelled on every screen of the vault, and the findings list is the part worth acting on.

## Hand the agent the screenshot, not the DOM.

This is the whole idea, and the vault states it in one sentence: _an agent that reads the DOM finds the buy button every time, and therefore finds no confusion — which is the only thing worth running this for._ So the loop is deliberately crippled. The agent gets the same thing a person would have and has to work out what to do from it.

|  | Step | Why it is there |
| --- | --- | --- |
| 1 | Observe | Screenshot at that persona’s own window size. **Do not read the DOM.** Do not read the markdown twin unless this persona would |
| 2 | Say what you see | At the level of detail this persona would take in — a skimmer sees three things, a slow reader sees the caveat under the price |
| 3 | Think | What they are weighing, and what they are suspicious of |
| 4 | Record a question | Something the page raised and did not answer. Null when there is none. **These are the output** |
| 5 | Record confusion | Where the page lost them, or where they guessed. Every claim of confusion must point at something on the screenshot |
| 6 | Act | One action, with the reason given in the persona’s terms rather than the site’s |
| 7 | Loop | Until they would buy, leave, or run out of patience — and patience is a field on their record, not a judgement made mid-run |

Seven interview questions follow, however the run ended. The two that earn their keep are _where did you have to guess_ and _what did you still not know at the end_, because those are the two a real reader never tells you. The protocol is published **inside** the vault, which is what makes a second run next month comparable rather than merely later.

## Five readers, twice each.

Every number below is computed from the run records rather than from the summary. The outcome column is what the reader decided at the last step, in their own words.

| Reader | At v1.20.1 | At v1.25.1 | Questions | Lost | Viewport |
| --- | --- | --- | --- | --- | --- |
| **Priya Raghavan**staff engineer, pays on her own card | would buy, level 1 | **would buy, level 1 today** | 4 | 4 | 1440×900 |
| **Tom Achterberg**founder, six weeks from a term sheet | stalled | **would buy, level 1 tonight** | 5 | 4 | **390×844** phone |
| **Mei-Lin Okafor**head of engineering, a bank’s questionnaire due Friday | would buy, blocked on timing | would buy level 4, blocking on a date | 6 | 4 | 1440×900 |
| **Rafael Duarte**fund partner, 31 companies | left | buys nothing, sends three companies | 6 | 2 | 1440×900 |
| **Claire Buckley**risk manager at an insurance broker | left, having understood it only on the third page | **buys nothing, understood on screen one** | 5 | 3 | 1440×900 |

The questions and lost columns are the second run’s. Read the viewport column. The reader carrying the most urgent decision — a founder six weeks from a term sheet, for whom £500 is his own call — did the whole thing **on a phone**, and produced the most questions and the most confusion of anyone. That is not something the vault announces; it falls out of the table once the numbers are in one place.

## The first run’s finding: the product is not named where it is sold.

The headline finding was a word, and it was measurable. Above the fold on a 1440×900 screen, the home page at **v1.20.1** said — this table is a dated record of a page that has since been rewritten:

| Word, above the fold | Times |
| --- | --- |
| policy / policies | **6** |
| insure / insurable / insurability | 3 |
| underwriters | 1 |
| a price (£5) | 1 |
| **Agent Behaviour Policy** | **0** |
| **ABP** | **0** |

The words _Agent Behaviour Policy_ first appeared at character **5,387 of 9,270** — 58% of the way down the page. **Two of the five read “Buy one, from £5” as buying an insurance policy for five pounds.** The insurance broker held that reading for four screens; the founder resolved it by accident, from the caption of the third button.

- **The hero card made it worse.** It was captioned _A REAL POLICY · TEMPLATE_, directly beside a headline about being insurable — the phrase most likely to be read as an insurance policy, on the one caption with room to say the product’s name instead.
- **The page led with the step that does not exist.** The audience cards began at 2,823px on a desktop and 4,947px on a phone — the fourth and sixth screenful. Every reader who was one of the three named audiences scrolled past two full screens of insurance argument before the page addressed them.
- **Two sales were blocked by something that is not a price.** The founder would have paid £500 from his phone: no page states how long any level takes. The head of engineering would have paid £1,500 the same day against a deal worth more than her runway: the payment rails are not built, and the site says so.
- **The investor’s content is on the conference page.** It exists and it is good, and a partner arriving outside conference season finds his own content filed under an event he is not attending.

And what worked, named unprompted by more than one reader: the connector-scope quotes with their sources and dates, the admissions this site keeps making against itself, and the four-number card — which was the only thing on the first screen that kept the engineer reading. _“Nobody oversells and then volunteers that.”_

## The confusion the first run measured did not happen again.

Same five readers, same six-step loop, same window sizes, against the home page rebuilt from a business partner’s design. Measured on the page rather than asserted:

| Measured on the home page | v1.20.1 | v1.25.1 |
| --- | --- | --- |
| where _Agent Behaviour Policy_ first appears | character 5,387 of 9,270 | **character 67 of 6,081** |
| _Agent Behaviour Policy_ above the fold | 0 | **1** |
| bare _policy_ / _policies_ in the page body | 6 above the fold alone | **0** |
| _behaviour policy_, qualified | — | **12** |
| insurance-register words above the fold | 10 | **0** |
| a price above the fold | £5 | £10 |
| screens to the four levels, desktop | — | 4.8 |
| screens to the four levels, on a phone | — | **8.9** |

The insurance broker understood on the first screen what took her three pages before, and said why: _“policy here is a document, and they have put the qualifier in front of the noun everywhere I can see.”_ The phone reader, who stalled at v1.20.1 without ever learning what was for sale, reached a purchase decision at step six. **Four of the five would now spend money, against two of five.** None of that is a sale; two of the three who would buy said the entry level is cheap enough not to be a decision, which is a compliment to the pricing rather than to the page.

- **The word that was wrong is fixed; the vocabulary is now split.** The home page says _reach_, _mandate_, _gap_, _barriers_ and carries a note about the file names. The pages it links to use the older words in their own prose — [the behaviour-policy page](agent-behaviour-policy.html) says _the grant_ and _the delta_, and [for-corporate](for-corporate.html) says _the grant_. Three readers hit it within two minutes of the home page. The investor put it worst: _“I am forwarding this to people who will not chase a footnote.”_
- **Every delivery window starts from a reply that has no clock on it.** Levels 3 and 4 say _1 to 3 days_ and _1 to 5 days_ from your reply. The reader who would have paid £1,500 the same day could not: _“one to five days from my reply still depends on when they reply to me.”_ The step with no time on it is ours.
- **A read key may go to your board, your auditor or your broker — and to a customer?** The sentence lists three recipients and the reader with a bank’s questionnaire is a fourth. Whether a read key can go to a customer, and be revoked after the review, decides that purchase and is not on the site.
- **The investor still has nowhere to land.** At v1.20.1 he found an audience card pointing at a page that did not exist. At v1.25.1 the audience cards are gone, so he finds nothing: no view card among CEO, CTO, CISO and insurer, no page, and no sentence saying the document has the same shape every time — which is the only thing he needs to ask thirty-one companies for one.
- **Both dated 2026 facts are unsourced where most people read them.** [The insurance page](insurance.html) gives the exclusion’s announcement date and explains why its figures are deliberately qualitative. The home page states the same two facts with no source and no link, and the home page is the page people reach.
- **One sentence about somebody else’s industry is unhedged.** _“What earns cover back is a written record…”_ states as settled a thing only an underwriter decides, on a page that hedges everything about its own product precisely. The insurance page’s conditional version is the one to carry. The same reader asked for a line the site does not have anywhere: **RiskMandate is not an insurer and places no cover.**
- **And the small ones, measured.** The eighteen vault pages say _Buy this policy_ on their primary button, bare, straight after a home page that says _behaviour policy_ twelve times. [for-corporate](for-corporate.html) says _See a real policy_ — the exact phrase two readers took for insurance last time. The header’s button says _Get in touch_ on the home page and _Book a demo_ on three others.

What no reader asked to change, named unprompted by more than one of them: the **in design** chip on the third step (_“the single most credible thing on this site”_), **model-drafted and marked as such, not a compliance assessment**, and the deposit split (_“somebody who has been burned by a late delivery themselves”_). Two design decisions were vindicated: the product’s name in the first sentence, and the price on the first screen — which v1.22.0 removed on principle and a partner’s design put back. The investor read the price before he read anything else, and it is the reason he will act.

## Two mechanical corrections, both in the runner.

Neither was a finding about the site and both would have quietly falsified the study. The page grows while its webfonts settle, so a scroll issued too early lands short, clamped against a shorter document. And the site sets `scroll-behavior: smooth`, so `scrollTo` animates and a screenshot 280ms later catches the page mid-flight — a step aimed at 4,340px landed at 3,308px and showed a different section entirely.

Both are fixed in `tools/runner.mjs` in the vault, and every step now records the scroll position it actually reached. A run that lands somewhere other than where it was aimed is visible in the record rather than silent. This is the same class of problem as the one the first study found: the screenshots looked plausible, so nothing else would have caught it.

## Two pages were shipping broken JavaScript.

Before a word of the study had been written, the first pass recorded a page error on **every step of every journey**: `Unexpected token '}'` on the home page and `Unexpected end of input` on the insurance page. The menu, the mobile drawer, the in-page scroll buttons and the enquiry button were dead on both, and the insurance page had been broken since it launched.

Nothing else caught it. The HTML still rendered, so both pages looked right in a screenshot; twenty-six tests, four `npm run check` gates and two further CI checks all passed, because not one of them parsed a line of the JavaScript the pages carry. Fixed in [v1.20.2](versions.html), with a test that parses every inline script on every page — verified by deliberately breaking a page and watching it fail. Driving a real browser and recording what it throws is the only reason this was found.

## Two runs a day apart were the comparison.

The personas, the paths and the protocol were in the vault, so the same five readers were walked through the rewritten site and the answers read down a column as well as across. Every persona in this vault now carries two runs, and the reading app switches between them. That is the thing this exists to make possible, and it has now been done once.
