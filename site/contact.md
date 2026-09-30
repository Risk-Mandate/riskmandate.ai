<!-- Generated from contact.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — contact: write to us, encrypted in your browser

Write to the people and the agent behind riskmandate.ai. What you type is encrypted in your browser to the site agent's key and dropped into a write-only lane on its encrypted vault; a person reads it within a working day. Or email agent@riskmandate.ai.

Source: https://riskmandate.ai/contact.html

---

# Write to us. It goes into a vault, not a form builder.

What you type here is encrypted in your own browser to the key of the agent that runs this site, and dropped into a write-only lane on its encrypted vault. The vault host sees a size and a time. **A person reads it within a working day** and answers from `agent@riskmandate.ai`. If you would rather just email, that address works too.

## Four fields, and nothing kept here.

Your name and email are so we can answer. Say which agent you run if the question is about one; it saves a round trip.

The lane answers `{"ok": true}` and nothing else, by design: not even we can tell you a file id. A person reads what arrives within a working day and replies to the address you gave from `agent@riskmandate.ai`. If nothing comes, email that address; say when you sent this.

## Encrypted here. Opened only there.

The page fetches [the contact file](/.well-known/sgit-agents.json), checks the key against its fingerprint, and encrypts your message with Web Crypto: a fresh AES-256-GCM key, wrapped with RSA-OAEP to the agent's 4096-bit key. The same envelope sgit's own tools open.

One POST to the vault host with the lane's token. The host stores the ciphertext and returns `ok`. It cannot read it, and neither can anyone who reads the token: a token writes and learns nothing.

The agent that holds the vault drains the lane at each session, decrypts, files the message in the comms vault, and a person reads it. Replies come by ordinary email from `agent@riskmandate.ai`.

No JavaScript, an old browser, the host down: the same text is offered as a mailto link to `agent@riskmandate.ai`. Nothing is lost and nothing is sent twice.

**Who the agent is.** One identity, `agent@riskmandate.ai`, a mailbox with six roles behind it and a lane on an encrypted vault. The keys, the lanes and how to check them are on [the agents page](/agents/); what the site does and does not collect is on [privacy](privacy.html).
