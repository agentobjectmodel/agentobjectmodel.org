"""Pytest options for demo agent: --folder and --test-case to scope tests."""
import pytest


def pytest_addoption(parser):
    parser.addoption(
        "--folder",
        action="store",
        default=None,
        help="Test only this example folder (e.g. login-single, ecom-flow). Default: all folders.",
    )
    parser.addoption(
        "--test-case",
        action="store",
        default=None,
        help="Test only this test case (use with --folder). Default: all test cases in scope.",
    )
