## Contributing to the Agent Object Model (AOM)™ spec and tools

**Start here:** Run validators and demo tests before submitting (see “Before you open a PR” below).

This repository is the **reference implementation** of the AOM specification (schemas, examples, and tools). Keep changes aligned with the spec and backwards compatible where possible.

---

### What lives in this repo

- **Spec + schemas** under `spec/` (for example `spec/v0.1.0/`).
- **Examples** under `examples/` (for example `examples/v0.1.0/`).
- **Reference tools** under `Tools/`:
  - Validators (Python + Node)
  - Output generators (`create-outputs`)
  - Demo agents for examples

The top-level `aom` CLI wrappers (`aom.py`, `aom.mjs`) provide a single entrypoint to these tools.

---

### Before you open a PR

1. **Validate examples and outputs**

   From the repo root (`agentobjectmodel.org/`):

   ```bash
   # Python
   python aom.py validate all --examples-dir examples/v0.1.0

   # Node
   node aom.mjs validate all --examples-dir examples/v0.1.0
   ```

2. **Run demo-agent tests (if you touched examples or tools)**

   ```bash
   # Python demo agents
   python aom.py demo test
   # (runs both Python and Node demo-agent tests)
   ```

3. **Check paths and links**

   - Prefer versioned paths (for example `spec/v0.1.0/`, `examples/v0.1.0/`).
   - Keep docs and examples consistent with the on-disk layout.

---

### Versioning and compatibility

See `spec/v0.1.0/README.md` for the versioning policy. In short:

- **Minor and patch** versions should remain backward compatible for existing payloads.
- **Breaking changes** should be clearly called out and usually require a new major version.

When proposing schema changes, please include:

- Before/after snippets of the schema.
- Example payloads that illustrate the intended behavior.
- Notes on migration and compatibility.

---

### Questions and proposals

If you are unsure whether a change belongs in the spec or in tooling:

- Open an issue describing the problem and desired behavior.
- Include concrete JSON examples (AOM surfaces and/or outputs).

Discussions about broader design (new fields, new flows, integrations and tooling) are welcome; the spec should remain focused on **interoperable contracts** between agents and surfaces.

