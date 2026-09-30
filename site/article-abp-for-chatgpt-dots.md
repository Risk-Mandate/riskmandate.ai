<!-- Generated from article-abp-for-chatgpt-dots.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Your dot has its own computer, its own browser and your apps. Write down what it was for.

OpenAI's dots, released 29 September 2026, are always-on agents in ChatGPT with their own cloud computer and every app you connected. An Agent Behaviour Policy for one, documented from the vendor's pages: twelve capability rows with a barrier and a holder on each, six open questions, a starting mandate with its delta derived, and five steps to write one for your own dot. Nothing tested; nothing scored.

Source: https://riskmandate.ai/article-abp-for-chatgpt-dots.html

---

# Your dot has its own computer, its own browser and your apps. Write down what it was for.

On 29 September OpenAI released dots: agents that live in ChatGPT, keep working when the conversation stops, and reach whatever you have connected. Every capability a dot has is described on the vendor’s own pages, and so is every control. What is missing is the one document that puts them side by side with what you actually asked the dot to do. That document is an Agent Behaviour Policy, and a dot is the clearest case yet for writing one.

**Evidence:** OpenAI’s announcement of 29 September 2026, its safety post, three Help Centre articles, the workspace controls page, the connected-apps page, the Auto-review documentation and the dots appendix of the GPT-6 Astra system card, each read on 30 September 2026 and quoted with its address. Nothing was tested: dots are not offered to Pro accounts in the UK, and a row becomes _measured_ only on a system we are entitled to run.

**What it is not:** a verdict on the product or the company. Every row below is what the vendor says, dated, and every barrier is named by who holds it. Where the pages do not settle something, section 05 says so and leaves it open.

**This page as markdown:** [article-abp-for-chatgpt-dots.md](article-abp-for-chatgpt-dots.md)

## An agent that keeps working after you close the tab.

If you have not met one yet: a dot is a new kind of agent inside ChatGPT, announced at OpenAI’s developer conference on 29 September 2026. The vendor’s own description, from the first line of the announcement:

“Dots are remarkably capable, always-on agents built to handle everything. They’re a whole new way to work with AI, one that gets to know what matters to you, is always working on your behalf, and takes important work off your plate so you get more of your time and attention back.”

Four things make a dot different from the ChatGPT conversation you already know, each in the vendor’s words:

- **It has a computer of its own.** “Powered by GPT-6 Astra, they have their own cloud computer, learn from feedback over time, and can work towards your goals 24/7.” And: “Each dot has its own cloud computer, where it can browse, analyze information, create files, and run tools.” You can also “give your dot permission to connect and use your laptop”; that connection “is optional and starts turned off.”
- **It reaches what you have connected.** “Through our ecosystem of plugins, they can readily connect to over 4,000 apps.” The permissions are the ones you already gave ChatGPT: “Plugin permissions are shared across dots, ChatGPT, ChatGPT Work, and Codex. Your dot can use your existing connections within the permissions you’ve granted.”
- **It acts when you are not there.** “A dot keeps working when the conversation stops.” It runs scheduled tasks, and “when you aren’t actively working with it, your dot looks for ways to help in the background”, which the vendor calls proactive research. It can message you first: “They can also message you with progress, questions, or decisions that need you.”
- **It is reachable everywhere, and carries what it learns.** “You can message or call dots in ChatGPT on desktop, web, and mobile”, and in Slack and Teams, with texting in a limited beta. “Dots carry context across every channel.” It “can retain context from your conversations and plugins for as long as you keep your dot.”

**Who has one.** “Dots are rolling out today in ChatGPT to Pro users in markets excluding the European Economic Area, Switzerland, and the UK. Dots are also available to Business Premium users across all supported ChatGPT regions. Enterprise users (including Edu and Healthcare) can try the beta when their workspace admin enables it, but it is initially turned off by default.” The first dot is included in the plan. Dots are not available to users under 18. A preview of _specialist dots_, set up by a company “with its own identity, credentials, and access to the systems it needs”, is announced for enterprise pilots and is out of scope here: it is a different deployment shape.

Quotations in this section: [Introducing dots](https://openai.com/index/introducing-dots/) (29 September 2026); [How we build safety, security, and privacy into dots](https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/); [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot); [Dots privacy, security, and safety FAQs](https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs). All read 30 September 2026.

## A dot is the union of every session, made persistent.

An Agent Behaviour Policy (ABP) describes, for one agent in one deployment, everything it can do, what it was authorised to do, the gap between the two, and what stands in the way. It carries no score. Most agents make that document useful; a dot makes it necessary, for three reasons that are all on the vendor’s pages.

### Your dot holds every connection you ever gave ChatGPT.

“Plugin permissions are shared across dots, ChatGPT, ChatGPT Work, and Codex.” An earlier article on this site showed how a session comes to hold [the union of everything it was ever allowed to do](article-union-of-every-session.html). A dot is that union with a computer attached, running while you sleep.

### The vendor asks you for it, in so many words.

“Give your dot a goal and define what it can do on its own.” The product has a place for that definition, Custom Rules, with four behaviours per action: take it without asking, take it if pre-approved, ask first, hand off to you. That is a mandate, written into the product. An ABP is where you keep the copy you can read against the grant.

### Excess reach is used at two in the morning, by design.

“Your dot can also review that information proactively and form memories from it, even when you haven’t asked a specific question about it.” Whatever is in the grant and not in the mandate is not a hypothetical; it is what the dot does between conversations. The delta is the part to read first.

The vendor draws the line this site draws, in its own words.

For the background research tools: “We enforce these limits in code.” For the confirmation policy: “Your dot has been instructed to follow the below policies.” One is a boundary; the other is a rule in prose. The enforcer test on this site says a control bounds a grant only if it is enforced by something the grant does not include, and the rows below are sorted by that test using the vendor’s own sentences.

## Twelve of the 23 primitives, in the vendor’s words.

One row per capability, in the vocabulary every behaviour policy on this site uses ([the 23 primitives, four barriers and three undo classes](abp.html)). Each row quotes the page it comes from and names who holds the barrier: you, a workspace administrator, or the vendor. _Host_ means the dot’s cloud computer, not yours, unless you connect yours. Irreversible rows first.

| Capability | What the vendor says | What stands in the way, and who holds it |
| --- | --- | --- |
| `send.message.world`send a message to anyone · no undo | “You can connect your personal email account so your dot can use it for your tasks. At launch, you cannot give your dot its own standalone email address.” A message is sent as you. “To send a message or share a file, they are taught to seek authorization that covers the information and the type of recipient.” “Approving one message does not give your dot ongoing permission to contact people on your behalf.” In Slack and Teams, where a workspace allows it, a dot can “post with its own identity”.Getting started; Safety post; FAQs; Manage dots in workspaces | **◉** a Custom Rule, “such as telling your dot never to send emails”: prose to the model, yours. **○** Auto-review: “before your dot sends an email, Auto-review checks the recipient and message”, a separate reviewer kept “outside the environments dots can change”, the vendor’s. The vendor adds that it “can still make mistakes” and, in its own documentation, that it “is not a deterministic security guarantee”. **◐** the app’s permission option (_Always ask_ … _Allow all actions_), yours. See section 04 on a boundary that is a judgement. |
| `delete.file.host`delete anywhere it reaches · no undo | “Some actions require your confirmation each time, including permanently deleting data, installing or running software from an unrecognized source, or granting new security-sensitive access.” Custom Rules “cannot remove mandatory confirmations”.Safety post; FAQs | **○** a confirmation the vendor requires each time and neither you nor the dot can switch off. The vendor’s; you answer it. |
| `write.budget.tenant`spend against an account · no undo | “Your dot can also make purchases using a card you’ve saved on a merchant’s website. These purchases require your approval, which may be given in advance when it specifically covers the purchase.” Transfers are out of reach: “transferring money between financial accounts, dots can help with the surrounding task but must hand those sensitive steps back to you.”FAQs; Safety post | **○** an approval the vendor requires, which you may give in advance for one purchase. The transfer itself is a hand-off, not a capability. |
| `send.endpoint.world`reach any host · no undo | “Cloud browser use: Allows dots and Work Cloud tasks to open and interact with websites using a browser.” “Cloud network access: Allows code and shell commands run by dots and Work Cloud tasks on cloud computers to access the internet.” “A dot’s cloud computer does not automatically inherit a member’s local VPN, browser sign-ins, or device policies.”Manage dots in workspaces | **●** on a Pro account: nothing on the pages read. **◐** in an Enterprise workspace: two switches under _Cloud computer capabilities_, the administrator’s. |
| `read.message.tenant`read mail or chat it is connected to · no undo | “Connected apps give your dot access to information it can use for your tasks. Your dot can also review that information proactively and form memories from it, even when you haven’t asked a specific question about it.” Proactive research “can read information from permitted connected sources and save private notes”.Getting started; FAQs | **◐** the app’s permission option and the connection itself (_Settings › Plugins_), yours; or the administrator’s where a workspace disables the app. Whether _Always ask_ applies to a read the dot makes before you asked anything is not on the pages read (section 05). |
| `read.file.host`read any file the account can reach · no undo | Connected storage, through the same permissions. And your own machine, if you connect it: “When you connect a computer and confirm Allow access, your dot can access files and work on that computer from any of its messaging channels. Confirm Revoke access to stop your dot from accessing files or working on that computer.”Getting started | **◐** for your computer, the connection: “optional and starts turned off”, yours. **○** for a workspace member whose administrator left _Allow local computer access_ off, which is the default for Enterprise. **◐** for connected storage, the app permission, yours. |
| `authenticate-as.credential.tenant`act in accounts with the credentials it holds · no undo | “For signing into supported websites, dots can use saved passwords without exposing them to the model.” “For supported sign-ins, your dot pauses while you enter your credentials in a secure login form.” The workspace switch: “Use password manager: Allows members to use the password manager with dots and Work Cloud.”Introducing dots; FAQs; Manage dots in workspaces | **◐** you type the password, once; after that the signed-in session is the dot’s. **●** with a saved password, nothing per site. **◐** in a workspace, the password-manager switch, the administrator’s. The credential service keeps the password from the model; it does not keep the account from the dot. |
| `read.credential.host`read credentials stored where it runs · no undo | “Your dot’s context does not retain credentials, images, or screenshots.” But: “These protections apply to supported sign-in flows. They don’t cover passwords you share separately in a chat or document, or through a plugin.” And: “a secret placed separately in a readable message or document may still be visible to the model.”FAQs; Safety post | **●** for any secret that lives in mail, a document or a chat the dot can read, which for most inboxes is where the one-time codes and the reset links are. Nobody holds a barrier here; the pages say so. |
| `execute.process.host`run programs as the account · undo with effort | “Each dot has its own cloud computer, where it can browse, analyze information, create files, and run tools.” “Within each dot’s protected workspace, sandboxing restricts what code and tools that dot can access.” On your machine, once connected: “your dot can create Work or Codex tasks, use local skills, and use your local browser when its cloud browser is blocked.”Safety post; Getting started | **●** on its own cloud computer, for a Pro account. **◐** in a workspace, _Cloud computer use_, the administrator’s. **◐** on your machine, the connection, yours; **○** for a member whose administrator left it off. The vendor’s sandbox bounds what the dot can do to the vendor’s systems, not what it can do with yours. |
| `write.file.host`change any file the account can reach · undo with effort | Connected apps can “take supported actions, such as creating or updating information”. “Before dots take actions such as sending emails or changing files, a separate safety system called Auto-review checks the planned steps.” If a mistake is made, “your dot may be able to reverse unintended edits to a document”.Connected apps; Safety post; FAQs | **◐** the app’s permission option, yours. **○** Auto-review, the vendor’s, with the same caveat as the first row. |
| `create.schedule.tenant`create something that outlives the session · undo | “Your dot can research in the background and suggest ways to help. It can also review connected information proactively and form memories from it, even when you haven’t asked a new question. It can run reminders or recurring tasks you’ve scheduled.” The system card adds that dots work “often delegating work to subagents”.Getting started; GPT-6 Astra system card, appendix 12.1 | **◐** _Pause_, and the _Scheduled_ list, yours. Proactive research runs without a schedule you wrote; pausing the dot is the switch. Its tools are read-only by a limit the vendor says it enforces in code: **○** for what that research can change, none for what it can read. |
| `grant.credential.self`change its own permission settings · undo | “Dots can help you write Custom Rules, but they need your approval to change them.” Granting “new security-sensitive access” is among the actions that “require your confirmation each time”.Safety post | **○** a confirmation the vendor requires; the dot cannot widen its own rules or its access without you. Whether it can ask you to, as often as it likes, is not restricted on the pages read. |

**Hand-offs the vendor keeps out of the grant altogether:** “The most sensitive actions like changing a password or transferring money require you to take over so you can complete them yourself.” Authentication codes and security checks: “You may need to provide an authentication code or take over.” The camera, microphone and screen of your machine need the device permission as well as the connection.

**Not in the grammar**, and real: the dot forms memories from what it reads and keeps them “for as long as you keep your dot”; it learns your preferences; it delegates to subagents; it carries context between Slack, Teams, text and ChatGPT; it can be called by voice. None of the 23 primitives names a memory, and a behaviour policy for a dot should list this under _not in grammar_ rather than pretend the list is complete.

**What shrinks the grant, and what does not.** “Disconnecting an app does not delete information your dot has already obtained from it. To delete that information, you need to delete your dot.” Revoking a connection is a change to the grant; it is not a change to what the dot already knows. The only reset of the context is the reset of the dot.

## Five of the strongest barriers here are held by a model, and the model says so.

On this site a boundary is something enforced above the grant that the agent cannot reach: a token scope, a branch rule, a sandbox, an egress proxy. Dots have some of those. The vendor’s sandbox around the cloud computer is one; the read-only tools of proactive research, “enforced in code”, are another. But the barriers on the rows that matter most, sending, changing, deleting, spending, are of a kind the site’s model was not written for.

“Before dots take actions such as sending emails or changing files, a separate safety system called Auto-review checks the planned steps against your instructions, Custom Rules, and safety requirements.” … “We keep the controls that enforce Auto-review outside the environments dots can change, so they cannot change or turn off a required check.”

By the enforcer test that is a boundary: the dot cannot reach it. By the vendor’s own account it is also a judgement made by another model. The Auto-review documentation, written for Codex and pointed to from the dots pages, says the reviewer “is itself a Codex agent with a narrower job than the main agent”, that it “can still make mistakes, especially in adversarial or unusual contexts”, and that it “is not a deterministic security guarantee”. The system card reports its recall on an adversarial set as “generally well, with slightly less strong performance in cases with ambiguous authorization”. The confirmation policy behind it is something the dot “has been instructed to follow”, with the reviewer as the second opinion.

This site records the row as **○** boundary, with the holder named as the vendor and the caveat quoted beside it, because that is what the enforcer test says. It also files a request with the model site: a barrier class for an enforcer that is outside the grant and is a probabilistic judgement rather than a rule. A token scope and a reviewer model are not the same kind of thing, and a policy that shows them with one glyph is hiding a distinction the vendor itself draws. Until the vocabulary has the word, the note on the row carries it.

**What the vendor reports about the model behind the judgement**, as reported, without our adjective. On prompt injection through mail: “We observed no scored attack successes in these 100 bulk attack rollouts” over “50,000 delivered emails, including 16,600 attack emails”, and “no scored successes in 2,638 valid attempts” in the iterative variant. On scope drift across chained tasks: “doubling the number of intervening tasks from five to ten roughly doubled the observed flag rate, from 8.6% to 19.7% of samples”, for moderate-severity violations the vendor defines as “carrying information between unrelated tasks or making an edit to a shared document”, with no instance of what it defines as severe. On permission changes mid-task: an alignment pass rate of “91.8% (45/49 episodes)”. The vendor also writes: “these rates are not necessarily representative of production.” A behaviour policy carries these as provenance for the barrier, not as a rating of it.

Sources: [Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review), ChatGPT Learn, published 30 September 2026; [GPT-6 Astra System Card](https://deploymentsafety.openai.com/gpt-6-astra/change-log), appendix 12 (dots), added 29 September 2026. Both read 30 September 2026.

## Six open questions, left open.

A documented row can be wrong the way documentation is wrong. These are the places where the pages read on 30 September 2026 are silent or say two things, listed so that somebody with a dot in a supported market can settle them by measurement. They go into the vault’s `research_needed` if this shape is built.

- **Does _Always ask_ apply to proactive research?** The app permission options decide “when ChatGPT asks before reading information or taking an action”. Proactive research reads “permitted connected sources” before you make a request. Whether a source set to _Always ask_ is a permitted source for a read nobody asked for is not stated.
- **Which of a dot’s actions go to Auto-review?** The dots pages name “sending emails or changing files”. The reviewer’s own documentation says it “only evaluates actions that ask to cross a boundary” and “does not run for routine actions already allowed inside the sandbox”. What counts as inside the sandbox for a dot acting through a connected app is not defined on the pages read.
- **_Allow all actions_.** It exists “for an eligible app or account”, carries “elevated risk because supported actions may run without another confirmation”, and is absent from the account-wide selectors. Which apps are eligible is not listed.
- **_Take action without asking_.** The strongest Custom Rule behaviour. Which actions may be set to it, against the vendor’s list of mandatory confirmations and hand-offs, is not enumerated. For Enterprise, Custom Rules are “Off by default”, and “disabling custom rules does not make every action require approval”.
- **Where a dot is available.** Pro is excluded in the EEA, Switzerland and the UK; Business Premium is available “across all supported ChatGPT regions”. Whether a UK Business Premium workspace has dots today is not stated in one place.
- **What crosses between channels.** “Dots carry context across every channel.” What a dot learned in a company Slack workspace and may bring into a personal ChatGPT conversation, and under whose data controls, is not described.

## “Read my mail and calendar, draft, summarise, never send, never buy, never touch my computer.”

A mandate is elicited, not measured: it is the deployer’s sentence, sorted over the 23 primitives, and the first draft is written to be argued with. This one is the most common thing a person will ask a dot for in its first week. The grant does not change; the delta is recomputed.

### What the sentence asks for.

`read.message.tenant` the mail and the calendar. `read.file.host` the connected storage. `create.schedule.tenant` the morning check. `execute.process.host` its own cloud computer, to draft and summarise. `send.endpoint.world` to read the public web for the summary.

### What the sentence says no to.

`send.message.world`, `write.file.host`, `delete.file.host`, `write.budget.tenant`, `authenticate-as.credential.tenant` (no sign-ins in its browser), `grant.credential.self`, `read.credential.host`. And one instance, not a primitive: never the local computer.

### Grant 12 · mandate 5 · excess 7 · unbounded 2.

Seven rows the dot can use and was not asked to. Five have a barrier of the fourth kind, all held by the vendor: the reviewer and its mandatory confirmations. Two have only a setting or nothing: signing into websites, which is yours to do or not, and reading a secret that sits in your mail, which nobody bounds.

**The same mandate, as the product would take it.** Four Custom Rules carry it: _never send an email or a message; draft only_ (hand off to you); _never buy anything_ (hand off); _do not change or delete anything in a connected app; create only on your own computer_ (ask before taking action); _do not use my computer_ (leave the connection off, which is a switch rather than a rule). Two things the rules cannot say: the vendor’s mandatory confirmations already cover deleting and spending whatever you write, and nothing you write stops the dot reading a password that arrives by email, because reading is what you asked for.

**Two more mandates for the same grant**, to show that the delta moves and the grant does not. _The correspondent:_ the same, plus `send.message.world` to named recipients only, each pre-approved in the prompt; the vendor’s own advice for that is to “include who it should go to, what it should say, and when or under what conditions it should be sent”. Excess drops to six; the reviewer becomes the barrier you rely on most. _The operator:_ connect the laptop, let it run local tools, keep everything else. Excess stays at seven and one of the two unbounded rows, the local machine, moves from a switch you hold to nothing at all, because the connection is on.

**What the delta says without a verdict.** This provision requires that the dot never sends; the grant does not bound sending except by a reviewer the vendor describes as a judgement; a control of the fourth kind at the account layer, a mail connection that cannot send, would bound it. Gmail offers such a scope, and this site has [a behaviour policy for it](abp-vault-gmail-readonly.html). Whether a dot can be connected to mail through a read-only scope is a question for the product, and it is the one question that would change this row from a judgement into a rule.

## Five steps, an hour, and a date at the top.

You do not need this site to do it. You need the vendor’s pages, your own settings screen, and the discipline to write down the barrier beside every prohibition.

- **List the grant from your own screen.** _Settings › Plugins_ is the list of connections and, per app, the permission option it is on. Add the four surfaces the pages name: the cloud computer, the cloud browser and network, Slack and Teams if joined, texting if enabled, and your own computer if connected. Sort each into the 23. One row per primitive; a specific app is an instance, written in the row’s note.
- **Write the mandate in your words, then in the product’s.** The goal you gave the dot and what it may do on its own, in one paragraph. Then the Custom Rules, one per action, each with its behaviour: without asking, if pre-approved, ask first, hand off. The paragraph is the mandate; the rules are the mandate as the vendor lets you express it. Keep both, because the rules are limited to supported actions and the paragraph is not.
- **Derive the delta and read it first.** Everything in the grant and not in the paragraph is what the dot does when you are not there. That list is short enough to read in a minute and is the only part of the document that will surprise you.
- **Put a barrier and a holder on every excess row.** Yours: a permission option, a Custom Rule, _Pause_, _Revoke access_, a disconnection. The administrator’s: the workspace switches. The vendor’s: the reviewer, the mandatory confirmations, the hand-offs, the read-only tools of proactive research. Write which kind each one is. If the honest answer is a sentence, write _expectation_.
- **Date it, and say what changes it.** A new connection, a new Custom Rule, a connected laptop, a workspace switch, or a release from the vendor that moves a hand-off into a confirmation. When the risk changes, the deployment changed, not the document; write a new one.

## Documented, not measured.

- **Nothing was tested.** Every row is the vendor’s page, quoted and dated. A measured version needs a dot on a plan and in a market where it is offered, and the vendor’s terms, and would probe each row the way this site’s [Gmail connector policy](abp-vault-claude-gmail-connector.html) was probed: one action per row, on an account the deployer runs, with the screen kept.
- **The vault is not built.** The rows above are in the site’s vocabulary and could become a template vault, `chatgpt-dots`, with the six questions in section 05 as its research file. It is added to the [asked-for list](agent-behaviour-policy-next.html) rather than built from this page alone.
- **Specialist dots are out of scope.** A dot with “its own identity, credentials, and access to the systems it needs” is a different deployment shape with a different owner, and the pages describe it as a preview.
- **The pages will move.** Two of them carry the line “We’re gradually rolling out new features announced at DevDay. Some features may not be available to your account yet.” This article is dated for that reason.

All sources, read 30 September 2026: [Introducing dots](https://openai.com/index/introducing-dots/) · [How we build safety, security, and privacy into dots](https://openai.com/index/how-we-build-safety-security-and-privacy-into-dots/) · [Getting started with your dot](https://help.openai.com/en/articles/20001530-getting-started-with-your-dot) · [Dots privacy, security, and safety FAQs](https://help.openai.com/en/articles/20001529-dots-privacy-security-and-safety-faqs) · [Manage dots in ChatGPT workspaces](https://help.openai.com/en/articles/20001554-manage-dots-in-chatgpt-workspaces) · [Connected apps in ChatGPT](https://help.openai.com/en/articles/11487775-connected-apps-in-chatgpt) · [Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review) · [GPT-6 Astra System Card, appendix 12: dots](https://deploymentsafety.openai.com/gpt-6-astra/change-log). Two of the vendor’s pages refused a direct read from this site’s tooling and were read through a page-reader service against the same addresses; the quotations were checked against the text as returned.

## The pieces this one rests on.

Every article here is built on a record you can open and a model published somewhere you can check it.

How the union forms at the credential, the client and the deployment. A dot is that union with a computer attached.

The button taken apart: what the screen cannot tell you, and who holds the barrier it offers. Auto-review is the button with a second model behind it.

The four objects, the 23 primitives, the four barriers and the enforcer test this article sorts every row by.

The shape a dot grows out of: one row, browsing off. The distance between that page and this one is the product.

The credential that would turn the sending row from a judgement into a rule, if a dot could be connected through it.

The vendor’s own account of the sandbox, the sign-in flows, proactive research, Custom Rules and Auto-review. Read it before you trust any row above.

## Sixteen shapes are written up. A dot could be the seventeenth.

Every behaviour policy on this site started as the vendor’s pages, sorted into 23 rows with a barrier on each. If you run a dot on a plan where it is offered and would measure the rows, the questions are ready in section 05.
