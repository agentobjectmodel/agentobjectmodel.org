#!/usr/bin/env python3
"""
Validate a site-level policy JSON (site-policy-schema.json).

Usage:
  python Tools/python/validate/validate_site.py <site-policy-json-path>
"""

from pathlib import Path
import sys

from validate import main as _core_main  # type: ignore

REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
SCHEMA = REPO_ROOT / "spec" / "v0.1.0" / "site-policy-schema.json"


def main():
    if len(sys.argv) != 2:
        print("Usage: python Tools/python/validate/validate_site.py <site-policy-json-path>")
        sys.exit(1)

    json_path = Path(sys.argv[1]).resolve()
    sys.argv = [sys.argv[0], str(SCHEMA), str(json_path)]
    _core_main()


if __name__ == "__main__":
    main()

