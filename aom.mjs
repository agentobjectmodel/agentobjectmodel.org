#!/usr/bin/env node
/**
 * Unified AOM CLI (Node flavor).
 *
 * Run from the agentobejctmodel.org repo root, for example:
 *
 *   node aom.mjs validate input --file examples/v0.1.0/login-single/login.aom.json
 *   node aom.mjs validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json
 *   node aom.mjs validate site --file .well-known/aom-policy.open.site.json
 *   node aom.mjs validate all --examples-dir examples/v0.1.0
 *   node aom.mjs create-outputs
 *   node aom.mjs demo run --lang node --folder v0.1.0/login-single --test-case _login.success.output
 *   node aom.mjs demo test
 */

import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname; // agentobejctmodel.org root

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: "inherit",
  });
  return result.status ?? 1;
}

function parseArgs() {
  const [, , command, subcommand, ...rest] = process.argv;
  return { command, subcommand, rest };
}

function getFlag(rest, name, fallback) {
  const idx = rest.indexOf(name);
  if (idx >= 0 && rest[idx + 1]) return rest[idx + 1];
  return fallback;
}

function main() {
  const { command, subcommand, rest } = parseArgs();

  if (command === "validate") {
    if (subcommand === "input") {
      const file = getFlag(rest, "--file");
      if (!file) {
        console.error("Missing required flag: --file");
        process.exit(1);
      }
      process.exit(run("node", ["tools/node/validate/validate_input.js", file]));
    }

    if (subcommand === "output") {
      const file = getFlag(rest, "--file");
      if (!file) {
        console.error("Missing required flag: --file");
        process.exit(1);
      }
      process.exit(run("node", ["tools/node/validate/validate_output.js", file]));
    }

    if (subcommand === "site") {
      const file = getFlag(rest, "--file");
      if (!file) {
        console.error("Missing required flag: --file");
        process.exit(1);
      }
      process.exit(run("node", ["tools/node/validate/validate_site.js", file]));
    }

    if (subcommand === "all") {
      const dir = getFlag(rest, "--examples-dir", "examples/v0.1.0");
      process.exit(run("node", ["tools/node/validate/validate_all.js", dir]));
    }
  }

  if (command === "create-outputs") {
    // Current implementation scans examples/ automatically.
    process.exit(run("node", ["tools/node/create-outputs/create_outputs.js"]));
  }

  if (command === "demo") {
    if (subcommand === "run") {
      const lang = getFlag(rest, "--lang", "node");
      const folder = getFlag(rest, "--folder");
      const testCase = getFlag(rest, "--test-case");
      if (!folder || !testCase) {
        console.error("Missing required flags: --folder and --test-case");
        process.exit(1);
      }

      if (lang === "python") {
        process.exit(
          run("python", [
            "examples/v0.1.0/demo-agents/python/demo_agent.py",
            "--folder",
            folder,
            "--test-case",
            testCase,
          ]),
        );
      }

      process.exit(
        run("node", [
          "examples/v0.1.0/demo-agents/node/demo_agent.js",
          "--folder",
          folder,
          "--test-case",
          testCase,
        ]),
      );
    }

    if (subcommand === "test") {
      const rc1 = run("python", [
        "-m",
        "pytest",
        "examples/v0.1.0/demo-agents/python",
        "-v",
      ]);
      const rc2 = run("node", [
        "examples/v0.1.0/demo-agents/node/run_tests.js",
      ]);
      process.exit(rc1 || rc2);
    }
  }

  console.error("Usage:");
  console.error("  node aom.mjs validate input --file <path>");
  console.error("  node aom.mjs validate output --file <path>");
  console.error("  node aom.mjs validate site --file <path>");
  console.error("  node aom.mjs validate all --examples-dir <dir>");
  console.error("  node aom.mjs create-outputs");
  console.error("  node aom.mjs demo run --lang python|node --folder <name> --test-case <name>");
  console.error("  node aom.mjs demo test");
  process.exit(1);
}

main();

