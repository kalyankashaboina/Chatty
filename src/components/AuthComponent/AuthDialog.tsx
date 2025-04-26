import React, { useState, useEffect } from "react";
import {
  Modal,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
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
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTab(defaultTab);
  }, [defaultTab]);

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post("/api/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify({
        id: response.data.user._id,
        username: response.data.user.fullName,
      }));

      const socketConnection = initializeSocket(response.data.token);
      socketConnection.on("connect", () => console.log("Connected to WebSocket"));
      socketConnection.on("message", (message: string) => console.log(message));

      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const response = await axiosInstance.get("/welcome");
        setWelcomeMessage(response.data.message);
      } catch (error) {
        console.error("Error fetching welcome message:", error);
      }
    };

    fetchWelcomeMessage();
  }, []);

  console.log("Welcome message:", welcomeMessage);

  const handleRegister = async () => {
    try {
      await axiosInstance.post("/api/register", { username, email, password });
      alert("Registration successful! You can now log in.");
      setTab("login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const textFieldStyles = {
    input: {
      color: "#09090b", // Black color
      backgroundColor: "transparent",
      caretColor: "#09090b", // Black color
    },
    label: {
      color: "#09090b", // Black color
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a78bfa", // Light Violet
      },
      "&:hover fieldset": {
        borderColor: "#7c3aed", // Violet
      },
      "&.Mui-focused fieldset": {
        borderColor: "#7c3aed", // Violet
      },
    },
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="auth-dialog">
      <Paper
        className={styles.dialog}
        sx={{
          backgroundColor: "#ffffff", // White background
          color: "#09090b", // Black text color
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
            <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#7c3aed", color: "#ffffff" }} onClick={handleLogin}>
              Login
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
            <Button fullWidth variant="contained" sx={{ mt: 2, backgroundColor: "#7c3aed", color: "#ffffff" }} onClick={handleRegister}>
              Register
            </Button>
          </>
        )}
      </Paper>
    </Modal>
  );
};

export default AuthDialog;
