# AOM™ Policy Badges – Usage Guide

The AOM™ policy badges are **official visual indicators** for the
`automation_policy` field in AOM/ASM surfaces.

Badges are optional for UIs (web + mobile).  
Agents MUST rely on the JSON `automation_policy` value as the source of truth.

---

## Badge mapping

Use these badges according to your AOM automation policy:

- `automation_policy = "forbidden"`
  - Use the **No Automation** badge.

- `automation_policy = "allowed"`
  - Optionally use the **AOM™ Ready** badge.

- `automation_policy = "open"`
  - Use the **AOM™ Open** badge (recommended for public, agent-friendly surfaces).

---

## Canonical asset URLs

Each badge has two canonical assets:

- **SVG (preferred)**: crisp at any size, best for modern browsers.
- **PNG**: fallback for environments that don’t support SVG.

### No Automation

```text
https://www.agentobjectmodel.org/static/aom-badges/no-automation/aom-no-automation.png
https://www.agentobjectmodel.org/static/aom-badges/no-automation/aom-no-automation.svg
```

### AOM™ Ready (allowed)

```text
https://www.agentobjectmodel.org/static/aom-badges/ready/aom-ready.png
https://www.agentobjectmodel.org/static/aom-badges/ready/aom-ready.svg
```

### AOM™ Open

```text
https://www.agentobjectmodel.org/static/aom-badges/open/aom-open.png
https://www.agentobjectmodel.org/static/aom-badges/open/aom-open.svg
```

You may reference these URLs directly or host copies on your own domain.

---

## How to use (HTML)

### No Automation (forbidden)

```html
<img src="https://www.agentobjectmodel.org/static/aom-badges/no-automation/aom-no-automation.svg"
     alt="No Automation (AOM)" width="48" height="48">
```

### AOM™ Ready (allowed)

```html
<img src="https://www.agentobjectmodel.org/static/aom-badges/ready/aom-ready.svg"
     alt="Agent automation allowed (AOM Ready)" width="48" height="48">
```

### AOM™ Open

```html
<img src="https://www.agentobjectmodel.org/static/aom-badges/open/aom-open.svg"
     alt="Open automation surface (AOM Open)" width="48" height="48">
```

---

## Rendering and transparency

Badge SVGs and PNGs have **transparent backgrounds**. Transparent areas show whatever is behind the image (e.g. your page or card background).

- **Default:** Use the `<img>` examples above as-is; transparent regions will show the underlying background.
- **Theme-aware (light/dark):** To make the badge visually sit on a specific surface (e.g. a card), set the image’s background to match that surface. Example:

```css
.card img[src*="aom-badges"][src$=".svg"] {
  background: var(--card-bg);   /* or your card/surface color */
  border-radius: 50%;           /* optional: round clip for circular badges */
}
```

Use a single asset; no need for separate “light” and “dark” badge files.

A **theme test and copy-paste template** is in this directory: [badge-test.html](badge-test.html). Open it locally to verify light/dark rendering and reuse the card, theme toggle, and CSS pattern in your own pages.

---

## Mobile / compact usage

For mobile headers or compact UIs, use the same SVG with a smaller size:

```html
<div class="header">
  <h1>Checkout</h1>
  <img src="https://www.agentobjectmodel.org/static/aom-badges/open/aom-open.svg"
       alt="AOM Open" width="32" height="32">
</div>
```

You can also place badges near primary actions:

```html
<button class="primary">
  Submit Order
  <img src="https://www.agentobjectmodel.org/static/aom-badges/ready/aom-ready.svg"
       alt="AOM Ready" width="16" height="16">
</button>
```

---

## Automation policy vs. badge

- **Required for agents**: the `automation_policy` field in your AOM JSON.
- **Optional for humans**: the badges above, rendered in your HTML / app UI.

Agents MUST honor `automation_policy` even if no badge is shown.  
Badges are for human reassurance and quick visual scanning.

---