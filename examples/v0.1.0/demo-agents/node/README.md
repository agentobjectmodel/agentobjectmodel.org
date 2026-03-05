# Node · Demo agent

Generic consumer of AOM example outputs. Same behavior as [Python demo-agent](../python/README.md). Run from **repository root**.

**Requirements:** Node 18+. No dependencies.

## Usage

**Required:** `--folder` and `--test-case`. Use full stem (e.g. `_login.success.output`) or a prefix that matches exactly one (e.g. `_login.success`, `login.captcha_required`). Use `listTestCases(folder)` to see valid ids.

```bash
node examples/v0.1.0/demo-agents/node/demo_agent.js --folder v0.1.0/login-single --test-case _login.success.output
node examples/v0.1.0/demo-agents/node/demo_agent.js --folder v0.1.0/ecom-flow --test-case _step01_product.success.output
```

Ensure `examples/<folder>/outputs/` exist (run create-outputs first). For example, `--folder v0.1.0/login-single` expects `examples/v0.1.0/login-single/outputs/`.

When resolving outputs, the Node demo agent prefers `<stem>.output.json`, but if that file does not exist it will fall back to `<stem>.json.skip` (hand-edited outputs that `create-outputs` will not overwrite).

**From code:** `import { run, listFolders, listTestCases } from './demo_agent.js'`

## Tests — 3 layers (use run_tests.js)

The runner `run_tests.js` parses `--folder` and `--test-case` and runs the test file with the right scope. Same CLI as Python; no env vars to set.

| Layer | Command | What runs |
|-------|---------|-----------|
| **all + all** | `node run_tests.js` or `npm test` | All folders × all test cases (49) |
| **1 + all** | `node run_tests.js --folder v0.1.0/login-single` | One folder × all its test cases (21) |
| **1 + 1** | `node run_tests.js --folder v0.1.0/login-single --test-case _login.success.output` | One folder × one test case (1) |

From repo root: `node examples/v0.1.0/demo-agents/node/run_tests.js [--folder NAME] [--test-case STEM]`  
From this folder: `node run_tests.js [--folder NAME] [--test-case STEM]` or `npm test [-- --folder NAME] [-- --test-case STEM]`
