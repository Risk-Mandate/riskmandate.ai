<!-- Generated from business-case-postgresql-pitr.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for PostgreSQL point-in-time recovery

PostgreSQL point-in-time recovery (PostgreSQL Global Development Group), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-postgresql-pitr.html

---

# PostgreSQL point-in-time recovery, by the risk it changes

Continuous archiving of the write-ahead log, so a database can be restored to any moment since its base backup. Written as an answer, what an agent changes in the database can be undone, for the whole cluster at once.

**Open source:** PostgreSQL Licence · PostgreSQL Global Development Group · [get involved](https://www.postgresql.org/community/)

**The deployment:** The model's typical deployment, with the answers this project addresses stated as they are without it: some of what it changes cannot be undone.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Restore to any point in time since the base backup. “it is possible to restore the database to its state at any time since your base backup was taken.” · [www.postgresql.org](https://www.postgresql.org/docs/current/continuous-archiving.html), read 24 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 4 retired, 1 new, 22 unchanged.

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

Its documentation warns that if the file system holding the write-ahead log fills up, _PostgreSQL will do a PANIC shutdown_, so archiving has to be monitored.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Configure archiving and base backups, and monitor the archive.
- Plan how to recover one agent's changes without losing everyone else's, because a restore is all or nothing.

## The limits of the case, stated by the case.

- That it was tested. Nothing was installed or run; every change rests on the documentation quoted beside it.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the project's maintainers at the same time. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
