# Python · Validate

Validate AOM JSON against the [spec](../../../spec/v0.1.0/README.md) schemas. Same behavior as [Node validate](../../node/validate/README.md). Run all commands **from the repository root**.

**Requirements:** Python 3.x — `pip install -r requirements.txt` (from this folder or `pip install -r tools/python/validate/requirements.txt` from repo root).

## Usage

> Recommended: use the top-level `aom` CLI wrappers (see `README.md` and `COMMANDS.md`) and let them call these scripts for you. The commands below are the underlying script-level entrypoints.

**Validate one file** — use one of the three specialized validators (input / output / site), or call `validate.py` directly with `<schema-path> <json-path>`. Paths are relative to the current directory.

```bash
# AOM surface (input schema)
python tools/python/validate/validate_input.py examples/v0.1.0/login-single/login.aom.json

# Agent output (output schema)
python tools/python/validate/validate_output.py examples/v0.1.0/login-single/outputs/_login.success.output.json

# Site policy (site-policy-schema.json)
python tools/python/validate/validate_site.py .well-known/aom-policy.open.site.json

# Explicit schema and JSON paths (generic)
python tools/python/validate/validate.py spec/v0.1.0/aom-input-schema.json examples/v0.1.0/login-single/login.aom.json
```

**Validate all examples** — discovers every `*.aom.json` and `*.output.json` under `examples/`:

```bash
python tools/python/validate/validate_all.py
```

**Validate one section** — optional folder argument (e.g. `v0.1.0/ecom-flow`, `v0.1.0/login-single`, or `examples/v0.1.0/ecom-flow`):

```bash
python tools/python/validate/validate_all.py v0.1.0/ecom-flow
```

Schemas are resolved from `spec/v0.1.0/`.
