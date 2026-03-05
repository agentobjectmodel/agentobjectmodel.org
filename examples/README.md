# Examples

AOM surface definitions (`*.aom.json`) and expected agent outputs (`outputs/*.output.json`). All validate against the [spec](../spec/v0.1.0/README.md) schemas.

## Validate all (from repo root)

```bash
python aom.py validate all --examples-dir examples/v0.1.0
node   aom.mjs validate all --examples-dir examples/v0.1.0
```

## Layout

- **v0.1.0/login-single**, **v0.1.0/ecom-flow** — Surfaces and their `outputs/`.
- **v0.1.0/demo-agents/** — Demo agents (Python + Node); see [v0.1.0/demo-agents/README.md](v0.1.0/demo-agents/README.md).
- **Site policy templates** — Ready-to-copy JSON templates live under [`spec/v0.1.0/templates/site-policy/`](../spec/v0.1.0/templates/site-policy/).

Each example folder (e.g. `v0.1.0/login-single`) contains:

- **`*.aom.json`** — AOM surfaces. Validated with `spec/v0.1.0/aom-input-schema.json`.
- **`outputs/`** — Golden output JSON. Validated with `spec/v0.1.0/aom-output-schema.json` (`_*.success.output.json`, `*.failed.output.json`, `_*.escalated.output.json`).

## Generating outputs

From repo root, generate golden `*.output.json` files:

```bash
python aom.py create-outputs
node   aom.mjs create-outputs
```

This discovers every `*.aom.json` under `examples/` and writes success, failed, and (when applicable) escalated outputs. To avoid overwriting hand-edited files, add a `.skip` marker (see [Tools/testing/README.md](../Tools/testing/README.md)).

## Validating a single folder (advanced)

```bash
python Tools/python/validate/validate_all.py v0.1.0/ecom-flow
node Tools/node/validate/validate_all.js v0.1.0/ecom-flow
```
