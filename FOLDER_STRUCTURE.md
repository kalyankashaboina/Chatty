---
# Folder structure & coding guidelines — Component-first (Final)

[![Docs](https://img.shields.io/badge/docs-guidelines-blue)](./FOLDER_STRUCTURE.md) [![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE) [![Quality](https://img.shields.io/badge/code-quality-high-brightgreen)](README.md)

This is the final, opinionated guide for how we structure, name and maintain the frontend code. It's written for engineers who will build components, shared utilities, and tests. Follow this file to keep the codebase maintainable, discoverable and scalable.

What you'll find here (quick)

- Clear naming conventions for files, classes and TypeScript types
- Practical engineering principles (DRY / KISS / SRP) and enforcement rules
- Component-first templates, CSS rules and token guidance
- Utilities & services maintenance rules and testing requirements
- PR checklist, completeness checklist and quick commands

---

## 1. Layout overview (component-first)

We follow a **component-first** layout: each reusable UI piece has its own folder under `src/components/`. Only create feature folders for large, self-contained domains (rare).

Recommended top-level tree

```text
.
├─ public/
├─ src/
│  ├─ assets/          # images, icons, fonts (kebab-case)
│  ├─ components/      # one folder per component (PascalCase)
│  ├─ pages/           # route-level containers (thin)
│  ├─ hooks/           # reusable hooks (useXxx)
│  ├─ services/        # API clients & service wrappers
│  ├─ utils/           # small, focused helpers
│  ├─ store/           # state management (slices, store setup)
│  ├─ types/           # shared TS types/interfaces
│  ├─ App.tsx
│  └─ main.tsx
```

---

## 2. Naming cases — Complete matrix (single source of truth)

| Item                    |                        Case | Format / suffix                     | Example                                    |
| ----------------------- | --------------------------: | ----------------------------------- | ------------------------------------------ |
| Component folder & file |                  PascalCase | <ComponentFolder>/<Component>.tsx   | `src/components/ChatHeader/ChatHeader.tsx` |
| Component styles        |     PascalCase + CSS Module | `<Component>.module.css`            | `ChatHeader.module.css`                    |
| Component test          |    PascalCase + `.test.tsx` | `<Component>.test.tsx`              | `ChatHeader.test.tsx`                      |
| Hook                    | camelCase with `use` prefix | `useXxx.ts`                         | `useSocketEvents.ts`                       |
| Utility file            |     camelCase or kebab-case | `formatDate.ts` or `format-date.ts` | `formatDate.ts`                            |
| Service / API client    |                   camelCase | `chatService.ts`                    | `chatService.ts`                           |
| Types / Interfaces      |  PascalCase (no `I` prefix) | `UserProfile`, `MessageDTO`         | `UserProfile.ts`                           |
| CSS Module class names  |                   camelCase | `styles.root`, `styles.chatHeader`  | `.root {}`                                 |
| Global CSS class names  |    kebab-case (BEM allowed) | `card__title`, `layout--wide`       | `card__title`                              |
| CSS variables (tokens)  |    kebab-case with `--app-` | `--app-color-primary`               | `--app-color-primary`                      |
| Constants / env names   |            UPPER_SNAKE_CASE | `VITE_API_URL`, `API_TIMEOUT`       | `VITE_API_URL`                             |

**Key rules**

- TypeScript types/interfaces: **PascalCase, no `I` prefix** (e.g., `UserProfile`).
- Component filenames/folders: **PascalCase** and one component per folder.
- Prefer **named exports** from utils/services; components should be default exports.

---

## 3. Engineering principles (apply on every PR)

Use these small, enforceable rules to keep quality high:

- **DRY** — extract repeated logic to a helper/hook.
- **KISS** — choose the simplest readable solution.
- **SRP** — one responsibility per component/module.
- **YAGNI** — avoid premature abstractions.
- **Predictability** — use clear names so reviewers understand intent quickly.

Tip: include a short note in the PR describing why you chose a particular structure or abstraction.

---

## 4. Component-first patterns & templates (copy-ready)

Each component folder should look like:

```
src/components/MyComponent/
  MyComponent.tsx
  MyComponent.module.css
  MyComponent.test.tsx
  MyComponent.stories.tsx   # optional (Storybook)
  index.ts                  # `export { default } from './MyComponent'`
```

Minimal component example (production-ready)

```tsx
// src/components/MyComponent/MyComponent.tsx
import React from 'react';
import styles from './MyComponent.module.css';

export type MyComponentProps = {
  title?: string;
};

export default function MyComponent({ title }: MyComponentProps) {
  return <div className={styles.root}>{title ?? 'MyComponent'}</div>;
}
```

Test example

```tsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders title', () => {
  render(<MyComponent title="hello" />);
  expect(screen.getByText('hello')).toBeInTheDocument();
});
```

Index re-export (short imports)

```ts
export { default } from './MyComponent';
```

When to create feature folders: only for large domains that include many components, pages and services. Otherwise, prefer the component-first approach.

---

## 5. Utilities & services — maintenance rules

Shared helpers must be small, documented and tested.

- **Location:** `src/utils/` for pure helpers; `src/services/` for API clients.
- **Public API:** design minimal, stable function signatures and export types.
- **Named exports:** `export function formatDate(...) {}`.
- **Tests required:** every util with logic needs unit tests.
- **No commented-out code:** remove dead code. Use Git history for past versions.
- **Backwards compatibility:** plan deprecations and document migration in PR and `CHANGELOG.md`.

Example util

```ts
// src/utils/formatDate.ts
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}
```

---

## 6. CSS, class names and design tokens

**CSS Modules (preferred)**

- File: `MyComponent.module.css` (PascalCase filename).
- Class names: **camelCase** (e.g., `styles.container`, `styles.item`).

Example

```css
/* src/components/ChatHeader/ChatHeader.module.css */
.root {
  display: flex;
}
.title {
  font-size: 1.2rem;
}
```

**Global styles & tokens**

- Keep minimal in `src/styles/` (`variables.css`, `global.css`).
- CSS variables: prefix with `--app-` and use kebab-case: `--app-color-primary`.

Sass variables (if used): `$app-color-primary`.

---

## 7. TypeScript: types & interface naming (rules)

- Use **PascalCase** for all exported types and interfaces. Do **not** prefix with `I`.
- Co-locate local types next to components; shared types in `src/types/`.
- Export explicit return types for public functions.

Example

```ts
export type UserProfile = {
  id: string;
  name: string;
  email?: string;
};
```

---

## 8. Function & handler naming (component-local)

Use consistent prefixes:

- **Props callbacks:** `onXxx` (e.g., `onSendMessage`).
- **Internal handlers:** `handleXxx` (e.g., `handleSubmit`).
- **Async operations:** verb-style: `fetchMessages`, `createChat`.
- **Boolean props:** `isXxx`, `hasXxx`.
- **Selectors:** `selectXxx` for store selectors.

Example

```tsx
function ChatInput({ onSend }: { onSend: (t: string) => void }) {
  const [text, setText] = useState('');
  function handleChange(e) {
    setText(e.target.value);
  }
  function handleSubmit() {
    onSend(text);
    setText('');
  }
}
```

---

## 9. Exports & barrel files

- Use `index.ts` re-exports inside component folders for short imports.
- Avoid monolithic global barrels that export unrelated modules.

Example

```ts
// src/components/ChatHeader/index.ts
export { default } from './ChatHeader';
```

---

## 10. Tests, stories & docs

- **Unit tests:** colocate with component `.test.tsx`.
- **E2E tests:** store under `tests/` (Cypress/Playwright).
- **Storybook:** optional but recommended for visual docs; `MyComponent.stories.tsx` next to component.

---

## 11. PR checklist (must pass before merge)

Use this checklist in PR descriptions and CI:

- [ ] Branch name uses `feature/`, `fix/`, or `chore/`.
- [ ] Lint & format: `npm run lint`, `npm run format`.
- [ ] Type-check: `npm run type-check`.
- [ ] Tests pass: `npm test`.
- [ ] New util has unit tests.
- [ ] No large commented-out blocks in source files.
- [ ] Breaking change? Add migration notes and update `CHANGELOG.md`.

Quick commands (PowerShell)

```powershell
npm install
npm run lint
npm run type-check
npm test
```

---

## 12. Technical debt & refactor guidance

- Create `technical-debt` issues describing impact and suggested fix.
- Split large refactors into small, reviewable PRs.
- Prioritize fixes that improve stability, security or developer velocity.

---

## 13. Repo completeness checklist

| Item                           | Purpose                         |          Status          |
| ------------------------------ | ------------------------------- | :----------------------: |
| `README.md`                    | Project overview & quick start  |            ✅            |
| `CONTRIBUTING.md`              | Contribution workflow           |            ✅            |
| `FOLDER_STRUCTURE.md`          | This file — naming & layout     |            ✅            |
| `CODE_OF_CONDUCT.md`           | Community behavior              |            ✅            |
| `SECURITY.md`                  | Vulnerability reporting         |            ✅            |
| `CHANGELOG.md`                 | Release notes / migration guide |            ✅            |
| `.env.example`                 | Example env variables           |   ❌ (suggest adding)    |
| `tsconfig.json` alias          | `@/*` imports                   |       ❌/Optional        |
| `.editorconfig`, `.prettierrc` | Formatting rules                |       ❌/Optional        |
| `LICENSE`                      | OSS license file                | ❌ (add MIT if intended) |
| CI workflow                    | Run lint/test/build in CI       |       ❌/Optional        |

If you want, I will add the missing items (`.env.example`, update `tsconfig.*.json` with paths, `.editorconfig`, CI) and run `npm run type-check` and `npm run lint`.

---

## 14. Quick reference — Best naming & code-quality rules

- Component file/folder: `ChatHeader/ChatHeader.tsx` (PascalCase)
- Component CSS: `ChatHeader.module.css` and class names `styles.root`
- Props callback: `onSave`, internal handler: `handleSave`
- Hook: `useSocketEvents.ts` (camelCase, use-prefix)
- Util: `formatDate.ts` (named export)
- Type: `UserProfile` (PascalCase)

---

_This is the final, production-ready version of `FOLDER_STRUCTURE.md`. If you'd like, I can now add the `.env.example`, update tsconfig aliases and create a small `scripts/generate-component.js` scaffolder._

_Last updated: Oct 2025_
