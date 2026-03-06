# Python · Demo agent

Generic consumer of AOM example outputs. Same behavior as [Node demo-agent](../node/README.md). Run from **repository root**.

**Requirements:** Python 3.x. For tests: `pip install -r requirements.txt` (pytest).

## Usage

**Required:** `--folder` and `--test-case`. Use full stem (e.g. `_login.success.output`) or a prefix that matches exactly one (e.g. `_login.success`, `login.captcha_required`). Use `list_test_cases(folder)` to see valid ids.

```bash
python examples/v0.1.0/demo-agents/python/demo_agent.py --folder v0.1.0/login-single --test-case _login.success.output
python examples/v0.1.0/demo-agents/python/demo_agent.py --folder v0.1.0/ecom-flow --test-case _step01_product.success.output
```

Ensure `examples/<folder>/outputs/` exist (run [create-outputs](../../../../tools/testing/README.md) first). For example, `--folder v0.1.0/login-single` expects `examples/v0.1.0/login-single/outputs/`.

When resolving outputs, the Python demo agent prefers `<stem>.output.json`, but if that file does not exist it will fall back to `<stem>.json.skip` (hand-edited outputs that `create-outputs` will not overwrite).

**From code:** `from demo_agent import run, list_folders, list_test_cases`

## Tests (pytest) — 3 layers

Run from this folder: `python -m pytest -v [--folder NAME] [--test-case STEM]`

| Layer | Command | What runs |
|-------|---------|-----------|
| **all + all** | `python -m pytest -v` | All folders × all test cases (49) |
| **1 + all** | `python -m pytest -v --folder v0.1.0/login-single` | One folder × all its test cases (21) |
| **1 + 1** | `python -m pytest -v --folder v0.1.0/login-single --test-case _login.success.output` | One folder × one test case (1) |

From repo root: `python -m pytest examples/v0.1.0/demo-agents/python/ -v [--folder NAME] [--test-case STEM]`
