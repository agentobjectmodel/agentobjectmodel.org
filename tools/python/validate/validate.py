#!/usr/bin/env python3
"""
Generic JSON Schema validator used by the specialized validators:

- input:  AOM input surfaces  (spec/v0.1.0/aom-input-schema.json)
- output: AOM outputs         (spec/v0.1.0/aom-output-schema.json)
- site:   Site policy         (spec/v0.1.0/site-policy-schema.json)

Usage (internal; prefer the three wrappers):
  python validate.py <schema-path> <json-path>
"""

import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator

_SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = _SCRIPT_DIR.parent.parent.parent.parent


def load_json(path: Path):
    try:
        with path.open("r", encoding="utf-8-sig") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        # Make it very clear which file failed to parse.
        print(f"[FAIL] JSON parse error in {path}: {e}")
        sys.exit(1)


def main():
    args = sys.argv[1:]
    if len(args) != 2:
        print("Usage: python validate.py <schema-path> <json-path>")
        sys.exit(1)

    schema_path = Path(args[0]).resolve()
    json_path = Path(args[1]).resolve()

    if not schema_path.is_file():
        print(f"Schema file not found: {schema_path}")
        sys.exit(1)

    if not json_path.is_file():
        print(f"JSON file not found: {json_path}")
        sys.exit(1)

    schema = load_json(schema_path)
    data = load_json(json_path)

    validator = Draft202012Validator(schema)
    errors = sorted(validator.iter_errors(data), key=lambda e: e.path)

    if not errors:
        print(f"[OK] {json_path} is valid.")
        sys.exit(0)

    print(f"[FAIL] {json_path} is NOT valid:")
    for err in errors:
        path_list = list(err.path)
        path_str = ".".join(str(p) for p in path_list) or "<root>"
        print(f"- {path_str}: {err.message}")

        # Best-effort: show a small JSON snippet at the error location to help humans.
        try:
            node = data
            for p in path_list:
                node = node[p]
        except Exception:
            node = None

        if node is not None:
            try:
                snippet = json.dumps(node, indent=2, ensure_ascii=False)
            except TypeError:
                snippet = repr(node)
            if len(snippet) > 400:
                snippet = snippet[:397] + "..."
            print("  context:")
            for line in snippet.splitlines():
                print(f"    {line}")

    sys.exit(1)


if __name__ == "__main__":
    main()
