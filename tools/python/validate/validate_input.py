#!/usr/bin/env python3
"""
Validate an AOM input surface (aom-input-schema.json).

Usage:
  python tools/python/validate/validate_input.py <aom-json-path>
"""

from pathlib import Path
import sys

from validate import main as _core_main  # type: ignore

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
SCHEMA = REPO_ROOT / "spec" / "v0.1.0" / "aom-input-schema.json"


def main():
    if len(sys.argv) != 2:
        print("Usage: python tools/python/validate/validate_input.py <aom-json-path>")
        sys.exit(1)

    json_path = Path(sys.argv[1]).resolve()
    sys.argv = [sys.argv[0], str(SCHEMA), str(json_path)]
    _core_main()


if __name__ == "__main__":
    main()

