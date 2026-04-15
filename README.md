# Agent Object Model™ (AOM)™ · Spec and tools

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/agentobjectmodel/agentobjectmodel.org/releases) [![License](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)

> A task-centric, entity-driven JSON standard that gives AI agents a clean, automation-aware view of any web page or surface — with zero layout noise, clear tasks, and explicit policies.

**Start here — [white paper (HTML)](whitepaper/agent-object-model.html):** motivation, architecture, Input and Output AOM, automation policy (including the three `automation_policy` modes), and incremental adoption. Read it in the browser before diving into schemas and examples.

**Get the project:** Clone this repo or [download ZIP](https://github.com/agentobjectmodel/agentobjectmodel.org/archive/refs/heads/master.zip) — spec, schemas, examples, and validators in one package. Latest release: [v0.1.0](https://github.com/agentobjectmodel/agentobjectmodel.org/releases).

Agent Object Model and AOM are trademarks; registration has been filed. See [Trademark Notice](static/TRADEMARK-NOTICE.md). This repo is the canonical source for the AOM spec and reference tooling (https://www.agentobjectmodel.org).

---

## Table of Contents

- [White paper (recommended first read)](#white-paper)
- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Output Modes](#output-modes)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Examples](#examples)
- [tools and validators](#tools-and-validators)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Why AOM?](#why-aom)
- [Community and Support](#community-and-support)

---

## The Problem

AI agents browsing the web today face critical challenges:

**What agents see:**

- Raw HTML and DOM trees full of layout classes, ads, and tracking scripts.
- Unstable element identifiers that change between renders.
- No explicit description of tasks, workflows, or navigation.
- Hidden state machines and error paths spread across multiple pages.

**This leads agents to:**

- Waste tokens parsing irrelevant markup.
- Misidentify which elements are safe or important to act on.
- Struggle with multi-step flows (login, checkout, onboarding).
- Depend on brittle, page-specific prompts instead of reusable contracts.

**Example: A simple login form**

What the agent gets (HTML):

```html
<form id="login_form_a8f3" class="needs-validation">
  <input type="email" id="email_input_x2k9" required>
  <input type="password" id="password_x7k1" required>
  <button type="submit">Log In</button>
  <a href="/account/change-password" class="link-secondary">Change password</a>
</form>
```

Result: Agent wastes tokens, unclear what happens after submit or what is safe to do.

---

## The Solution

Instead of raw HTML, agents receive a **clean, semantic AOM JSON document** with exactly what they need:

```json
{
  "aom_version": "0.1.0",
  "surface_id": "app:auth:login",
  "surface_kind": "screen",
  "automation_policy": "allowed",
  "purpose": {
    "primary_goal": "Authenticate the user and establish a session.",
    "user_roles": ["guest", "anonymous"]
  },
  "tasks": [{
    "id": "login",
    "label": "Sign in",
    "description": "Submit credentials to authenticate.",
    "default_action_id": "submit_login",
    "input_entities": ["LoginCredentials"]
  }],
  "entities": {
    "LoginCredentials": {
      "schema": {
        "username": { "type": "string", "required": true },
        "password": { "type": "string", "required": true }
      }
    }
  },
  "actions": [{
    "id": "submit_login",
    "label": "Log In",
    "category": "mutation",
    "input_entities": ["LoginCredentials"]
  }]
}
```

**Result:** Agent sees purpose, tasks, entities, and allowed actions. No layout noise; automation policy can restrict to AOM-only (`allowed` with guardrails) or allow more (`open`). *(The snippet above is illustrative; a full valid surface also includes required `generated_at`, `state`, `navigation`, and `signals` — see [spec](spec/v0.1.0/README.md).)*

**AOM's answer:**

- **Surfaces**: Clean JSON documents that describe a screen's purpose, tasks, entities, actions, state, navigation, and signals.
- **Outputs**: Structured agent responses that declare thoughts, actions, and results against those surfaces.
- **Automation policy**: Site-level and per-surface rules (`forbidden` | `allowed` | `open`) advertised via `/.well-known/aom-policy.json` and JSON-LD in `<head>`.
- **Tooling**: Validators and demo agents in this repo; reference plugins and the browser extension at [aom.tools](https://aom.tools).

See [spec/v0.1.0/README.md](spec/v0.1.0/README.md) for the full formal model and a [diagram of where the documents fit](spec/v0.1.0/README.md#where-the-documents-fit) (surface → agent → output → request to site; and where schemas, examples, and tools live in this repo).

---

## Quick Start

Clone or download this repository (see **Get the project** above), then from the repo root run the commands below. You need either Python 3 or Node 18+ for the CLI.

### 0. Explore examples

```bash
# View an example surface (or open the file in an editor)
cat examples/v0.1.0/login-single/login.aom.json
```

### 1. Validate a single input and output

```bash
python aom.py validate input --file examples/v0.1.0/login-single/login.aom.json
python aom.py validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json
```

### 2. Run bulk validation across examples

```bash
python aom.py validate all --examples-dir examples/v0.1.0
node   aom.mjs validate all --examples-dir examples/v0.1.0
```

### 3. Run one demo-agent case

```bash
python aom.py demo run --lang python --folder v0.1.0/login-single --test-case _login.success.output
node   aom.mjs demo run --lang node   --folder v0.1.0/login-single --test-case _login.success.output
```

**Sample agent output (single-shot):**

```json
{
  "mode": "single",
  "action": {
    "action_id": "submit_login",
    "params": {},
    "priority": 5
  },
  "meta": { "done": true, "confidence": 0.95 },
  "thought": "Proceeding with default task action.",
  "result": { "ok": true, "user_id": "user1234" }
}
```

For the full matrix of CLI and script-level commands, see [COMMANDS.md](COMMANDS.md).

---

## Core Concepts

| Concept | What it represents | Where to learn more |
|--------|---------------------|---------------------|
| **Surface** | JSON description of a screen: purpose, tasks, entities, actions, state, navigation, signals | [spec/v0.1.0/README.md](spec/v0.1.0/README.md) (`aom-input-schema.json`) |
| **Output** | Agent's response: thought, chosen action, result, meta | [spec/v0.1.0/README.md](spec/v0.1.0/README.md) (`aom-output-schema.json`) |
| **Automation policy** | Rules for automation: `forbidden` \| `allowed` \| `open` | [spec/v0.1.0/README.md](spec/v0.1.0/README.md), [spec/well-known-policy.md](spec/well-known-policy.md) |
| **Site policy** | Well-known JSON for site-wide automation policy | `/.well-known/aom-policy.json` examples |
| **Signals & test cases** | Built-in feedback and test cases for each surface | [spec/v0.1.0/README.md](spec/v0.1.0/README.md) (`signals.test_cases`) |

### Surface sections

| Section | What it tells the agent |
|---------|-------------------------|
| **purpose** | Why does this screen exist? What is the user's goal? |
| **tasks** | What workflows are available? What are the steps? |
| **entities** | What data is in play? What are the schemas? |
| **actions** | What can the agent do? What are the inputs/outputs? |
| **state** | Where are we in the workflow? What is the current context? |
| **navigation** | Where can the agent go next? What are the transitions? |
| **signals** | Are there errors, warnings, or confirmations? |

### Key principles

1. **Task-centric** — Organized around user goals, not UI layout.
2. **Entity-driven** — Data structures explicit and typed.
3. **Action-oriented** — Clear definition of what can be done.
4. **State-aware** — Workflow position and context tracked.
5. **Layout-free** — No CSS, coordinates, or visual information.
6. **Semantic-only** — Pure meaning, zero presentation noise.
7. **Automation guardrails** — `forbidden` / `allowed` (with guardrails) / `open` control how agents may use the surface.

---

## Output Modes

AOM supports two execution patterns for agent behavior:

- **Single-shot** (`mode: "single"`): One decision, one response. Agent reads the surface, chooses an action, returns a result with `meta.done: true`. No loop.
- **Flow** (`mode: "flow"`): Multi-step. Agent emits an action; runtime returns an updated surface; loop continues until `meta.done: true`.

See [spec/v0.1.0/README.md](spec/v0.1.0/README.md) and `aom-output-schema.json` for the full output contract.

---

## Repository Structure

```
agentobjectmodel.org/
├── spec/
│   ├── v0.1.0/                    # Schemas, templates, well-known policy
│   │   ├── aom-input-schema.json
│   │   ├── aom-output-schema.json
│   │   ├── site-policy-schema.json
│   │   ├── README.md
│   │   ├── sequence-diagram-for-geeks.md   # Full runtime flow diagram (site/page policy, Input/Output AOM)
│   │   └── templates/site-policy/
│   └── well-known-policy.md
├── examples/
│   └── v0.1.0/                   # login-single, ecom-flow, forbidden-page-template (minimal *.aom.json), demo-agents
├── tools/                        # Python + Node: validate, create-outputs, testing
├── static/                      # Badges, USAGE.md, badge-test.html, TRADEMARK-NOTICE.md
├── .well-known/                 # Example site policy JSON
├── aom.py                        # Python CLI
├── aom.mjs                       # Node CLI
└── COMMANDS.md                   # Full command reference
```

Key entrypoints: `aom.py`, `aom.mjs`, and [COMMANDS.md](COMMANDS.md).

---

## Getting Started

### For agent developers

**Goal:** Build agents that consume AOM surfaces.

1. Read the [spec](spec/v0.1.0/README.md) and schemas.
2. Run the [examples](examples/v0.1.0/) and [demo agents](examples/v0.1.0/demo-agents/).
3. Validate surfaces and outputs with `aom validate input` / `aom validate output` / `aom validate all`.
4. See [COMMANDS.md](COMMANDS.md) for the full CLI surface.

### For site and page publishers

**Goal:** Make your site AOM-ready.

1. Serve `/.well-known/aom-policy.json` (see [well-known-policy.md](spec/well-known-policy.md) and [spec/v0.1.0/templates/site-policy/](spec/v0.1.0/templates/site-policy/)).
2. Embed AOM or JSON-LD in pages where you want agent automation.
3. Reference plugins (WordPress, Next.js, Nuxt, Gatsby, Shopify, static-site) and the browser extension are available at [aom.tools](https://aom.tools); direct downloads: [plugins and extension](#community-and-support) in Community and Support.
4. Optional: use [policy badges](https://www.agentobjectmodel.org/static/USAGE.html) to signal automation policy to users (usage guide and copy-paste HTML on the site).

In **`automation_policy: "allowed"`** (with guardrails) you decide which actions the agent can see and perform: if you do **not** include a password reset or change-password flow in the surface’s `tasks` / `actions`, a conforming agent cannot invoke those operations or see the associated sensitive state. You can keep higher‑risk flows on separate surfaces with stricter policy or A2H requirements.

### For implementers

**Goal:** Validators, create-outputs, or other tooling.

1. Read the [schemas](spec/v0.1.0/) (`aom-input-schema.json`, `aom-output-schema.json`, `site-policy-schema.json`).
2. Run the [tools](tools/README.md) (validate, create-outputs) via CLI or scripts.
3. Use [COMMANDS.md](COMMANDS.md) for all commands and parameters.

---

## Examples

| Example | Purpose | Location |
|---------|---------|----------|
| **Login single** | Single-shot sign-in surface (`allowed`, with guardrails) | [examples/v0.1.0/login-single/](examples/v0.1.0/login-single/) |
| **Ecom flow** | Multi-step checkout flow | [examples/v0.1.0/ecom-flow/](examples/v0.1.0/ecom-flow/) |
| **Forbidden page template** | Page-level no-automation (minimal valid surface) | [examples/v0.1.0/forbidden-page-template/](examples/v0.1.0/forbidden-page-template/) — `aom-policy.forbidden.page.aom.json` |

Demo agents (Python + Node) that consume surfaces and produce conformant outputs live in [examples/v0.1.0/demo-agents/](examples/v0.1.0/demo-agents/).

See [examples/v0.1.0/](examples/v0.1.0/) for details and validation instructions.

---

## tools and validators

- **Unified CLI**: `aom.py` (Python) and `aom.mjs` (Node) — validate input/output/site/all, create-outputs, demo run/test.
- **Validators**: Python and Node against `aom-input-schema.json`, `aom-output-schema.json`, and `site-policy-schema.json`.
- **Create-outputs**: Generate golden `*.output.json` from `*.aom.json` surfaces.
- **Demo agents**: Reference implementations in [examples/v0.1.0/demo-agents/](examples/v0.1.0/demo-agents/) (Python + Node).

Quick start: run `python aom.py --help` or `node aom.mjs --help` from the repo root. Full reference: [COMMANDS.md](COMMANDS.md) and [tools/README.md](tools/README.md).

---

## Roadmap

- **v0.1.0 (current)** — Spec, schemas, validators, create-outputs, demo agents, site policy, automation guardrails (`forbidden` / `allowed` / `open`).
- **Next** — Secure payloads (future, documented elsewhere); more examples. Plugins and browser extension: [aom.tools](https://aom.tools).

See [CHANGELOG.md](CHANGELOG.md) for release history.

---

## Contributing

This repo is the reference implementation for the AOM spec. Contributions are welcome, especially:

- Improvements to the spec text and examples (keeping backwards compatibility where possible).
- Improvements to the Python / Node reference tools, as long as behavior stays aligned with the schemas and examples.

**How to contribute:**

- [Report issues](https://github.com/agentobjectmodel/agentobjectmodel.org/issues) or propose changes (spec, examples, tools).
- Improve documentation, add examples, or enhance tools.
- Before submitting: run validators and demo tests per [COMMANDS.md](COMMANDS.md).

See [CONTRIBUTING.md](CONTRIBUTING.md) and [spec/v0.1.0/README.md](spec/v0.1.0/README.md) for versioning and compatibility guidance.

---

## License

MIT License — see [LICENSE.md](LICENSE.md). You may use, modify, and redistribute in commercial and non-commercial projects.

---

## Why AOM?

- **For AI agents** — Less token waste, explicit tasks and actions, automation guardrails (`allowed` with guardrails vs `open`), support for multi-step flows.
- **For developers** — Agent-ready surfaces, clear contracts, validators and CLI to adopt the spec quickly.
- **For users** — More predictable agent behavior and transparency via AOM and site policy.

---

## White paper

[Agent Object Model v0.1.0 — white paper](whitepaper/agent-object-model.html) (same link as in the introduction above): motivation, architecture, Input/Output AOM, automation policy at a glance (with figure), and adoption.

---

## Community and Support

- **Updates on X**: [@AOMstandards](https://x.com/AOMstandards)
- **Spec and standards**: [standards@agentobjectmodel.org](mailto:standards@agentobjectmodel.org)
- **Key docs**: [spec/v0.1.0/README.md](spec/v0.1.0/README.md), [spec/well-known-policy.md](spec/well-known-policy.md), [tools/README.md](tools/README.md), [COMMANDS.md](COMMANDS.md), [CONTRIBUTING.md](CONTRIBUTING.md)
- **White paper**: [Agent Object Model v0.1.0 (HTML)](whitepaper/agent-object-model.html) — linked at the top of this README; full narrative and policy figure.
- **Trademark**: [static/TRADEMARK-NOTICE.md](static/TRADEMARK-NOTICE.md)
- **Badges**: [Usage guide and HTML examples](https://www.agentobjectmodel.org/static/USAGE.html) — policy badges (SVG/PNG) for AOM Open, allowed (with guardrails), No Automation. [Theme test page](https://www.agentobjectmodel.org/static/badge-test.html) (light/dark, copy-paste). Example (links to guide):
  <a href="https://www.agentobjectmodel.org/static/USAGE.html"><img src="https://www.agentobjectmodel.org/static/aom-badges/open/aom-open.svg" alt="AOM Open" width="48" height="48"></a>
- **tools and integrations** (aom.tools): plugins, browser extension, and agent kits — see [AOM Tools downloads](https://aom.tools/downloads/) for the latest links.
