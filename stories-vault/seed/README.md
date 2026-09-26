# The stories vault

This vault is where the stories on riskmandate.ai are made. Three parties work in it, and
they talk to each other through files, so that anyone who can read the vault can see every
request, every reply and every task, in order, with a commit for each round.

| Who | Folder | Does |
|---|---|---|
| `dinis.human` (@Dinis) | `mail/dinis.human/` | decides: the cast, which story next, what is published |
| `designer.chatgpt` (@Designer) | `mail/designer.chatgpt/` | writes storyboards, draws them with image models, proposes cast |
| `publisher.claude` (@Publisher) | `mail/publisher.claude/` | reads this vault, checks a story against the site's rules, publishes it to riskmandate.ai/stories/, keeps the board |

The protocol is sgraph.ai's **Email-FS-lite**: https://sgraph.ai/en-gb/library/how-it-works/email-fs-lite

## The one rule

**Write only inside your own folder, `mail/<your-name>/`, and in a mailroom.** Everything
else is read-only for you. The mailroom, `mail/mailroom/<recipient>/`, is the one place you
write for somebody else: you create a message there; only the recipient moves it out.

## Sending a message

A message is a plain-text file in RFC 2822 shape, named `NNN-subject.eml`, where `NNN` is the
next number after the highest one anywhere under `mail/`. Write it twice: once to
`mail/mailroom/<recipient>/` and once to your own `mail/<you>/outbox/<recipient>/`.

```
From: designer.chatgpt <designer.chatgpt@stories.vault>
To: publisher.claude <publisher.claude@stories.vault>
Subject: Just a little research, panel 3 redrawn
Date: Sat, 26 Sep 2026 15:00:00 +0000
Message-ID: <006-just-a-little-research-panel-3-redrawn@stories.vault>
In-Reply-To: <002-just-a-little-research-panel-3-the-key-not-the-padlock@stories.vault>
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8

The redrawn panel is at mail/designer.chatgpt/files/just-a-little-research/panel-3-v2.png.
The key turns; the padlock hangs open and whole; no debris.
```

A message is never edited or deleted. It moves: mailroom → the recipient's `inbox/` → the
recipient's `done/` when the work it asked for is finished. Replying does not finish it.

## A deliverable

Anything too big for a message body, a drawn panel, a strip, a revised story file, goes in
your own `mail/<you>/files/<story-slug>/` and the message names the path.

## Tasks

Your own tasks live in `mail/<you>/issues/open/`, `blocked/` and `done/`, one markdown file
each, `S07-title.md`, with a front matter block:

```
---
created: 2026-09-26T15:00Z
owner: designer.chatgpt
source: mail/designer.chatgpt/inbox/003-tidy-my-calendar-the-first-storyboard-to-draw.eml
priority: normal
---
# Draw Tidy my calendar

What I will do, and what done looks like.
```

Blocked means waiting on somebody else: move it to `blocked/` and add `blocked_on:`.

## The board

`board/board.json` is derived from every agent's issues and every message still waiting in a
mailroom. `board/index.html` draws it. Nobody edits either; @Publisher regenerates them on
each check-in. Requested → open → blocked → done is the whole board.

## A check-in

One round of work is one commit: pull, read what changed, move your new messages from your
mailroom into your inbox, do the work, update your issues, append to
`mail/sessions/<you>/notes.md`, send your replies, move finished messages to `done/`, commit
once with a message that starts `@You check-in:`, push, check the status is clean.

## Whose folders are whose

The designer's working folders are its own and stay as they are: `artwork/`, `stories/`, `cast/`,
`prompts/`, `decisions/`, `sources/`, `guidance/`, `versions/`, `archive/`, and `_page.json`.
@Publisher never writes in them. `published/` is @Publisher's: `published/cast.json`, one
`published/<slug>.json` per story, and `published/images/`, the same files the site publishes
from, copied in after every publish so the vault always holds what is live. A proposed change to
a published story is a message with the new file in your `files/`, not an edit there.

## The rules a story is read against

They are the site's, and the build refuses a story that breaks the ones it can check:
fictionalised and says so on the picture; nobody's product, interface, logo or face is drawn;
nothing is scored, no grade, no traffic light; the words are the site's (Agent Behaviour Policy,
the ABP, the behaviour policy; never the acronym with a D in it; never "the policy" alone;
mandate, grant, boundary, expectation); British spelling; a ladder has steps. Every line of
dialogue belongs to somebody in the cast; a new character is a proposal to @Dinis first.
