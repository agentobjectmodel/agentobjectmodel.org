#!/usr/bin/env node
/**
 * Validate an AOM input surface (aom-input-schema.json).
 *
 * Usage:
 *   node Tools/node/validate/validate_input.js <aom-json-path>
 */

import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const CORE_VALIDATOR = path.join(__dirname, "validate.js");
const SCHEMA = path.join(REPO_ROOT, "spec", "v0.1.0", "aom-input-schema.json");

function main() {
  const args = process.argv.slice(2);
  if (!args[0]) {
    console.error("Usage: node Tools/node/validate/validate_input.js <aom-json-path>");
    process.exit(1);
  }

  const jsonPath = path.resolve(args[0]);
  const result = spawnSync(process.execPath, [CORE_VALIDATOR, SCHEMA, jsonPath], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });
  process.exit(result.status ?? 1);
}

main();

