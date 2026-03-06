## Changelog

### v0.1.0 (MVP)

**Status:** Current, unsigned payloads only.  
**Spec:** [`https://www.agentobjectmodel.org/spec/v0.1.0/`](https://www.agentobjectmodel.org/spec/v0.1.0/)

- **Core spec**
  - Defined the Agent Object Model™ v0.1.0: surfaces, actions, navigation, and automation policies (`allowed`, `open`, `forbidden`).
  - Documented the well‑known site policy at `/.well-known/aom-policy.json`.
  - Signed/secure payloads and verification APIs are **out of scope** for this repo; any such standard will be defined elsewhere.

- **Examples**
  - Added `examples/v0.1.0/` with runnable flows (e.g. `login-single`, `ecom-flow`).
  - Standardized `automation_policy` and navigation patterns for v0.1.0.
  - Provided golden `*.output.json` files plus `.json.skip` markers where outputs are hand‑edited.

- **Validators and tooling**
  - Python and Node validators for:
    - **Inputs** (`*.aom.json`), **outputs** (`*.output.json`), and **site policies**.
  - Bulk validators (`validate_all`) that:
    - Walk `examples/v0.1.0/`, validate both inputs and outputs (including `.json.skip`).
    - Report JSON parse errors and schema violations with paths and JSON snippets.
  - `create-outputs` tools for generating canonical `*.output.json` files from demo agents, respecting `.json.skip` markers.

- **CLI entrypoints**
  - **Python:** `aom.py`
  - **Node:** `aom.mjs`
  - Common commands:
    - `validate input|output|site`
    - `validate all`
    - `create-outputs`
    - `demo run` / `demo test`

- **Demo agents**
  - Python and Node demo agents under `examples/v0.1.0/demo-agents/`.
  - Support:
    - `--folder v0.1.0/<example>` (e.g. `v0.1.0/login-single`).
    - `--test-case <stem>` (e.g. `_login.success.output`).
  - Resolution rules:
    - Prefer `<stem>.output.json`, fall back to `<stem>.json.skip` when only a hand‑edited output exists.
  - Full test suites (Python `pytest`, Node `node --test`) covering all current examples.

- **Plugins and integrations**
  - Reference plugins (WordPress, Next.js, Nuxt 3, Gatsby, static HTML, Shopify Liquid) and the AOM Surface Explorer browser extension are distributed from [aom.tools](https://aom.tools). They target v0.1.0 (well-known policy, per-page JSON-LD, AOM badges). See the Community and Support section of the root README for direct download links on aom.tools.

- **Docs**
  - This repo is the canonical source for the spec and reference tooling (https://www.agentobjectmodel.org). Secure/signed payloads and verification are out of scope here.

