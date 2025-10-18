# Folder Structure & Coding Guidelines (Component-Based)

This document describes the folder layout, naming conventions, coding standards, and best practices for the Chattty React Vite project.

---

## 1. Folder Layout

```
/src
  /components        # All reusable components (each in its own folder)
    /ComponentName
      ComponentName.jsx/tsx
      ComponentName.module.scss
      ComponentName.test.jsx/tsx
  /hooks             # Custom React hooks (use prefix)
  /utils             # Utility functions (camelCase or lower-case hyphens)
  /assets            # Images, icons, fonts (lower-case hyphens)
  /styles            # Global/shared SCSS/CSS files (lower-case hyphens)
  /constants         # App constants (UPPER_CASE.js)
  /types             # TypeScript types/interfaces (PascalCase)
```

---

## 2. Naming Conventions

### Components

- Folders & files: **PascalCase** (e.g., `ChatWindow`, `VideoCall`)
- Component names: **PascalCase** (`ChatWindow`)
- Test files: `ComponentName.test.jsx` or `.test.tsx`
- Styles: `ComponentName.module.scss`
- Only one component per folder (unless tightly coupled subcomponents).

### SCSS/CSS

- Component styles: `ComponentName.module.scss`
- Global styles: lower-case with hyphens (e.g., `global-styles.scss`)

### Functions & Utilities

- Functions: **camelCase** (e.g., `sendMessage`)
- Utility files: **camelCase** or lower-case with hyphens (e.g., `format-date.js`)

### Hooks

- Custom hooks: **use** prefix + camelCase (e.g., `useChat`)
- Hook files: `useHookName.js` (e.g., `useChat.js`)

### Assets (Images, Icons, Fonts)

- lower-case, hyphens (e.g., `user-avatar.png`, `video-icon.svg`)

### Constants

- UPPER_CASE with underscores (e.g., `MAX_COUNT.js`)

### Types/Interfaces (TypeScript)

- PascalCase (e.g., `UserProfile.ts`)

### Config & Env Files

- `vite.config.js`, `.env.local`

---

## 3. Coding Quality Rules

- **Add new components in their own folder inside `/components`.**
- **Co-locate styles and tests with component files.**
- **Do not overwrite or modify core/shared files unless necessary.**
- **Do not leave commented-out or unused code in PRs.**
- **Write readable and maintainable code.**
- **Test your changes thoroughly before submitting a PR.**
- **Run lint and format tools according to project standards.**
- **Document any new features/components.**
- **Add only necessary dependencies—avoid bloat.**
- **Use ES6+ features where possible.**
- **Ensure accessibility in all UI (use ARIA, alt text, etc.).**
- **Use PropTypes or TypeScript for type safety.**
- **Avoid long files; break into subcomponents if needed.**

---

## 4. Common Mistakes & How to Avoid Them

- **Misplacing files:** Always add files to the correct component or utility folder.
- **Breaking imports:** If you update a shared component/hook, check all usages.
- **Style conflicts:** Use module SCSS for component styles to avoid global clashes.
- **Not testing:** Run the app and tests before making a PR.
- **Ignoring naming conventions:** Use the formats above for all files and code.
- **Missing accessibility:** Don't forget ARIA attributes and alt text for images.

---

## 5. Checklist Before PR Submission

- [ ] All files are in correct folders.
- [ ] Naming conventions are followed.
- [ ] No core/shared files are overwritten unnecessarily.
- [ ] Code is linted and formatted.
- [ ] App runs without errors.
- [ ] No commented-out or unused code.
- [ ] New components/features are documented.
- [ ] All relevant tests are passing.
- [ ] Accessibility standards are met.
- [ ] Type safety (PropTypes/TypeScript) is implemented.

---

## 6. Best Practices & Tips

- **Keep components small, focused, and independent.**
- **Use custom hooks and utilities for code reuse.**
- **Ask questions in Discussions/Issues if unsure about the structure or standards.**
- **Experienced contributors may skip some basics, but double-check to avoid accidental mistakes.**

---

## 7. Need Help?

If you have any doubts or are unsure about folder structure, coding style, or anything else, don’t hesitate to reach out or open a discussion.  
**Following these guidelines helps keep our codebase healthy and easy to maintain!**
