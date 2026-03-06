# Testing and Validation Overview

This folder provides an overview of how to **test and validate** AOM payloads in this repo. It ties together the language-specific tools in `tools/python/` and `tools/node/` and the versioned examples in `examples/`.

For AOM v0.1.0, the primary entrypoint for testing is the **`validate` commands**; there is no separate "test runner" beyond these validators and the demo agents.

## Start here (quick checks from repo root)

```bash
# Validate all examples (recommended)
python aom.py validate all --examples-dir examples/v0.1.0
node   aom.mjs validate all --examples-dir examples/v0.1.0
```

```bash
# Validate one surface or output
python aom.py validate input  --file examples/v0.1.0/login-single/login.aom.json
python aom.py validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json
```

---

## 1. Validators (core conformance checks)

Use the `validate` tools to check your AOM JSON against the schemas in `spec/v0.1.0/`:

- Python: see `tools/python/validate/README.md`
- Node: see `tools/node/validate/README.md`

From the repo root (script-level, advanced):

```bash
# Validate all examples
python tools/python/validate/validate_all.py
# or
node tools/node/validate/validate_all.js
```

These commands:

- Discover `*.aom.json` and `*.output.json` under `examples/`
- Validate surfaces against `spec/v0.1.0/aom-input-schema.json`
- Validate outputs against `spec/v0.1.0/aom-output-schema.json`

## 2. Golden outputs (create-outputs)

Golden `outputs/*.output.json` files are generated and updated by the **create-outputs** tools:

```bash
python aom.py create-outputs
node   aom.mjs create-outputs
```

These discover every `*.aom.json` under `examples/` and write:

- Success outputs
- Per–test-case failed outputs
- Escalated outputs (when applicable)

To avoid overwriting hand-edited outputs, add a `.skip` marker file alongside the JSON you want to protect.

## 3. Demo agents

Under `examples/v0.1.0/demo-agents/` you will find:

- `python/` — a demo agent and pytest-based tests
- `node/` — a demo agent and Node test runner

These are reference implementations that consume example AOM surfaces and produce outputs that match the golden files.

## 4. Recommended flow for users

For sites or agents adopting AOM v0.1.0:

1. Author/emit your AOM surfaces and outputs.
2. Run the **validate** commands (Python or Node) against your files.
3. Optionally use **create-outputs** and the demo agents as a starting point for your own test harness.

The validators are the **official conformance testing tools** for this repo; no additional test framework is required for MVP.

## 5. Agent kits (aom.tools)

If you want more opinionated starter code for building agents that consume and produce AOM, AOM Agent kits (Python and Node) are distributed from [aom.tools](https://aom.tools). These live outside this spec repo and complement the free demo agents and validators here.

