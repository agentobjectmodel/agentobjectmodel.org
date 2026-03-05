/**
 * Node demo agent tests. Scope via env (set by run_tests.js when you pass --folder / --test-case).
 * Run: node run_tests.js [--folder NAME] [--test-case STEM]
 *   or: npm test [-- --folder NAME] [-- --test-case STEM]  (npm test uses run_tests.js)
 */

import { describe, it } from "node:test";
import assert from "node:assert";
import { run, listFolders, listTestCases, resolveTestCase } from "./demo_agent.js";

const optFolder = process.env.NODE_DEMO_FOLDER?.trim() || null;
const optTestCase = process.env.NODE_DEMO_TEST_CASE?.trim() || null;

function getPairs() {
  if (optFolder && optTestCase) {
    const resolved = resolveTestCase(optFolder, optTestCase);
    if (resolved) return [[optFolder, resolved]];
    return []; // invalid folder or test case → 0 tests, 0 passed
  }
  if (optFolder) {
    if (!listFolders().includes(optFolder)) return [];
    return listTestCases(optFolder).map((tc) => [optFolder, tc]);
  }
  const pairs = [];
  for (const f of listFolders()) {
    for (const tc of listTestCases(f)) pairs.push([f, tc]);
  }
  return pairs;
}

describe("demo_agent", () => {
  for (const [folder, testCase] of getPairs()) {
    it(`${folder} :: ${testCase} returns valid structure`, () => {
      const out = run({ folder, test_case: testCase });
      assert.ok(out.meta, "has meta");
      assert.strictEqual(typeof out.meta.done, "boolean", "meta.done is boolean");
      if (out.meta.done) {
        assert.ok(out.result, "has result when done");
      } else {
        assert.ok(out.meta.error?.message || out.meta.a2h_intent, "has error or a2h_intent when not done");
      }
    });
  }
});
