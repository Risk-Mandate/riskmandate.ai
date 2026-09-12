<!-- Generated from lab-shape-collector.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Lab 04 · the shape collector

A build specification: the collector that asks somebody what they run, the schema no standard supplies, the write-only lane that cannot correlate — and the arithmetic showing why a twenty-connector question is not anonymous.

Source: https://riskmandate.ai/lab-shape-collector.html

---

# Seven things to build, and one word we have not earned.

The first thing anybody will ever use is a page that asks what they run, computes what they granted, and hands them the gap. This is its build specification: three tools, two vaults, two documents — and the arithmetic that says a twenty-connector question is not anonymous, which changes what may leave the browser.

## The cheapest product we have, and it asks one thing.

Every other route into what an agent can do requires something to be installed. This one asks. Somebody says which assistants they use, on which surfaces, with which connectors switched on; the page works out what that grants; and it hands back the difference between that and what they would have said they intended. No install, no administrator, no procurement.

- **It is stages two to four of the flow next door, collapsed into one screen.** [Lab 02](lab-abp-flow.html) draws twelve stages from a stranger's first question to a delivered policy. Self-select, draft and correct are three of them, and the finding here is that they are not three conversations — they are one page where the picture on the right changes as the answers on the left do, and correcting it is done by changing an answer rather than by writing to us.
- **The output already has a name.** It is _the shape_ — the deployment shape, which is the noun the model site already uses for a configuration somebody actually runs. The collector produces a shape record and the grant is derived from it. No new noun.
- **It is also the whole of the smallest paid thing.** Their answers, their measured grant, the delta between them, as a file they keep. That is what the first tier on [the pricing page](pricing.html) describes, and until now it has been a questions page waiting for a tool.
- **And it is honest about what it is not.** This finds what people will tell you. That is a different thing from what is on the network, and neither one is complete. That sentence belongs on the product, not in a footnote — see [below](#market) for why nobody else says it.

The collector asks the shape, computes the grant, and returns the delta.

Everything on this page after that sentence is about one question: what, if anything, is allowed to leave the browser.

## A twenty-connector question is not anonymous.

The instinct is that answers like these are harmless in bulk, so they can simply be collected. That instinct is wrong, and it is wrong measurably rather than arguably — which is the good case, because it means the fix is arithmetic rather than judgement.

2²⁰ — about a million distinct answers to one question.

4 bands × 2⁵ category combinations = 128 answers. A reduction of about 8,000×, and the research loses almost nothing — the interesting finding is _how many_ and _of what kind_, not which brand.

| Responses | Cells that could hold a group of five | Realistic outcome |
| --- | --- | --- |
| 100 | at most 20 | **Effectively every respondent unique** |
| 500 | at most 100 | **Effectively every respondent unique** |
| 5,000 | at most 1,000 | Common shapes reach a group of five. **Every interesting shape does not** |
| 50,000 | at most 10,000 | The head is safe and the tail still singles out |

- **The nominal space is around five trillion cells** once assistants, surfaces, role and company size are multiplied in — roughly 42 bits. Real distributions are skewed, so far fewer cells are ever occupied. The comparison that decides the question is not with the space, it is with the number of respondents, and at any sample we will plausibly reach, the respondents lose.
- **The regulator's test is singling out** — the ability to isolate the records relating to one person — assessed against a motivated intruder assumed reasonably competent with ordinary resources, and it cites groups of five as strong protection. Nothing in the table above reaches that.
- **A second anchor, from outside our field entirely.** Three low-cardinality fields — postcode, gender and date of birth — uniquely identify about 87% of a national population. A configuration is a fingerprint in the literal sense, and fingerprints do not become less identifying because the person typed them in themselves.
- **So the submissions are personal data and must be handled as such.** That is not an argument against building it. It is an argument for building it the way described next, which costs almost nothing and makes the product better.

## Compute locally in full. Submit banded.

This keeps everything the product needs and gives up nothing the user wants. The full configuration is computed in the browser and never leaves it; what crosses the wire, and only if somebody presses submit, is a banded record.

The full shape, and everything derived from it

Every connector by name, every surface, every assistant. The grant is computed from the full shape, the delta derived, the label and the leaflet rendered. The user sees all of it. It is their configuration.

- **named** connectors, assistants, surfaces
- **computed** grant, delta, barriers
- **typed** anything written freely
- **kept** in this browser, to be resumed

Bands and categories. Nothing else.

A record with no names in it, no identifier of any kind attached to it, and nothing recorded about the request that carried it.

- **band** connector count, 4 values
- **categories** mail, files, calendar, code, chat
- **coarse** desktop, web, editor, command line
- **bands** role (3–4), company size (3)

| Field | Full, local | Submitted |
| --- | --- | --- |
| connectors | The named list of twenty | **A count band** — none, 1–2, 3–5, 6+ — **plus categories**: mail, files, calendar, code, chat |
| assistants | The named list | A count band and the categories |
| surfaces | Each one | Coarse — desktop, web, editor, command line |
| role | Free choice | **Three or four bands** |
| company size | Exact | **Three bands** |
| free text | Shown back to them | **Never submitted.** Free text cannot be anonymised |
| address, user agent, precise time | Not needed | **Never recorded** — each one independently defeats the banding |

A collector that cannot read back cannot correlate.

That is the estate's own enforcer test — a control bounds a grant only if it is enforced by something the grant does not include — applied to our own product. A promise not to correlate is bounded only by something the collector does not have, and here that something is read access. It is a structural claim rather than a policy, which is the only kind worth publishing.

- **The write-only lane between two vaults is therefore not a platform demonstration.** It is the correct privacy architecture for this specific job, and saying so turns a capability into an argument. The submitting side holds a write credential and no read key; it cannot join a submission to an earlier one, cannot read across respondents at the point of collection, and cannot reconstruct a session — because it cannot read anything at all.
- **One hard rule follows, and it goes in the build rather than in a policy.** A submission carries _no stable identifier of any kind_. Not a session token, not an install identifier, not a hash of anything, not a salted hash, not a "random" value that persists past the page. The pattern to copy is the install counter that refuses identifiers outright and buckets by week.
- **Suppress on output, and check the subtraction.** Never render a published cell backed by fewer than five submissions, and verify that a suppressed cell cannot be recovered by subtracting the ones around it from a total. The second half is the part that gets forgotten.

## Three tools, two vaults, two documents.

Nothing below exists. Each card says what the thing is, where it runs, what it holds, what it must never do, and what has to be decided before it can be started. The two documents are on this list because without them the product cannot use the word it wants to use.

### The shape collector

The page itself: under fifteen questions, one item per screen on a phone, an honest stated duration, a picture that accumulates on the right as the answers come in on the left, one guess screen before the reveal, and a result the user can keep. Everything it computes, it computes locally.

### The shape record schema

A closed, controlled vocabulary for a _deployed configuration_: which assistant, on which surface, with which connectors granted which scopes — and the mapping from that to the capability primitives it grants. Twice this month the answer to "do we need to build this" has been "it already exists". Not this time.

### The submitting vault

The lane the browser hands a banded record to. It holds a write credential for V2 and no read key for anything, which is what makes the privacy claim structural instead of promissory.

### The collection vault

Where banded records accumulate. Read access sits with us and not with the collector, which is the entire point of splitting it from V1.

### The aggregator

The thing that turns a collection vault into something publishable, and the only place the suppression rule can actually be enforced. It is listed separately because a rule that lives in prose is not a rule.

### The motivated-intruder assessment

A short written assessment naming who the motivated intruder would be, what they would already know, and what the banded corpus would add to it. The obligation is not to reduce the risk to zero; it is to make a reasoned assessment and record it.

### The employer instrument

The same questions, sent by an employer to its own staff, to find out how many agents are in use. It is a real second product and it is _not the same product_, because the law changes when the employer sends the link. Detail in [its own section](#employer).

## Storing the answers is one thing. Sending them is another.

The analysis splits cleanly, and the design should follow the split rather than cover the whole tool with one consent banner. Three of these four rows need no banner at all. The fourth needs more than a banner.

| Operation | Regime | Position |
| --- | --- | --- |
| storing in-progress answers | Storage rules, in scope | **Strictly necessary.** Assessed from the user's point of view, and somebody who starts a self-assessment plainly wants their answers to persist. **No banner** |
| reading them back | Storage rules, in scope | Same exception, same reasoning |
| analytics about the tool | Storage rules, in scope | Drop-off point, device class, which question loses people. **The statistical-purposes exception fits**, with clear information and a simple free means to object — a toggle defaulted on. **Browser settings are not sufficient** |
| submitting the answers | Not the storage rules. Data protection only | **An explicit, separate, unticked act.** The answers are the content the user produced, not statistics about how the service is used |

The statistical exception covers _how_ a service is used. It does not cover _what_ the user told it.

Those are different things and only the first is exempt. The regulator is explicit that the exception is not a broad one covering all analytics — which means the submit screen is a real screen, with its own unticked control, and not a line in a footer.

## Do not design it as a game. Design it to finish.

The instinct that the game framing carries over from the teaching work is wrong, and the evidence that applies here is a different literature. This is a data-collection instrument, not a teaching artefact: what matters is completion, and that literature is well developed and mostly contradicts the folklore.

| Progress indicator | Effect on dropping out |
| --- | --- |
| constant speed — an honest linear bar | **No significant effect** |
| fast at first, then slowing | Drop-off odds multiplied by about **0.80** |
| slow at first, then speeding up | **Drop-off odds up by 56%** |

- **The harmful pattern is exactly what this tool produces by accident.** A short introductory section followed by a long connector-by-connector section makes the bar stall in the middle — which is the slow-then-fast shape, the one that raises drop-off odds by more than half. The meta-analysis behind the table covers nineteen studies and thirty-two experiments and concludes that its findings question the common belief that progress indicators reduce drop-off at all.
- **One question per screen does not reliably buy completion either.** A controlled comparison of a conversational form against an ordinary one found 89.8% against 91.4% completion — no significant difference — and the conversational version took **53% longer**. A 2026 field experiment found it rated more original and more entertaining, harder to navigate, and with no practical data-quality advantage.
- **And the widely quoted commercial figure does not survive inspection.** A conversational-form vendor claims 47.3% completion against a stated industry average of 21.5%, with no methodology, no denominator definition and no independent verification. Its companion claim about rich media is an uncontrolled correlation between finishing a form and how much effort somebody put into building it.

| Rank | Lever | Evidence |
| --- | --- | --- |
| 1 | **Fewer questions** | The only lever with both randomised and large observational support, and the observational data shows a cliff above roughly fifteen |
| 2 | **An honest, short stated duration** | Randomised and replicated. **The announcement is itself a treatment**, and an indicator only helped when the task was promised short and actually was |
| 3 | **Works on a phone, one item at a time, no grids** | Strong on quality, good on completion. Most responses will be mobile |
| 4 | A high-value question early | One clean experiment, one large observational study. Modest but real |
| 5 | Showing partial results | **Satisfaction significantly higher, completion roughly unchanged.** Treat as an untested hypothesis |

- **The accumulating picture is still worth building, for the honest reason.** It makes the thing feel worth finishing and it makes the output legible. It is _not_ evidenced as a completion mechanism, so it should be measured rather than assumed — which is the fifth row of the table above, not the first.
- **One game mechanic earns its place, and it is the estate's own.** Before revealing what the selected connectors grant, ask the user to guess the number. Stating a belief before being shown the answer is the mechanic the games site is built on; it costs one screen; and it is what makes the result land rather than scroll past. It is also what turns a form into the experience the game instinct was reaching for, without the 53% time penalty of a conversational interface.

## When the employer sends the link, the law changes.

The same instrument, circulated inside a company to find out how many agents are actually in use, is a real product and a different one. Three things move, and the third is the one that decides the design.

- **Consent stops working.** The regulator's guidance on monitoring workers says consent is not usually appropriate in the employment context because of the imbalance of power, and that it must be freely given and withdrawable without detriment. A survey circulated by an employer, whose answers could reveal a policy breach, is close to the worst case for freely given consent. The realistic basis is legitimate interests with a documented assessment.
- **An impact assessment is likely required before it runs.** One must be carried out before processing likely to cause high risk to workers' interests, and a tool that inventories which systems an individual employee uses, on which devices, with which data connectors, is systematic monitoring of workers.
- **And the employer holds the identifying context we do not.** The regulator recognises relative anonymity explicitly: information can be personal data in one organisation's hands and anonymous in the hands of another that lacks the context. The employer has the organisation chart, the device fleet and the sign-on logs.

"One product person on a desktop assistant with mail, files and code connectors" is anonymous to us and a name to them.

So the employer mode never returns an individual row. Only cells above the suppression threshold, only bands, and the product says so on the page the employee sees before they answer.

## Nobody else asks. That is the opening and the problem.

A ten-vendor comparison of the discovery market, published 7 September 2026, found that all ten discover through technical telemetry — browser extensions, endpoint agents, network inspection, API integrations, sign-on logs — and none through self-report. One free assessment tool disparages self-report explicitly and recommends usage telemetry instead. Both halves of that matter.

Self-report reaches what telemetry cannot

A personal device, a personal account and a locally run server are all invisible to every method on that list, and all three are where the interesting deployments are. One of the larger vendors implicitly concedes the gap by selling desktop agents to close it.

- **no** procurement
- **no** installation
- **no** administrator

There is no vocabulary of trust for it

No incumbent treats survey data as a legitimate discovery source, so the burden of explaining why it counts falls entirely on us — and it cannot be met by claiming more than the method delivers.

- **says** what people will tell you
- **not** what is on the network
- **neither** one is complete
- **The completion standard to beat is a free seven-question organisational assessment** taking about two minutes, with no email gate. That is the bar, and our budget above is nine screens — so the honest stated duration has to be honest.
- **And nothing we found asks an individual which assistants and connectors they personally use and returns them a result.** That is the specific thing being built, and it is the reason this is worth doing at all.

## The honest word, until then, is banded.

One sentence of product copy is doing more damage than any missing feature on this page, and it is the one that says the data is anonymous. It is a claim with a defined test behind it, and we do not currently pass the test.

The word _anonymous_ may not appear in this product until all three of these exist:

- **The banding** — no named connector list, no free text, no address, no user agent, no precise time, no stable identifier. _Specified above; not built._
- **The suppression** — no published cell below five, and the subtraction check alongside it. _Specified above; not built._
- **The assessment** — written down, naming the motivated intruder, published and dated. _Not written._
- **Until then the product says _banded_**, and explains what that means in a sentence: we ask how many and of what kind, never which brand, and never anything you typed. That is a claim we can currently support, which is the only kind this site publishes.
- **This is the same rule the rest of the site runs on.** No claim about a third party without a source and a date; no score without stated inputs; no capability asserted without saying whether it was measured or derived. A privacy claim is not exempt from the discipline just because it is about us.

## Seven things we cannot settle alone.

These are real rather than rhetorical, and four of the seven block a card in the build list above. If you have an opinion on any of them, that is more useful to us today than agreement with the rest of the page.

| # | Question | Blocks |
| --- | --- | --- |
| 1 | **How many questions, exactly?** The cliff is around fifteen and the connector question alone could be twenty items if built carelessly | T1 |
| 2 | **Is the connector question one multi-select, or a category then a count?** The second is the banding made native, and it may lose people who want to see their own tool named | T1 |
| 3 | **What does the guess screen ask?** One number, or one number per category | T1 |
| 4 | **Who writes the motivated-intruder assessment, and where does it live?** It is a short document and it is a precondition for a word | D1 |
| 5 | **Does the employer mode need a different instrument, or the same one with a different output?** Same instrument is cheaper, and the consent problem does not care | T4 |
| 6 | **What is the suppression threshold?** Five is the cited standard, and a small early sample will suppress nearly everything | T3 · V2 |
| 7 | **Does the shape schema become the published vocabulary, or stay internal until the fifth policy?** Publishing early invites correction and locks a shape too soon | T2 |

## And seven we are choosing to live with.

| Tension | Both halves are true |
| --- | --- |
| banding the submission | It is what makes the data lawful to hold, and it throws away the brand-level detail that would be the most interesting thing to publish |
| computing locally | It is the strongest privacy position available, and it means we learn nothing at all unless somebody presses submit |
| not designing it as a game | The evidence is about completion rather than enjoyment, and the instinct about feel is what will make people start |
| the guess screen | It is the one mechanic with a published argument behind it, and it adds a screen to an instrument whose main lever is fewer screens |
| employer mode | It is a real second product, and it carries an impact assessment, a weak lawful basis, and an intruder who is the buyer |
| self-report | It reaches what telemetry cannot, and no incumbent treats it as legitimate |
| building the schema | It is a genuine gap, and it is the third schema this estate has taken on in a fortnight |

Written 12 September 2026 from a dev brief of the same date. Sources, all read 12 September 2026 — **completion:** the progress-indicator meta-analysis of 19 studies and 32 experiments, Villar, Callegaro and Yang 2013, _Social Science Computer Review_ 31(6); the expectation-matching result, Yan, Conrad, Tourangeau and Couper 2011, _IJPOR_ 23(2); the conversational comparison, Kim, Lee and Gweon 2019, CHI; the 2026 field experiment, Cavusoglu Deveci, Fuchs and Metzler, _BMS_ 169-170(1), 6 March 2026; the item-by-item finding, Revilla, Toninelli and Ochoa 2015; the personalised-feedback trial, Kühne and Kroh 2018, _SSCR_ 36(6); vendor completion claims at [typeform.com](https://www.typeform.com), treated as marketing with no methodology. **Schemas:** [cyclonedx.org](https://cyclonedx.org/), machine-learning component bill of materials v1.7, standardised as an international specification December 2025; the alternative family's profile at [spdx.github.io/spdx-spec](https://spdx.github.io/spdx-spec/). Neither describes a deployed configuration. **Identifiability:** the regulator on effective anonymisation, the singling-out test, the motivated-intruder test and groups of five, at [ico.org.uk](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-sharing/anonymisation/how-do-we-ensure-anonymisation-is-effective/); Sweeney on postcode, gender and date of birth; Eckersley 2010 on 470,000 browser samples and 83.6% instantaneous uniqueness. **Storage and submission:** the guidance on storage and access technologies, published 29 April 2026, at [ico.org.uk](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/), including the strictly-necessary test assessed from the user's point of view, the statistical-purposes conditions, the objection mechanism that may not be a browser setting, and the statement that the exception is not a broad one covering all analytics. **Employment:** the regulator on monitoring workers, October 2023 and last updated 16 June 2026, at [ico.org.uk](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/employment/monitoring-workers/). **The market:** a ten-vendor comparison published 7 September 2026; [nudgesecurity.com](https://www.nudgesecurity.com) for the one transparent price found; the free seven-question assessment at [aona.ai](https://aona.ai/tools/shadow-ai-risk-assessment), which recommends telemetry over self-report. **Inside the estate:** the capability map and its 23 primitives at [what-can-it-do.games.sgit.ai](https://what-can-it-do.games.sgit.ai/map/index.html); the belief-before-answer mechanic at [games.sgit.ai](https://games.sgit.ai/). The entropy arithmetic in [the second section](#bits) is ours, derived from stated assumptions rather than measured.

## The journey, kept as files.

This page holds current thinking, and it will change. Each edition below is a dated, immutable copy of what it said on the day, with its own digest. Nothing is rewritten; the list only grows.

Digests for every edition are in [lab-editions.json](lab-editions.json), so a PDF somebody was sent can be checked against this list.

## Two vaults are hours. One word is a document.

The write-only lane can be provisioned today and it is what makes the privacy claim structural rather than promissory. The assessment is a short piece of writing and it decides what the product is allowed to say. Neither is the hard part, and both are ahead of the hard part.
