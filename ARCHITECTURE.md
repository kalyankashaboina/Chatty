# Project Architecture Guide

This document provides a comprehensive overview of the architectural decisions, patterns, and folder structure that govern this project. Its purpose is to ensure consistency and maintain a high standard of quality as the application evolves.

## Guiding Principles

Our architecture is founded on principles that promote a clean and scalable codebase.

- **DRY (Don't Repeat Yourself):** This is a cornerstone of our development philosophy. We actively avoid code duplication by:
  - **Abstracting UI Logic:** Creating reusable, generic components in `src/components/common`.
  - **Abstracting Business Logic:** Encapsulating shared stateful logic within custom React hooks in `src/hooks`.
  - **Abstracting State Logic:** Using pre-typed Redux hooks (`useAppSelector`/`useAppDispatch`) to avoid repetitive type definitions in components.
  - **Abstracting Utility Logic:** Centralizing pure, reusable functions (e.g., formatters, validators) in `src/utils`.

- **KISS (Keep It Simple, Stupid):** We prioritize simplicity and clarity.
  - **Focused Components:** Each component should have a single, well-defined responsibility.
  - **Minimal Abstraction:** We introduce abstractions only when a clear pattern of repetition emerges, avoiding premature or overly complex engineering.

## Directory Structure Overview

The `src` directory is organized by domain, separating concerns to ensure a logical and predictable structure.

- **`src/assets`**: Contains all static assets, primarily global style definitions (`_variables.scss`, `_mixins.scss`).
- **`src/components`**: Houses all reusable React components.
  - `common/`: Small, universal components (e.g., `Button`, `Input`, `Modal`). These should be generic and application-agnostic.
  - `layout/`: Structural components that define the application's look and feel (e.g., `Header`, `Sidebar`).
- **`src/constants`**: Stores application-wide, immutable values like API endpoints or configuration keys.
- **`src/hooks`**: Contains custom React hooks for shared stateful logic.
- **`src/pages`**: Components that represent a full page or view, tied directly to a route. These components are primarily responsible for composing layout and feature components.
- **`src/router`**: Defines the application's routes using React Router.
- **`src/services`**: Manages all external API communication.
- **`src/store`**: Contains all Redux Toolkit logic.
  - `slices/`: Feature-based state slices.
  - `hooks.ts`: The pre-typed `useAppDispatch` and `useAppSelector` hooks. **All components should use these hooks** instead of the raw RTK versions.
  - `store.ts`: The root Redux store configuration.
- **`src/types`**: Home for shared TypeScript interfaces and types used across multiple domains.
- **`src/utils`**: A collection of pure, stateless utility functions.

## Key Architectural Patterns

### State Management

We utilize **Redux Toolkit** for predictable and centralized state management. The state is normalized and organized into feature-based slices. Components should interact with the store exclusively through the provided typed hooks in `src/store/hooks.ts` to ensure type safety and adherence to the DRY principle.

### Styling

Our styling strategy uses **SCSS with CSS Modules**. This approach guarantees that styles are locally scoped to their component, eliminating the risk of global CSS conflicts. A BEM-style nesting convention within each `.module.scss` file is enforced for clarity and maintainability.

### Testing

The testing strategy is built on **Jest** and **React Testing Library**.

- **Co-location:** Test files (`*.test.tsx`) are located directly alongside the files they are testing.
- **Focus:** Tests should focus on user behavior and component functionality rather than implementation details.
