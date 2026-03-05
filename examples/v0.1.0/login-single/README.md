# Login (single surface)

Single-screen AOM example: **login only**. One surface (`login.aom.json`) with entity `LoginCredentials`, a single `login` task and `submit_login` action, A2H, and many `signals.test_cases` (success plus error cases such as invalid credentials, account locked, rate limited).

This surface uses `automation_policy: "allowed"` (AOM Ready). It intentionally **does not** expose any password-reset tasks/actions in the AOM surface, so the agent can help users sign in but **cannot directly trigger password reset or change credentials**. Those flows, if present, are expected to be modeled as separate, higher-risk surfaces with stricter policy/A2H.

**Outputs:** Generated under `outputs/` (success, per–test-case failed, escalated). Use the [create-outputs](../../../Tools/testing/README.md) tools to regenerate; see the [examples overview](../../README.md).

**Validate:** From repo root, `python aom.py validate all --examples-dir examples/v0.1.0` or this folder only: `python Tools/python/validate/validate_all.py v0.1.0/login-single` / `node Tools/node/validate/validate_all.js v0.1.0/login-single`.
