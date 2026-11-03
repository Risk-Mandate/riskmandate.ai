# The customers site after SHarness: a brief for the session that maintains customers.riskmandate.ai

**Date:** 3 November 2026 · **Author:** @website-agent · **For:** the Claude session that maintains
`customers.riskmandate.ai` (repository `Risk-Mandate/Risk-Mandate-AI__Website__Customers`) · **Status:** a
proposal for that session to plan from with the lead; nothing here has been built on the customers site

**Trigger:** the lead, 3 November 2026: the secure harness *"changes quite a bit the offering and the
positioning"*; *"I'm going to also go to the agent that maintains the customers.riskmandate.ai so that we
map this out and again do some changes there and improve the usability and the demo."* riskmandate.ai
v1.40.0 carries the positioning below; this brief is the same story for the customers site.

## 1. What changed, in one paragraph

Until 29 October RiskMandate described and others enforced: an ABP said what one agent may do, and what
kept each rule was the agent's willingness (a line in the prompt), a hook on its own machine, or a
control the customer already ran. Now there is **SHarness** (https://sharness.ai/, `pip install
sharness-ai`, Apache-2.0), an open-source secure harness that RiskMandate maintains and the customer runs
in its own environment. It turns the ABP into a **Process Behaviour Policy**, named by a hash the person
supplies, which the Linux kernel and a small set of single-purpose *doors* hold on every process the
agent starts. So a row can now be **held**: a boundary, the one kind of barrier an insurer, an auditor or
a board can count. RiskMandate is still never in the request path; the policy compiles once, at launch,
and costs nothing per request.

## 2. What riskmandate.ai now says (v1.40.0), so the two sites agree

- **Hero:** enforce the rules *"with the controls you already run, or with SHarness, the open-source
  secure harness we maintain. We are never in the request path."*
- **Three levels, one word each:** *told* (a line in the prompt, an expectation), *checked* (a hook,
  a setting), *held* (a boundary; SHarness). The five-minute examples are all *told*, on purpose.
- **The offer in four steps:** describe (the ABP), check (lines and hooks), hold (SHarness), show (two
  numbers in every summary: the reach nobody asked for, and the rows no boundary holds).
- **Status said beside the claim**, as at 29 October 2026, 0.2.0: the kernel locks run on a process;
  `hello` holds six of six probes in five environments, one a Linux kernel in a browser tab; the file and
  network doors run as early versions. Not built: the launcher above the agent (*"Nothing yet binds the
  agent itself"*), the key, shell and model doors; Linux only.
- **The film:** Silvio Switha's *Reach, Mandate, Gap* (53 s, no narration) under the home page hero,
  self-hosted at `https://riskmandate.ai/assets/media/film/riskmandate-reach-mandate-gap.mp4` (H.264,
  6.2 MB) with a WebM beside it and a poster JPEG. The film says *delta* where the sites say *gap*.
- **New pages:** `secure-harness.html` (what changes, how a rule gets held, the offer, status, questions),
  `walkthrough.html` (private, the twenty-minute demo), and a slide deck at
  `assets/deck/positioning/index.html`.

## 3. What we propose for the customers site, in order

1. **A seventh step after refunds: hold it.** The six examples end at *told*. Add one that takes the same
   line to *held*: the kernel tab (`https://sharness.ai/code/browser/demo/index.html`, about two minutes
   to boot) running `hello`, and for Linux users `sharness-ai contain --workspace . --sites github.com --
   CMD` in a virtual environment. The point of the page is the comparison: the line the model chose to
   keep, against the rule the kernel holds.
2. **The ladder on *What is an ABP?*** The barrier table already has none, expectation, setting,
   boundary. Add which of the six examples sits where (all expectation), what a hook moves a row to, and
   what SHarness moves it to, with the status line beside it.
3. **The film on the home page**, above or beside hello world. Copy the files rather than hotlink them:
   the customers site's own policy forbids loading from somebody else, as riskmandate.ai's does.
4. **The seven fixes from *An agent that may only chat*** (newsroom, 23 October), none shipped yet:
   a line should say who can lift it; the published hooks fail open; no hook covers every tool, so match
   `"*"`; the tests stop at unit level; every hook-backed ABP needs a fallback drill; a project hook is
   only a setting and `--bare` skips hooks; agent-driving-agent is missing from the threat model.
5. **A demo path for the stand and for meetings.** One page that opens, in order: the film, hello world in
   the visitor's own assistant, the kernel tab. Phone first: most stand visitors arrive from a QR code.
   Web Summit's print QR codes point at `https://web-summit.sgit.ai/meet/<id>/`, and its plan names the
   customers site as the onboarding path; agree with the lead where a meet page hands over to this site.
6. **Web Summit, Lisbon, 9 to 12 November; the stand is on Thursday 12 November.** Say so on the home page
   until the 12th, and link the meet pages.
7. **The usability the lead asked for.** The newsroom's *A solution, not a problem* (2 November) says the
   outreach asks people for homework (write your policies, list your agents) without a clear return, and
   proposes writing the first ABP for the customer *"as a service and not as homework"*. The article calls
   that *"a direction, not something we offer today"*: it is the lead's decision before it is a page. What
   can change now without that decision: say on every example what you get at the end of it, in one line,
   before the steps.

## 4. What not to say

- That RiskMandate enforces, or sits in the request path. The customer's environment enforces; SHarness is
  something the customer runs.
- That SHarness binds the agent today. It binds the processes it starts; the launcher above the agent is
  the design.
- That the security of SHarness has been independently reviewed: the reviews so far were by an agent of
  the project.
- Any score, rating or verdict, on the site or in data. *The ABP*, never *the policy* alone. British
  English.

## 5. Sources

- `https://newsroom.sgit.ai/articles/introducing-sharness.html` (29 October), the core article.
- `https://sharness.ai/evidence/status/index.html`, the honest column.
- `https://sharness.ai/users/v0.2.0/index.html`, the synthetic users' report: run `hello` from a virtual
  environment (0 of 6 after a per-user install, 6 of 6 from a venv).
- `https://newsroom.sgit.ai/articles/an-agent-that-may-only-chat.html` (23 October), the seven fixes.
- `https://newsroom.sgit.ai/articles/a-solution-not-a-problem.html` (2 November).
- `https://web-summit.sgit.ai/videos/index.html`, Silvio Switha's two films.
- riskmandate.ai v1.40.0: `secure-harness.html`, `index.html#film`, `index.html#harness`.
