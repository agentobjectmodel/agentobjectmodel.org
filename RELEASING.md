# Creating a release

Use this when tagging a new version (e.g. v0.1.0) and publishing it on GitLab.

## One-time: v0.1.0

1. **Commit and push** any final changes to `main` or `master`.

2. **Create the tag** (from repo root):
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0"
   git push origin v0.1.0
   ```
   If your default branch is `main`:
   ```bash
   git push origin v0.1.0
   ```

3. **Create the release in GitLab**
   - Go to **Deploy** → **Releases** (or `https://gitlab.com/agentobjectmodel/agentobjectmodel.org/-/releases`).
   - Click **New release**.
   - **Tag:** select or type `v0.1.0`.
   - **Release title:** `v0.1.0` or `Agent Object Model v0.1.0`.
   - **Release notes:** paste the contents of [release-notes/v0.1.0.md](release-notes/v0.1.0.md) (or the v0.1.0 section from [CHANGELOG.md](CHANGELOG.md)).
   - Save. GitLab will list **Source code (zip)** and **Source code (tar.gz)**; download counts for these assets will increase when people download them.

4. **Verify**
   - Open the releases page and confirm v0.1.0 appears with the source assets.
   - The "Latest release" link in the README will point to this release.

## Future releases

- Bump version in docs/schemas as needed.
- Add an entry under **Unreleased** or a new version in [CHANGELOG.md](CHANGELOG.md).
- Create `release-notes/vX.Y.Z.md` if you want paste-ready notes.
- Tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"` then `git push origin vX.Y.Z`.
- Create the release in GitLab as above, using the new tag and notes.
