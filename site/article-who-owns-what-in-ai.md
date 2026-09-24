<!-- Generated from article-who-owns-what-in-ai.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# Who owns what in AI. And how accountability holds on the way up.

A LinkedIn infographic maps thirteen roles to what each owns in AI and what it protects. Every company will redraw it. What joins its levels, so that accountability holds on the way up, is risk acceptance with the Agent Behaviour Policy underneath: one agent worked from its nine rows to the board, seven rules, six weeks, and the model in enough detail to build.

Source: https://riskmandate.ai/article-who-owns-what-in-ai.html

---

# Who owns what in AI. And how accountability holds on the way up.

An infographic shared on LinkedIn, _Who owns what in AI (By Role)_, maps thirteen roles, from the board to all employees, to what each one owns in AI and what that protects. It is a good place to start, and every company will redraw it for itself. What a one-page map has no room for is the other direction: how a risk that begins with one agent’s access travels to the board, in whose words, accepted by whom, and until when. This article adds that direction, works it through on one agent, and ends with the model in enough detail to build.

**Responding to:** “Who owns what in AI (By Role)”, by Alex Miguel Meyer, shared on LinkedIn and sent to us on 24 September 2026. Its rows are quoted in section 01 so the argument can be followed; the image is the author’s and is not reproduced here.

**The worked example:** an invented company and an invented agent. Nobody’s system was tested. The one product fact used is quoted from the vendor’s own page, with its date.

**The figures:** three on this page are drawn by script from the article’s own data, and one of them can be played and changed. The page loads nothing from anywhere and sends nothing.

**This page as markdown:** [article-who-owns-what-in-ai.md](article-who-owns-what-in-ai.md)

## Thirteen roles, what each owns, and what it protects.

The infographic’s subtitle is “Different roles. Clear ownership. Better outcomes.” It reads left to right: a role, an arrow to what that role owns in AI, and an arrow to what the ownership protects. Its thirteen rows, as written:

Source: “Who owns what in AI (By Role)”, Alex Miguel Meyer, LinkedIn. Text transcribed from the image on 24 September 2026.

**Why we are building on it.** The lead’s reaction on seeing it was that it is a very good mapping, and the reason is specific: it is about levels of responsibility. It puts AI on every role’s desk rather than on IT’s alone. It gives the board “oversight, risk appetite and accountability”. And it ends with all employees, who are the people actually connecting agents to their mail, their calendars and their customers’ records. Everything below depends on those three things.

**What it is, and what it is not.** Across its thirteen rows, the word _risk_ appears twice, in the board’s row and the CISO’s, and _accountability_ once, in the board’s. No row mentions an agent. None of that is an omission to point at: a one-page map of who owns which area is a different object from a record of who answers for a given risk. The second is what this article is about, and it needs the first.

## A generic map, and yours will differ.

Every company that uses a map like this will have its own levels of responsibility. In a twenty-person startup the CEO is also the CFO and signs for security. A bank adds a chief risk officer and a data protection officer. A UK government department has a senior information risk owner. That is how it should be. Our own framework is generic in the same way, and it is adjusted everywhere it is used. So the useful question is not whose map is right. It is which parts a company may change and which parts must stay fixed, so that accountability still holds after the adjusting.

### The people, the lines and the limits.

- The roles, and what the company calls them.
- Who reports to whom, up to the board.
- What each role may accept, and for how long: the board’s risk appetite, handed down.
- The words each role uses for a risk.
- How long silence is allowed before a risk moves up. A week, in the example below.

### The grammar.

- Every risk has one holder at a time.
- Every holder answers to somebody, and every path ends at the board.
- Nothing is denied. A risk is accepted for a stated interval, the work to end it is funded, or it is fixed.
- Silence is not a decision. An unaccepted risk moves up.
- Every risk names the facts that make it true and the facts that would end it.
- The behaviour policy scores nothing.

## The map runs sideways. Accountability runs upwards.

Every arrow on the map points to the right: a role, what it owns, what that protects. That is the right shape for describing areas. A risk does not stay inside one area, though. It starts at a fact somewhere low, such as a connector’s scope or a setting nobody changed. From there it has to travel until it reaches somebody with the authority to accept it, fund the work that ends it, or fix it.

### The middle column is a routing table.

When a risk appears, “what they own” says whose area it touches. Customer data leaving the company is the CIO’s and the CISO’s. Mail to customers is Sales’. What goes out under the company’s name is Marketing’s. Read this way, the map already does half the work: it says where a risk lands.

### The organisation chart is the escalation path.

Each holder answers to somebody, and the chain ends at the board. Three verbs travel along this path that the map does not draw: **accepts**, for a stated interval; **answers to**, when the holder cannot or does not decide; and **can stop**, which says who can switch the agent off, and how quickly.

Both directions are needed, and joining them is the whole design. The map says which holder a risk goes to. The chain says where it goes next when that holder has no authority to accept it, or simply does not decide. What keeps accountability intact on the way up is that the risk is carried: the same exposure, in each holder’s own words, linked to the one below it and not retyped.

## One agent, and its Agent Behaviour Policy.

The example is invented, and deliberately ordinary. A company of about two hundred people sells software to other businesses. A sales representative connects an AI assistant to their own email, calendar and customer relationship management system (the CRM), so it can draft follow-ups and suggest meeting times. Their manager says yes. Nobody else is asked, because nothing about it looks like a decision.

An **Agent Behaviour Policy** (ABP) is the record of one agent in one deployment. It lists everything the agent can do (the _grant_), what it was authorised to do (the _mandate_), the gap between the two, and what stands in the way of each thing in the gap. It scores nothing. For this agent it has nine rows. One of them, the last, is the reason the table is worth reading twice: the mandate says _my own mail_, and the grant does not know the difference.

**How to read the barrier column.** What stands in the way is one of four kinds, weakest first: _nothing_; an _expectation_, a rule in prose that nothing enforces, such as a line in the agent’s instructions; a _setting_ the agent’s own account could switch off; and a _boundary_, enforced by something the agent cannot reach. Only a boundary is a control. That is why row 3 counts as unbounded even though the instructions forbid it. Unbounded excess is the one number a control can move: each real control turns a row into a boundary, and the count falls.

**On row 7:** in Google Calendar, for example, a deleted event stays in the trash for 30 days, and Google’s pages document no way for a user to restore an edited one (read 24 September 2026; the details are in [a separate article](article-calendar-edits-cannot-be-undone.html)). **On row 8:** unless the product marks what an agent did, every record shows the rep did it.

**Rows 1, 3 and 4 together** are what Simon Willison named the lethal trifecta: “Access to your private data… Exposure to untrusted content… The ability to externally communicate in a way that could be used to steal your data” ([16 June 2025](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)). This agent has all three, and an instruction is the only thing in the way. Row 9 widens the first of them from the rep’s mail to the whole team’s.

**From rows to risks.** Each row is a fact, with its source, and rows in the mandate establish risks too: the difference is that those are inside the authority of the person who connected the agent, and they accept them by connecting. That is the level the business already lives with, and it belongs in the record so that the line between it and the gap is visible. The facts establish seven risks. At first each is written the way the rep would say it:

**A control does not make a risk zero. It trades a red risk for a green one.** Every control in this article carries a residual risk of its own, smaller, inside somebody’s authority, and accepted the day the control lands: an approval step is a person clicking, and people get worn down (the CISO’s); a message approved in a hurry still goes out (the rep’s); a CRM that limits reps to their own accounts still takes wrong entries at machine speed (Sales’); a proxy that carries out every write under the ABP’s rules is now the thing that can fail, and its log is a copy of customer data (the CTO’s, and Legal’s). These belong in the record beside the risks they replaced, because they are what the business is actually running once the controls are in, and because the ABP is where the controls are written down: each one is a barrier on a row, with who holds it. The figure in section 05 draws them in green.

## The same agent, in each role’s own words.

Here is the agent’s exposure as each of the map’s thirteen roles would put it, from the bottom of the company to the top. The map’s middle column decides whom it reaches. Its right-hand column says what each of them stands to lose, quoted as written. Each statement is linked to the risks below it and never retyped, so when those end, the ones above know.

**Now follow one risk up.** R2, the stranger’s email, starts with the rep. The rep has no authority to accept it, so it goes at once to the role whose area it touches, the CISO. From there it follows the reporting lines. The chart below is this example company’s; yours will differ.

“We cannot say what our agents can do beyond what they were authorised to do, or who accepted the difference.”

“A customer could learn from somebody else that their data left us in an email we never meant to send.”

“A connector we allow lets an outside sender steer an agent that holds customer data.”

“Untrusted input reaches an agent with private data and a way out, and only an instruction stands in the way.”

“An email from a stranger could tell it to send our customer data out.”

Rows 1, 3 and 4 of the ABP: reads mail from anybody; reads the CRM; sends to anybody, with only an expectation in the way.

Read from the bottom. Each arrow is a named edge: a fact establishes a risk, a risk is translated into the holder’s words, a holder answers to the role above.

### Connect the assistant, and watch the risks travel up. Then end them.

Drawn from the article’s own data. Play the six weeks of section 07, or change the record yourself: connect and disconnect, add the controls, and see which facts stop holding. A risk lights up when every fact it needs holds and none is bounded; it drifts to the role that holds it, and lights the whole path above that role to the board, because a risk never stops with its holder: everyone above carries it. **The colour travels up the path too**: while anything below a role is unaccepted, that role’s path is red, whatever else it holds. The number on a role is how many risks it holds or carries. A risk ceases when one of its facts changes, citing the ABP version that changed it, **and what takes its place is the control’s own residual risk**, in green: smaller, inside its holder’s own authority, accepted when it appears. That is what a control does to a risk. It does not make it zero; it turns a red one into a green one that somebody can live with. Put every control on and every path to the board is green, and the risks that remain are the ones the business runs the assistant to take. Colour is the state of an acceptance, never a rating. Hover or click a role to see what it holds, carries and is informed of; hover a risk for what establishes it and what it reaches. Only the roles this agent’s path touches are drawn: Marketing, Product and HR are in the tables and not here.

**Try the last switch on its own.** Connect the mail and the CRM, then tick the instructions. Every row in the gap changes from _nothing in the way_ to _an expectation_, the mandate is now precise about the business process, and the risks stay lit: unbounded excess does not move. That is the honest picture of an instruction. It is worth writing down, because it says what the agent was told, and the ABP is where it is written. It is not a control. The mail connector in the example, like the real ones we have recorded, grants the whole mailbox: on our [Gmail record](abp-vault-claude-gmail-connector.html), Google’s consent screen offers three lines to tick, each for the whole account, and none for one folder, one customer or one business process (read 16 September 2026). So the mandate can say _only follow-ups on my own accounts_, and the grant cannot. The gap between those two sentences is the risk, and the boundary switches above are what end it.

## Seven rules that keep accountability intact.

These are what join the map to the chart. They are how Risk Mandate works: the acceptance loop, with the ABP underneath it supplying the facts. Most are published on this site already, and are gathered here so that the article stands on its own: the three doors and their intervals, silence, facts that end risks, and the stop. Two are new in this article: authority delegated from the board, and placing a risk by the map.

### The board’s risk appetite becomes authority to accept.

The map gives the board “oversight, risk appetite and accountability”. Appetite becomes usable when it is handed down, one role at a time, as a limit on what that role may accept and for how long. In the example: the rep may accept what stays inside their own mailbox, calendar and drafts, for up to a month. The head of Sales may accept what touches the team’s customer mail and records, for up to a month. The CIO and the CISO may accept customer data at risk, inside the company or leaving it, for up to three months. The CEO may accept what reaches customers at scale or cannot be undone across the company. The board keeps whatever its appetite statement reserves to itself.

Authority is written as _kinds of consequence_ and _lengths of time_, not as scores. Both can be argued with, and both can be checked.

### A risk is placed by the map, and moves by the chart.

A new risk is offered first to the nearest holder, usually the person who connected the agent. If it is outside their authority, it goes straight to the role whose area it touches: the map’s middle column. From there it follows reporting lines until it meets an authority that covers it. It has one holder at a time. Everyone else it touches is _informed_, and informed is not the same as holding.

### There is no deny. There are three doors, each with an interval.

A risk exists as soon as the facts do, whether or not anybody has signed for it. So the choice is never yes or no. It is: **accept** it for a stated interval; **fund** the work that will end it, and accept it for as long as that work takes; or **fix** it now. The interval is the decision. Anything under a week is an incident, and should be treated as one. A month is a piece of funded work. Six months, near the line of what the business finds acceptable, is a named decision to wait.

### Silence goes up.

A risk nobody has accepted is critical for whoever holds it, because until somebody accepts it that person is accountable for it. If the holder does nothing within the time the company has set (a week, in the example), the risk moves to the person they answer to. When an acceptance expires, the same decision comes back to the same desk with whatever has changed since. If it is not renewed, it goes up.

### Translate, never retype.

Each holder receives the risk in their own words, as a new statement linked to the one below it. The CISO’s sentence and the rep’s are different sentences about the same facts. When the lower one ends, the upper one ends too, unless another source still holds it up. A retyped risk is disconnected the moment it is written; a translated one knows when it is over.

### Facts end risks. People do not close them.

The ABP is recomputed whenever the grant or the mandate changes. When a row moves to a boundary, or leaves the grant, the facts it established end, and every risk that needed them ceases. The new ABP version is the evidence. Nobody closes a risk by saying it is closed.

### Somebody can stop the agent, within the shortest interval accepted.

If a holder accepts a risk for four hours, somebody must be able to switch the agent off within four hours. Every chain records who can stop the agent and how long it takes: the rep can disconnect it, and IT can revoke the connector for the whole company. An interval nobody can honour is a finding. [The plug profile](plug.html) is where that gets written down.

## The five risks, from the day it was connected.

Invented dates, and the mechanics are the point. Watch where each risk goes, who decides, and what ends it.

### Connected. Nine rows, five in the gap, none bounded.

The ABP is written from the connector’s consent screen, the products’ own pages and ten minutes with the rep about what they want it for. Nine risks are established. **The person who connected the agent can accept one of them**, R0, which stays inside their own work, and they do, by connecting. Every other one reaches past it. R1, R4 and R7 go to the head of Sales, R2 to the CISO, R3 to the CIO, R5 to the COO, whose map row is “operational integration”, RL to Legal and RC to the CFO. Each of them also lights the path above its holder to the board, in red while it is unaccepted: the CTO carries what the CIO and the CISO hold, and the CEO carries all of it. The board’s view shows eight new risks with holders and none accepted, and one accepted by the rep.

### Sales accepts one, funds one, and asks for a fix.

The head of Sales **accepts** R7 for a month: the team’s customer mail is inside Sales’ own authority, and reading it is a risk the team can live with while it decides whether the delegation should stay. Then Sales **funds** R1: accepted for two weeks while IT adds an approval step to sending that the agent cannot give itself. For R4 they choose **fix**: they ask the CRM administrator to limit reps to their own accounts.

### The CISO, the CIO, Legal and the CFO accept, with actions.

The CISO **accepts** R2 for two weeks and records why that is enough: R2 needs rows 1, 3 and 4 together, so R1’s fix ends it too. The CIO **funds** R3: accepted for a month while export is removed from the connector’s scope, a change IT has to schedule. Legal **funds** RL for three months: processing terms with the model provider, and the notice to customers rewritten to say where their mail goes. The CFO **funds** RC for three months: the broker is asked, in writing, what the cover says about an agent acting as staff. Neither of those is a technical control, and both end a risk, because each changes a fact the risk was established on.

### R4 ceases, on evidence. Its residual takes its place.

The CRM now limits the rep to their own accounts. ABP version 2 is recomputed: row 5’s barrier is a boundary, held by the CRM administrator, out of the agent’s reach. The fact behind R4 no longer holds, and R4 ceases, citing version 2. Sales’ and the CIO’s statements lose that source. What is left is G2: wrong entries on a rep’s own accounts still happen, at machine speed. It is inside Sales’ authority, and Sales accepts it the same day.

### Silence: R5 moves up.

The COO has not acted on R5 in a week. It moves to the CEO, whom the COO answers to, and it is now critical there.

### The CEO fixes R5, and a smaller risk takes its place.

The CEO asks IT to narrow the agent’s calendar access to the rep’s own calendar. ABP version 3: R5 ceases. The agent can still edit the rep’s own events, which is more than suggesting times, so a smaller risk is established: “it can change my own meetings”. That one is inside the rep’s authority, and the rep accepts it for a month.

### The approval step goes live. R1 and R2 cease together; two residuals appear.

Sending now needs the rep’s approval, somewhere the agent cannot reach. ABP version 4: row 3’s barrier is a boundary. R1 ceases. R2 needed all three rows, loses the sending one and ceases too. The lethal trifecta is broken on evidence, not on an instruction. Two residuals are established and accepted the same day: G1, a message the rep approves in a hurry still goes out as them, which is the rep’s; and G4, that an approval is a person clicking and people get worn down, which is the CISO’s.

### Three acceptances run out, and are renewed.

The scope change was scheduled and has not shipped. R3 returns to the CIO, who renews for one more month with a date for the change. R0 came back to the rep on day 30 and R7 to Sales on day 32, and both were renewed. Each renewal is a new acceptance, and the old ones stay in the record.

### What the board sees.

Nine open risks, each with a name and a date, and none unaccepted, so every path to the board is green. Four are still funded or accepted from the gap: R3, held by the CIO until day 63 with the work scheduled; R7, held by Sales until day 62; RL, Legal’s, and RC, the CFO’s, both until day 93. Five are inside their holders’ own authority: R0 and R6, the rep’s; and the residuals of the two controls that landed, G2 with Sales, G1 with the rep and G4 with the CISO. Four risks ceased, each citing the ABP version that ended it. For the agent, unbounded excess went from five to three. That is not a score. It is a count anybody can recompute from the ABP versions.

### Who held each risk, in which state, and what ended it.

The same six weeks as a strip: one line per risk, day 0 to day 42. A hatched bar is a funded acceptance; the small arrow on R5 is the week of silence that moved it from the COO to the CEO; each ending names the ABP version whose facts ended the risk. The last three lines start where a control lands: they are its residual risks, accepted by their holders from that day. R0 is the one inside the rep’s own authority from the day the agent was connected, which is the level the business already lives with. Everything that runs past the edge was renewed, and carries a date.

## The same thirteen rows, with what a one-page map has no room for.

For the example company and this one agent. The first column is the map’s; the other four are what the acceptance loop adds. Another company would fill them differently, and another agent would change the second column entirely.

**Read down the last column.** Of thirteen roles, four can stop this agent, and only two can do it without asking anybody: the rep and IT. That is normal. It becomes a finding only when an acceptance is shorter than the time the stop takes, or when nobody on the risk’s path can stop it at all.

## The model, in enough detail to implement.

Everything above fits in a semantic graph: nodes, and edges that are verbs. Every verb has a named inverse, so each link reads correctly from either end. There is no generic “relates to”, because an edge without a verb constrains nothing. Nothing is deleted: a new version supersedes the old one, and both stay.

### Eight node types, thirteen verbs, every verb with an inverse.

The tables above, drawn. The bottom row is the evidence: an agent, the versions of its behaviour policy, and the facts each version records. The middle is the risk and its acceptance. The top is the people: roles, the authority delegated to each, and the person who signs. A dashed edge is one of the two that can end or inform without holding. Hover a verb to read it from both ends.

Hover or focus a verb.

### Placement

When a risk is established, offer it to the role of the person who connected the agent. If its consequence is outside that role’s authority, place it with the role whose _owns_ matches the consequence. If that role’s authority does not cover it either, walk `answers_to` until one does, or until the board. Add `informs` to every other role whose area it touches.

### The clock

An open risk with no acceptance starts the silence timer the company set. When the timer runs out, move the risk one step up `answers_to` and restart the timer. An acceptance sets an expiry. At expiry, return the risk to the same holder with what has changed since. If it is not renewed within the silence timer, move it up. An acceptance longer than the holder’s authority allows is refused, not trimmed.

### Cease

On every new ABP version, re-derive the facts. A risk ceases when a fact it needs no longer holds, or when a fact that `ends` it now holds. Record the ABP version that ended it. Then walk `translates_into`: a risk above ceases when none of the risks it was translated from still hold.

### The stop check

For each acceptance, compare its interval with the fastest `can_stop` on the risk’s path. If the acceptance is shorter than the stop, raise a finding. The same finding stands if nobody on the path can stop the agent at all.

### The board’s view

A list, never a score: every open risk, its holder, the door chosen, the expiry and the action, with unaccepted risks first. Then the ceased ones and the ABP versions that ended them. For each agent, the four counts: grant, mandate, excess, unbounded excess. Whatever the board has reserved to itself comes first.

**Nothing in this model scores anything.** Kinds of consequence and lengths of time do the work a score usually does, and unlike a score, a person can argue with them. The ABP never rates the agent; it says what the agent can do, on a date, with sources.

## What runs today, and what this article proposes.

### The record, and the loop on paper.

- The ABP format, and [sixteen example ABPs](agent-behaviour-policy.html), free, with the grant, the mandate, the gap and the barriers computed for each.
- The 23 capability primitives and the four barrier kinds used in section 04.
- A risk engine behind [our business cases](business-cases.html). It computes which risks hold from facts, and carries them up ten roles to the board.
- What [acceptable](acceptable.html) means, the intervals, and why an unaccepted risk is critical.
- The question of [who can stop an agent](plug.html), and how fast.

### The engine, and seven of the thirteen roles.

- Software that records acceptances, runs the clocks and moves silence upwards.
- Authority as data. Delegating the board’s appetite into kinds of consequence and lengths of time is proposed here for the first time.
- Seven of the map’s roles. Our model has ten: the CEO, the board, the CFO, the CTO, the CISO and Product are in it, alongside roles the map does not have, such as a data protection officer. The COO, CIO / Data, Legal, HR, Marketing, Sales and all employees are not.
- Translation. Each role’s wording is written by hand today.
- Real grants at scale. The ABPs are templates, read from vendors’ own pages, with some rows measured on accounts we are entitled to use.

What we would ask of anybody who draws a map like the one in section 01, including its author: keep the middle column, because it is what places a risk. Then add one arrow pointing up. And if you have drawn your company’s version of the map, we would like to see which of the four extra columns you could fill in today.

## Start at the bottom of the chain: what can your agent do?

Every risk in this article came from eight rows. The free prompts have your agent list its own reach in about twenty minutes, with nothing collected. The ABP puts that next to what you authorised, and the gap is where the acceptance loop begins.
