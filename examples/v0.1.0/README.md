# Examples (v0.1.0)

AOM surface definitions (`*.aom.json`) and expected agent outputs (`outputs/*.output.json`). All validate against the [spec](../../spec/v0.1.0/README.md) schemas.

## Validate all (from repo root)

```bash
python aom.py validate all --examples-dir examples/v0.1.0
node   aom.mjs validate all --examples-dir examples/v0.1.0
```

## Layout

- **[login-single](login-single/)**, **[ecom-flow](ecom-flow/)**, **[forbidden-page-template](forbidden-page-template/)** — Surfaces and their `outputs/` (forbidden template is page-level policy only).
- **[demo-agents/](demo-agents/README.md)** — Demo agents (Python + Node).
- **Site policy templates** — Ready-to-copy JSON templates live under [spec/v0.1.0/templates/site-policy/](../../spec/v0.1.0/templates/site-policy/).

Each example folder (e.g. `login-single`, `ecom-flow`) contains:

- **`*.aom.json`** — AOM surfaces. Validated with `spec/v0.1.0/aom-input-schema.json`.
- **`outputs/`** — Golden output JSON. Validated with `spec/v0.1.0/aom-output-schema.json` (`_*.success.output.json`, `*.failed.output.json`, `_*.escalated.output.json`).

## Generating outputs

From repo root, generate golden `*.output.json` files:

```bash
python aom.py create-outputs
node   aom.mjs create-outputs
```

This discovers every `*.aom.json` under `examples/` and writes success, failed, and (when applicable) escalated outputs. To avoid overwriting hand-edited files, add a `.skip` marker (see [tools/testing/README.md](../../tools/testing/README.md)).

## Validating a single folder (advanced)

```bash
python tools/python/validate/validate_all.py v0.1.0/ecom-flow
node tools/node/validate/validate_all.js v0.1.0/ecom-flow
```
