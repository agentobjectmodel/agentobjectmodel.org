# AOM™ logos and badges

This directory is the placeholder for official AOM™ logo and badge assets. Final SVG/PNG assets will be published at [agentobjectmodel.org](https://agentobjectmodel.org) and may be added here. The spec is the single place that defines **meaning** and **usage**; this README summarizes both.

---

## No-automation logo

**Purpose:** On-screen display meaning "no AI or agent automation allowed" on this page or site.

**Machine-readable equivalent:** Set `automation_policy: "forbidden"` in the AOM surface, or omit AOM entirely for that page. Agents must not automate when they see this policy or when no AOM is present.

**Usage:**
- **Placement:** Footer, header, or near forms where the policy applies. Often shown at page or site level.
- **Recommended display sizes:** 16x16, 32x32, 64x64 (px), adjusted via CSS or `width` / `height` on a single SVG/PNG asset.
- **Format:** one SVG (preferred for scaling) and one PNG fallback per badge, published under `static/aom-badges/`. Both have transparent backgrounds; see [USAGE.md](USAGE.md) for rendering and theme-aware usage. A [badge-test.html](badge-test.html) theme test and template is in this directory.

**Guidelines:** Use only for pages/sites that intend to forbid agent automation. Do not use on pages that expose AOM with `automation_policy: "allowed"` or `"open"`. MVP supports only three policies: allowed, forbidden, open.

---

## Asset status

- **No-automation and other badges:** Logo designs and files are published at https://agentobjectmodel.org under `static/aom-badges/`; usage guidelines above are authoritative.
- **Updates:** When assets change, this README and `static/USAGE.md` will be updated with file names and formats. Discussion and final asset specs: https://agentobjectmodel.org (community and standards).
