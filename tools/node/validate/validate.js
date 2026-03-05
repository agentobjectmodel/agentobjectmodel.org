#!/usr/bin/env node
/**
 * Generic JSON Schema validator used by the specialized validators:
 *
 * - input:  AOM input surfaces  (spec/v0.1.0/aom-input-schema.json)
 * - output: AOM outputs         (spec/v0.1.0/aom-output-schema.json)
 * - site:   Site policy         (spec/v0.1.0/site-policy-schema.json)
 *
 * Usage (internal; prefer the three wrappers):
 *   node validate.js <schema-path> <json-path>
 */
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

function loadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    console.error(`[FAIL] JSON parse error in ${p}: ${e.message}`);
    process.exit(1);
  }
}

const args = process.argv.slice(2);
if (!args[0] || !args[1]) {
  console.error("Usage: node validate.js <schema-path> <json-path>");
  process.exit(1);
}

const schemaPath = path.resolve(args[0]);
const jsonPath = path.resolve(args[1]);

if (!fs.existsSync(schemaPath) || !fs.statSync(schemaPath).isFile()) {
  console.error("Schema not found: " + schemaPath);
  process.exit(1);
}
if (!fs.existsSync(jsonPath) || !fs.statSync(jsonPath).isFile()) {
  console.error("JSON not found: " + jsonPath);
  process.exit(1);
}

const schema = loadJson(schemaPath);
const data = loadJson(jsonPath);
const ajv = new Ajv({ strict: false, allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

if (validate(data)) {
  console.log("[OK] " + jsonPath + " is valid.");
  process.exit(0);
}
console.error("[FAIL] " + jsonPath + " is NOT valid:");

function getNodeAtPath(root, instancePath) {
  if (!instancePath) return root;
  const parts = instancePath.split("/").slice(1); // skip leading empty segment
  let node = root;
  for (const part of parts) {
    if (node == null) return undefined;
    const key = Number.isInteger(Number(part)) && part !== "" ? Number(part) : part;
    node = node[key];
  }
  return node;
}

(validate.errors || [])
  .sort((a, b) => (a.instancePath || "").localeCompare(b.instancePath || ""))
  .forEach((e) => {
    const pathStr = e.instancePath || "<root>";
    console.error("- " + pathStr + ": " + e.message);
    const node = getNodeAtPath(data, e.instancePath || "");
    if (node !== undefined) {
      let snippet;
      try {
        snippet = JSON.stringify(node, null, 2);
      } catch {
        snippet = String(node);
      }
      if (snippet.length > 400) snippet = snippet.slice(0, 397) + "...";
      console.error("  context:");
      snippet.split("\n").forEach((line) => console.error("    " + line));
    }
  });
process.exit(1);
