# tools

Run all commands **from the repository root**. Use `aom.py` (Python) or `aom.mjs` (Node) as the main CLI.

## Quick reference (run from repo root)

Use this first; details and script-level commands are below.

| Task | Python | Node |
|------|--------|------|
| Validate one input surface | `python aom.py validate input --file examples/v0.1.0/login-single/login.aom.json` | `node aom.mjs validate input --file examples/v0.1.0/login-single/login.aom.json` |
| Validate one output | `python aom.py validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json` | `node aom.mjs validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json` |
| Validate one site policy | `python aom.py validate site --file .well-known/aom-policy.open.site.json` | `node aom.mjs validate site --file .well-known/aom-policy.open.site.json` |
| Validate all examples | `python aom.py validate all --examples-dir examples/v0.1.0` | `node aom.mjs validate all --examples-dir examples/v0.1.0` |
| Create test outputs | `python aom.py create-outputs` | `node aom.mjs create-outputs` |
| Demo agent | `python aom.py demo run --lang python --folder v0.1.0/login-single --test-case _login.success.output` | `node aom.mjs demo run --lang node --folder v0.1.0/login-single --test-case _login.success.output` |

Paths: `spec/v0.1.0/`, `examples/v0.1.0/`. Full reference: [COMMANDS.md](../COMMANDS.md).

---

## Layout and requirements

Tooling is by **language** (Python or Node). Demo agents live under **examples/v0.1.0/demo-agents/**: [python](../examples/v0.1.0/demo-agents/python/README.md), [node](../examples/v0.1.0/demo-agents/node/README.md).

```
tools/
  python/  validate/  create-outputs/
  node/    validate/  create-outputs/
```

- **Python validate:** `pip install -r tools/python/validate/requirements.txt`
- **Node validate:** `npm install` in `tools/node/validate/`
- **create-outputs:** no extra deps (Python or Node)

---

## Script-level commands (advanced)

From repo root, if you need to call scripts directly instead of the CLI:

**All examples:**  
`python tools/python/validate/validate_all.py`
`node tools/node/validate/validate_all.js`

**Create outputs:**  
`python tools/python/create-outputs/create_outputs.py`
`node tools/node/create-outputs/create_outputs.js`

**Demo agent:**  
`python examples/v0.1.0/demo-agents/python/demo_agent.py --folder v0.1.0/login-single --test-case _login.success.output`
`node examples/v0.1.0/demo-agents/node/demo_agent.js --folder v0.1.0/login-single --test-case _login.success.output`

**Run demo-agent tests:**  
`python -m pytest examples/v0.1.0/demo-agents/python/ -v`
`node --test examples/v0.1.0/demo-agents/node/demo_agent.test.js`

## AOM Surface Explorer (browser extension) and plugins

**Downloads (aom.tools):**

| Type | Download |
|------|----------|
| **Plugins** | [WordPress](https://aom.tools/releases/aom-policy-wp.zip) · [Next.js](https://aom.tools/releases/aom-next-middleware.zip) · [Static site](https://aom.tools/releases/aom-static-site-snippets.zip) · [Nuxt](https://aom.tools/releases/aom-nuxt-middleware.zip) · [Gatsby](https://aom.tools/releases/aom-gatsby.zip) · [Shopify](https://aom.tools/releases/aom-shopify.zip) |
| **Browser extension** | [AOM Surface Explorer (Chromium)](https://aom.tools/releases/aom-surface-explorer-chromium.zip) |
| **Agent kits** | [Python](https://aom.tools/releases/aom-agent-kit-python.zip) · [Node](https://aom.tools/releases/aom-agent-kit-node.zip) |

The **AOM Surface Explorer** is a companion Chrome/Chromium extension (shipped separately from this repo) that helps you **see and export** AOM surfaces directly from live pages.

- **Generate AOM**: a content script inspects the current page and injects:
  - `<script type="application/ld+aom+json" id="aom-surface">…</script>`
  - The JSON is a best-effort AOM surface aligned to `spec/v0.1.0/aom-input-schema.json` (fields such as `automation_policy`, `aom_version`, `surface_id`, `surface_kind`, `purpose`, `context`, `tasks`, `entities`, `actions`, `state`, `navigation`, `signals`).
- **Read / copy AOM**: the popup reads `#aom-surface` from the active tab and lets you copy the JSON so you can:
  - Paste it into files under `examples/` for experimentation, or
  - Pipe it into the CLIs below for validation or further tooling.
- **Quick structural check**: the popup can do a light check for required top-level fields. For full, schema-accurate validation, use the AOM CLIs:
  - `python aom.py validate input --file ...`
  - `node aom.mjs validate input --file ...`
- **Feedback loop**: a “Report issue / Feedback” action opens an email (for example to your team’s dev list) with the page URL and captured AOM snippet so issues can be turned into new examples or tests.

The extension is a convenience for exploring pages; the **CLI validators in this repo remain the source of truth** for conformance to the AOM v0.1.0 schemas.
