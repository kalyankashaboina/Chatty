# Chatty — Frontend (React + TypeScript)

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/bundler-vite-brightgreen)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/framework-react-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)

Chatty is a production-oriented single-page application (SPA) frontend for a real-time chat platform. It’s implemented with React, TypeScript, and Vite, and it integrates with a REST API and a Socket.IO server for real-time features.

**Quick Links**

- **Live Demo:** (Add URL when available)
- **Backend API Repository:** (Add backend repo link)

## Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Project Architecture](#project-architecture)
- [API & Socket Contracts](#api--socket-contracts)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Maintainers](#maintainers)

---

## About

This repository contains the frontend application for Chatty. The UI focuses on performance, accessibility, and a clean developer experience. It connects to a backend REST API for persistent data (like user profiles and message history) and a Socket.IO server for real-time messaging and presence.

## Key Features

- **Full User Authentication**: Register, login, logout, and password reset flows.
- **Real-Time Messaging**: One-to-one and group chats powered by WebSockets.
- **Message History**: Loads recent messages on connect with support for pagination/infinite scroll.
- **Real-Time Indicators**: Live typing indicators and message read receipts.
- **Online Presence**: See which users are currently online.
- **Responsive UI**: Modern design implemented with CSS Modules for scoped styling.

## Tech Stack

- **Framework**: React (Functional Components + Hooks)
- **Language**: TypeScript
- **Build Tool**: Vite (Dev Server + Bundler)
- **Real-Time**: Socket.IO Client
- **Styling**: CSS Modules
- **Recommended Tools**: ESLint, Prettier, Jest + React Testing Library

---

## Quick Start

**Prerequisites**: Node.js v16+ and `npm` (or `pnpm`/`yarn`).

**1. Clone the repository**

```bash
git clone https://github.com/kalyankashaboina/Chatty.git
cd Chatty
```

**2. Set up environment variables**
Create a local environment file by copying the example.

```bash
cp .env.example .env
```

Now, open the `.env` file and add the required URLs for your backend API and socket server.

**3. Install dependencies and run**

```bash
npm install
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## Environment Variables

Only variables prefixed with `VITE_` are exposed to the client-side code. Never commit secrets to source control.

| Variable          | Required | Description                       | Example                     |
| :---------------- | :------- | :-------------------------------- | :-------------------------- |
| `VITE_API_URL`    | **Yes**  | Base URL for the backend REST API | `http://localhost:8080/api` |
| `VITE_SOCKET_URL` | **Yes**  | URL for the Socket.IO server      | `http://localhost:8080`     |
| `VITE_SENTRY_DSN` | No       | Sentry DSN for error reporting    | (Your Sentry DSN)           |

---

## Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement.
- `npm run build`: Bundles the application for production into the `dist/` folder.
- `npm run preview`: Serves the production build locally to preview it.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run test`: Runs unit and integration tests using Jest.

---

## Project Architecture

The project follows a component-based, feature-driven folder structure to ensure scalability and separation of concerns.

- `src/components/`: Shared, reusable UI components (e.g., `Button`, `Input`).
- `src/hooks/`: Custom React hooks for shared logic (e.g., `useSocket`, `useAuth`).
- `src/pages/`: Top-level components that correspond to application routes.
- `src/services/`: Business logic, API calls, and socket event handlers.
- `src/utils/`: Utility functions, such as an Axios instance wrapper.

For a complete breakdown of our structure and naming conventions, please see our **[FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md)** document.

---

## API & Socket Contracts

The frontend relies on a specific contract with the backend. Key interactions include:

**REST API Endpoints**

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/users/me`

**Socket.IO Events**

- **Emitted by Client**: `sendMessage`, `startTyping`
- **Listened for by Client**: `newMessage`, `userTyping`, `userOnline`

---

## Contributing

We welcome all contributions! Please read our **[CONTRIBUTING.md](CONTRIBUTING.md)** file for guidelines on how to report bugs, suggest features, and submit pull requests.

---

## Security

If you discover a security vulnerability, please see our **[SECURITY.md](SECURITY.md)** for instructions on how to report it privately.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Maintainers

- **[kalyankashaboina](kalyankashaboina07@gmail.com)**
