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

- GET /api/users/:id
  - Response: { id, name, email, status }

Messages

- GET /api/chats/:chatId/messages?limit=20&before=<messageId>
  - Response: { messages: [ { id, chatId, senderId, text, createdAt } ], hasMore }

- POST /api/chats/:chatId/messages
  - Request: { text }
  - Response: 201 Created { message: { id, chatId, senderId, text, createdAt } }

Auth handling

- The frontend stores the JWT (or session token) in memory or an HTTP-only cookie set by the backend. If you store the token in localStorage, be aware of XSS risks and consider mitigation strategies.

---

## Socket events (client ↔ server)

These are the commonly used Socket.IO events handled by `src/utils/socket.ts` and `src/hooks/useSocketEvents.tsx`.

- connection / disconnect — Socket connect lifecycle
- auth:token — (client → server) send token after connect for authentication
- user:online — (server → clients) broadcast when a user comes online
- user:offline — (server → clients) broadcast when a user goes offline
- message:send — (client → server) send a new message payload
- message:receive — (server → clients) receive messages in real time
- message:edit — edit notification
- message:delete — delete notification
- typing:start / typing:stop — typing indicators
- message:read — read receipt (server or recipient emits)

Example client flow

1. Connect socket
2. Emit `auth:token` with JWT
3. On `message:receive`, update chat store and UI
4. Emit `message:send` when user submits a message

---

## Scripts

- `npm run dev` — dev server (Vite)
- `npm run build` — create production build (output: `dist/`)
- `npm run preview` — preview production build locally
- `npm run lint` — run lint checks
- `npm test` — run tests

---

## Project layout

High-level view (important files / folders)

- `src/`
  - `components/` — UI components grouped by feature
  - `hooks/` — custom hooks (socket events, infinite scroll)
  - `pages/` — route-level components (login, chat, home)
  - `store/` — Redux or state slices
  - `utils/` — axios instance, socket wrapper, helpers
- `public/` — static assets
- `index.html` — app shell

Refer to `FOLDER_STRUCTURE.md` for the complete map.

---

## Development notes & best practices

- Use the provided axios instance (`src/utils/axios.ts`) to ensure consistent headers and error handling.
- Keep socket subscriptions in `useEffect` within `src/hooks/useSocketEvents.tsx` and clean up on unmount.
- Add component-level tests where business logic is present (hooks, reducers, utils).
- Use TypeScript types in `src/types/types.d.ts` to document API shapes.

---

## CI / Deployment

Recommended: GitHub Actions for CI and Vercel or Netlify for hosting the frontend static site.

Example (summary)

- CI checks: install, lint, test, build
- Deploy: build artifacts and publish `dist/` to Vercel/Netlify

If you want, I can add a sample `.github/workflows/ci.yml` and a `vercel.json` configuration snippet.

---

## Security

- Prefer HTTP-only, secure cookies for auth tokens to reduce XSS risk.
- Use HTTPS in production and set appropriate CORS policies on the backend.
- Validate and sanitize user inputs on the server.
- Rate-limit message endpoints and socket connections on the backend.

---

## Contributing

Preferred workflow

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes with descriptive messages
4. Open a pull request describing the change and context

Checklist for PRs

- [ ] Tests for new behavior or bug fix
- [ ] Linting passes locally
- [ ] Code follows the existing style and uses TypeScript types
- [ ] Update `FOLDER_STRUCTURE.md` or README if the change affects usage

PR review notes

- Keep PRs small and focused
- Include screenshots or a short screencast for UI changes

---

## Troubleshooting

- Socket not connecting: verify `VITE_SOCKET_URL` and backend socket is running; check the browser console for CORS or auth errors.
- CORS errors: ensure backend has the correct origin whitelisted.
- Missing env vars: restart dev server after changing `.env`.
- Build failures: run `npm run build` locally and inspect stack trace; check TypeScript errors.

If problems persist, open an issue with steps to reproduce, relevant logs and screenshots.

---

## Screenshots

Add screenshots to `public/images/` and reference them here. Example:

![Chatty - main chat screen](public/images/screenshot-main.png)

_(Replace the placeholder with real screenshots or a link to a demo video.)_

---

## Maintainers

- kalyankashaboina

## Acknowledgements

- Built with React, Vite and Socket.IO. Thanks to the open-source community.

---

## License

MIT — see `LICENSE` for details.

---

If you'd like, I can also:

- Add a CI workflow file (`.github/workflows/ci.yml`) that runs tests, lint and builds.
- Add a `CONTRIBUTING.md` with templates, or a PR template.
- Insert real screenshots and a short architecture diagram.

Tell me which of those you'd like next and I'll add them.
