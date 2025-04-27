import React, { useState, useEffect } from "react";
import { Modal, Paper, Typography, Stack, TextField, Button } from "@mui/material";
import styles from "./AuthDialog.module.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { initializeSocket } from "../../utils/socket";

interface AuthDialogProps {
  onClose: () => void;
  defaultTab?: "login" | "register";
  open: boolean;
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  onClose,
  defaultTab = "login",
  open,
}) => {
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/login", { email, password });

     
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const socketConnection = initializeSocket();
      socketConnection.on("connect", () => console.log("Connected to WebSocket"));
      
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/api/register", { username, email, password });
      alert("Registration successful! You can now log in.");
      setTab("login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    input: {
      color: "#09090b", 
      backgroundColor: "transparent",
      caretColor: "#09090b", 
    },
    label: {
      color: "#09090b", 
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a78bfa", 
      },
      "&:hover fieldset": {
        borderColor: "#7c3aed", 
      },
      "&.Mui-focused fieldset": {
        borderColor: "#7c3aed", 
      },
    },
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="auth-dialog">
      <Paper
        className={styles.dialog}
        sx={{
          backgroundColor: "#ffffff", 
          color: "#09090b", 
          padding: 3,
          borderRadius: 2,
          boxShadow: 6,
        }}
      >
        <Stack direction="row" justifyContent="space-around" className={styles.tabs}>
          <Typography
            variant="subtitle1"
            className={`${styles.tab} ${tab === "login" ? styles.active : ""}`}
            onClick={() => setTab("login")}
          >
            Login
          </Typography>
          <Typography
            variant="subtitle1"
            className={`${styles.tab} ${tab === "register" ? styles.active : ""}`}
            onClick={() => setTab("register")}
          >
            Register
          </Typography>
        </Stack>

        {tab === "login" && (
          <>
            <Typography variant="h6" mb={2}>Login</Typography>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyles}
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
        )}

        {tab === "register" && (
          <>
            <Typography variant="h6" mb={2}>Register</Typography>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={textFieldStyles}
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={textFieldStyles}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#7c3aed", color: "#ffffff" }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </>
        )}
      </Paper>
    </Modal>
  );
};

export default AuthDialog;
