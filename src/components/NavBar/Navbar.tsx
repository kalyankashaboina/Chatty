import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axiosInstance from "../../utils/axios";

interface NavbarProps {
  onToggleTheme: () => void;
  themeMode?: "light" | "dark";
}

const Navbar: React.FC<NavbarProps> = () => {


  // Handle logout functionality
  const handleLogout = async () => {
    try {
      // Sending logout request to the server (logout API)
      await axiosInstance.post("/api/logout");

      // After successful logout, redirect to login page (or wherever you want)
    //  navigate("/login"); // This will redirect to the login page
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AppBar position="static" className="MuiAppBar-root" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" className="chatty-logo">
          💬 Chatty
        </Typography>

        {/* Add Log Out Button */}
        <Button
          color="inherit"
          onClick={handleLogout}
          style={{ marginLeft: "auto" }} // Push the button to the right side
        >
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
