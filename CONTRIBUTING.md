# Contributor Guidelines

We are excited that you are interested in contributing to this project. This document outlines the standards and procedures for all development contributions to ensure a smooth and effective workflow.

## Core Principles

- **Ownership:** Take pride in your work. Ensure your code is tested, documented, and adheres to the project's standards before submitting it for review.
- **Communication:** Be clear and concise in your commit messages and pull request descriptions.

---

## The Development Workflow

### 1. Branching Strategy

All work must be done on a feature branch. The `main` branch is protected and all changes must be merged via pull request.

- **Branching Source:** Always create your new branch from the latest `main`.
- **Naming Convention:** Branches must be prefixed according to their purpose.
  - `feature/<feature-description>` (e.g., `feature/user-profile-page`)
  - `fix/<bug-description>` (e.g., `fix/login-form-validation`)
  - `refactor/<area-of-refactor>` (e.g., `refactor/api-service-layer`)
  - `docs/<documentation-update>` (e.g., `docs/update-readme`)

### 2. Commit Hygiene

We enforce the **Conventional Commits** specification. This practice is essential for maintaining a clean commit history and automating changelogs. Our pre-commit hook will lint your commit message.

- **Format:** `<type>(<optional-scope>): <subject>`
- **Common Types:** `feat`, `fix`, `build`, `chore`, `ci`, `docs`, `perf`, `refactor`, `revert`, `style`, `test`.

- **Examples:**
  ```
  feat(auth): implement password reset functionality
  fix(header): correct responsive layout bug on mobile
  docs(contributing): clarify commit message format
  ```

### 3. Submitting a Pull Request (PR)

1.  **Pre-Submission Checklist:** Before opening a PR, ensure you have completed the following on your branch:
    - [ ] Code is free of linting errors (`npm run lint`).
    - [ ] All existing and new tests are passing (`npm run test`).
    - [ ] The branch is up-to-date with the latest `main`.
    - [ ] The code adheres to all standards outlined in `ARCHITECTURE.md` and `CODE_STYLE.md`.

2.  **Opening the PR:**
    - Push your feature branch to the remote repository.
    - Open a pull request targeting the `main` branch.
    - Use a clear and descriptive title.
    - The PR description must follow the provided template, detailing the _what_ and _why_ of the changes.

3.  **Code Review:**
    - A PR requires at least one approval from a team member before it can be merged.
    - Address all review comments and push your changes to the same branch.
    - Once approved, the PR will be squashed and merged by a maintainer.
