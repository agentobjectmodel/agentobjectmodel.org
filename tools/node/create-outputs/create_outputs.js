#!/usr/bin/env node
/** Generate golden AOM output files. Same behavior as Python create-outputs. */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

function findExamplesDir() {
  for (const name of ["Examples", "examples"]) {
    const d = path.join(REPO_ROOT, name);
    if (fs.existsSync(d) && fs.statSync(d).isDirectory()) return d;
  }
  return null;
}

function findAllAomFiles() {
  const examplesDir = findExamplesDir();
  if (!examplesDir) return [[], null];
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return;
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (stat.isFile() && full.endsWith(".aom.json")) files.push(full);
    }
  }
  walk(examplesDir);
  return [files.sort(), examplesDir];
}

function baseName(surfacePath) {
  const stem = path.basename(surfacePath, path.extname(surfacePath));
  return stem.endsWith(".aom") ? stem.slice(0, -4) : stem;
}

function getA2hDefaults(aom) {
  const a2h = aom.a2h || {};
  return { confidence_threshold: a2h.confidence_threshold ?? 0.5, default_intent_type: a2h.default_intent_type ?? "ESCALATE", escalation_channel: a2h.escalation_channel ?? "in_app" };
}

function buildOutputFromAom(aom, opts) {
  const { success = true, errorMessage = null, expected = null, a2hIntent = null } = opts || {};
  const tasks = aom.tasks || [];
  const actions = aom.actions || [];
  let defaultActionId = "none";
  if (success && !a2hIntent && tasks.length && tasks[0].default_action_id) defaultActionId = tasks[0].default_action_id;
  else if (!a2hIntent && actions.length) defaultActionId = actions[0].id || "none";
  const action = { action_id: defaultActionId, params: {} };
  if (defaultActionId !== "none") action.priority = 5;
  const a2hDefaults = getA2hDefaults(aom);
  const threshold = a2hDefaults.confidence_threshold;
  let confidence = a2hIntent ? Math.max(0, threshold - 0.1) : (success && !errorMessage) ? (aom.a2h ? Math.min(1, threshold + 0.05) : 0.9) : (aom.a2h ? Math.max(0, threshold - 0.1) : 0.3);
  const meta = { done: success && !errorMessage && !a2hIntent, confidence };
  if (errorMessage) meta.error = { message: errorMessage };
  if (a2hIntent) meta.a2h_intent = a2hIntent;
  const payload = { mode: "single", action, meta };
  if (success && !errorMessage && !a2hIntent) { payload.thought = "Proceeding with default task action."; payload.result = { ok: true, ...(expected || {}) }; }
  else if (a2hIntent) payload.thought = payload.thought || "Confidence below threshold; handing over to human.";
  return payload;
}

function isHandEdited(outputPath) { return fs.existsSync(outputPath + ".skip"); }

function ensureOutputsForSurface(surfacePath, examplesDir, generateFailed) {
  const base = baseName(surfacePath);
  const sectionDir = path.dirname(surfacePath);
  const outputDir = path.join(sectionDir, "outputs");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const counts = { created: { success: 0, failed: 0, escalated: 0 }, skipped: { success: 0, failed: 0, escalated: 0 } };
  let aom;
  try { aom = JSON.parse(fs.readFileSync(surfacePath, "utf-8")); } catch (e) { console.error("  Error: " + surfacePath + " - " + e.message); return counts; }
  const testCases = (aom.signals && aom.signals.test_cases) || [];
  let successExpected = null;
  for (const tc of testCases) { if (tc.name === "success" && !(tc.errors && tc.errors.length)) { successExpected = tc.expected; break; } }
  const successPath = path.join(outputDir, "_" + base + ".success.output.json");
  if (isHandEdited(successPath)) { counts.skipped.success = 1; console.log("  Skip: " + path.relative(REPO_ROOT, successPath)); }
  else { fs.writeFileSync(successPath, JSON.stringify(buildOutputFromAom(aom, { success: true, expected: successExpected }), null, 2), "utf-8"); counts.created.success = 1; console.log("  Write: " + path.relative(REPO_ROOT, successPath)); }
  const a2hDefaults = getA2hDefaults(aom);
  for (const tc of testCases) {
    const tcName = tc.name || "unknown";
    const tcErrors = tc.errors || [];
    if (!tcErrors.length) continue;
    const errorMessage = tcErrors.join("; ");
    const a2hIntent = { type: tc.intent_type || a2hDefaults.default_intent_type, message: errorMessage, escalation_channel: tc.escalation_channel || a2hDefaults.escalation_channel };
    const failedPath = path.join(outputDir, base + "." + tcName + ".failed.output.json");
    if (isHandEdited(failedPath)) { counts.skipped.failed += 1; console.log("  Skip: " + path.relative(REPO_ROOT, failedPath)); }
    else { fs.writeFileSync(failedPath, JSON.stringify(buildOutputFromAom(aom, { success: false, errorMessage, a2hIntent }), null, 2), "utf-8"); counts.created.failed += 1; console.log("  Write: " + path.relative(REPO_ROOT, failedPath)); }
  }
  if (aom.a2h) {
    const a2hIntent = { type: a2hDefaults.default_intent_type, message: "Confidence below threshold. Please complete or verify the action.", escalation_channel: a2hDefaults.escalation_channel };
    const escalatedPath = path.join(outputDir, "_" + base + ".escalated.output.json");
    if (isHandEdited(escalatedPath)) { counts.skipped.escalated = 1; console.log("  Skip: " + path.relative(REPO_ROOT, escalatedPath)); }
    else { fs.writeFileSync(escalatedPath, JSON.stringify(buildOutputFromAom(aom, { success: false, a2hIntent }), null, 2), "utf-8"); counts.created.escalated = 1; console.log("  Write: " + path.relative(REPO_ROOT, escalatedPath)); }
  }
  return counts;
}

function main() {
  const [surfaces, examplesDir] = findAllAomFiles();
  console.log("REPO_ROOT: " + REPO_ROOT);
  if (examplesDir) console.log("EXAMPLES_DIR: " + path.relative(REPO_ROOT, examplesDir)); else console.log("EXAMPLES_DIR: (none)");
  console.log("Found " + surfaces.length + " AOM file(s):"); surfaces.forEach(p => console.log("  - " + path.relative(REPO_ROOT, p))); console.log("");
  if (!surfaces.length) { console.error("No *.aom.json found."); process.exit(1); }
  const summary = [];
  for (const surfacePath of surfaces) { console.log("Processing " + path.relative(REPO_ROOT, surfacePath)); summary.push([surfacePath, ensureOutputsForSurface(surfacePath, examplesDir, process.argv.includes("--failed"))]); }
  console.log("\n" + "=".repeat(60) + "\nSummary (per AOM file)\n" + "=".repeat(60));
  for (const [surfacePath, counts] of summary) { const c = counts.created; const s = counts.skipped; let line = "  " + path.basename(surfacePath) + ": created " + c.success + " success, " + c.failed + " failed, " + c.escalated + " escalated"; if (s.success + s.failed + s.escalated) line += "  |  skipped " + s.success + " success, " + s.failed + " failed, " + s.escalated + " escalated"; console.log(line); }
  console.log("=".repeat(60)); const totalC = summary.reduce((a, [, c]) => a + c.created.success + c.created.failed + c.created.escalated, 0); const totalS = summary.reduce((a, [, c]) => a + c.skipped.success + c.skipped.failed + c.skipped.escalated, 0); console.log("  Total: " + totalC + " created, " + totalS + " skipped\nDone."); }
main();
