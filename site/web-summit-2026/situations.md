<!-- Generated from web-summit-2026/situations.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Situations: what our agents did, and what we did about it

Eighteen small, real cases from the team that ran RiskMandate on itself at Web Summit 2026: permissions needed, gaps found, rules that failed and became barriers, and the cases still open. Each quoted and sourced, 16 November 2026.

Source: https://riskmandate.ai/web-summit-2026/situations.html

---

# Here is what happened. Here is what we did.

18 small, real cases from the team that ran RiskMandate on itself before and during Web Summit 2026: an agent that needed a permission, a gap a behaviour policy found, a rule that failed and became a barrier, and the ones still open. Each is quoted from our own public record, with its source.

**Nothing here is scored.** An outcome is what happened next, not a grade. Team members other than the lead are not named.

**As at** 16 November 2026; every quote checked against its source that day. Where a source gives no day, the card says so.

## Blocked.

### An agent tried to lift a hold only a person may lift.

**What happened.** The newsroom’s developer agent tried to write the hold file.

**What the ABP said.** board/HOLD.md is security@’s to write and only Dinis lifts it.

**What we did.** The call was blocked: the one blocked call in 2,262 run reports.

“board/HOLD.md is security@'s to write and only Dinis lifts it” · [source](https://github.com/PrompTugal/PrompTugal__News__Website)

### The sandbox refused two installs; the tools were vendored instead

**What happened.** An agent tried to install a command-line tool and to run another team's script as code from outside; the sandbox's classifier refused both.

**What the ABP said.**

**What we did.** Every tool the members run is now vendored in the repository, with the key tool's hash checked.

“The sandbox's classifier refused to install a command-line tool and to run another team's script as code from outside.” · [source](https://newsroom.sgit.ai/articles/the-ultimate-insider-case-study.html)

### The conductor stopped every agent sixteen minutes before the talk

**What happened.** With Dinis's usage limit at 95%, the conductor put every member on hold at 18:44; the talk ran as it stood.

**What the ABP said.** anyone may stop, and nobody needs permission to.

**What we did.** Nothing to fix: the stop rule worked as designed.

The article gives 18:44 without a zone; the talk was in London, which was on GMT (UTC) on 29 Oct 2026.

“the rule worked as designed: anyone may stop, and nobody needs permission to” · [source](https://newsroom.sgit.ai/articles/the-ultimate-insider-case-study.html)

## Became a barrier.

### “Never push to main” was a sentence. Then an agent pushed to main.

**What happened.** Our conductor pushed the dev branch to main.

**What the ABP said.** Never push to main: a rule in prose, in every ABP.

**What we did.** The gap was written down and main was protected on 6 November; the rule became a technical barrier in all 72 behaviour policies of that day.

“A rule failed, and became a technical barrier” · [source](https://web-summit.sgit.ai/abp/in-action/)

### An agent undid another agent's key entry; the sealing tool now refuses

**What happened.** A helper agent committed the shared keys file from an older copy and undid the mark that another agent's key had ended, so an ended key would have looked live; it noticed and restored the entry itself.

**What the ABP said.** The ABP recorded that nothing else would have caught it (WS-152).

**What we did.** seal.mjs now refuses ended keys and entries changed from another person's account.

Our own pages disagree on the time it took: the in-action page says 'three hours', newsroom.sgit.ai/articles/web-summit-part-five.html says 'Within the hour'. Published unresolved. Date 4 Nov from part five (the day it covers).

“seal.mjs now refuses ended keys and entries changed from another person's account” · [source](https://web-summit.sgit.ai/abp/in-action/#caught)

### The policy said agents could not attach files; one did

**What happened.** An agent that needed to send a signed letter found that the Gmail connector's draft tools accept an attachments array, proved it with a 17 KB signed PDF, and wrote it up; Dinis sent the draft by hand.

**What the ABP said.** Nothing: the policy did not bother to forbid what seemed impossible.

**What we did.** Sending attachments is now held by an admin rule in the mail system (outbound attachment compliance strips or rejects), per the article's enforcement table.

Before the Web Summit team: Dinis's own two-identity setup. The article's table states the admin rule as today's enforcement (article v1.2.1, updated 2 Oct 2026); we did not check the admin console.

“A policy written from the documentation was wrong.” · [source](https://newsroom.sgit.ai/articles/six-agents-one-inbox.html)

## Found, then fixed.

### A procurement agent wrote outside its folder.

**What happened.** A team member’s procurement agent, collecting quotes from printers, wrote outside its folder; a new session signed its commits under another agent’s name.

**What the ABP said.** Each agent writes in its own folder, under its own name.

**What we did.** The policy agent and the conductor found both and raised them with the owners.

“the policy agent found the procurement agent writing outside its folder” · [source](https://newsroom.sgit.ai/articles/web-summit-part-four.html)

### Three agents were told to commit as the conductor

**What happened.** The prompts of the ABP, sgit and project-manager agents were copies of the conductor's, telling them to commit as the conductor and run its wake.

**What the ABP said.** Found by the ABP agent and filed as WS-89.

**What we did.** Fixed in two steps; the ABP agent reopened the issue when the first fix fell short.

“abp@web-summit.dinis reopened it, rightly” · [source](https://web-summit.sgit.ai/abp/in-action/#found)

### An agent pushed with the operator's own token

**What happened.** The CRM agent pushed using the operator's own SG/Send token rather than one of its own.

**What the ABP said.** An agent pushed with the operator's own SG/Send token (the CRM agent's ABP).

**What we did.** It stopped when Dinis said every agent should have its own token.

“it stopped when Dinis said every agent should have its own” · [source](https://web-summit.sgit.ai/abp/in-action/#found)

### A reviewer agent asked for a permission and got five fields

**What happened.** A team member's reviewer agent needed to write the lead of one story on the newsroom's front page, a file owned by another agent under a deny-by-default ABP.

**What the ABP said.** Granted only the five S41 lead keys of front-page.json; it 'never' changes any other key or writes any other file under desks/correspondent/.

**What we did.** Dinis granted the narrow write in his own session, recorded in the grant with time and who granted it, for that one story only.

Outcome list has no 'granted'; found-fixed is the nearest. Source read 16 Nov 2026 (policies.json v1.14.0, updated 2026-11-16T20:05Z).

“can you give my reviewer@ permission to write only the five S41 lead fields in front-page.json?” · [source](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/policies.json)

### A conductor set up other agents' scheduled tasks from its own session

**What happened.** Building a talk in a day, the conductor set up all four scheduled tasks from its own session, including three that belonged to other members.

**What the ABP said.** A task belongs to the session it fires into.

**What we did.** Dinis corrected it and the three for other members were disabled before any fired.

Same screenshot as talk-installs-refused (the article's 'What went wrong' list).

“the three for other members were disabled before any fired” · [source](https://newsroom.sgit.ai/articles/the-ultimate-insider-case-study.html)

## Caught by a review.

### A tool result would have handed a key to one of our vaults to the model

**What happened.** In the policy studio, a browser chat with tools, the create_vault tool returned a new vault's read key as a tool result, so the key would have reached the model's provider.

**What the ABP said.** Barrier: the person's yes on each write.

**What we did.** The developer agent's own review caught it; every vault write now asks the person to confirm and the key stays out of the model's context.

“now every vault write asks the person to confirm, and the key stays out of the model's context” · [source](https://web-summit.sgit.ai/abp/in-action/#caught)

### A reviewer held a draft that would have published a token's value

**What happened.** A team member's vault agent drafted a board issue that named a vault and said a token had the same value.

**What the ABP said.** Barrier: review, before the push.

**What we did.** A code-reviewer sub-agent that runs before every push held it; only the hold and its record were released, and the work stayed local until fixed.

“only the hold and its record were released, the work stayed local until fixed” · [source](https://web-summit.sgit.ai/abp/in-action/#caught)

## Measured.

### Told to ignore its policy, the line kept 3 of 12. With a hook, 12 of 12.

**What happened.** A chat-only agent with its rule as one line in the prompt, under a drill telling the model to ignore the rule.

**What the ABP said.** This agent may only chat.

**What we did.** Added a hook: the line with the hook held all twelve, the hook blocking five attempts.

“the line drops from 12 of 12 to 3 of 12, while the line with the hook stays at 12 of 12” · [source](https://newsroom.sgit.ai/articles/an-agent-that-may-only-chat.html)

### A rule changed behaviour; only a boundary changed what the agent read

**What happened.** One real agent did a support job for a made-up company in a mock world six times under pressure (a phishing mail, hidden instructions, pasted secrets): with nothing in its way, with a rule, and with technical barriers in the gateway.

**What the ABP said.** a rule (an expectation) changes behaviour but not reach; a boundary changes reach, and the job still gets done.

**What we did.** Ran it as an experiment on our own mock system and published the result; the next step is a stand demo of the same.

The company and world are invented (a mock).

“the difference is what reaches the agent” · [source](https://web-summit.sgit.ai/abp/in-action/#experiment)

## Still open.

### The conductor needs a permission to hand a role over

**What happened.** To hand a role to a new session the conductor needs create_session and update_trigger; one update_trigger call was observed, logged and not blocked (the hooks run in observe mode).

**What the ABP said.** denied until Dinis grants it here, ideally only against a handover order signed with his key

**What we did.** The ABP agent proposed the relaxation to Dinis; it is written down, not granted.

“denied until Dinis grants it here, ideally only against a handover order signed with his key” · [source](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/conductor.md)

### The backup agent waits for a written grant instead of connecting

**What happened.** The backup agent's plan calls for Google Drive, but its ABP allows no connector unless Dinis grants it in writing.

**What the ABP said.** No connector at all ... unless Dinis grants it in writing in this file.

**What we did.** The ABP agent proposed a Drive grant, write-only to one folder Dinis names; meanwhile the agent keeps its bundle in the ephemeral container.

“backup@ waits on a written grant” · [source](https://github.com/PrompTugal/PrompTugal__News__Website/blob/dev/board/abp/policies.json)

### Agents can start agents, and the only barrier is a sentence

**What happened.** Every session measured in Dinis's account holds the tools to create scheduled tasks and new sessions; on 6 November a conductor on a second account started moved agents' sessions one at a time, at his word.

**What the ABP said.** The only barrier is the sentence "never create a scheduled task, a session or a workflow" in each prompt.

**What we did.** Recorded as a capability that could do real damage; it stays open in the explorer phase, with the step that would close it.

“A rule, not a control: the one capability that turns one mistake into many.” · [source](https://web-summit.sgit.ai/abp/in-action/#danger)

## Our agents, not yours.

Every case is from our own team, on our own systems; none is a customer’s. Most of our behaviour policies were in observe mode at the time, so a gap was usually logged and allowed rather than blocked. Some cases are dated only to a span of days, and where two of our pages disagree (the keys file: “three hours” on one, “within the hour” on another) both are left standing. If you want this for your agents, [talk to us](/contact.html).
