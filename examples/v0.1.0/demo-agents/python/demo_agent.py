#!/usr/bin/env python3
"""
Demo agent: generic consumer of AOM example outputs.
Input: --folder, --test-case (full stem from list_test_cases(folder)).
Output: AOM output JSON (examples/<folder>/outputs/*.output.json).
"""
import json
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
# Repo root is four levels up from this file: examples/v0.1.0/demo-agents/python
REPO_ROOT = _SCRIPT_DIR.parent.parent.parent.parent


def _examples_dir():
    for name in ("Examples", "examples"):
        d = REPO_ROOT / name
        if d.is_dir():
            return d
    return REPO_ROOT / "examples"


def _section_dir(folder: str) -> Path:
    return _examples_dir() / folder.strip("/").replace("\\", "/").rstrip("/")


def _outputs_dir(folder: str) -> Path:
    return _section_dir(folder) / "outputs"


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def _create_outputs_hint(folder: str) -> str:
    # Hint keeps the command simple; CLI wrapper aom.py uses the same script.
    return "Run: python aom.py create-outputs"


def list_folders() -> list[str]:
    """Folder paths (relative to examples/) that have outputs/ with at least one *.output.json."""
    ex = _examples_dir()
    if not ex.is_dir():
        return []
    folders = []
    # Walk recursively under examples/, but record the parent of each outputs/ directory
    # as the logical folder id (e.g. "v0.1.0/login-single").
    for out_dir in ex.rglob("outputs"):
        if not out_dir.is_dir():
            continue
        # Skip demo-agents or hidden paths
        if any(part.startswith(".") for part in out_dir.parts):
            continue
        if "demo-agents" in out_dir.parts:
            continue
        if not any(out_dir.glob("*.output.json")):
            continue
        folder_rel = out_dir.parent.relative_to(ex).as_posix()
        if folder_rel and folder_rel not in folders:
            folders.append(folder_rel)
    return sorted(folders)


def list_test_cases(folder: str) -> list[str]:
    """All output test case ids (file stems) for the folder. Includes outputs that exist and those marked only with .skip (hand-edited)."""
    out_dir = _outputs_dir(folder)
    if not out_dir.is_dir():
        return []
    cases = {f.stem for f in out_dir.glob("*.output.json")}
    # Include stems from .skip markers so hand-edited outputs are still tested (same count as create-outputs)
    for f in out_dir.glob("*.output.json.skip"):
        stem = (f.name[:-5] if f.name.endswith(".skip") else f.name)  # remove ".skip"
        cases.add(Path(stem).stem)  # e.g. "x.output.json" -> "x.output"
    return sorted(cases)


def _resolve_output_path(outputs_dir: Path, test_case: str) -> Path | None:
    test_case = test_case.strip()
    p = outputs_dir / f"{test_case}.json"
    if p.is_file():
        return p
    p = outputs_dir / f"{test_case}.output.json"
    if p.is_file():
        return p
    # Fallback for hand-edited outputs that only exist as .output.json.skip markers
    p = outputs_dir / f"{test_case}.json.skip"
    if p.is_file():
        return p
    return None


def resolve_test_case(folder: str, test_case: str) -> str | None:
    """Resolve folder + test_case (exact or prefix) to full stem, or None if invalid. Use to validate before adding to test set (0 tests when invalid)."""
    if not folder or not test_case:
        return None
    folder = folder.strip("/").replace("\\", "/").rstrip("/")
    folders = list_folders()
    if folder not in folders:
        return None
    valid = list_test_cases(folder)
    if not valid:
        return None
    t = test_case.strip()
    if t in valid:
        return t
    match = [c for c in valid if c.startswith(t + ".")]
    return match[0] if len(match) == 1 else None


def run(*, folder: str, test_case: str) -> dict:
    """Return the pre-generated output for the given folder and test case (full stem)."""
    folder = folder.strip("/").replace("\\", "/").rstrip("/")
    if not folder:
        raise ValueError("folder is required")
    outputs_dir = _outputs_dir(folder)
    if not outputs_dir.is_dir():
        raise FileNotFoundError(
            f"Outputs dir not found: {outputs_dir}. {_create_outputs_hint(folder)}"
        )
    if not list_test_cases(folder):
        raise FileNotFoundError(
            f"No output files in {outputs_dir}. {_create_outputs_hint(folder)}"
        )
    resolved = resolve_test_case(folder, test_case)
    path = _resolve_output_path(outputs_dir, resolved) if resolved else None
    if path is None:
        raise ValueError(f"Unknown test_case or missing output file: {test_case!r}")
    return _load_json(path)


def main():
    import argparse
    p = argparse.ArgumentParser(description="Demo agent: folder + test-case → output")
    p.add_argument("--folder", metavar="NAME", required=True, help="Example folder under examples/ (e.g. v0.1.0/login-single, v0.1.0/ecom-flow)")
    p.add_argument("--test-case", metavar="NAME", required=True, help="Test case id (full stem from list_test_cases)")
    args = p.parse_args()
    try:
        out = run(folder=args.folder, test_case=args.test_case)
        print(json.dumps(out, indent=2))
    except (FileNotFoundError, ValueError) as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
