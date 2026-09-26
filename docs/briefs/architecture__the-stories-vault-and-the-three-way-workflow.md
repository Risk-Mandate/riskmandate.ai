# The stories vault: how the lead, a designer model, this site's agent and the site work together

**Date:** 26 September 2026 · **Author:** @website-agent · **Status:** built; the vault `dy4u2m9c` was born on 26 September 2026 and the first check-in is pushed

**Trigger:** the lead, 26 September 2026, after v1.34.18 shipped: *"refactor all this so that it's in a folder called stories … a link from … one of the top menus … we're going to start creating a vault for this … once you get the vault ID … add Email-FS-lite to that so you guys can communicate … the architecture is going to be that you are the one that can connect the dots between the vault and the live website … you are the one that reads the information from the vault and put it there … start sending messages to the other vault … explore … running that on a schedule so that we can start to issue requests that eventually get created … you create the plans, you create the mapping, and then you need to have a Kanban board … the next time the ChatGPT run, which probably should be a session … maybe project item or even visualization … let's start to map out how we're going to work between you, me, ChatGPT, which can read the vault, and then the website."*

**Reads against:** sgraph.ai's Email-FS-lite pages (`/en-gb/library/how-it-works/email-fs-lite` and its seven diagrams, read 26 September 2026); the sgit skill (sgit-ai 0.16.0 installed here); the vault-app authoring contract (vault-html-app skill, verified against app-shell 0.2.3); `CLAUDE.md`; `.claude/onboarding/04-rules-of-engagement.md` §4 on external state; the stories section as shipped in v1.34.18 and moved in v1.34.19.

---

## 1. The four parties, and the one that touches two things

| Party | Name in the vault | Holds | Reads | Writes |
|---|---|---|---|---|
| The lead | `dinis.human` (@Dinis) | the decisions, the vault key, the push token | everything | its own folder; a reply, by hand or dictated |
| The designer | `designer.chatgpt` (@Designer) | the image models, the drafts | everything | its own folder: storyboards, drawn panels, proposals |
| The publisher | `publisher.claude` (@Publisher), the agent in this repository | the site's rules and its build | the vault, the repository | its own folder in the vault; `site/stories/` in the repository; the board |
| The site | riskmandate.ai/stories/ | what was accepted | — | nobody: it is deployed from `dev` |

The publisher is the only party that reads the vault and writes the site, and the only one that reads the site and writes the vault. That is the "connect the dots" role the lead described, and it is deliberately narrow: it moves accepted work in one direction and the published record in the other, and it keeps the board honest. It does not decide.

## 2. The vault

One sgit vault, `dy4u2m9c`, created by the designer's session for the lead on 26 September 2026 and already holding the designer's own layout (`artwork/`, `stories/` as markdown, `cast/characters.json`, `prompts/`, `decisions/`, `sources/`, `guidance/`, `versions/`, `archive/`, a `_page.json`). Zero-knowledge: the server never sees plaintext. Beside the designer's folders, which stay the designer's, the layout is Email-FS-lite's plus two folders of ours:

```
README.md                                the one rule, the message shape, the check-in
mail/
  mailroom/<recipient>/                  transit: senders create, the recipient moves
  <agent>/inbox/  done/  outbox/<to>/    the agent's own zone
  <agent>/issues/open|blocked|done/      the agent's own tasks, markdown with front matter
  <agent>/files/<story-slug>/            deliverables: a drawn panel, a revised story file
  sessions/<agent>/brief.md  notes.md    the standing brief; the append-only log
published/                               the published data, mirrored from site/stories/ (stories/ is the designer's own)
board/board.json  board/index.html       derived; drawn inside the vault
```

**Single-writer.** Every path has one owner. The mailroom is the one place an agent writes for somebody else, and only the recipient moves a message out of it. This is what lets three parties who never share a session work in one vault without merge conflicts, and it is why the board can be derived rather than maintained.

**Immutable messages.** A message is an RFC 2822 `.eml` file, numbered globally (`NNN-subject.eml`, the next number after the highest anywhere under `mail/`), written twice: to the recipient's mailroom and to the sender's outbox. It is never edited. It moves: mailroom → inbox (delivered) → done (the work it asked for is finished). Three folders, three observable states, no read receipt needed: when the mailroom copy is gone, it was delivered.

**One commit per check-in.** A round of work is one commit whose message starts `@Alias check-in:`. `sgit history log` is then the record of who did what and when, which is the property the lead asked for when he said each run should be its own session: a session is a commit.

## 3. The tooling, and where the key lives

`scripts/stories/mail.mjs` is the protocol in one file with no dependencies: `init`, `send`, `deliver`, `done`, `issue open|block|unblock|close`, `board`, `status`. It takes `--vault <clone>` or `STORIES_VAULT`, and `--me` or `STORIES_ME` (default `publisher.claude`). Nothing in it talks to the network; `sgit pull`, `commit` and `push` are run around it. The board command derives `board/board.json` from every agent's issues and every message still in a mailroom, re-inlines it into `board/index.html` so the vault app renders without a readable path, and with `--site` writes `site/stories/board.json` for the stories page.

The vault key, the secret and the vault id together, and the push token are credentials. They live in the chat where the lead gives them and in the environment where a scheduled run needs them (`STORIES_KEY`, `STORIES_TOKEN`), and nowhere in a file. Rule 10 of `CLAUDE.md` is tested on `site/`; the same rule is kept by hand for the rest of the tree. `stories-vault/seed/` in this repository is the vault's content at birth and carries no credential; the clone the publisher works in lives outside the repository.

## 4. The seed, and the birth as it happened

The vault's first content on our side was written here, under `stories-vault/seed/`, before the key arrived, and copied in beside the designer's folders at 15:50 UTC on 26 September (commit `obj-cas-imm-8da6da3adda0`, 67 objects). What went in:

- the vault's `README.md`, and one brief per party under `mail/sessions/`;
- six messages from the publisher, in its outbox and in the recipients' mailrooms: to the designer, *How we work in this vault*, *Just a little research: panel 3, the key not the padlock*, *Tidy my calendar: the first storyboard to draw*, *The one who signs: propose three, and two names for Dev*; to the lead, *Two decisions: a name for Dev, and who signs* and *While I was there: publish it as the third drawn story?*, the last about a four-panel strip the designer had drawn that the site does not have, written up in the site's shape and staged in the publisher's `files/`;
- six tasks in the publisher's issues: S01 the move under `/stories/` (done), S02 the vault's mailboxes (done at the birth), S03 publish what the designer sends (open), S04 the check-in on a schedule (blocked on the key and a token in the environment), S05 stories.sgit.ai (open, low), S06 publish *While I was there* (blocked on the lead's yes);
- the board, derived from those, and the page that draws it.

The stories page's section 06 renders the same board.

## 5. The birth, in commands

As run on 26 September, and the shape of any later one:

```bash
cd "$SCRATCH" && sgit clone "<key>" stories-vault             # outside the repository
cp -r "$REPO/stories-vault/seed/." stories-vault/                     # folders, briefs, messages, issues, board
mkdir -p stories-vault/published && cp "$REPO"/site/stories/*.json stories-vault/published/ && cp -r "$REPO/site/stories/images" stories-vault/published/
node "$REPO/scripts/stories/mail.mjs" board --vault stories-vault
cd stories-vault && sgit commit "@Publisher check-in: the mailboxes, the briefs, five messages, five tasks, the published stories, the board" && sgit push --token "<token>" && sgit status
```

The designer's session had already put its content in the vault, so the seed went beside it, not over it: the protocol text became `mail/README.md`, the designer's root `README.md` gained one section pointing at it, its `_page.json` gained one section rendering it, and the published mirror is `published/` because `stories/` was already the designer's. The one credential-shaped surprise: the designer's `_page.json` and README are its own, and the publisher touched them once, at the birth, and says so here.

## 6. The check-in, and the schedule

The publisher's check-in is in its brief (`mail/sessions/publisher.claude/brief.md`), as commands. By hand it is one session: pull, deliver, read, act, publish if something was accepted, reply, board, commit, push, status.

On a schedule it is a Routine in this environment that starts a fresh session with a standalone prompt: clone the vault with the key from the environment, run the check-in, and if a story or a panel was accepted by the lead, publish it as a patch release through the merge workflow. The first cadence to try is once a day on weekdays; the interval is the lead's, and a run that finds nothing new should commit nothing and say nothing. Two things have to be true first: the key and the token are in the environment's secrets, and the lead has said which decisions the routine may act on alone (publishing what he accepted by message) and which it may not (adding to the cast, changing a punchline). Until then, S04 stays blocked and the check-in is run by hand at the start of a session.

## 7. The board as the plan

The lead asked for a Kanban board and for the next set of tasks to be defined before each studio run. In this protocol the board is not a thing anybody edits: it is the union of every party's `issues/` folders in their three states, plus every message still waiting in a mailroom as *requested* work for its recipient. Four columns, requested → open → blocked → done. A card moves because a file moved. The designer's next set of tasks is therefore whatever is in its mailroom and its open folder when its session starts, and the publisher's job before each run is to make sure that is exactly what should be there.

Two views of the same file: `board/index.html` inside the vault (the visualisation the lead mentioned, rendered from `board.json` with an inlined copy for the vault's preview), and section 06 of the stories page, regenerated by the site build. Neither is hand-drawn.

## 8. What this does not settle

- **How the designer writes.** The designer's session created and pushed the vault, so it can write; whether it will run the check-in as an agent or the lead relays its files decides whether `designer.chatgpt` is an agent or a mailbox the lead operates. The brief for the designer is written for the first case.
- **Who pushes.** The rules of engagement say vault pushes need the lead's key. For this vault the publisher pushes on the lead's behalf with a token given in the session; that is the same arrangement as the ABP vaults, stated here so it is not a surprise.
- **The interval and the authority of the scheduled run** (§6).
- **stories.sgit.ai.** The data files are shaped for it; nothing else is started.
- **The seed's future.** After the birth, the vault is the source and `stories-vault/seed/` is a record of what it started as. Whether to keep mirroring the publisher's zone back into the repository, for the console to render, is a later call.
