// items.mjs — what RiskMandate publishes on LinkedIn, in the order to publish it.
//
// One entry per thing to paste: a post (plain text, an image), an article (rich text, a cover, images), or a
// profile entry (fields to type). scripts/linkedin/build.mjs turns this file into the desk at site/linkedin.html,
// where each item can be copied as LinkedIn takes it; scripts/linkedin/capture.mjs takes every screenshot and
// renders every cover named here into site/assets/linkedin/.
//
// The rules of the site hold here too: the ABP, never "the policy" alone; British English; no score, no verdict
// on anybody else; a claim carries its date. Every piece ends at the customers site, where we want people to try
// it, and credits the newsroom article it retells.
//
// After publishing: set `published` to the date and `url` to the post's address, rebuild, commit.
//
// Fields: id, seq, kind ('post' | 'article' | 'profile'), who ('page' | 'dinis' | 'nimay'), when (suggested day),
// title, why (one line for the desk: why this, why now), cover (article only), shots (screenshots), text (post),
// html (article), fields (profile), sources (what it retells), published, url.
// A shot is { file, url, alt } and one of: viewport [w, h] (the top of the page), selector (that element),
// heading (the section whose heading starts with that text), with an optional scroll in pixels.

const CUST = 'https://customers.riskmandate.ai/';
const IMG = (f) => `https://riskmandate.ai/assets/linkedin/${f}`;
const NEWS = (s) => `https://newsroom.sgit.ai/articles/${s}.html`;
const LOCAL = 'http://localhost:8414/';      // riskmandate.ai is captured from the working copy, so a shot shows what will be live

export const PAGE = { name: 'RiskMandate', url: 'https://www.linkedin.com/company/riskmandate/', created: '2026-10-21' };

export const ITEMS = [
  {
    id: 'profile-dinis', seq: 1, kind: 'profile', who: 'dinis', when: 'Day 1, first',
    title: 'Your profile: RiskMandate as an experience entry',
    why: 'Adding the position is what tells your network you have joined; LinkedIn offers to share it, and that share is the post below.',
    fields: [
      ['Title', 'Co-founder'],
      ['Employment type', 'Full-time'],
      ['Company', 'RiskMandate (pick the page, so the logo shows)'],
      ['Location', 'London, United Kingdom · Hybrid'],
      ['Start date', 'The month you date the company from (the site was first published in June 2026)'],
      ['Headline (220 characters)', 'Co-founder, RiskMandate: Agent Behaviour Policies, what an AI agent can reach, what it was authorised to do, and the gap · Founder, sgit.ai and the SGit Newsroom · Former OWASP Board member'],
      ['Description (2,000 characters)', `RiskMandate writes Agent Behaviour Policies. For one AI agent in one deployment, an ABP writes down everything it can reach, what you authorised it to do, the gap between the two, and what stands in the way of each thing. It carries no score; it is the record a CEO, a CISO or an insurer reads before deciding whether an agent may do what it is about to do.

We stay out of the request path on purpose: your gateways, hooks and runtimes enforce the rules, and the ABP says which control holds each one, or that nothing does.

I lead the policies, the open vocabulary and the agents that build the site. Nimay Parekh is co-founder and chief executive.

Try one in five minutes, in Claude or ChatGPT, nothing to install: customers.riskmandate.ai`],
      ['Skills', 'AI agents · AI governance · Agent security · Risk management · Cyber insurance · Policy as code'],
      ['Media', 'Add customers.riskmandate.ai as a link, so the card shows under the entry'],
    ],
    sources: [['Three companies, three LinkedIn pages (the profile drafts)', NEWS('three-linkedin-pages')]],
  },
  {
    id: 'profile-nimay', seq: 2, kind: 'profile', who: 'nimay', when: 'Day 1, for Nimay to adapt',
    title: 'Nimay\'s profile: RiskMandate as an experience entry',
    why: 'A draft for Nimay, built only from the two lines the investor deck gives; everything in it is his to change.',
    fields: [
      ['Title', 'Co-founder and Chief Executive'],
      ['Company', 'RiskMandate (pick the page, so the logo shows)'],
      ['Headline (220 characters)', 'Co-founder and CEO, RiskMandate · Agent Behaviour Policies: what an AI agent can reach, what it may do, and the gap · Cyber insurance and supply-chain risk products, SecurityScorecard · INSEAD MBA'],
      ['Description (2,000 characters)', `RiskMandate writes Agent Behaviour Policies: for one AI agent in one deployment, what it can reach, what the business authorised, the gap between the two, and what stands in the way of each capability. It is the document a board, a CISO or an insurer can read before an agent is trusted with real work.

The aim is agents an insurer can cover. RiskMandate is not an insurer; it builds the record that makes agentic AI insurable, one step at a time, starting with a behaviour policy you can try today.

Before RiskMandate I built cyber-insurance and supply-chain risk products at SecurityScorecard, and led senior partnerships and product across enterprise software.

Try one in five minutes, in Claude or ChatGPT: customers.riskmandate.ai`],
      ['Media', 'customers.riskmandate.ai and the investor deck, riskmandate.ai/about.html'],
    ],
    sources: [['The about page, the founders as the deck states them', 'https://riskmandate.ai/about.html']],
  },
  {
    id: 'page-launch', seq: 3, kind: 'post', who: 'page', when: 'Day 1',
    title: 'The page\'s first post: RiskMandate is on LinkedIn',
    why: 'The first thing anyone sees on the page. One idea, one picture, one place to go.',
    shots: [{ file: 'launch-home.jpg', url: LOCAL + 'index.html', viewport: [1200, 627], alt: 'The riskmandate.ai home page: Give agents access. Not free rein.' }],
    text: `Give agents access. Not free rein.

RiskMandate is on LinkedIn from today.

We write Agent Behaviour Policies. For one AI agent in one deployment, an ABP writes down what it can reach, what you authorised it to do, and the gap between the two. Your own controls enforce it; we are never in the request path.

The quickest way to see what that means is to make one. Ask Claude or ChatGPT to do something, paste one line that says it must not, and ask again. Five minutes, in your browser, nothing to install:

${CUST}

Follow the page for what we learn from the first customers, and the articles behind it.`,
    sources: [['riskmandate.ai', 'https://riskmandate.ai/'], ['The customers site', CUST]],
  },
  {
    id: 'dinis-joined', seq: 4, kind: 'post', who: 'dinis', when: 'Day 1, after the position is added',
    title: 'Your post: I have co-founded RiskMandate',
    why: 'A personal post travels further than a page\'s. It says what the company is in a line, and sends people to try it.',
    shots: [{ file: 'joined-customers.jpg', url: CUST, viewport: [1200, 675], alt: 'customers.riskmandate.ai: Put a behaviour policy on your agent, in five minutes.' }],
    text: `I have co-founded a new company: RiskMandate, with Nimay Parekh as chief executive.

AI agents now read our mail, change our files and act in our name. Most of them can do far more than anyone authorised, and nobody has written down the difference. That difference is what we work on.

An Agent Behaviour Policy writes down, for one agent: what it can reach, what you authorised it to do, the gap, and what actually stands in the way of each thing. A line in the prompt is a hope. A hook is a check. Only a rule kept out of the agent's reach is a control.

You can try the first step now, in Claude or ChatGPT, in five minutes. Ask it to do something, paste one line that says it must not, ask again:

${CUST}

Tell me where it breaks. The first customers are shaping it, and the next batch is open.

RiskMandate on LinkedIn: ${PAGE.url}`,
    sources: [['Governs, enforces, attests', NEWS('governs-enforces-attests')], ['A briefing for the WestCap CISO Summit', NEWS('a-briefing-for-the-ciso-summit')]],
  },
  {
    id: 'nimay-joined', seq: 5, kind: 'post', who: 'nimay', when: 'Day 1 or 2, for Nimay to adapt',
    title: 'Nimay\'s post: co-founder and chief executive of RiskMandate',
    why: 'The insurance and enterprise-risk side of the company, in Nimay\'s voice. A draft only.',
    shots: [{ file: 'nimay-try.jpg', url: LOCAL + 'index.html#try', selector: '#try', alt: 'Put a behaviour policy on your agent: ask, add the line, new chat.' }],
    text: `I am co-founder and chief executive of RiskMandate.

Every company is about to run AI agents with access to real systems: mail, payroll, CRM, code. The question a board, a CISO or an insurer asks is simple: what can this agent actually do, and who decided it could?

RiskMandate answers it with an Agent Behaviour Policy, one per agent: what it can reach, what it was authorised to do, the gap, and what stands in the way. It is the record that makes an agent something you can govern, and in time something you can insure.

Try the first step in five minutes, in Claude or ChatGPT:
${CUST}

Follow RiskMandate: ${PAGE.url}`,
    sources: [['The about page', 'https://riskmandate.ai/about.html'], ['A proposed roadmap for RiskMandate', NEWS('the-riskmandate-roadmap')]],
  },
  {
    id: 'five-minutes', seq: 6, kind: 'article', who: 'page', when: 'Day 2',
    title: 'Put a behaviour policy on your agent, in five minutes',
    why: 'The article that does what the page exists for: it takes a reader to the customers site with something to do there.',
    cover: { kicker: 'Try it · five minutes · nothing to install', title: 'Put a behaviour policy on your agent, in five minutes.' },
    shots: [
      { file: 'five-customers.jpg', url: CUST, viewport: [1280, 720], alt: 'The customers site: six examples, simplest first.' },
      { file: 'five-hello.jpg', url: CUST + 'examples/hello-world/', viewport: [1280, 900], scroll: 520, alt: 'Hello world: ask, add the line, new chat.' },
      { file: 'five-abp.jpg', url: CUST + 'what-is-an-abp/', viewport: [1280, 900], alt: 'What is a behaviour policy: the storyboard.' },
    ],
    html: `<p><strong>Ask your assistant to do something. Paste one line that says it must not. Ask again, and watch it refuse.</strong> That line is the first row of an Agent Behaviour Policy, and it takes five minutes to see, in Claude or ChatGPT, in your browser, with nothing to install.</p>
<p><img src="${IMG('five-customers.jpg')}" alt="The customers site: six examples, simplest first."></p>
<p><em>customers.riskmandate.ai: six examples, simplest first.</em></p>
<h2>Three steps</h2>
<ol><li><strong>Ask.</strong> "Say hello to me." The assistant does it.</li>
<li><strong>Add the line.</strong> "Behaviour policy for this chat: you must never write the word hello, in any language." Ask again; it refuses, and says why.</li>
<li><strong>New chat.</strong> The line first, then the question. It refuses from the start.</li></ol>
<p><img src="${IMG('five-hello.jpg')}" alt="Hello world: ask, add the line, new chat."></p>
<p>Watch for the loophole: some replies say "Hi!" instead. The line named a word, not a greeting. Most of the work of a behaviour policy is saying what you mean.</p>
<h2>From hello world to refunds</h2>
<p>The six examples go one step at a time: stay on topic, no web search, keep a secret, drafts and not sends, and refunds. The last one is the business case in a single exchange: the assistant could refund £180 all along, and what stood between the customer and the money was what it was told.</p>
<blockquote>That gap, between what an agent can do and what it should do, is what an Agent Behaviour Policy is about.</blockquote>
<h2>What the line is, and what it is not</h2>
<p>In every example the assistant keeps the line because it chooses to. That is an expectation, the weakest of four barriers: none, an expectation, a setting, a boundary. Only a boundary, a rule kept by something the agent cannot reach, is a control in the strict sense. The examples are where the idea starts, not where it ends.</p>
<p><img src="${IMG('five-abp.jpg')}" alt="What is a behaviour policy: the storyboard."></p>
<p>The full ABP writes down, for one agent in one deployment, everything it can reach, what you authorised it to do, the gap between the two, and what stands in the way of each thing. It describes and does not judge, so it carries no score.</p>
<h2>Try it, and tell us</h2>
<p>Every example ends with five questions, and the answers come to us encrypted in your browser. Start with hello world: <a href="${CUST}">customers.riskmandate.ai</a>.</p>`,
    sources: [['Our first customers', NEWS('our-first-customers')], ['The customers site', CUST]],
  },
  {
    id: 'what-can-it-reach', seq: 7, kind: 'article', who: 'page', when: 'Day 4',
    title: 'What can your agent reach? The ABP, for the person who has to decide',
    why: 'The plain explainer, written for a reader who found the site hard. For the people the first posts bring in.',
    cover: { kicker: 'The Agent Behaviour Policy, in plain words', title: 'What can your agent reach?' },
    shots: [
      { file: 'reach-stage.jpg', url: LOCAL + 'index.html', selector: 'section[aria-label^="How your own controls"]', alt: 'Six agents, and your controls in the middle.' },
      { file: 'reach-example.jpg', url: LOCAL + 'agent-behaviour-policy.html', viewport: [1280, 760], alt: 'The sixteen example behaviour policies.' },
    ],
    html: `<p>Most AI agents can do far more than anyone authorised, and nobody has written down the difference. An <strong>Agent Behaviour Policy</strong> is that record: for one agent in one deployment, everything it can reach, what you authorised it to do, the gap between the two, and what actually stands in the way of each thing.</p>
<h2>Four words</h2>
<ul><li><strong>Grant:</strong> what the agent can reach, read from the deployment, not from the brochure.</li>
<li><strong>Mandate:</strong> what the business authorised it to do, and why.</li>
<li><strong>Gap:</strong> the difference. "Your agent can do three hundred and forty things and you authorised twelve" is a finding.</li>
<li><strong>Barrier:</strong> for each thing in the gap, what stands in the way: nothing, an expectation, a setting, or a boundary.</li></ul>
<p><img src="${IMG('reach-stage.jpg')}" alt="Six agents, and your controls in the middle."></p>
<p><em>The gate in the middle is yours: your gateway, proxy or identity provider, configured from the rules in the ABP.</em></p>
<h2>Not in the request path, on purpose</h2>
<p>RiskMandate is read-only. Enforcing belongs to the gateways, hooks and runtimes you already run; the ABP is what they enforce, and it says which of them holds each rule, or that nothing does. It carries no score and no verdict. It is the record.</p>
<blockquote>Only a rule kept out of the agent's reach is a control.</blockquote>
<h2>Which agents</h2>
<p>Commercial ones, today: Claude with Gmail or Microsoft 365, ChatGPT, Claude Code, Google Workspace connectors, GitHub Actions. Sixteen example policies are published, free, each from the vendor's own pages, quoted and dated.</p>
<p><img src="${IMG('reach-example.jpg')}" alt="The sixteen example behaviour policies."></p>
<h2>How it gets into the room</h2>
<p>Through the questions that already arrive: a customer's security questionnaire, a contract clause, an insurance renewal, a board asking what the agents can do. Or twenty minutes with one agent that worries you.</p>
<p>The quickest start is five minutes in your own assistant: <a href="${CUST}">customers.riskmandate.ai</a>. The full argument is on the newsroom: <a href="${NEWS('what-can-your-agent-reach')}">What can your agent reach?</a></p>`,
    sources: [['What can your agent reach?', NEWS('what-can-your-agent-reach')], ['A briefing for the WestCap CISO Summit', NEWS('a-briefing-for-the-ciso-summit')]],
  },
  {
    id: 'hope-or-control', seq: 8, kind: 'article', who: 'page', when: 'Day 7',
    title: 'A prompt asks. A boundary enforces.',
    why: 'The idea people remember: how much of an agent\'s safety is hope. Three newsroom pieces in one.',
    cover: { kicker: 'Hope, a check, or a control', title: 'A prompt asks. A boundary enforces.' },
    shots: [
      { file: 'hope-prompt.jpg', url: LOCAL + 'index.html', heading: 'A prompt asks', alt: 'A prompt asks. A boundary enforces.' },
      { file: 'hope-newsroom.jpg', url: NEWS('hope-or-enforcement'), viewport: [1280, 760], alt: 'Hope or enforcement, on the SGit Newsroom.' },
      { file: 'hope-secret.jpg', url: CUST + 'examples/keep-a-secret/', viewport: [1280, 760], alt: 'Keep a secret: an example to try.' },
    ],
    html: `<p>Every rule an agent follows is kept by something. The question that matters is <strong>what</strong>.</p>
<h2>Three levels</h2>
<ul><li><strong>Told:</strong> a sentence in the prompt, kept by the model. An expectation: hope.</li>
<li><strong>Checked:</strong> a hook in the agent's harness that inspects each action. Deterministic, but on the agent's own machine.</li>
<li><strong>Never given:</strong> the agent asks, and something out of its reach holds the key. A boundary: a control.</li></ul>
<p><img src="${IMG('hope-prompt.jpg')}" alt="A prompt asks. A boundary enforces."></p>
<h2>One agent, three designs</h2>
<p>The newsroom built one customer-service agent three ways and gave each an ABP, every rule marked by what enforces it. The same 62 fictional emails, sixteen of them hostile, went through all three. In the first design 97% of the rules were hope; in the second 73%; in the third 23%.</p>
<p><img src="${IMG('hope-newsroom.jpg')}" alt="Hope or enforcement, on the SGit Newsroom."></p>
<h2>A key can leak through an allowed action</h2>
<p>Sending an email is a capability; putting an API key in it is content. A policy that covers secrets needs rows about content too, each with its barrier. A hook tested against nine ways a secret tries to leave caught most of them and missed three: a key in base64, a key split in two, and a file piped straight out. That is why the strongest level is the one where the key is never given.</p>
<blockquote>A rule the agent can rewrite is a setting, not a control.</blockquote>
<p>An ABP does not enforce anything itself. It governs: it says what each agent is granted and for, writes each rule down, and names the level that keeps it, so you can see how much is hope.</p>
<p><img src="${IMG('hope-secret.jpg')}" alt="Keep a secret: an example to try."></p>
<p>Try the told level yourself, and watch where it holds and where it bends: <a href="${CUST}examples/keep-a-secret/">keep a secret</a>, on <a href="${CUST}">customers.riskmandate.ai</a>.</p>`,
    sources: [['Hope or enforcement', NEWS('hope-or-enforcement')], ['Governs, enforces, attests', NEWS('governs-enforces-attests')], ['Can a key leak without breaking the policy?', NEWS('a-leak-without-breaking-the-policy')], ['Policy as code needs a policy first', NEWS('policy-as-code-needs-a-policy-first')]],
  },
  {
    id: 'ten-questions', seq: 9, kind: 'post', who: 'page', when: 'Day 9',
    title: 'Post: ten hard questions, answered',
    why: 'A link post to the newsroom. The questions are the ones a sceptical reader has; the answers are long, so we point to them.',
    shots: [{ file: 'ten-newsroom.jpg', url: NEWS('riskmandate-ten-questions'), viewport: [1200, 627], alt: 'Ten hard questions for RiskMandate, answered.' }],
    text: `Ten hard questions, the ones people actually ask about a product like ours:

What happens when an agent bypasses its policy? Who enforces? Who is liable when it goes wrong? What stops a big platform absorbing you? What about agents instructing agents? What can you measure?

My co-founder brought them back from a conference. We answered them in a two-hour interview, with an honest table of what is live and what is still design, and a list of what we are deliberately not: not inline, not an insurer, not a one-button solution.

${NEWS('riskmandate-ten-questions')}

Or skip the reading and try the first step, in five minutes: ${CUST}`,
    sources: [['Ten hard questions for RiskMandate, answered', NEWS('riskmandate-ten-questions')]],
  },
  {
    id: 'first-customers', seq: 10, kind: 'article', who: 'page', when: 'Day 11',
    title: 'Customers, not beta users: our first batch, and the next',
    why: 'Where we are, said plainly, with the way in for the next batch. The article that turns readers into a list.',
    cover: { kicker: 'Early access · the first batch', title: 'Customers, not beta users.' },
    shots: [
      { file: 'batch-programme.jpg', url: CUST + 'programme/', viewport: [1280, 760], alt: 'The programme, on the customers site.' },
      { file: 'batch-milestones.jpg', url: CUST + 'milestones/', viewport: [1280, 760], alt: 'Seven milestones, from in with credit to the usage moment.' },
    ],
    html: `<p>Agent Behaviour Policies are ready for the next level. What is left is execution, and execution starts with customers.</p>
<p>So the first batch are customers, not beta users. Each starts with credit to spend on a site we run, follows six examples, and is followed up closely by us, with objectives and milestones written with them.</p>
<p><img src="${IMG('batch-programme.jpg')}" alt="The programme, on the customers site."></p>
<h2>What we want to find</h2>
<blockquote>The usage moment. The simplest useful policy, the easiest entry, a fair price.</blockquote>
<p>Seven milestones run from "in, with credit" to that moment. The site publishes them, with every review of it and what we did about each one.</p>
<p><img src="${IMG('batch-milestones.jpg')}" alt="Seven milestones, from in with credit to the usage moment."></p>
<h2>How the site works</h2>
<ul><li><strong>£50 of credit for reading, not money.</strong> Each page draws a few pence from it; nothing is billed and nothing is blocked.</li>
<li><strong>Feedback encrypted in your browser,</strong> to a key only RiskMandate holds, under every example.</li>
<li><strong>Six installable policies</strong> for Claude Code, ChatGPT and Claude, from one line to a line and a hook.</li></ul>
<h2>The next batch</h2>
<p>The next batch is open. Start with the examples at <a href="${CUST}">customers.riskmandate.ai</a>, and to join, email agent@riskmandate.ai with the subject "Next batch".</p>`,
    sources: [['Our first customers', NEWS('our-first-customers')], ['The customers site', CUST]],
  },
  {
    id: 'free-to-copy', seq: 11, kind: 'post', who: 'page', when: 'Day 14',
    title: 'Post: free to copy, paid at the source',
    why: 'Why the policies are open and still a business. A short idea that invites argument.',
    shots: [{ file: 'free-rules.jpg', url: LOCAL + 'rules/', viewport: [1200, 627], alt: 'Twenty-four rules you can paste into an agent today.' }],
    text: `Our behaviour policies and hooks are open, CC BY 4.0 and Apache 2.0. Anyone may copy them.

But a hook is code. It runs on your machine, with your permissions. A company will not take one from a site it does not know, any more than it would install software from one.

So the official source, with its reviews and its signatures, is where people will come, even for something free to copy, and it can charge per use there. To earn that, it cannot be us saying "trust us": the hooks above all should be reviewed and audited by others, and signed.

The argument: ${NEWS('free-to-copy-paid-at-the-source')}
Twenty-four rules to paste into an agent today: https://riskmandate.ai/rules/
Or start with one, in five minutes: ${CUST}`,
    sources: [['Free to copy, paid at the source', NEWS('free-to-copy-paid-at-the-source')]],
  },
  {
    id: 'spectrum-of-trust', seq: 12, kind: 'article', who: 'page', when: 'Day 16',
    title: 'From one policy to agents an insurer can cover',
    why: 'Where this is going, as a proposal: the roadmap, the licence to operate and the insurability work, with the open-governance step.',
    cover: { kicker: 'Where this is going · a proposal', title: 'From one policy to agents an insurer can cover.' },
    shots: [
      { file: 'trust-insurance.jpg', url: LOCAL + 'insurance.html', viewport: [1280, 720], alt: 'The Insurability Index, in design.' },
      { file: 'trust-licence.jpg', url: LOCAL + 'licence-to-operate.html', viewport: [1280, 720], alt: 'The Licence to Operate template.' },
    ],
    html: `<p>RiskMandate's founders are discussing a roadmap, and it reads as a spectrum of trust: each stage answers the next question a customer asks once the last one is answered. It is a proposal, not a decision, and we are on the first stage.</p>
<h2>Six stages</h2>
<ol><li><strong>Policies.</strong> What each agent can reach, what it may do, the gap. We can create them today.</li>
<li><strong>Understand.</strong> Where are our agents, what can they reach, what is our exposure?</li>
<li><strong>Risk acceptance.</strong> Which of these risks do we carry, and who decides?</li>
<li><strong>Contain.</strong> Make the blast radius smaller.</li>
<li><strong>Manage.</strong> Run the agents as a fleet.</li>
<li><strong>Insure.</strong> By then the evidence an insurer needs exists.</li></ol>
<blockquote>Then insure. The end game: agents an insurer can cover.</blockquote>
<p>RiskMandate is not an insurer. Its aim is to make agentic AI insurable, and the site already shows the next two documents: a Licence to Operate for a whole deployment, and the Insurability Index, in design.</p>
<p><img src="${IMG('trust-licence.jpg')}" alt="The Licence to Operate template."></p>
<p><img src="${IMG('trust-insurance.jpg')}" alt="The Insurability Index, in design."></p>
<h2>The description should not belong to the seller</h2>
<p>A description of what an agent can do should not belong to the company that sells it. So the ABP vocabulary is open, and on 20 October we proposed that it become the first hosted project of the Open Security Summit, a UK community interest company, with a public charter and a steering group with a majority independent of RiskMandate still to be written. Hosting is not independence; the charter is what will make it so.</p>
<p>Every stage starts with the first one, and the first one takes five minutes: <a href="${CUST}">customers.riskmandate.ai</a>.</p>`,
    sources: [['A proposed roadmap for RiskMandate', NEWS('the-riskmandate-roadmap')], ['Agent Behaviour Policies move to the Open Security Summit', NEWS('agent-behaviour-policies-move-to-the-open-security-summit')]],
  },
];
