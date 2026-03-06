## Project command reference

This file is an **advanced / reference** index of all supported CLI and script-level commands for the AOM tools. Most users can start with the `aom` CLI section below and only consult the rest when they need more control.

All commands below are intended to be run from the repo root:

`agentobjectmodel.org/`

---

### 1. Recommended: `aom` CLI wrappers

From the repo root you can use the unified CLI entrypoints instead of calling individual scripts:

- **Python flavor:**

  ```bash
  python aom.py validate input --file examples/v0.1.0/login-single/login.aom.json
  python aom.py validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json
  python aom.py validate site --file .well-known/aom-policy.open.site.json
  python aom.py validate all --examples-dir examples/v0.1.0
  python aom.py create-outputs
  python aom.py demo run --lang python --folder v0.1.0/login-single --test-case _login.success.output
  python aom.py demo test
  ```

- **Node flavor:**

  ```bash
  node aom.mjs validate input --file examples/v0.1.0/login-single/login.aom.json
  node aom.mjs validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json
  node aom.mjs validate site --file .well-known/aom-policy.open.site.json
  node aom.mjs validate all --examples-dir examples/v0.1.0
  node aom.mjs create-outputs
  node aom.mjs demo run --lang node --folder v0.1.0/login-single --test-case _login.success.output
  node aom.mjs demo test
  ```

The sections below list the underlying script-level commands for reference and advanced usage.

---

### 2. Install tool dependencies

- **Python validators:**

  ```bash
  python -m pip install -r tools/python/validate/requirements.txt
  ```

- **Node validators:**

  ```bash
  cd tools/node/validate
  npm install
  cd ../../..
  ```

---

### 3. Validate AOM input surfaces

- **Single surface (Python):**

  ```bash
  python tools/python/validate/validate_input.py examples/v0.1.0/login-single/login.aom.json
  ```

- **Single surface (Node):**

  ```bash
  node tools/node/validate/validate_input.js examples/v0.1.0/login-single/login.aom.json
  ```

- **All examples (Python):**

  ```bash
  python tools/python/validate/validate_all.py v0.1.0
  ```

- **All examples (Node):**

  ```bash
  node tools/node/validate/validate_all.js v0.1.0
  ```

---

### 4. Validate AOM outputs

- **Single output (Python):**

  ```bash
  python tools/python/validate/validate_output.py examples/v0.1.0/login-single/outputs/_login.success.output.json
  ```

- **Single output (Node):**

  ```bash
  node tools/node/validate/validate_output.js examples/v0.1.0/login-single/outputs/_login.success.output.json
  ```

- **All outputs (Python/Node):**

  Use the same `validate_all` commands as for inputs (they cover both inputs and outputs):

  ```bash
  python tools/python/validate/validate_all.py v0.1.0
  node tools/node/validate/validate_all.js v0.1.0
  ```

---

### 5. Validate site-level policy (`site-policy-schema.json`)

- **Python (tools validator):**

  ```bash
  python tools/python/validate/validate_site.py .well-known/aom-policy.open.site.json
  ```

- **Node (tools validator):**

  ```bash
  node tools/node/validate/validate_site.js .well-known/aom-policy.open.site.json
  ```

- **Python (spec-local validator):**

  ```bash
  python spec/v0.1.0/templates/site-policy/validators/python_validator.py .well-known/aom-policy.open.site.json
  ```

- **Node (spec-local validator):**

  ```bash
  node spec/v0.1.0/templates/site-policy/validators/node_validator.js .well-known/aom-policy.open.site.json
  ```

---

### 6. Generate golden output files

- **Python create-outputs:**

  ```bash
  python tools/python/create-outputs/create_outputs.py
  # Optional failed-only flag (if supported in future):
  # python tools/python/create-outputs/create_outputs.py --failed
  ```

- **Node create-outputs:**

  ```bash
  node tools/node/create-outputs/create_outputs.js
  # Optional failed-only flag (if supported in future):
  # node tools/node/create-outputs/create_outputs.js --failed
  ```

---

### 7. Demo agents (single run)

- **Python demo agent:**

  ```bash
  python examples/v0.1.0/demo-agents/python/demo_agent.py --folder v0.1.0/login-single --test-case _login.success.output
  ```

- **Node demo agent:**

  ```bash
  node examples/v0.1.0/demo-agents/node/demo_agent.js --folder v0.1.0/login-single --test-case _login.success.output
  ```

---

### 8. Demo-agent test suites

- **Python tests (pytest):**

  ```bash
  python -m pytest examples/v0.1.0/demo-agents/python/ -v
  ```

- **Node tests (TAP):**

  ```bash
  node examples/v0.1.0/demo-agents/node/run_tests.js
  ```

---

### 9. Misc / low-level validator usage

- **Generic Python validator:**

  ```bash
  python tools/python/validate/validate.py spec/v0.1.0/aom-input-schema.json examples/v0.1.0/login-single/login.aom.json
  ```

- **Generic Node validator:**

  ```bash
  node tools/node/validate/validate.js spec/v0.1.0/aom-input-schema.json examples/v0.1.0/login-single/login.aom.json
  ```

