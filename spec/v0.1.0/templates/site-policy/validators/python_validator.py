#!/usr/bin/env python3
"""
Validate a site-level policy JSON using spec/v0.1.0/site-policy-schema.json.

Usage (from repo root):
  python spec/v0.1.0/templates/site-policy/validators/python_validator.py <site-policy-json-path>
"""

from pathlib import Path
import sys

import json
from jsonschema import Draft202012Validator


SCHEMA_PATH = Path(__file__).resolve().parents[3] / "site-policy-schema.json"


def _load_json(path: Path):
  with path.open("r", encoding="utf-8-sig") as f:
    return json.load(f)


def main():
  if len(sys.argv) != 2:
    print("Usage: python spec/v0.1.0/templates/site-policy/validators/python_validator.py <site-policy-json-path>")
    sys.exit(1)

  json_path = Path(sys.argv[1]).resolve()
  if not SCHEMA_PATH.is_file():
    print(f"Schema not found: {SCHEMA_PATH}")
    sys.exit(1)
  if not json_path.is_file():
    print(f"JSON not found: {json_path}")
    sys.exit(1)

  schema = _load_json(SCHEMA_PATH)
  data = _load_json(json_path)

  validator = Draft202012Validator(schema)
  errors = sorted(validator.iter_errors(data), key=lambda e: e.path)

  if not errors:
    print(f"[OK] {json_path} is valid against site-policy-schema.json")
    sys.exit(0)

  print(f"[FAIL] {json_path} is NOT valid:")
  for err in errors:
    path_str = ".".join(str(p) for p in err.path) or "<root>"
    print(f"- {path_str}: {err.message}")

  sys.exit(1)


if __name__ == "__main__":
  main()

