#!/usr/bin/env node
/**
 * Demo agent: generic consumer of AOM example outputs.
 * Input: --folder, --test-case (full stem from listTestCases(folder)).
 * Output: AOM output JSON (examples/<folder>/outputs/*.output.json).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Repo root is four levels up: examples/v0.1.0/demo-agents/node -> ... -> repo root
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");

function examplesDir() {
  for (const name of ["Examples", "examples"]) {
    const d = path.join(REPO_ROOT, name);
    if (fs.existsSync(d) && fs.statSync(d).isDirectory()) return d;
  }
  return path.join(REPO_ROOT, "examples");
}

function outputsDir(folder) {
  const norm = folder.replace(/^[/\\]+|[/\\]+$/g, "");
  return path.join(examplesDir(), norm, "outputs");
}

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function listFolders() {
  const ex = examplesDir();
  if (!fs.existsSync(ex) || !fs.statSync(ex).isDirectory()) return [];
  const folders = new Set();

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    // If this dir has an outputs/ child with *.output.json, record it
    const outputsChild = entries.find((e) => e.isDirectory() && e.name === "outputs");
    if (outputsChild) {
      const outDir = path.join(dir, outputsChild.name);
      try {
        if (fs.readdirSync(outDir).some((f) => f.endsWith(".output.json"))) {
          const rel = path.relative(ex, dir).replace(/\\/g, "/");
          if (rel && !rel.split("/").some((p) => p.startsWith(".") || p === "demo-agents")) {
            folders.add(rel);
          }
        }
      } catch (_) {}
    }

    // Recurse into child directories (excluding outputs/ itself and demo-agents/ or hidden folders)
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name === "outputs" || entry.name === "demo-agents" || entry.name.startsWith(".")) continue;
      walk(path.join(dir, entry.name));
    }
  }

  walk(ex);
  return [...folders].sort();
}

export function listTestCases(folder) {
  const outDir = outputsDir(folder);
  if (!fs.existsSync(outDir) || !fs.statSync(outDir).isDirectory()) return [];
  const cases = new Set();
  for (const name of fs.readdirSync(outDir)) {
    if (name.endsWith(".output.json")) cases.add(path.basename(name, ".json"));
    if (name.endsWith(".output.json.skip")) cases.add(path.basename(path.basename(name, ".skip"), ".json")); // stem e.g. _login.escalated.output
  }
  return [...cases].sort();
}

function resolveOutputPath(outDir, testCase) {
  const t = String(testCase).trim();
  const p1 = path.join(outDir, t + ".json");
  if (fs.existsSync(p1) && fs.statSync(p1).isFile()) return p1;
  const p2 = path.join(outDir, t + ".output.json");
  if (fs.existsSync(p2) && fs.statSync(p2).isFile()) return p2;
  // Fallback for hand-edited outputs that only exist as .output.json.skip markers
  const p3 = path.join(outDir, t + ".json.skip");
  if (fs.existsSync(p3) && fs.statSync(p3).isFile()) return p3;
  return null;
}

/**
 * Resolve a folder + test_case (exact or prefix) to a full stem, or null if invalid.
 * Use to validate before adding to test set (0 tests when invalid).
 */
export function resolveTestCase(folder, testCase) {
  if (!folder || !testCase) return null;
  const folderNorm = folder.replace(/^[/\\]+|[/\\]+$/g, "");
  const folders = listFolders();
  if (!folders.includes(folderNorm)) return null;
  const cases = listTestCases(folderNorm);
  if (cases.length === 0) return null;
  const t = String(testCase).trim();
  if (cases.includes(t)) return t;
  const match = cases.filter((c) => c.startsWith(t + "."));
  return match.length === 1 ? match[0] : null;
}

/**
 * @param {{ folder: string, test_case: string }} opts
 * @returns {object} AOM output
 */
export function run(opts = {}) {
  const { folder, test_case: testCase } = opts;
  if (!folder || !testCase) throw new Error("folder and test_case are required");
  const folderNorm = folder.replace(/^[/\\]+|[/\\]+$/g, "");
  const outDir = outputsDir(folderNorm);
  if (!fs.existsSync(outDir) || !fs.statSync(outDir).isDirectory()) {
    throw new Error(`Outputs dir not found: ${outDir}. Run: node aom.mjs create-outputs`);
  }
  const cases = listTestCases(folderNorm);
  if (cases.length === 0) {
    throw new Error(`No output files in ${outDir}. Run: node aom.mjs create-outputs`);
  }
  const resolved = resolveTestCase(folderNorm, testCase);
  const filePath = resolved ? resolveOutputPath(outDir, resolved) : null;
  if (!filePath) throw new Error(`Unknown test_case or missing output file: ${testCase}`);
  return loadJson(filePath);
}

function main() {
  const args = process.argv.slice(2);
  let folder = null;
  let testCase = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--folder" && args[i + 1]) {
      folder = args[++i];
    } else if (args[i] === "--test-case" && args[i + 1]) {
      testCase = args[++i];
    }
  }
  try {
    if (!folder || !testCase) {
      console.error("Usage: node demo_agent.js --folder NAME --test-case STEM");
      process.exit(1);
    }
    const out = run({ folder, test_case: testCase });
    console.log(JSON.stringify(out, null, 2));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith("demo_agent.js")) {
  main();
}
