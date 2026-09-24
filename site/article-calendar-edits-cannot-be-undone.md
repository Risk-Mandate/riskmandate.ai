<!-- Generated from article-calendar-edits-cannot-be-undone.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# A deleted meeting comes back. An edited one does not.

Google Calendar keeps a deleted event in a trash for 30 days and documents no way for a user to restore an edited one. What Google keeps after each action, in its own words, why an edit is worse than a delete, where Google's pages disagree, and the draft Calendar rows of an Agent Behaviour Policy.

Source: https://riskmandate.ai/article-calendar-edits-cannot-be-undone.html

---

# A deleted meeting comes back. An edited one does not.

Google Calendar keeps a deleted event in a trash for 30 days. It documents no way for a user to get back an event that was edited. So an agent allowed to edit your calendar can do damage a delete cannot: fifty meetings moved, re-titled or stripped of their guests, each still looking like a real meeting, with nothing to restore them from. This is an integrity risk, and it changes which permission is the dangerous one.

**Evidence:** Google’s own help, Workspace and developer pages, read 24 September 2026, quoted with their addresses. Nothing was tested on anybody’s account.

**Where it came from:** drafting behaviour policies for agents with Calendar access. Those policies are in draft and not yet published; the rows in section 06 are from the draft.

**This page as markdown:** [article-calendar-edits-cannot-be-undone.md](article-calendar-edits-cannot-be-undone.md)

## The inbox is best effort. The calendar runs the day.

Asked which mattered more, their email or their calendar, the early users the lead spoke to said the calendar, and so does the lead. That is a handful of conversations, not a survey, and it is offered as that. The reason they gave is the useful part: email is read when there is time, and some of it never is; the calendar is followed. People turn up where it says, at the time it says, having prepared for what it says the meeting is about.

Which means that for a calendar, the question that matters most is often not _who can read it_ but _can I still trust it_. A confidentiality failure leaks your week. An integrity failure sends you to the wrong room, at the wrong hour, without the person you were meeting, and nothing on the screen tells you so.

## Action by action, in Google’s own words.

For a personal account, and for a Workspace account whose edition includes Vault for Calendar. Where a page shows no date, it was read on 24 September 2026; Workspace and developer pages carry their own “last updated” dates, all in 2026.

### Delete an event

### Delete “this and following” events of a series

### Edit an event

### Change the guest list through the API

### Export, then import

**For contrast, from the same company.** Docs, Sheets and Slides offer _Restore this version_. Gmail keeps deleted mail in a trash for 30 days. Calendar protects the delete, like Gmail, and does not protect the edit, unlike Docs.

## A delete leaves a hole. An edit leaves a wrong answer.

### You can see that something is missing.

The slot is empty. Somebody asks where the meeting went. The trash has it for 30 days, unless it was the rest of a recurring series.

### Nothing looks wrong.

The meeting is still there, an hour later, in another room, without the client, with a description that is no longer the agenda. It is followed, because the calendar is followed. Nothing in the user’s view records what it said before.

Now multiply it. An agent that can edit one event can edit fifty in the time it takes to read this paragraph, and it does not matter much why: a mistake, a misguided plan to “tidy up”, an instruction hidden in an invitation it read, or the user asking for something broader than they meant. The result is corruption: records that are wrong and look right, with no undo in the product and often no backup of a calendar at all. Even a daily backup loses the day.

**So the permissions are the wrong way round from how they feel.** Withholding delete while granting edit feels cautious. On these facts, granting delete while withholding edit leaves less that cannot be undone. The deletes to worry about are the recurring-series ones, which skip the trash, and the edits are the ones to worry about all the time.

Google’s scopes do not separate the two. The events scope reads: _“View and edit events on all your calendars.”_ The narrower ones limit _which_ calendars, not _which verbs_: `calendar.events.owned` is “See, create, change, and delete events on Google calendars you own”, and `calendar.app.created` covers only calendars the app itself made. [Calendar API scopes](https://developers.google.com/workspace/calendar/api/auth), updated 3 September 2026.

## Three contradictions, published unresolved.

Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else’s system.

### Does Vault cover Calendar?

The Vault FAQ, updated 18 September 2026: _“Vault doesn’t support services such as Calendar, Contacts, Keep, and Currents.”_

The supported-services page, same date, marks Calendar for retention, holds, and search and export, and lists “Versions of primary calendar events”.

### How many versions a hold keeps

The holds page: _“Only one version of an event is held per day.”_

The search page: _“all of their revisions are retained for the duration of the hold.”_

### What Google’s own agent server may do

The Calendar MCP server, in developer preview since 22 April 2026, is described as letting agents _“take actions, such as creating, updating, or deleting events”_, and lists update and delete tools.

Its setup page tells developers to add three read-only scopes. Our record of [Google’s Workspace MCP servers](abp-vault-google-workspace-mcp.html) already carries the same kind of gap: “schedule meetings” advertised, read-only scopes permitted.

**One thing that did change in 2026.** The Workspace admin audit log for Calendar now lists an attribute “By an agent — Action was performed with an AI agent (True or False)”, and records the old and the new title when a title changes; other edits are recorded as “{actor} modified {event_title}”. Logs are kept six months. That is detection, for an admin. It is not a way back. [answer/6110475](https://support.google.com/a/answer/6110475?hl=en), updated 18 September 2026.

## One mistake is enough, because it is a warning.

Users give a calendar agent very little room for error, and they are right to. The first batch of wrong meetings is not judged as one bad afternoon. It is read as proof of what the agent can do, and the user does the risk assessment then, after the fact: this can manage my calendar, and it can also destroy it; is that worth it? In the lead’s experience, many answer no and switch it off. Usually it is a mistake that starts this, not an attack. Either way it is the same assessment, done too late and at the worst moment.

The same assessment can be done before the agent is switched on, calmly, by writing down what it can reach, what it is meant to do, and what can and cannot be undone. That is what the rest of this page does for Calendar.

## Calendar rows, with recovery beside each one. Draft

From the Calendar behaviour policies in draft, for an agent holding the scope that reads and edits events on all calendars. The reach is what the scope allows. The mandate is an example of what a person might authorise. The barrier column says what actually stands in the way, and a sentence in the agent’s instructions is not a barrier: it is hope.

Read down the last column and the answer is the uncomfortable one: for most rows, nothing stands in the way except the agent’s instructions. A behaviour policy does not grade that; it writes it down, row by row, so that whoever authorises the agent sees it before the first mistake rather than after. Where a barrier is wanted, the facts above say which: **a before-image of every event the agent edits, kept where the agent cannot reach**, because Google does not keep one for the user.

## Most systems protect the delete and not the edit.

Calendar is the clear example, not the unusual one. Customer databases, ticketing systems and CRMs often have a soft delete or a recycle bin, and an update that simply overwrites. Backups, where they exist, are usually daily. For every action an agent is granted, three questions belong in its behaviour policy: can this be undone, by whom, and how far back. Where the answers are _no_, _nobody_ and _not at all_, that row is the one to read first.

Related: [The pilot worked. Then somebody asked what else it could do.](article-pilots-do-not-stay-in-production.html) — on why the answer to that question is what keeps agents out of production — and [An approval prompt is not a human in the loop](article-approval-prompts.html).

## Find out what your agent can change before it changes it.

The free prompts have the agent list its own reach, including every tool that edits, in twenty minutes and with nothing collected. If you know a way to restore an edited Calendar event that Google’s pages do not mention, tell us and we will correct this page with a date.
