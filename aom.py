#!/usr/bin/env python3
"""
Unified AOM CLI (Python flavor).

Run from the agentobejctmodel.org repo root, for example:

  python aom.py validate input --file examples/v0.1.0/login-single/login.aom.json
  python aom.py validate output --file examples/v0.1.0/login-single/outputs/_login.success.output.json
  python aom.py validate site --file .well-known/aom-policy.open.site.json
  python aom.py validate all --examples-dir examples/v0.1.0
  python aom.py create-outputs
  python aom.py demo run --lang python --folder v0.1.0/login-single --test-case _login.success.output
  python aom.py demo test
"""

import argparse
import subprocess
from pathlib import Path
from typing import List


ROOT = Path(__file__).resolve().parent


def run(cmd: List[str]) -> int:
    """Run a subprocess from the repo root."""
    completed = subprocess.run(cmd, cwd=ROOT)
    return completed.returncode


# ---- validate commands ----

def cmd_validate_input(args: argparse.Namespace) -> int:
    return run(["python", "tools/python/validate/validate_input.py", args.file])


def cmd_validate_output(args: argparse.Namespace) -> int:
    return run(["python", "tools/python/validate/validate_output.py", args.file])


def cmd_validate_site(args: argparse.Namespace) -> int:
    return run(["python", "tools/python/validate/validate_site.py", args.file])


def cmd_validate_all(args: argparse.Namespace) -> int:
    target = args.examples_dir or f"examples/v{args.version}"
    return run(["python", "tools/python/validate/validate_all.py", target])


# ---- create-outputs ----

def cmd_create_outputs(args: argparse.Namespace) -> int:
    # Existing script discovers examples under examples/
    return run(["python", "tools/python/create-outputs/create_outputs.py"])


# ---- demo commands ----

def cmd_demo_run(args: argparse.Namespace) -> int:
    if args.lang == "python":
        return run(
            [
                "python",
                "examples/v0.1.0/demo-agents/python/demo_agent.py",
                "--folder",
                args.folder,
                "--test-case",
                args.test_case,
            ]
        )
    return run(
        [
            "node",
            "examples/v0.1.0/demo-agents/node/demo_agent.js",
            "--folder",
            args.folder,
            "--test-case",
            args.test_case,
        ]
    )


def cmd_demo_test(args: argparse.Namespace) -> int:
    rc1 = run(
        [
            "python",
            "-m",
            "pytest",
            "examples/v0.1.0/demo-agents/python",
            "-v",
        ]
    )
    rc2 = run(["node", "examples/v0.1.0/demo-agents/node/run_tests.js"])
    return rc1 or rc2


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="aom", description="AOM reference CLI (Python flavor)")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # validate
    p_val = subparsers.add_parser("validate", help="Validate AOM inputs, outputs, or site policies")
    val_sub = p_val.add_subparsers(dest="kind", required=True)

    p_in = val_sub.add_parser("input", help="Validate one AOM input surface")
    p_in.add_argument("--file", required=True, help="Path to *.aom.json")
    p_in.set_defaults(func=cmd_validate_input)

    p_out = val_sub.add_parser("output", help="Validate one AOM output JSON")
    p_out.add_argument("--file", required=True, help="Path to *.output.json")
    p_out.set_defaults(func=cmd_validate_output)

    p_site = val_sub.add_parser("site", help="Validate one site policy JSON")
    p_site.add_argument("--file", required=True, help="Path to /.well-known/aom-policy.json")
    p_site.set_defaults(func=cmd_validate_site)

    p_all = val_sub.add_parser("all", help="Validate all inputs and outputs under a directory")
    p_all.add_argument(
        "--examples-dir",
        help="Directory under examples/ to scan (default: examples/v<VERSION>)",
    )
    p_all.add_argument(
        "--version",
        default="0.1.0",
        help="Spec/examples version (default: 0.1.0)",
    )
    p_all.set_defaults(func=cmd_validate_all)

    # create-outputs
    p_co = subparsers.add_parser(
        "create-outputs",
        help="Generate golden *.output.json files for all examples",
    )
    p_co.add_argument(
        "--examples-dir",
        help="(reserved for future use; current implementation scans examples/ automatically)",
    )
    p_co.set_defaults(func=cmd_create_outputs)

    # demo
    p_demo = subparsers.add_parser("demo", help="Run or test demo agents")
    demo_sub = p_demo.add_subparsers(dest="demo_cmd", required=True)

    p_run = demo_sub.add_parser("run", help="Run a single demo-agent scenario")
    p_run.add_argument(
        "--lang",
        choices=["python", "node"],
        default="python",
        help="Runtime to use (default: python)",
    )
    p_run.add_argument("--folder", required=True, help="Example folder (e.g. login-single)")
    p_run.add_argument(
        "--test-case",
        required=True,
        help="Test-case id (e.g. _login.success.output)",
    )
    p_run.set_defaults(func=cmd_demo_run)

    p_test = demo_sub.add_parser("test", help="Run all demo-agent tests (Python + Node)")
    p_test.set_defaults(func=cmd_demo_test)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    exit_code = args.func(args)  # type: ignore[attr-defined]
    raise SystemExit(exit_code)


if __name__ == "__main__":
    main()

