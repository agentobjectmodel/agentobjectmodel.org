#!/usr/bin/env node
/**
 * Validate AOM examples against their schemas. Optionally restrict to one folder.
 * Usage: node validate_all.js [folder]
 */

import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const VALIDATOR = path.join(__dirname, "validate.js");

function getSchemasDir() {
  const specV = path.join(REPO_ROOT, "spec", "v0.1.0");
  if (fs.existsSync(specV) && fs.statSync(specV).isDirectory()) return specV;
  return specV;
}

function examplesRoot() {
  for (const name of ["Examples", "examples"]) {
    const d = path.join(REPO_ROOT, name);
    if (fs.existsSync(d) && fs.statSync(d).isDirectory()) return d;
  }
  return path.join(REPO_ROOT, "Examples");
}

function globRecursive(dir, suffix) {
  const results = [];
  function walk(d) {
    if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()) return;
    for (const name of fs.readdirSync(d)) {
      const full = path.join(d, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (stat.isFile() && full.endsWith(suffix)) results.push(full);
    }
  }
  walk(dir);
  return results.sort();
}

function runValidator(schemaPath, jsonPath) {
  const result = spawnSync(process.execPath, [VALIDATOR, schemaPath, jsonPath], {
    cwd: REPO_ROOT,
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return { status: result.status, stderr: result.stderr || "" };
}

function main() {
  const examplesRootDir = examplesRoot();
  let searchRoot;

  if (process.argv.length >= 3) {
    const folderArg = process.argv[2].trim().replace(/\\/g, "/");
    if (path.isAbsolute(folderArg)) {
      searchRoot = path.resolve(folderArg);
    } else {
      const candidates = [
        path.resolve(examplesRootDir, folderArg),
        path.resolve(REPO_ROOT, folderArg),
      ];
      if (folderArg.includes("/") && folderArg.toLowerCase().startsWith("examples/")) {
        const rest = folderArg.split("/").slice(1).join(path.sep);
        candidates.push(path.resolve(REPO_ROOT, path.basename(examplesRootDir), rest));
      }
      searchRoot = null;
      for (const c of candidates) {
        if (fs.existsSync(c) && fs.statSync(c).isDirectory()) {
          searchRoot = c;
          break;
        }
      }
      if (searchRoot === null) searchRoot = candidates[0];
    }
    if (!fs.existsSync(searchRoot) || !fs.statSync(searchRoot).isDirectory()) {
      console.error("Folder not found: " + searchRoot);
      process.exit(1);
    }
    console.log("Validating only: " + path.relative(REPO_ROOT, searchRoot) + "\n");
  } else {
    searchRoot = examplesRootDir;
    console.log("Validating all examples under: " + path.relative(REPO_ROOT, searchRoot) + "\n");
  }

  const aomFiles = globRecursive(searchRoot, ".aom.json");
  const outputFiles = globRecursive(searchRoot, ".output.json");
  const skipFiles = globRecursive(searchRoot, ".output.json.skip");

  console.log("Found " + aomFiles.length + " AOM surface(s), " + (outputFiles.length + skipFiles.length) + " output(s)\n");

  const SCHEMAS = getSchemasDir();
  const coreSchema = path.join(SCHEMAS, "aom-input-schema.json");
  const outputSchema = path.join(SCHEMAS, "aom-output-schema.json");
  if (!fs.existsSync(coreSchema) || !fs.statSync(coreSchema).isFile()) {
    console.error("Schema not found: " + coreSchema);
    process.exit(1);
  }

  const failures = [];

  console.log("aom-input-schema.json");
  for (const f of aomFiles) {
    const rel = path.relative(REPO_ROOT, f).replace(/\\/g, "/");
    const { status, stderr } = runValidator(coreSchema, f);
    if (status !== 0) {
      console.log("[FAIL] " + rel);
      failures.push({ kind: "input", rel, stderr });
    } else {
      console.log("[OK] " + rel);
    }
  }

  console.log("\naom-output-schema.json");
  for (const f of [...outputFiles, ...skipFiles]) {
    const rel = path.relative(REPO_ROOT, f).replace(/\\/g, "/");
    const { status, stderr } = runValidator(outputSchema, f);
    if (status !== 0) {
      console.log("[FAIL] " + rel);
      failures.push({ kind: "output", rel, stderr });
    } else {
      console.log("[OK] " + rel);
    }
  }

  if (failures.length) {
    console.log("\nSummary of failed files:");
    const inputFailures = failures.filter((f) => f.kind === "input");
    const outputFailures = failures.filter((f) => f.kind === "output");

    if (inputFailures.length) {
      console.log("  Input surfaces (aom.json):");
      for (const { rel, stderr } of inputFailures) {
        console.log("    - " + rel);
        if (stderr) {
          console.log("      details:");
          stderr
            .trim()
            .split("\n")
            .forEach((line) => console.log("        " + line));
        }
      }
    }

    if (outputFailures.length) {
      console.log("  Outputs (output.json / output.json.skip):");
      for (const { rel, stderr } of outputFailures) {
        console.log("    - " + rel);
        if (stderr) {
          console.log("      details:");
          stderr
            .trim()
            .split("\n")
            .forEach((line) => console.log("        " + line));
        }
      }
    }

    process.exit(1);
  }

  console.log("\nAll valid!");
}

main();
