# Changelog

All notable changes to this project are recorded in this file following the "Keep a Changelog" format. This repository adheres to [Semantic Versioning](https://semver.org/).

Format

- Unreleased: changes that are not yet released.
- Released versions are listed in descending order.

## Unreleased

- Documentation: added and polished `README.md`, `CONTRIBUTING.md`, `FOLDER_STRUCTURE.md`, `DEVELOPMENT.md` and contributing templates.

## [0.1.0] - 2025-10-19

Initial public documentation and project structure for the Chatty frontend.

### Added

- Project README and quick start
- Folder structure & coding guidelines (`FOLDER_STRUCTURE.md`)
- Contribution guidelines (`CONTRIBUTING.md`) and community docs (`CODE_OF_CONDUCT.md`, `SECURITY.md`)
- Basic changelog and development notes (`CHANGELOG.md`, `DEVELOPMENT.md`)
- GitHub issue & PR templates

### Notes

- This release contains documentation only — no runtime code changes.

---

### How to release

1. Update the `Unreleased` section with the changes to include.
2. Bump the version following semantic versioning (patch/minor/major).
3. Add a new release section with the version and date, move entries from `Unreleased`.
4. Tag the release and push to the main branch.

Example

```
## [0.1.1] - 2025-10-20
- Fixed: small doc typo in README
```

---

If you'd like, I can create a GitHub release and tag for `0.1.0`, or add a GitHub Actions workflow that updates the changelog automatically from PR labels.
