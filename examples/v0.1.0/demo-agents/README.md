# Demo agents

Generic agents: `--folder` + `--test-case` (full stem) → AOM output. Same behavior in Python and Node; both have tests (all+all, 1+all, 1+1).

| Runtime | Path | Tests |
|---------|------|--------|
| Python | [python/](python/README.md) | pytest (`--folder`, `--test-case`) |
| Node | [node/](node/README.md) | node --test (env: `NODE_DEMO_FOLDER`, `NODE_DEMO_TEST_CASE`) |

**Run from repo root.**

- `--folder` is a path under `examples/`, e.g. `v0.1.0/login-single` → `examples/v0.1.0/login-single/outputs/`.
- `--test-case` is the full stem (e.g. `_login.success.output`), which resolves to either `<stem>.output.json` or, if that is missing, `<stem>.json.skip` for hand-edited outputs.
- Ensure `examples/<folder>/outputs/` exist (run create-outputs first).
