# E‑commerce checkout flow

Multi-step AOM example: **product → cart → shipping → payment → confirmation**. Five surfaces with shared `state.workflow` (`flow_id: ecom-checkout`, `step_id` step01–step05), `navigation.neighbors`, and A2H. Each step has its own `*.aom.json` and `outputs/`.

| Step | Surface | Purpose |
|------|---------|--------|
| step01 | `step01_product.aom.json` | View product, add to cart |
| step02 | `step02_cart.aom.json` | Review cart, proceed to shipping |
| step03 | `step03_shipping.aom.json` | Shipping address |
| step04 | `step04_payment.aom.json` | Payment; `place_order` has A2H policy (authorize) |
| step05 | `step05_confirmation.aom.json` | Order confirmation |

**Outputs:** Generated under each step’s `outputs/`. Use the [create-outputs](../../../tools/testing/README.md) tools to regenerate; see the [examples overview](../../README.md).

**Validate:** From repo root, `python aom.py validate all --examples-dir examples/v0.1.0` or this folder only: `python tools/python/validate/validate_all.py v0.1.0/ecom-flow` / `node tools/node/validate/validate_all.js v0.1.0/ecom-flow`.
