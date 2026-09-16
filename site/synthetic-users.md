<!-- Generated from synthetic-users.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# Synthetic users — five people who do not exist, reading this site

Five invented readers were walked through riskmandate.ai one screenshot at a time and interviewed at the end. Thirty screenshots, eleven unanswered questions, twelve findings, two of them blocking a sale.

Source: https://riskmandate.ai/synthetic-users.html

---

# Five people who do not exist, reading this site.

Five invented readers were walked through riskmandate.ai one screenshot at a time, asked what they made of each screen, and interviewed at the end. Every one of them started knowing nothing about RiskMandate, Agent Behaviour Policies, or what is for sale. The vault holds all of it: **30 screenshots, 30 steps, 11 questions the site did not answer, 12 places somebody got lost, and 12 findings — two of them costing a sale.**

## The key is the whole credential.

Nothing in the vault is a secret: no real person, no customer data, no credential. It is published read-only so the method can be checked rather than described.

Derived one way from a vault key that is not published and never will be. The read key opens the vault and cannot change it.

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

## Five readers, and what each one cost.

Every number below is computed from the run records rather than from the summary.

| Reader | Outcome | Steps | Questions | Lost | Viewport |
| --- | --- | --- | --- | --- | --- |
| **Priya Raghavan**staff engineer, pays on her own card | would buy, level 1 | 6 | 2 | 2 | 1440×900 |
| **Tom Achterberg**founder, six weeks from a term sheet | stalled | 6 | 3 | 3 | **390×844** phone |
| **Mei-Lin Okafor**head of engineering, a bank’s questionnaire due Friday | would buy, blocked on timing | 6 | 2 | 2 | 1440×900 |
| **Rafael Duarte**fund partner, 31 companies | left | 6 | 2 | 2 | 1440×900 |
| **Claire Buckley**risk manager at an insurance broker | left, having understood it only on the third page | 6 | 2 | 3 | 1440×900 |

Read the viewport column. The reader carrying the most urgent decision — a founder six weeks from a term sheet, for whom £500 is his own call — did the whole thing **on a phone**, and produced the most questions and the most confusion of anyone. That is not something the vault announces; it falls out of the table once the numbers are in one place.

## The product is not named where it is sold.

The headline finding is a word, and it is measurable. Above the fold on a 1440×900 screen, the home page at v1.20.1 said:

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
- **The page led with the rung that does not exist.** The audience cards began at 2,823px on a desktop and 4,947px on a phone — the fourth and sixth screenful. Every reader who was one of the three named audiences scrolled past two full screens of insurance argument before the page addressed them.
- **Two sales were blocked by something that is not a price.** The founder would have paid £500 from his phone: no page states how long any level takes. The head of engineering would have paid £1,500 the same day against a deal worth more than her runway: the payment rails are not built, and the site says so.
- **The investor’s content is on the conference page.** It exists and it is good, and a partner arriving outside conference season finds his own content filed under an event he is not attending.

And what worked, named unprompted by more than one reader: the connector-scope quotes with their sources and dates, the admissions this site keeps making against itself, and the four-number card — which was the only thing on the first screen that kept the engineer reading. _“Nobody oversells and then volunteers that.”_

## Two pages were shipping broken JavaScript.

Before a word of the study had been written, the first pass recorded a page error on **every step of every journey**: `Unexpected token '}'` on the home page and `Unexpected end of input` on the insurance page. The menu, the mobile drawer, the in-page scroll buttons and the enquiry button were dead on both, and the insurance page had been broken since it launched.

Nothing else caught it. The HTML still rendered, so both pages looked right in a screenshot; twenty-six tests, four `npm run check` gates and two further CI checks all passed, because not one of them parsed a line of the JavaScript the pages carry. Fixed in [v1.24.2](versions.html), with a test that parses every inline script on every page — verified by deliberately breaking a page and watching it fail. Driving a real browser and recording what it throws is the only reason this was found.

## Two runs a month apart are the comparison.

The personas, the paths and the protocol are all in the vault, so the same five readers can be walked through a changed site and the answers read down a column as well as across. That is the thing this exists to make possible.
