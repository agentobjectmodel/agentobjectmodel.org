# Well-known AOM policy (site-level)

**Definition.** The well-known AOM policy is a JSON document served at a fixed path on an origin. It declares the **default agent automation policy** for that origin. Agents that implement this mechanism **MUST** respect it for the origin.

**URL.** `/.well-known/aom-policy.json` at the origin (e.g. `https://example.com/.well-known/aom-policy.json`). **Content-Type:** `application/json`.

---

## Fields

| Field | Type | Values | Meaning |
|-------|------|--------|---------|
| `automation_policy` | string | `"forbidden"` \| `"allowed"` \| `"open"` | Default policy for this origin. See below. |
| `aom_version` | string | e.g. `"0.1.0"` | Format version. Optional; recommended for compatibility. |
| `expires` | string | ISO 8601 date-time | When the policy is stale. Optional. If present and in the past, agents SHOULD re-fetch or treat as invalid. |

Unknown fields **MUST** be ignored by agents.

**Meaning of `automation_policy`:**
- **`forbidden`** — No agent automation on this origin unless a per-page AOM overrides it.
- **`allowed`** — Agents may use surfaces when present.
- **`open`** — This origin publishes AOM in the open by default.

---

## Agent behavior

- **Present and valid:** Apply the policy for the origin.
- **`expires` in the past:** Treat as stale; re-fetch or fall back to per-page AOM / no automation for this origin.
- **Absent (e.g. 404) or invalid:** No site-level policy; rely on per-page AOM or absence of AOM.
- **Page override:** If the agent has both this resource and a per-page AOM surface, the **page** `automation_policy` takes precedence for that page.

---

## Templates (site-level only)

Use one of these as the content for `/.well-known/aom-policy.json`:

| Policy | Template |
|--------|----------|
| Forbidden | [v0.1.0/templates/site-policy/.well-known/aom-policy.forbidden.site.json](v0.1.0/templates/site-policy/.well-known/aom-policy.forbidden.site.json) |
| Allowed | [v0.1.0/templates/site-policy/.well-known/aom-policy.allowed.site.json](v0.1.0/templates/site-policy/.well-known/aom-policy.allowed.site.json) |
| Open | [v0.1.0/templates/site-policy/.well-known/aom-policy.open.site.json](v0.1.0/templates/site-policy/.well-known/aom-policy.open.site.json) |

Update `expires` and optionally `aom_version` before deploying.
