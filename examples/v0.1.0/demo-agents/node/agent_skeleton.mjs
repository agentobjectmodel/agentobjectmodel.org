#!/usr/bin/env node
/**
 * AOM agent skeleton — copy this file into your project and add your logic.
 * Reads an AOM input (surface) JSON, runs your agent, and writes an AOM output JSON.
 * No dependency on this repo; paths are explicit. Node 18+.
 *
 * Run: node agent_skeleton.mjs --input path/to/surface.aom.json [--output path/to/out.json]
 */
import fs from "fs";
import path from "path";

/**
 * Turn an AOM surface (input) into an AOM output.
 * Replace the body with your own logic (LLM, rules, browser automation, etc.).
 * @param {object} surface - AOM input (aom_version, surface_id, actions, tasks, ...)
 * @returns {object} AOM output (mode, action, meta, thought, result, ...)
 */
function runAgent(surface) {
  // ————— YOUR LOGIC HERE —————
  const actions = surface.actions || [];
  const firstActionId = actions.length ? (actions[0].id || "none") : "none";

  return {
    mode: "single",
    action: {
      action_id: firstActionId,
      params: {},
      priority: 5,
    },
    meta: {
      done: true,
      confidence: 0.9,
    },
    thought:
      "Skeleton: selected first available action. Replace with your logic.",
    result: { ok: true },
  };
}

function main() {
  const args = process.argv.slice(2);
  let inputPath = null;
  let outputPath = null;
  for (let i = 0; i < args.length; i++) {
    if ((args[i] === "--input" || args[i] === "-i") && args[i + 1]) {
      inputPath = path.resolve(args[++i]);
    } else if ((args[i] === "--output" || args[i] === "-o") && args[i + 1]) {
      outputPath = path.resolve(args[++i]);
    }
  }

  if (!inputPath) {
    console.error("Usage: node agent_skeleton.mjs --input FILE [--output FILE]");
    process.exit(1);
  }

  if (!fs.existsSync(inputPath) || !fs.statSync(inputPath).isFile()) {
    console.error("Error: input file not found:", inputPath);
    process.exit(1);
  }

  const surface = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const out = runAgent(surface);
  const json = JSON.stringify(out, null, 2);

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, json, "utf-8");
  } else {
    console.log(json);
  }
}

main();
