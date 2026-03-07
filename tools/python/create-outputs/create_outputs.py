#!/usr/bin/env python3
"""
Generate golden AOM output files for testing.
- Discovers all *.aom.json under Examples/ (or examples/).
- Writes to <section>/outputs/: _<base>.success.output.json, <base>.<error_name>.failed.output.json, _<base>.escalated.output.json when surface has a2h.
- Outputs conform to Spec/aom-output-schema.json.
- To protect hand-edited files: create a marker <outputfilename>.skip; the script will not overwrite.
"""
import json
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = _SCRIPT_DIR.parent.parent.parent


def _find_examples_dir():
    for name in ("Examples", "examples"):
        d = REPO_ROOT / name
        if d.is_dir():
            return d
    return None


def _find_all_aom_files():
    examples_dir = _find_examples_dir()
    if not examples_dir:
        return [], None
    return sorted(examples_dir.rglob("*.aom.json")), examples_dir


def _base_name(surface_path: Path) -> str:
    stem = surface_path.stem
    return stem.replace(".aom", "") if stem.endswith(".aom") else stem


def _get_a2h_defaults(aom: dict) -> dict:
    a2h = aom.get("a2h") or {}
    return {
        "confidence_threshold": a2h.get("confidence_threshold", 0.5),
        "default_intent_type": a2h.get("default_intent_type", "ESCALATE"),
        "escalation_channel": a2h.get("escalation_channel", "in_app"),
    }


def build_output_from_aom(
    aom: dict,
    *,
    success: bool = True,
    error_message: str | None = None,
    expected: dict | None = None,
    a2h_intent: dict | None = None,
) -> dict:
    tasks = aom.get("tasks") or []
    actions = aom.get("actions") or []
    default_action_id = "none"
    if success and not a2h_intent and tasks and tasks[0].get("default_action_id"):
        default_action_id = tasks[0]["default_action_id"]
    elif not a2h_intent and actions:
        default_action_id = actions[0].get("id", "none")

    action = {"action_id": default_action_id, "params": {}}
    if default_action_id != "none":
        action["priority"] = 5

    a2h_defaults = _get_a2h_defaults(aom)
    threshold = a2h_defaults["confidence_threshold"]
    if a2h_intent:
        confidence = max(0.0, threshold - 0.1)
    elif success and not error_message:
        confidence = min(1.0, threshold + 0.05) if aom.get("a2h") else 0.9
    else:
        confidence = max(0.0, threshold - 0.1) if aom.get("a2h") else 0.3

    meta = {"done": success and (error_message is None) and not a2h_intent, "confidence": confidence}
    if error_message:
        meta["error"] = {"message": error_message}
    if a2h_intent:
        meta["a2h_intent"] = a2h_intent

    payload = {"mode": "single", "action": action, "meta": meta}
    if success and not error_message and not a2h_intent:
        payload["thought"] = "Proceeding with default task action."
        payload["result"] = {"ok": True, **(expected or {})}
    elif a2h_intent:
        payload["thought"] = payload.get("thought") or "Confidence below threshold; handing over to human."
    return payload


def _is_hand_edited(output_path: Path) -> bool:
    skip_path = output_path.parent / (output_path.name + ".skip")
    return skip_path.is_file()


def ensure_outputs_for_surface(surface_path: Path, examples_dir: Path, generate_failed: bool) -> dict:
    base = _base_name(surface_path)
    section_dir = surface_path.parent
    output_dir = section_dir / "outputs"
    output_dir.mkdir(parents=True, exist_ok=True)
    counts = {"created": {"success": 0, "failed": 0, "escalated": 0}, "skipped": {"success": 0, "failed": 0, "escalated": 0}}

    try:
        aom = json.loads(surface_path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"  ❌ Could not read/parse {surface_path}: {e}")
        return counts

    test_cases = (aom.get("signals") or {}).get("test_cases") or []

    success_expected = None
    for tc in test_cases:
        if tc.get("name") == "success" and not (tc.get("errors") or []):
            success_expected = tc.get("expected")
            break
    success_output = build_output_from_aom(aom, success=True, expected=success_expected)
    success_path = output_dir / f"_{base}.success.output.json"
    if _is_hand_edited(success_path):
        counts["skipped"]["success"] = 1
        print(f"  [skip] {success_path.relative_to(REPO_ROOT)} (hand-edited, .skip)")
    else:
        success_path.write_text(json.dumps(success_output, indent=2), encoding="utf-8")
        counts["created"]["success"] = 1
        print(f"  [out] {success_path.relative_to(REPO_ROOT)}")

    a2h_defaults = _get_a2h_defaults(aom)
    for tc in test_cases:
        tc_name = tc.get("name") or "unknown"
        tc_errors = tc.get("errors") or []
        if not tc_errors:
            continue
        error_message = "; ".join(tc_errors)
        intent_type = tc.get("intent_type") or a2h_defaults["default_intent_type"]
        escalation_channel = tc.get("escalation_channel") or a2h_defaults["escalation_channel"]
        a2h_intent = {"type": intent_type, "message": error_message, "escalation_channel": escalation_channel}
        failed_path = output_dir / f"{base}.{tc_name}.failed.output.json"
        if _is_hand_edited(failed_path):
            counts["skipped"]["failed"] += 1
            print(f"  [skip] {failed_path.relative_to(REPO_ROOT)} (hand-edited, .skip)")
        else:
            failed_output = build_output_from_aom(aom, success=False, error_message=error_message, a2h_intent=a2h_intent)
            failed_path.write_text(json.dumps(failed_output, indent=2), encoding="utf-8")
            counts["created"]["failed"] += 1
            print(f"  [out] {failed_path.relative_to(REPO_ROOT)}")

    if aom.get("a2h"):
        a2h_intent = {
            "type": a2h_defaults["default_intent_type"],
            "message": "Confidence below threshold. Please complete or verify the action.",
            "escalation_channel": a2h_defaults["escalation_channel"],
        }
        escalated_path = output_dir / f"_{base}.escalated.output.json"
        if _is_hand_edited(escalated_path):
            counts["skipped"]["escalated"] = 1
            print(f"  [skip]  {escalated_path.relative_to(REPO_ROOT)} (hand-edited, .skip)")
        else:
            escalated_output = build_output_from_aom(aom, success=False, error_message=None, a2h_intent=a2h_intent)
            escalated_path.write_text(json.dumps(escalated_output, indent=2), encoding="utf-8")
            counts["created"]["escalated"] = 1
            print(f"  [out] {escalated_path.relative_to(REPO_ROOT)}")

    return counts


def main():
    generate_failed = "--failed" in sys.argv
    surfaces, examples_dir = _find_all_aom_files()

    print(f"REPO_ROOT: {REPO_ROOT}")
    if examples_dir:
        print(f"EXAMPLES_DIR: {examples_dir.relative_to(REPO_ROOT)}")
    else:
        print("EXAMPLES_DIR: (none — no 'Examples' or 'examples' folder found)")
    print(f"Found {len(surfaces)} AOM file(s):")
    for p in surfaces:
        print(f"  - {p.relative_to(REPO_ROOT)}")
    print()

    if not surfaces:
        print("❌ No *.aom.json found. Add files under Examples/<Section>/*.aom.json (or examples/).")
        sys.exit(1)

    summary = []
    for surface_path in surfaces:
        print(f"Processing {surface_path.relative_to(REPO_ROOT)}")
        counts = ensure_outputs_for_surface(surface_path, examples_dir, generate_failed)
        summary.append((surface_path, counts))

    print("\n" + "=" * 60)
    print("Summary (per AOM file)")
    print("=" * 60)
    for surface_path, counts in summary:
        name = surface_path.name
        c = counts["created"]
        s = counts["skipped"]
        total_skipped = s["success"] + s["failed"] + s["escalated"]
        line = f"  {name}: created {c['success']} success, {c['failed']} failed, {c['escalated']} escalated"
        if total_skipped:
            line += f"  |  skipped {s['success']} success, {s['failed']} failed, {s['escalated']} escalated"
        print(line)
    print("=" * 60)
    total_c = sum(c["success"] + c["failed"] + c["escalated"] for _, counts in summary for c in [counts["created"]])
    total_s = sum(s["success"] + s["failed"] + s["escalated"] for _, counts in summary for s in [counts["skipped"]])
    print(f"  Total: {total_c} created, {total_s} skipped")
    print("\nDone.")


if __name__ == "__main__":
    main()
