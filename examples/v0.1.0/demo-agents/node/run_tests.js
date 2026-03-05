#!/usr/bin/env node
/**
 * Runner for demo agent tests. Parses --folder and --test-case, then runs node --test.
 * Usage: node run_tests.js [--folder NAME] [--test-case STEM]
 *   (no args = all+all; --folder only = 1+all; both = 1+1)
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
let folder = null;
let testCase = null;
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--folder" && argv[i + 1]) {
    folder = argv[++i].trim();
  } else if (argv[i] === "--test-case" && argv[i + 1]) {
    testCase = argv[++i].trim();
  }
}

const env = { ...process.env };
if (folder) env.NODE_DEMO_FOLDER = folder;
else delete env.NODE_DEMO_FOLDER;
if (testCase) env.NODE_DEMO_TEST_CASE = testCase;
else delete env.NODE_DEMO_TEST_CASE;

const child = spawn(
  process.execPath,
  ["--test", path.join(__dirname, "demo_agent.test.js")],
  { stdio: "inherit", env, cwd: __dirname }
);
child.on("close", (code) => process.exit(code ?? 0));
