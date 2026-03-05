# Node · Create outputs

Generates golden AOM output JSON for testing. Same behavior as [Python create-outputs](../../python/create-outputs/README.md). Outputs conform to `spec/v0.1.0/aom-output-schema.json` (see `spec/v0.1.0/README.md`). Run **from the repository root**.

**Requirements:** Node 18+ (no dependencies).

## Usage

```bash
node aom.mjs create-outputs
# or (script-level)
node Tools/node/create-outputs/create_outputs.js
```

Optional: `--failed` is accepted for compatibility.

## Output files

| Type      | Filename pattern                              | When                        |
|-----------|-----------------------------------------------|-----------------------------|
| Success   | `_<base>.success.output.json`                | Always (one per surface).  |
| Failed    | `<base>.<test_case_name>.failed.output.json`  | One per error test case.   |
| Escalated | `_<base>.escalated.output.json`               | When the surface has `a2h`.|

## Protecting hand-edited files

Create a **skip marker**: same name as the output file plus `.skip` (e.g. `_login.success.output.json.skip`). The script will not overwrite that output and will include it in the summary as skipped.

At the end of the run, a **summary** lists per AOM file how many outputs were created and skipped, plus totals. See [Tools/testing/README.md](../../testing/README.md) for an overview.
