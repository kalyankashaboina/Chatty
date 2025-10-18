Development — local workflow & best practices

This document captures the recommended local setup, branching workflow, testing and release steps for contributors working on the Chatty frontend.

Prerequisites

- Node.js 16+ (LTS recommended)
- npm (or pnpm/yarn)
- Git configured with your user/email

Local setup

1. Clone the repository and install dependencies:

```powershell
git clone https://github.com/kalyankashaboina/Chatty.git
cd Chatty
npm install
```

2. Create a local environment file

```powershell
copy .env.example .env
# then edit `.env` with your local values (VITE_API_URL, VITE_SOCKET_URL, etc.)
```

3. Start the dev server

```powershell
npm run dev
```

Branching & PR workflow

- Branch from `main` (or `master`) using clear names: `feature/`, `fix/`, `chore/`.
- Keep PRs small and focused; prefer multiple small PRs over one large PR.
- Reference related Issues in the PR description and add a short summary and test steps.

Linting & formatting

- Run lint and format before opening a PR:

```powershell
npm run lint
npm run format
```

Type checking & tests

- Run TypeScript checks locally:

```powershell
npm run type-check
```

- Run unit tests:

```powershell
npm test
```

Build & preview

- Build for production:

```powershell
npm run build
```

- Preview the production build locally:

```powershell
npm run preview
```

Release & changelog

- Update `CHANGELOG.md`'s `Unreleased` section with the changes to include.
- When ready, bump the version, move `Unreleased` entries into a new version section, tag release and push.

Helpful developer notes

- Co-locate tests and styles with components.
- Keep components small (single responsibility) and prefer composition.
- Add unit tests for utilities and core business logic.
- Avoid committing secrets — use `.env` and your hosting provider's secret store for production.

Need setup help?

If you don't have a backend or socket server locally, mock API responses or use staging endpoints. If you want, I can add a small sample `.env.example` and a mock server script.

_End of development guide_
Development

This document contains practical steps and conventions for working on the project.

Local setup

1. Install Node.js 16+.
2. Copy `.env` values into a local `.env` file.
3. Install dependencies: `npm install`.
4. Run the dev server: `npm run dev`.

Testing

- Run unit tests: `npm test`.
- Run linters: `npm run lint`.

Build & deploy

- Build: `npm run build`.
- Preview: `npm run preview`.

Useful notes

- Keep PRs small and focused.
- Add tests for new logic.
- Update `CHANGELOG.md` for user-facing changes.
