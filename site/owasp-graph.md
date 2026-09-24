<!-- Generated from owasp-graph.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP, as a graph

A semantic graph of OWASP: the foundation, its AI and agent projects, the standards and tools an agent deployment touches, the items of eleven lists by title, and the relationships OWASP states between them, joined to the risk model behind the business cases.

Source: https://riskmandate.ai/owasp-graph.html

---

# Every OWASP document has its own ontology. Here they are joined.

OWASP is a foundation of projects, each project a set of documents or tools, each document a list of numbered items with its own vocabulary, and each of those pointing at the others and at frameworks outside. This page is that structure as one graph you can zoom through, from the foundation to a single item, with every relationship taken from OWASP’s own pages. Then it joins the graph to the risk model the rest of this section runs on.

**Read:** OWASP’s own pages, 24 September 2026. Items are titles only. Levels are the live project pages’, and disputed ones are marked.

**The data:** [graph.json](business-case/owasp/graph.json), offered to OWASP to take, correct and keep. The bridge to our model is our reading, not OWASP’s.

## Five levels, one graph.

The fractal part is that each level has the same shape as the one above it: a thing, its parts, and the edges to other things. A reader can stop at any level and still be holding something whole.

OWASP itself.

How this page groups the projects.

Each with its level, type and date.

The numbered entries of 11 lists.

Stated by OWASP, including 14 frameworks outside it.

## The GenAI Security Project

The umbrella project for generative AI and agent security, renamed from the LLM Top 10 project on 26 March 2025, with its own initiatives and documents. The project is Flagship on its live page.

### [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/)

Ten risk categories for applications built on large language models.

- LLM01:2025 Prompt Injection
- LLM02:2025 Sensitive Information Disclosure
- LLM03:2025 Supply Chain
- LLM04:2025 Data and Model Poisoning
- LLM05:2025 Improper Output Handling
- LLM06:2025 Excessive Agency
- LLM07:2025 System Prompt Leakage
- LLM08:2025 Vector and Embedding Weaknesses
- LLM09:2025 Misinformation
- LLM10:2025 Unbounded Consumption

### [OWASP Top 10 for LLM Applications 2026](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)

The edition that replaces 2025, ranked by community vote and incident data, with a different order.

- LLM01:2026 Prompt Injection
- LLM02:2026 Sensitive Information Disclosure
- LLM03:2026 Excessive Agency
- LLM04:2026 Supply Chain
- LLM05:2026 Data and Model Poisoning
- LLM06:2026 Unbounded Consumption
- LLM07:2026 Misinformation
- LLM08:2026 Hidden Context Exposure
- LLM09:2026 Vector and Embedding Weaknesses
- LLM10:2026 Improper Output Handling

### [OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)

Ten risk categories for agents that plan and act.

- ASI01 Agent Goal Hijack
- ASI02 Tool Misuse and Exploitation
- ASI03 Identity and Privilege Abuse
- ASI04 Agentic Supply Chain Vulnerabilities
- ASI05 Unexpected Code Execution (RCE)
- ASI06 Memory & Context Poisoning
- ASI07 Insecure Inter-Agent Communication
- ASI08 Cascading Failures
- ASI09 Human-Agent Trust Exploitation
- ASI10 Rogue Agents

### [Agentic AI – Threats and Mitigations](https://genai.owasp.org/resource/agentic-ai-threats-and-mitigations/)

The detailed agent threat taxonomy the Agentic Top 10 relies on.

### [Securing Agentic Applications Guide 1.0](https://genai.owasp.org/resource/securing-agentic-applications-guide-1-0/)

Guidance for building and deploying agent applications.

### [Multi-Agentic System Threat Modeling Guide v1.0](https://genai.owasp.org/resource/multi-agentic-system-threat-modeling-guide-v1-0/)

The threat taxonomy applied to systems of several agents.

### [State of Agentic AI Security and Governance 2.01](https://genai.owasp.org/resource/state-of-agentic-ai-security-and-governance/)

An overview of frameworks and regulation for agents.

### [Agent Name Service (ANS) v1.0](https://genai.owasp.org/resource/agent-name-service-ans-for-secure-al-agent-discovery-v1-0/)

A proposed scheme for naming and discovering agents.

### [Agent Control Standard (ACS)](https://genai.owasp.org/resource/agent-control-standard-acs/)

Standard hooks for inspecting and controlling agents at runtime, donated to the project.

### [A Practical Guide for Secure MCP Server Development](https://genai.owasp.org/resource/a-practical-guide-for-secure-mcp-server-development/)

Guidance for people who build MCP servers.

### [Cheat Sheet: Securely Using Third-Party MCP Servers 1.0](https://genai.owasp.org/resource/cheatsheet-a-practical-guide-for-securely-using-third-party-mcp-servers-1-0/)

Guidance for people who use MCP servers written by others.

### [GenAI Red Teaming Guide](https://genai.owasp.org/resource/genai-red-teaming-guide/)

A method for adversarial testing of generative AI systems.

### [Vendor Evaluation Criteria for AI Red Teaming Providers and Tooling v1.0](https://genai.owasp.org/resource/owasp-vendor-evaluation-criteria-for-ai-red-teaming-providers-tooling-v1-0/)

Questions to ask red-teaming vendors.

### [LLM Applications Cybersecurity and Governance Checklist v1.1](https://genai.owasp.org/resource/llm-applications-cybersecurity-and-governance-checklist-english/)

A checklist for leaders adopting large language models.

### [AI Security Solutions Landscape for Agentic AI, Q2 2026](https://genai.owasp.org/resource/ai-security-solutions-landscape-for-agentic-ai-q2-2026/)

A quarterly map of tools by lifecycle stage, for agents.

### [AI Security Solutions Landscape for LLM and GenAI Apps, Q2 2026](https://genai.owasp.org/resource/al-security-solutions-landscape-for-llm-and-gen-al-apps-q2-2026/)

The same map, for LLM applications.

### [Solutions Landscape for AI and Agentic Red Teaming, Q2 2026](https://genai.owasp.org/resource/ai-security-solutions-landscape-for-ai-and-agentic-red-teaming-q2-2026/)

The same map, for red-teaming tools.

### [GenAI Data Security Risks and Mitigations 2026 v1.0](https://genai.owasp.org/resource/owasp-genai-data-security-risks-mitigations-2026/)

Data-layer risks for generative AI systems.

### [GenAI Security Industry Framework Crosswalk](https://genai.owasp.org/resource/genai-security-industry-framework-crosswalk/)

Maps the project's risks to controls in outside frameworks.

### [AIUC-1 Crosswalk of the Agentic Top 10](https://genai.owasp.org/resource/aiuc-1-crosswalks-owasp-top-10-for-agentic-applications/)

A two-way mapping between AIUC-1 and the Agentic Top 10.

### [Threat Defense COMPASS 1.0](https://genai.owasp.org/resource/owasp-genai-security-project-threat-defense-compass-1-0/)

A worksheet method for prioritising AI threats.

### [GenAI Incident Response Guide 1.0](https://genai.owasp.org/resource/genai-incident-response-guide-1-0/)

Incident response for generative AI systems.

### [OWASP AIBOM Generator](https://genai.owasp.org/resource/owasp-aibom-generator/)

A tool that writes AI bills of materials in CycloneDX format.

### [FinBot Agentic AI CTF](https://genai.owasp.org/resource/finbot-agentic-ai-capture-the-flag-ctf-application/)

A deliberately vulnerable agent application for training.

## Other OWASP AI projects

AI and agent projects that sit beside the GenAI Security Project, each its own OWASP project.

### [OWASP AI Exchange](https://owaspai.org/)

Reference guidance on AI threats and controls, continuously updated.

### [OWASP AI Testing Guide](https://github.com/OWASP/www-project-ai-testing-guide)

A method and test cases for testing AI systems; v1, 26 November 2025.

### [OWASP AI Vulnerability Scoring System (AIVSS)](https://owasp.org/projects/ai-vulnerability-scoring-system-aivss)

A scoring method, starting with agent risks; v0.8.

### [OWASP AI Security Verification Standard (AISVS)](https://github.com/OWASP/AISVS)

Testable security requirements for AI systems; 1.0, June 2026.

### [OWASP Machine Learning Security Top Ten](https://github.com/OWASP/www-project-machine-learning-security-top-10)

Ten risk categories for machine-learning systems; the 2023 list, marked in draft.

- ML01:2023 Input Manipulation Attack
- ML02:2023 Data Poisoning Attack
- ML03:2023 Model Inversion Attack
- ML04:2023 Membership Inference Attack
- ML05:2023 Model Theft
- ML06:2023 AI Supply Chain Attacks
- ML07:2023 Transfer Learning Attack
- ML08:2023 Model Skewing
- ML09:2023 Output Integrity Attack
- ML10:2023 Model Poisoning

### [OWASP MCP Top 10](https://owasp.org/projects/mcp-top-10)

Ten risk categories for MCP systems; a 2025 beta, next release announced for October 2026.

- MCP01:2025 Token Mismanagement & Secret Exposure
- MCP02:2025 Privilege Escalation via Scope Creep
- MCP03:2025 Tool Poisoning
- MCP04:2025 Software Supply Chain Attacks & Dependency Tampering
- MCP05:2025 Command Injection & Execution
- MCP06:2025 Intent Flow Subversion
- MCP07:2025 Insufficient Authentication & Authorization
- MCP08:2025 Lack of Audit and Telemetry
- MCP09:2025 Shadow MCP Servers
- MCP10:2025 Context Injection & Over-Sharing

### [OWASP Non-Human Identities Top 10](https://owasp.org/www-project-non-human-identities-top-10/2025/)

Ten risk categories for machine identities: keys, tokens, service accounts; 2025 edition.

- NHI1:2025 Improper Offboarding
- NHI2:2025 Secret Leakage
- NHI3:2025 Vulnerable Third-Party NHI
- NHI4:2025 Insecure Authentication
- NHI5:2025 Overprivileged NHI
- NHI6:2025 Insecure Cloud Deployment Configurations
- NHI7:2025 Long-Lived Secrets
- NHI8:2025 Environment Isolation
- NHI9:2025 NHI Reuse
- NHI10:2025 Human Use of NHI

### [OWASP Agentic Skills Top 10](https://owasp.org/projects/agentic-skills-top-10)

Ten risk categories for agent skills, the layer that carries out an agent's actions; in public review.

- AST01 Malicious Skills
- AST02 Supply Chain Compromise
- AST03 Over-Privileged Skills
- AST04 Insecure Metadata
- AST05 Untrusted External Instructions
- AST06 Weak Isolation
- AST07 Update Drift
- AST08 Poor Scanning
- AST09 No Governance
- AST10 Cross-Platform Reuse

### [OWASP AIBOM](https://owaspaibom.org/)

Inventories of the parts of an AI system.

## Standards, lists and guides an agent deployment touches

OWASP work that predates agents but applies to the systems they run in and call.

### [OWASP ASVS](https://owasp.org/projects/asvs)

Security requirements for web applications; 5.0.0, May 2025.

### [OWASP SAMM](https://owaspsamm.org/)

A maturity model for software security programmes; v2.0.

### [OWASP Top 10: 2025](https://top10.owasp.org/2025)

Ten web application risk categories; the 2025 edition.

- A01:2025 Broken Access Control
- A02:2025 Security Misconfiguration
- A03:2025 Software Supply Chain Failures
- A04:2025 Cryptographic Failures
- A05:2025 Injection
- A06:2025 Insecure Design
- A07:2025 Authentication Failures
- A08:2025 Software or Data Integrity Failures
- A09:2025 Security Logging and Alerting Failures
- A10:2025 Mishandling of Exceptional Conditions

### [OWASP API Security Top 10](https://owasp.org/projects/api-security-project)

Ten API risk categories; the 2023 edition.

- API1:2023 Broken Object Level Authorization
- API2:2023 Broken Authentication
- API3:2023 Broken Object Property Level Authorization
- API4:2023 Unrestricted Resource Consumption
- API5:2023 Broken Function Level Authorization
- API6:2023 Unrestricted Access to Sensitive Business Flows
- API7:2023 Server Side Request Forgery
- API8:2023 Security Misconfiguration
- API9:2023 Improper Inventory Management
- API10:2023 Unsafe Consumption of APIs

### [CycloneDX (ECMA-424)](https://cyclonedx.org/)

A bill-of-materials standard with a machine-learning variant; specification 1.7.

### [Software Component Verification Standard](https://owasp.org/www-project-software-component-verification-standard/)

Supply-chain verification controls; 1.0.

### [Top 10 CI/CD Security Risks](https://owasp.org/projects/top-10-cicd-security-risks)

Ten build-pipeline risk categories.

- CICD-SEC-1 Insufficient Flow Control Mechanisms
- CICD-SEC-2 Inadequate Identity and Access Management
- CICD-SEC-3 Dependency Chain Abuse
- CICD-SEC-4 Poisoned Pipeline Execution (PPE)
- CICD-SEC-5 Insufficient PBAC (Pipeline-Based Access Controls)
- CICD-SEC-6 Insufficient Credential Hygiene
- CICD-SEC-7 Insecure System Configuration
- CICD-SEC-8 Ungoverned Usage of 3rd Party Services
- CICD-SEC-9 Improper Artifact Integrity Validation
- CICD-SEC-10 Insufficient Logging and Visibility

### [Kubernetes Top Ten](https://kubernetes-top10.owasp.org/)

Ten Kubernetes risk categories; the 2025 list.

- K01 Insecure Workload Configurations
- K02 Overly Permissive Authorization Configurations
- K03 Secrets Management Failures
- K04 Lack Of Cluster Level Policy Enforcement
- K05 Missing Network Segmentation Controls
- K06 Overly Exposed Kubernetes Components
- K07 Misconfigured And Vulnerable Cluster Components
- K08 Cluster To Cloud Lateral Movement
- K09 Broken Authentication Mechanisms
- K10 Inadequate Logging And Monitoring

### [Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

Short guides, one topic each.

### [Threat Modeling Project](https://owasp.org/projects/threat-modeling-project)

The entry point for OWASP's threat-modelling guidance, including agentic threat modelling.

## Tools

Software an organisation can run, several with a business case on this site.

### [Threat Dragon](https://owasp.org/www-project-threat-dragon/)

Threat models as data-flow diagrams.

### [pytm](https://owasp.org/www-project-pytm/)

Threat models written as Python code.

### [Coraza Web Application Firewall](https://coraza.io/)

A web application firewall engine.

### [Core Rule Set (CRS)](https://coreruleset.org/)

Detection rules for web application firewalls.

### [Dependency-Track](https://dependencytrack.org/)

Tracks component risk from bills of materials.

### [Dependency-Check](https://owasp.org/www-project-dependency-check/)

Finds known vulnerable dependencies.

### [DefectDojo](https://owasp.org/www-project-defectdojo/)

Collects and manages security findings.

### [Juice Shop](https://owasp.org/www-project-juice-shop/)

A deliberately vulnerable web application for training.

### [WrongSecrets](https://owasp.org/www-project-wrongsecrets/)

Secrets-management training exercises.

## The frameworks OWASP maps to, titles only.

### MITRE ATLAS

### MITRE ATT&CK

### MITRE CWE

### NIST AI RMF (AI 100-1)

### NIST AI 600-1

### CSA AI Controls Matrix

### ISO/IEC 42001

### ISO/IEC 27090

### EU AI Act

### AIUC-1

### Google SAIF

### NIST AML taxonomy

### CSA MAESTRO

### ZAP (left OWASP, 1 August 2023)

## The Agentic Top 10, joined to the register.

For each item, the answers in our model that bound it, the risks those answers establish, and the open-source cases on this site that change those answers. This is our reading, stated as ours. Three items touch nothing in the model; that is a finding about the model, and it says where the model has to grow.

## Published unresolved, for the projects to settle.

- **Project levels.** OWASP records a project's level in three places: the live project page, the committee's level file and the project's own page source. For several projects they disagree: the AI Exchange is Flagship on the live page, Incubator in the committee file and level 4 in its own source; the AI Testing Guide is Incubator on the live page and level 4 in its source; the MCP Top 10 is Production on the live page and level 2 in both others. This graph shows the live page's level and marks the disputed ones. [github.com/OWASP/owasp.github.io/blob/main/_data/project_levels.json](https://github.com/OWASP/owasp.github.io/blob/main/_data/project_levels.json)
- **The sixth MCP item.** MCP06:2025 is titled Intent Flow Subversion in the project's repository and Prompt Injection via Contextual Payloads on the live project page. This graph uses the repository's title. [github.com/OWASP/www-project-mcp-top-10](https://github.com/OWASP/www-project-mcp-top-10) · [owasp.org/projects/mcp-top-10](https://owasp.org/projects/mcp-top-10)
- **The date of the 2026 LLM Top 10.** 3 August in the project's feed, 4 August on the page and the cover, and a placeholder, publication date to be set, inside the document. [genai.owasp.org/resource/owasp-genai-llm-top-10-2026/](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/)
- **The ML Top 10's status.** Lab on the live site; an Incubator badge and in draft on its own page. [github.com/OWASP/www-project-machine-learning-security-top-10](https://github.com/OWASP/www-project-machine-learning-security-top-10)
- **What the AI Testing Guide is.** It calls itself a standard; the live site lists it as an Incubator project of type Other. [github.com/OWASP/www-project-ai-testing-guide](https://github.com/OWASP/www-project-ai-testing-guide)

## A graph OWASP does not have yet, offered to OWASP.

The lead is closely involved with OWASP, and the intent is to offer this graph, and in time the Agent Behaviour Policy format, to OWASP rather than keep them here. Until then the data is published so anybody can take it, and it changes with a date when a project corrects it.

- [OWASP Slack](https://owasp.org/slack/invite)
- [GenAI Security Project: contributing](https://genai.owasp.org/contributing/)
- [GenAI Security Project: meetings](https://genai.owasp.org/meetings/)
- [MCP Top 10 on GitHub](https://github.com/owasp/www-project-mcp-top-10)
- [NHI Top 10 on GitHub](https://github.com/OWASP/www-project-non-human-identities-top-10)
- [AI Testing Guide on GitHub](https://github.com/OWASP/www-project-ai-testing-guide)
- [AI Exchange](https://owaspai.org/)
- [Cheat Sheet Series on GitHub](https://github.com/OWASP/CheatSheetSeries)

## An item names a risk. A behaviour policy says whether yours has it.

The Top 10s say what can go wrong with agents in general. What goes wrong with yours depends on what it can reach, which is what a behaviour policy writes down, and which projects change it, which is what the business cases compute.
