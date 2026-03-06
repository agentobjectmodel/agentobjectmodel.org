# Page-level policy templates

**What this folder is:** Copy-pasteable **AOM surfaces** that you publish **with a specific page** to declare that page’s agent automation policy. Each file is a minimal, valid AOM document (validates against the core schema in `spec/v0.1.0/aom-input-schema.json`). You serve or embed it as the AOM for that page so agents see the policy when they read the page’s surface.

**Page vs site:** This folder is for **page-level** policy only. For **site-level** policy (one JSON for the whole origin), use the [site policy templates](../../../spec/v0.1.0/templates/site-policy/) and serve the chosen file at `/.well-known/aom-policy.json`. Page policy overrides site policy when both exist.

| File | Policy | Use when |
|------|--------|----------|
| [aom-policy.forbidden.page.json](aom-policy.forbidden.page.json) | `automation_policy: "forbidden"` | This page must not be automated by agents. Publish this AOM with the page and show the no-automation logo. |

For **open** or **allowed** pages, use your own AOM (e.g. from [examples](../../)) or build one from the core schema; there is no separate page template for those in this folder.

**Validation:** Validate with `tools/node/validate` or `tools/python/validate` against `spec/v0.1.0/aom-input-schema.json` before deploying.
