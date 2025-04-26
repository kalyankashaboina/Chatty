import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import Stack from "@mui/material/Stack";

interface NavbarProps {
  onToggleTheme: () => void;

  themeMode?: "light" | "dark";
}
//{
 // onToggleTheme,
  //themeMode = "light",
//}
const Navbar: React.FC<NavbarProps> = () => {
  return (
    <AppBar position="static" className="MuiAppBar-root" elevation={0}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" className="chatty-logo">
          💬 Chatty
        </Typography>

        {/* <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={onToggleTheme} color="inherit">
            {themeMode === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Stack> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
