#!/usr/bin/env python3
"""Validate AOM examples against their schemas. Optionally restrict to one folder."""

import glob
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
VALIDATOR = Path(__file__).resolve().parent / "validate.py"
SCHEMAS = REPO_ROOT / "spec" / "v0.1.0"


def _examples_root():
    for name in ("Examples", "examples"):
        d = REPO_ROOT / name
        if d.is_dir():
            return d
    return REPO_ROOT / "Examples"


def _run_validation(schema_path: Path, files: list[str], kind: str, failures: list[dict]):
    """Run the generic validator for each file, but do not stop on first failure.

    Accumulates failures in `failures` as dicts: {"kind", "rel", "details"}.
    """
    for f in files:
        cmd = f'python "{VALIDATOR}" "{schema_path}" "{f}"'
        result = subprocess.run(cmd, shell=True, cwd=REPO_ROOT, capture_output=True, text=True)
        rel = Path(f).resolve().relative_to(REPO_ROOT).as_posix()
        if result.returncode != 0:
            print(f"[FAIL] {rel}")
            details = (result.stdout or "") + (result.stderr or "")
            failures.append({"kind": kind, "rel": rel, "details": details})
        else:
            print(f"[OK] {rel}")


def main():
    examples_root = _examples_root()
    if len(sys.argv) >= 2:
        folder_arg = sys.argv[1].strip().replace("\\", "/")
        if Path(folder_arg).is_absolute():
            search_root = Path(folder_arg)
        else:
            candidates = [
                (examples_root / folder_arg).resolve(),
                (REPO_ROOT / folder_arg).resolve(),
            ]
            if "/" in folder_arg and folder_arg.lower().startswith("examples/"):
                rest = folder_arg.split("/", 1)[1]
                candidates.append((REPO_ROOT / examples_root.name / rest).resolve())
            search_root = None
            for c in candidates:
                if c.is_dir():
                    search_root = c
                    break
            if search_root is None:
                search_root = candidates[0]
        if not search_root.is_dir():
            print(f"[FAIL] Folder not found: {search_root}")
            sys.exit(1)
        print(f"Validating only: {search_root.relative_to(REPO_ROOT)}\n")
    else:
        search_root = examples_root
        print(f"Validating all examples under: {search_root.relative_to(REPO_ROOT)}\n")

    aom_glob = str(search_root / "**" / "*.aom.json")
    out_glob = str(search_root / "**" / "*.output.json")
    skip_glob = str(search_root / "**" / "*.output.json.skip")
    aom_files = sorted(glob.glob(aom_glob, recursive=True))
    output_files = sorted(glob.glob(out_glob, recursive=True))
    skip_files = sorted(glob.glob(skip_glob, recursive=True))
    output_files = output_files + skip_files

    print(f"Found {len(aom_files)} AOM surface(s), {len(output_files)} output(s)\n")

    core_schema = SCHEMAS / "aom-input-schema.json"
    output_schema = SCHEMAS / "aom-output-schema.json"
    if not core_schema.is_file():
        print("Schema not found:", core_schema)
        sys.exit(1)

    failures: list[dict] = []

    print("aom-input-schema.json")
    _run_validation(core_schema, aom_files, "input", failures)

    print("\naom-output-schema.json")
    _run_validation(output_schema, output_files, "output", failures)

    if failures:
        print("\nSummary of failed files:")
        input_failures = [f for f in failures if f["kind"] == "input"]
        output_failures = [f for f in failures if f["kind"] == "output"]

        if input_failures:
            print("  Input surfaces (aom.json):")
            for f in input_failures:
                print(f"    - {f['rel']}")
                details = (f.get("details") or "").strip()
                if details:
                    print("      details:")
                    for line in details.splitlines():
                        print(f"        {line}")

        if output_failures:
            print("  Outputs (output.json / output.json.skip):")
            for f in output_failures:
                print(f"    - {f['rel']}")
                details = (f.get("details") or "").strip()
                if details:
                    print("      details:")
                    for line in details.splitlines():
                        print(f"        {line}")

        sys.exit(1)

    print("\nAll valid!")


if __name__ == "__main__":
    main()
