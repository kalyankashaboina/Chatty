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
            const token = data.token;
            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // 🔌 Initialize and connect the socket
                const socket = initializeSocket();
                socket.connect();
                socket.on("connect", () => {
                    console.log("✅ Socket connected after login:", socket.id);
                });
                // Initialize WebSocket or other actions upon login success
                onSuccess();

                navigate("/home");
                console.log("Login successful:", data.user);
            } else {
                alert("Login failed. Token not received.");
            }
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
