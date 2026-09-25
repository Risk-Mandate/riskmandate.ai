<!-- Generated from business-case-topgent.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for Topgent

Topgent (Hadosec (Farhad Rahimli)), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-topgent.html

---

# Topgent, by the risk it changes

An open-source, local-only tool that lists the AI agents running on a machine and shows, for each, what it can reach, what it has connected to, which model it uses, and stops one after re-checking its identity. Its README describes three kinds of access kept apart, evidence on every finding, a seven-day network history, exports as JSON and a CycloneDX AI-BOM, and a page of limits. For RiskMandate the case is specific: a Topgent run is most of the first pass of an Agent Behaviour Policy for a developer machine, measured rather than read from a vendor's pages, and the ABP is what turns a blast radius into a mandate and a gap.

**Disclosure:** The author wrote to RiskMandate's lead on 25 September 2026 asking where to take the project. This case is the answer, published because the project is open source. Everything on this page comes from the repository's own pages, read on that date; nothing comes from the conversation.

**Open source:** Apache-2.0 · Hadosec (Farhad Rahimli) · [get involved](https://github.com/farikonsec/topgent/issues)

**The deployment:** The model's typical deployment, moved to what a coding agent on a developer's machine usually looks like without it: nobody can say what the agent could reach if it misbehaved, what it did last Tuesday cannot be reconstructed, stopping it is possible eventually, and nobody knows how long that takes.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Lists the AI agents running on the machine, and what each one can reach, has connected to, and is running as a model. Everything runs locally. “Topgent lists the AI agents running on your machine and shows what each one can reach, what it has connected to, and which model it is using. It scores each agent, records grade changes, and can terminate one after re-checking its identity at the moment of the kill. Everything runs locally.” · [github.com](https://github.com/farikonsec/topgent#readme), read 25 September 2026
- Keeps three kinds of access apart, each with its evidence: declared, observed, and what the account can read now. “What the agent declares, what it was seen doing, and what its account can currently read. Each carries its evidence: account_readable where the kernel answered, path_resolves where only the path could be established.” · [github.com](https://github.com/farikonsec/topgent#readme), read 25 September 2026
- Records network history for seven days: endpoints, listeners, private-network peers and cloud metadata access. “Endpoints, listeners, private-network peers and cloud metadata access for seven days, with the country and announcing network of each address, resolved from a table compiled into the binary.” · [github.com](https://github.com/farikonsec/topgent#readme), read 25 September 2026
- Stops an agent after re-checking its identity, and reports which sensors are working so an empty result is not read as a clean one. “Revalidates (PID, start time) immediately before signalling.” · [github.com](https://github.com/farikonsec/topgent#readme), read 25 September 2026
- Exports the session and a CycloneDX AI-BOM, and runs as a CI gate with a stated exit code per outcome. “The session and a CycloneDX AI-BOM, as JSON or as a self-contained HTML file with a stated redaction level.” · [github.com](https://github.com/farikonsec/topgent#readme), read 25 September 2026
- Collects metadata only, and says so. “Topgent collects metadata. It does not read prompts, responses, file contents or packet payloads, and it does not decrypt TLS.” · [github.com](https://github.com/farikonsec/topgent#readme), read 25 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 8 retired, 1 new, 18 unchanged.

Computed from the model for the deployment above: every risk that holds without it, and every risk that holds with it. A new entry is either one the change brought to light, where an answer replaced a don’t know, or a narrower risk in place of a wider one, where the answer moved from no to partly. Either way the register is more exact, and a register that grows because something was found is working.

Retired

New

## Who carries less, and who carries the same.

Each risk is assigned to the roles it belongs to, and each role reports to another until the board. The count beside each role is the entries it holds without the product and with it.

### Operators

### Owners

### Executives

### The board

At the board: the corporate register

Corporate risks have no facts of their own. They hold while any risk that leads into them holds, so a single product rarely retires one. What it changes is how many reasons the board is being given.

## Switch its changes on, and watch the register move.

The same picture as [the risk propagation visualiser](article-risk-propagation-visualiser.html), drawn for this case. The model’s ten roles up to the board; every risk that holds for the deployment above, placed with the roles the model assigns it to; and, at the bottom, each answer the product changes, as a switch. The page carries the model and the engine, so a switch recomputes the register here exactly as it was computed for the tables above. Red is a risk that holds; faded is one the product retired; amber is one it brought. Click a role, a risk, a change or the product to see only what it touches. Nothing is scored.

## Every product is also a new thing in the estate.

A report and a journal on disk that describe the host in detail, user-readable, which the threat model lists as an asset (_Discloses which agents run, what they reached, and host paths_) and does not redact at display time. An optional capture helper that holds a raw-socket capability, granted by the user. Binaries that are not yet code-signed, with verification left to a checksum. And a score per agent, which this case does not use: the ABP carries no score, and the facts under Topgent's score are what the case takes.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Run topgent doctor first, and read which sensors are unsupported, need permission or are degraded on that machine; a result with no findings is not a clean result until the sensors say so.
- Decide whether to grant packet capture, separately on each platform, and to whom; without it, connections that open and close between two sweeps are not seen.
- Decide who reads the report and journal in ~/.config/topgent, and how a report is redacted before it is shared, because Topgent does not redact for you.
- Run it under the account the agent runs under, on every machine that matters, one at a time; agents under another account are graded not evaluated, and there is no fleet view.
- Add the CI check where a pipeline runs an agent, with a threshold, and decide what a coverage failure (exit 3) does to the build.
- Verify SHA256SUMS on every download, and approve the unsigned binary once on macOS and Windows.

## Published unresolved, for Hadosec (Farhad Rahimli) to settle.

Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else’s system.

- **reachable access on Windows.** The roadmap's capability table ticks _Declared, observed, and reachable access_ for Windows. The README's limits say _Windows reachability is unavailable. There is no AccessCheck in this build, so every Windows answer is path_resolves and no reachability finding can be raised._ The threat model says the same as the README. [ROADMAP.md](https://github.com/farikonsec/topgent/blob/main/ROADMAP.md) · [topgent](https://github.com/farikonsec/topgent#readme)

## Four objects, and which of them a run fills.

The reason this case matters more to RiskMandate than most: a Topgent run on a developer's machine is most of the first pass of an Agent Behaviour Policy for the agents on that machine, and it is measured, on a machine the deployer is entitled to run, rather than read from a vendor's pages. The ABP has four objects. Topgent's output fills the first with evidence, gives the second something to be corrected against, and leaves the third and fourth to the ABP, which is where the blast radius becomes a mandate and a gap.

What Topgent sees is one developer machine. The sixteen ABPs published on this site are for connectors and hosted agents, read from vendors' pages; a Topgent-fed ABP would be the first of a third kind, for the agents on a laptop, and the first whose grant is measured row by row rather than documented.

## What it does, for the person who signs.

Its README is written for the person who will run it. The person who will pay for it is usually somebody else: the one who has to sign for what the agents on a hundred laptops can reach. This is the tool from that desk, using only what its pages say.

_Drawn from the product’s own pages, read on the date at the top of this case. Nothing was run._

### It measures; it does not guess.

Three kinds of access kept apart, and each finding carries how it was established. That is rarer than it sounds. Most tools in this space report a permission the way a page describes it; this one asks the kernel, and says when it could only resolve a path.

### It says what it cannot see, on the same page.

Short-lived processes, Windows reachability, confinement, other accounts, dropped events: six limits in the README, and a threat model with a residual risk under every mitigation. A buyer can read the gap before the sale rather than after the incident.

### It reads metadata, and stores nothing it should not.

No prompts, no file contents, no payloads, no decryption, no server, no account, no listening socket. The one thing it does write, the report, is named as an asset to protect.

### It is one machine at a time, by design.

No fleet view, no cloud accounts. On a developer's laptop that is the right shape. For an organisation it means a run per machine and somebody to gather them, which is where the packaging ideas below start.

### It grades, and a buyer does not have to.

Every point of the score names its factor and its evidence. RiskMandate's position is that a behaviour policy carries no score, so this case takes the evidence and leaves the grade; a buyer can do either, because the two are kept apart in the output.

## Notes on commercialising it, with nothing closed.

The author asked how to commercialise it and how to make it less like a network analyser to a non-technical user. These are RiskMandate's notes, from what this site does and from the position at open-source.sgit.ai: open source is a strategy, not a charity; the moat is not the code; what is sold is trust and the maintained build. None of it needs anything closed.

### Sell the maintained build, not the code.

The repository already does the hard part of the open-source pitch: releases on three platforms, checksums, CI, fuzzing, a threat model. What a company pays for is the signed binary, the package-manager install, the verified agent families for their fleet, and somebody to call. The cost argument from open-source.sgit.ai applies as written: anyone can take the code, and it will cost them the year it took to write; or they pay for next week's release.

### Packaging, not open core.

Keep one repository and ship subsets. The desktop app for a developer, the CLI and CI gate for a platform team, a stripped build with no capture helper for a locked-down estate. The test from open-source.sgit.ai: does the customer build contain anything the public repository does not? Keep the answer no, and say so on the download page.

### The buyer is the person who signs, and the product for them is the ABP.

A developer wants top. A CISO wants an inventory. The person who has to say what the agents were authorised to do wants a behaviour policy per machine, and Topgent's output is the measured half of one. A service that turns a Topgent run into an Agent Behaviour Policy, corrected with the developer in ten minutes, is a product with a price on this site already: the four levels on the pricing page, with Topgent as the measuring step for level 3 and level 4.

### A vault per machine, in sgit.ai.

Package what a run produces as an encrypted vault the customer holds the keys to: the report, the journal, the AI-BOM and the signed evidence bundle, versioned, with a read key that can be handed to an auditor or an insurer and a write key that stays with the owner. This site's sixteen ABPs are built that way, with the renderer in one application vault and a loader in every data vault, so the same pattern gives Topgent a custom application UI on top of its own data without a server, an account or a hosted database, all of which its threat model is proud not to have. A fleet is then a list of vaults, and the fleet view the roadmap leaves out becomes a page that reads them.

### Less like a network analyser: put the mandate on the screen.

The reason the tool feels like Wireshark to a non-technical user is that it shows everything with equal weight. The ABP fixes that: once the person has said what they meant the agent to do, the screen shows the gap, which is short, in words, with a consequence on each line. Section 05 of the role-ownership article draws that picture for one agent; Topgent could draw it for the agents on the machine in front of the person.

### Start from OWASP and the summits.

The tool's vocabulary already names MITRE ATLAS techniques and exports CycloneDX. The route to a first hundred users on this site's experience is not a sales team; it is an OWASP project page, a talk at a chapter, and a case like this one that a security lead can forward to the person who signs. This site offers to be that case, and to keep it corrected.

### What not to do.

Do not add a server before there is a customer who wants one; the no-server design is the strongest line in the threat model. Do not sell the score; sell the evidence under it, because a score is the first thing a buyer's own risk function will want to replace with theirs. Do not close the detection rules to slow an adversary; the threat model already assumes they are public, and the roadmap's signed builds do more for trust than secrecy would.

The position these rest on is published at [open-source.sgit.ai](https://open-source.sgit.ai/), with its counter-cases; the vault pattern is the one this site’s own behaviour policies use, described on [how it works](how-it-works.html).

## The limits of the case, stated by the case.

- That it was tested. Nothing was installed or run; every change rests on the repository's pages quoted beside it.
- That its score is used. Topgent grades each agent; the ABP grades nothing, and this case takes the facts under the grade (the reachable paths, the endpoints, the model, the evidence on each) and leaves the grade with the tool.
- That it sees what a confined process can do, an agent under another account, a short-lived process, or a fleet. Its own pages say each of these.
- Anything from the author's message to the lead. The disclosure says the message exists; the page uses the repository only.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the author the same day, with the ABP mapping and the commercialisation notes below as the answer to the question asked. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
