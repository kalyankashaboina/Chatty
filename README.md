---
# Chatty — Frontend (React + TypeScript)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Vite](https://img.shields.io/badge/bundler-vite-brightgreen)](https://vitejs.dev/) [![React](https://img.shields.io/badge/framework-react-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)  

A production-focused frontend for Chatty, a real-time chat platform. This repository contains the single-page application (SPA) built with React, TypeScript, Vite and Socket.IO.

Quick links

- Live demo: (add URL when available)
- Backend API: (add backend repo link)

## Table of contents

- About
- Features
- Tech stack
- Quick start
- Environment variables (detailed)
- API contract (examples)
- Socket events (client ↔ server)
- Scripts
- Project layout
- Development notes & best practices
- CI / Deployment
- Security
- Contributing
- Troubleshooting
- Maintainers
- License

---

## About

Chatty provides a modern, accessible chat UI that connects to a backend API and a Socket.IO server. The frontend focuses on performance, reliability, and a clean developer DX.

## Features

- Authentication: register, login, logout, password reset
- Real-time messaging (one-to-one and group chats)
- Message history and pagination (loads recent messages on connect)
- Typing indicators and read receipts
- Online presence (user status)
- Responsive UI with CSS Modules
- Pluggable socket and API utilities

## Tech stack

- React + Hooks
- TypeScript
- Vite
- Socket.IO Client
- CSS Modules
- Optional: ESLint, Prettier, Jest/Testing Library

---

## Quick start

Prerequisites: Node.js 16+ and npm (pnpm or yarn supported).

1. Clone

```powershell
git clone https://github.com/kalyankashaboina/Chatty.git
cd Chatty
```

2. Environment

Create a `.env` file in the project root (see the Environment Variables section below).

3. Install & run

```powershell
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Environment variables (detailed)

|---|---:|---|---|
| VITE_API_URL | yes | Base URL for the backend REST API | `https://api.example.com` |
| VITE_SOCKET_URL | yes | Socket.IO server URL | `https://sockets.example.com` |
| VITE_SENTRY_DSN | no | Sentry DSN for error reporting | (private) |
| VITE_FEATURE_FLAG_X | no | Example feature flag | `true` |

Notes:

- Only variables prefixed with `VITE_` are exposed to the client.
- Never commit secrets to git. Use your hosting provider's secret store for production values.

---

## API contract (examples)

Below are representative API endpoints used by the frontend. Adjust to match your backend.

Auth

- POST /api/auth/register
  - Request: { name, email, password }
  - Response: { user: { id, name, email }, token }

- POST /api/auth/login
  - Request: { email, password }
  - Response: { user: { id, name, email }, token }

Profile

# Chatty — Frontend (React + TypeScript)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Vite](https://img.shields.io/badge/bundler-vite-brightgreen)](https://vitejs.dev/) [![React](https://img.shields.io/badge/framework-react-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

Chatty is a production-oriented single-page application (SPA) frontend for a real-time chat platform. It’s implemented with React, TypeScript and Vite and integrates with a REST API and Socket.IO for real-time features.

Table of contents

- About
- Features
- Tech stack
- Quick start
- Environment variables
- Scripts
- Project layout
- Development
- Contributing
- Security
- License

---

## About

This repository contains the frontend application for Chatty. The UI focuses on performance, accessibility, and a pleasant developer experience. It connects to a backend REST API for persistent data and a Socket.IO server for real-time messaging and presence.

## Key features

- User authentication (register, login, password reset)
- Real-time messaging (one-to-one and group chats)
- Message history with pagination
- Typing indicators and read receipts
- Online presence / status
- Responsive UI implemented with CSS Modules

## Tech stack

- React (functional components + hooks)
- TypeScript
- Vite (dev server + build)
- Socket.IO client
- CSS Modules
- Recommended tools: ESLint, Prettier, Jest + Testing Library

---

## Quick start

Requirements: Node.js 16+ and a supported package manager (npm, pnpm or yarn).

1. Clone the repo

```powershell
git clone https://github.com/kalyankashaboina/Chatty.git ; cd Chatty
```

2. Copy environment template and set values

Create a `.env` in the project root or copy from an existing template (not committed):

```powershell
copy .env.example .env
# then edit .env with your VITE_API_URL and VITE_SOCKET_URL
```

3. Install and run

```powershell
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Environment variables

Only variables prefixed with `VITE_` are exposed to client-side code. Keep secrets out of source control and use your hosting platform's secrets for production.

Common variables

- `VITE_API_URL` (required) — Base URL for backend REST API
- `VITE_SOCKET_URL` (required) — Socket.IO server URL
- `VITE_SENTRY_DSN` (optional) — Sentry DSN for error reporting

Add any additional feature flags or integration keys as needed.

---

## Scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build production assets to `dist/`
- `npm run preview` — Preview production build locally
- `npm run lint` — Run linter
- `npm test` — Run tests

---

## Project layout (important files)

- `src/`
  - `components/` — UI components grouped by feature
  - `hooks/` — reusable hooks (socket events, infinite scroll, etc.)
  - `pages/` — route-level views (Home, Chat, Auth)
  - `store/` — Redux slices or other state management
  - `utils/` — axios instance, socket wrapper, helpers
- `public/` — static assets (images, icons)
- `index.html` — app shell

See `FOLDER_STRUCTURE.md` for a complete layout and naming conventions.

---

## Development notes

- Use the shared axios instance at `src/utils/axios.ts` for API calls to centralize headers and error handling.
- Keep socket lifecycle code in `src/hooks/useSocketEvents.tsx` and clean up listeners on unmount.
- Co-locate component styles and tests next to components using CSS Modules.
- Prefer TypeScript types in `src/types/types.d.ts` for API shapes and component props.

If you want, I can add a sample GitHub Actions workflow and deployment configuration.

---

## Contributing

Please read `CONTRIBUTING.md` for contribution guidelines, PR checklist, and coding standards.

---

## Security & reporting

If you discover a security vulnerability, see `SECURITY.md` for reporting instructions.

---

## License

MIT — see `LICENSE` file.

---

Maintainer: kalyankashaboina
