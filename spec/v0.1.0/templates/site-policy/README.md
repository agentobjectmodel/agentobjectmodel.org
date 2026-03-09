# Site-level policy templates

**What this folder is:** Three JSON files that declare the default agent automation policy for a whole origin / site. You copy one to your server and serve it at `/.well-known/aom-policy.json` (e.g. `https://www.agentobjectmodel.org/.well-known/aom-policy.open.site.json`). Agents use it as the site-wide default; per-page AOM™ can override it.

**Spec:** Format and behavior: [well-known-policy.md](../../../well-known-policy.md). For a more detailed markdown explainer (including examples and agent behavior), see [`.well-known/.well-known.md`](.well-known/.well-known.md).

| Template | automation | Use when |
|----------|------------|----------|
| [.well-known/aom-policy.forbidden.site.json](.well-known/aom-policy.forbidden.site.json) | forbidden | No agent automation on this origin. |
| [.well-known/aom-policy.allowed.site.json](.well-known/aom-policy.allowed.site.json) | allowed | Agents may use surfaces when present. |
| [.well-known/aom-policy.open.site.json](.well-known/aom-policy.open.site.json) | open | Origin publishes AOM in the open by default. |

**Before deploying:** Set `expires` (ISO 8601). Serve the chosen file at `root/.well-known/` at your origin root.
