# Creating a release

Use this when tagging a new version (e.g. v0.1.0) and publishing it on GitHub.

## One-time: v0.1.0

v0.1.0 is already created. The tag and release live at [GitHub Releases](https://github.com/agentobjectmodel/agentobjectmodel.org/releases). Paste-ready notes for that release: [release-notes/v0.1.0.md](release-notes/v0.1.0.md).

## Updating the latest release (e.g. move v0.1.0 to current master)

If you want the **v0.1.0** release to include the latest commits (e.g. badge-test AOM script, spec/examples redirects, Tools→tools):

1. **From repo root**, move the tag to the current branch and push:
   ```bash
   git tag -d v0.1.0
   git tag -a v0.1.0 -m "Release v0.1.0"
   git push origin :refs/tags/v0.1.0
   git push origin v0.1.0
   ```
2. On GitHub, the release at **Releases** → **v0.1.0** will now point at the new commit. The existing release title and notes are unchanged; edit them there if needed.

## Future releases (new version, e.g. v0.1.1)

- Bump version in docs/schemas as needed.
- Add an entry under **Unreleased** or a new version in [CHANGELOG.md](CHANGELOG.md).
- Create `release-notes/vX.Y.Z.md` if you want paste-ready notes.
- **Tag:** `git tag -a vX.Y.Z -m "Release vX.Y.Z"` then `git push origin vX.Y.Z`.
- **Create the release on GitHub:** **Releases** → **Draft a new release** → choose the tag, set title and paste notes from `release-notes/vX.Y.Z.md` or CHANGELOG. Publish.
