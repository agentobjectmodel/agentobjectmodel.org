#!/usr/bin/env node
/**
 * Validate a site-level policy JSON using spec/v0.1.0/site-policy-schema.json.
 *
 * Usage (from repo root):
 *   node spec/v0.1.0/templates/site-policy/validators/node_validator.js <site-policy-json-path>
 */

import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ORG_ROOT = path.resolve(__dirname, "..", "..", "..", "..", "..");
const CORE_VALIDATOR = path.join(ORG_ROOT, "Tools", "node", "validate", "validate_site.js");

function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error("Usage: node spec/v0.1.0/templates/site-policy/validators/node_validator.js <site-policy-json-path>");
    process.exit(1);
  }

  const jsonPath = path.resolve(args[0]);
  const result = spawnSync(process.execPath, [CORE_VALIDATOR, jsonPath], {
    cwd: ORG_ROOT,
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

main();

