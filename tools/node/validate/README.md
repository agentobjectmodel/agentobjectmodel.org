# Node · Validate

Validate AOM JSON against the [spec](../../../spec/v0.1.0/README.md) schemas. Same behavior as [Python validate](../../python/validate/README.md). Run all commands **from the repository root**.

**Requirements:** Node 18+ — run `npm install` in this folder (or `cd Tools/node/validate && npm install` from repo root).

## Usage

> Recommended: use the top-level `aom` CLI wrappers (see `README.md` and `COMMANDS.md`) and let them call these scripts for you. The commands below are the underlying script-level entrypoints.

**Validate one file** — use one of the three specialized validators (input / output / site), or call `validate.js` directly with `<schema-path> <json-path>`.

```bash
# AOM surface (input schema)
node Tools/node/validate/validate_input.js examples/v0.1.0/login-single/login.aom.json

# Agent output (output schema)
node Tools/node/validate/validate_output.js examples/v0.1.0/login-single/outputs/_login.success.output.json

# Site policy (site-policy-schema.json)
node Tools/node/validate/validate_site.js .well-known/aom-policy.open.site.json

# Or with explicit schema + JSON paths (generic)
node Tools/node/validate/validate.js spec/v0.1.0/aom-input-schema.json examples/v0.1.0/login-single/login.aom.json
```

**Validate all examples:**

```bash
node Tools/node/validate/validate_all.js
```

**Validate one section** (e.g. `v0.1.0/ecom-flow`, `v0.1.0/login-single`, or `examples/v0.1.0/ecom-flow`):

```bash
node Tools/node/validate/validate_all.js v0.1.0/ecom-flow
```

Schemas are resolved from `spec/v0.1.0/`.
