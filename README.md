# 💬 Chatty – Real-time Chat App (Frontend)

Chatty is a modern, real-time chat application built using **React**, **TypeScript**, **Vite**, and **Socket.IO**. This is the frontend for the chat platform, designed with responsiveness, performance, and usability in mind.

---

## 📦 Installation

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

5. **Preview the production build**

```bash
npm run preview
```

---

## 🧪 Testing

- Run unit tests (if configured):

  ```bash
  npm test
  ```

- Run linting checks:
  ```bash
  npm run lint
  ```

---

## 📚 Documentation

For detailed API documentation and backend setup, refer to the Chatty Backend Repository.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## ⚙️ Tech Stack

- ⚛️ **React** (with Hooks)
- ⛓️ **TypeScript**
- ⚡ **Vite** (super-fast dev server + build)
- 🔌 **Socket.IO Client** – for real-time communication
- 🎨 **CSS Modules / Tailwind / SCSS** (based on what you used)
- ✅ Optional: ESLint, Prettier for code quality

---

## 🚀 Features

- 🔐 User Authentication (via backend API)
- 📥 Real-time chat between users
- 📜 Displays last 20 messages on load
- 🟢 Online/offline user status
- 💅 Clean and responsive UI

---

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chatty-frontend.git
   cd chatty-frontend
   ```
2. **Set up environment variables**

   Create a `.env` file in the root directory and configure the required environment variables. Example:

   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

3. **Install dependencies**


    Run the following command to install all required packages:

    ```bash
    npm install
    ```

4. **Start the development server**


    Launch the development server with:

    ```bash
    npm run dev
    ```

    The app will be available at `http://localhost:5173` by default.
