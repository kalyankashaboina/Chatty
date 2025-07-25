// src/components/Auth/Login.tsx
import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { initializeSocket } from "../../../utils/socket";
import { loginUser } from "../../../services/authService";

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const handleLogin = async () => {
  setLoading(true);
  try {
    const data = await loginUser(email, password);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    const socket = initializeSocket();
    if (!socket) {
      alert("Socket initialization failed");
      setLoading(false);
      return;
    }

    socket.on("connect", () => {
      console.log("✅ Socket connected after login:", socket.id);
    });

    onSuccess();
    navigate("/home");
  } catch (error) {
    console.error("Login failed:", error);
    alert("Login failed. Please check your credentials.");
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <Typography variant="h6" mb={2}>Login</Typography>
      <TextField
        fullWidth
        label="Email"
        margin="normal"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        fullWidth
        label="Password"
        margin="normal"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2, backgroundColor: "#7c3aed", color: "#ffffff" }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </Button>
    </>
  );
};

export default Login;
