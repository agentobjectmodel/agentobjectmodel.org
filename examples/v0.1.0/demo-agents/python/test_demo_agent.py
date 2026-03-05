"""pytest for demo agent: all+all, 1+all, 1+1 via --folder and --test-case."""
import pytest
from demo_agent import run, list_test_cases, list_folders, resolve_test_case


def _folder_test_case_pairs(config):
    """(folder, test_case) pairs from --folder / --test-case (all+all, 1+all, or 1+1). Invalid folder/test-case → 0 tests (0 passed)."""
    folder_opt = config.getoption("folder", default=None)
    test_case_opt = config.getoption("test_case", default=None)
    if folder_opt is not None:
        folder_opt = folder_opt.strip()
    if test_case_opt is not None:
        test_case_opt = test_case_opt.strip()
    if folder_opt and test_case_opt:
        resolved = resolve_test_case(folder_opt, test_case_opt)
        if resolved:
            return [(folder_opt, resolved)]
        return []  # invalid folder or test case → 0 tests, 0 passed
    if folder_opt:
        if folder_opt not in list_folders():
            return []
        return [(folder_opt, tc) for tc in list_test_cases(folder_opt)]
    return [(f, tc) for f in list_folders() for tc in list_test_cases(f)]


def pytest_generate_tests(metafunc):
    if "folder" in metafunc.fixturenames and "test_case" in metafunc.fixturenames:
        pairs = _folder_test_case_pairs(metafunc.config)
        metafunc.parametrize("folder,test_case", pairs, ids=[f"{f}::{tc}" for f, tc in pairs])


def test_run_every_output_use_case_returns_valid_structure(folder, test_case):
    """Every output use case returns valid AOM output (done + result, error, or a2h_intent)."""
    valid = list_test_cases(folder)
    if test_case not in valid:
        pytest.skip(f"test_case {test_case!r} not in folder {folder!r}; use a full stem. Valid: {valid[:3]}{'...' if len(valid) > 3 else ''}")
    out = run(folder=folder, test_case=test_case)
    assert "meta" in out
    assert isinstance(out["meta"].get("done"), bool)
    if out["meta"]["done"]:
        assert "result" in out
    else:
        assert "error" in out["meta"] or "a2h_intent" in out["meta"]
        if "error" in out["meta"]:
            assert "message" in out["meta"]["error"]
