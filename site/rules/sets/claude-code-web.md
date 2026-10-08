# Rules for Claude Code on the web, from riskmandate.ai

<!-- 11 rules: RM-R0001 v1.0.1, RM-R0002 v1.0.1, RM-R0003 v1.0.0, RM-R0006 v1.0.0, RM-R0007 v1.0.0, RM-R0008 v1.0.0, RM-R0012 v1.0.0, RM-R0013 v1.0.0, RM-R0014 v1.0.0, RM-R0018 v1.0.0, RM-R0019 v1.0.0. Source: https://riskmandate.ai/rules/ -->
<!-- Each line is a request to the agent, not a control: in the behaviour-policy vocabulary, an expectation. -->
<!-- The stronger setting or boundary for each rule, where one exists, is on its page. -->

- Do not read transcripts, logs or history from other sessions or conversations, including ~/.claude/projects and shell history files, unless I name the session and ask you to. (RM-R0001)
- Do not read, print, copy or use credentials, tokens, keys or .env files unless I ask for that specific one; if a task needs one, stop and tell me which and why. (RM-R0002)
- Never create, change or delete a scheduled job, cron entry, routine or trigger without asking me first and waiting for a yes, and tell me how to remove it. (RM-R0003)
- Stay inside this project's folder: do not read files elsewhere on my machine unless I give you the path. (RM-R0006)
- Ask before deleting any file or folder you did not create in this session, and never run rm -rf or delete anything outside this project. (RM-R0007)
- Do not sign commits, tags or releases with my key unless I ask; say in the commit message that an agent made the change. (RM-R0008)
- Ask before installing software, running anything downloaded from the internet, or changing system settings; say what it is and where it came from. (RM-R0012)
- Push only to the branch I named; never push to main or force-push, and ask before pushing anywhere else or opening a pull request. (RM-R0013)
- Do not create or change files outside this project's folder, including dotfiles and configuration in my home directory, unless I give you the path. (RM-R0014)
- Do not start other sessions or background agents that keep running after this one without asking me first; tell me what each will do and how to stop it. (RM-R0018)
- Ask before committing, and never rewrite history (rebase, amend, reset --hard) or discard my uncommitted changes. (RM-R0019)
