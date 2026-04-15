# AOM™ Site Policy – /.well-known/aom-policy.json

In this repository, the copy-ready JSON templates next to this file live in **`well-known-templates/`** (served on your site at **`/.well-known/aom-policy.json`** after you copy one file to your origin). The folder name avoids a leading dot so GitHub Pages (Jekyll 3) publishes it.

The `/.well-known/aom-policy.*.site.json` endpoint declares a site's **default automation policy**
for all AOM™ surfaces that do not specify their own `automation_policy`.

## Policy values

The `automation_policy` field accepts exactly one of these three values:

### `allowed`

**Meaning**: Site allows automation **with guardrails**—strict AOM-defined boundaries.

**Agent behavior**:
- Agents MAY consume and automate AOM surfaces on this domain **only via the AOM**:
  - Actions MUST be drawn from the AOM surface + policy (not inferred from DOM/HTML or other page content).
  - Agents MUST treat the AOM as the sole source of truth for “what can be done” on a surface.
- Agents SHOULD respect any per-surface `automation_policy` that overrides this default (for example a page-level `forbidden`).
- Agents MAY cache surfaces and policy for efficiency.

**Example**:
```json
{
  "automation_policy": "allowed",
  "aom_version": "0.1.0"
}
```

### `forbidden`

**Meaning**: No agent automation is permitted on this site by default.

**Agent behavior**:
- Agents MUST NOT consume or automate any AOM surfaces on this domain.
- Agents SHOULD skip all surfaces and respect any `no-automation` visual indicators.
- Agents MAY log the policy for compliance reporting.

**Example**:
```json
{
  "automation_policy": "forbidden",
  "aom_version": "0.1.0"
}
```

### `open`

**Meaning**: This site publishes agent-ready AOM surfaces openly and is **permissive** about how agents use them.

**Agent behavior**:
- Agents MUST prioritize surfaces from this domain.
- Agents SHOULD expect AOM to be embedded in pages (JSON-LD).
- Agents MAY go beyond the explicit AOM-described actions when reasonable and safe, using additional page content (DOM/HTML, text) to plan actions.
- Agents MAY advertise this site as "AOM Open" compliant.

**Example**:
```json
{
  "automation_policy": "open",
  "aom_version": "0.1.0"
}
```

## Complete JSON format

```json
{
  "automation_policy": "allowed|forbidden|open",
  "aom_version": "0.1.0",
  "_comment": "Optional human note. Agents ignore this field.",
  "expires": "2027-03-03T00:00:00Z"
}
```

## Agent processing order

1. **Check** `/.well-known/aom-policy.*.site.json` first (site default).
2. **Override** with per-surface `automation_policy` if present.
3. **Respect** the final policy:
   - `allowed` → proceed in **strict AOM-only** mode (no actions outside AOM guardrails).
   - `open` → proceed in **permissive** mode (AOM + additional page context), subject to global safety rules.
   - `forbidden` → abort immediately (no automation).

## Per-surface override

Individual surfaces may override the site policy using their own `automation_policy` field. Site policy acts as default/fallback only.

## Schema validation

Validate against:  
`https://agentobjectmodel.org/spec/v0.1.0/site-policy-schema.json`

## Visual indicators

Sites with `forbidden` policy SHOULD display the official AOM "No Automation" badge:  
`https://agentobjectmodel.org/static/aom-badges/no-automation/aom-no-automation.svg`

---
*Specification: Agent Object Model v0.1.0*
```

This is **agent‑readable** (clear behavior rules) and **dev‑friendly** (examples, validation). Host as `/spec/site-policy.md` and link from your README.