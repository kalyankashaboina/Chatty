import React, { useState, } from "react";
import {
  Paper,
  List,
  ListItemButton,
  Typography,
  Stack,
  Box,
  Avatar,
  TextField,
  Button,
} from "@mui/material";
import { User } from "../../types/types";
import styles from "./Sidebar.module.css";
import { FiberManualRecord } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

interface SidebarProps {
  users: User[];
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  users,
  selectedUser,
  setSelectedUser,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Safe filtering with optional chaining
  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = async () => {
    console.log("Logout clicked");
    try {
      logoutUser()
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Something went wrong while logging out.");
    }
  };

  // useEffect(() => {
  //   // Logging when a user goes online/offline
  //   users.forEach((user) => {
  //     if (user.isOnline) {
  //       console.log(`${user.username} is now online`);
  //     } else {
  //       console.log(`${user.username} is offline`);
  //     }
  //   });
  // }, [users]);

  return (
    <Paper elevation={2} className={styles.sidebar}>
      {/* Sidebar header */}
      <Box className={styles.sidebarHeaderContainer}>
        <Typography variant="h6" className={styles.sidebarHeader}>
          Users
        </Typography>

        {/* Logout Button - Only on mobile */}
        <Button className={styles.logoutButton} variant="contained" onClick={handleLogout}>Logout</Button>
      </Box>

      {/* Search box */}
      <Box className={styles.searchBox}>
        <TextField
          fullWidth
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {/* Add User button */}
      <Button
        fullWidth
        className={styles.addUserBtn}
        onClick={() => console.log("Add User clicked")}
        variant="contained"
      >
        + Add User
      </Button>

      {/* User list */}
      <List className={styles.sidebarList}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <ListItemButton
              key={user.id}
              selected={user.id === selectedUser?.id}
              onClick={() => setSelectedUser(user)}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ width: "100%" }}
                className={styles.singleUser}
              >
                {/* Profile Picture and User Info */}
                <Box>
                  <Avatar
                    src={user.profilePic || undefined} // Use fallback value
                    alt={user.username}
                    sx={{
                      width: 40,
                      height: 40,
                      position: "relative",
                    }}
                  >
                    <FiberManualRecord
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        fontSize: 12,
                        color: user.isOnline ? "#44b700" : "gray", // Green if online
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                    />
                  </Avatar>
                </Box>

                {/* User details */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ whiteSpace: "nowrap" }}>
                      {user.username}
                    </Typography>
                    <Typography className={styles.time}>Today</Typography>
                  </Box>

                  <Box className={styles.userMessageDetails}>
                    <Typography className={styles.lastMessage}>
                      Last message here
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </ListItemButton>
          ))
        ) : (
          <Box p={2}>
            <Typography variant="body2" color="textSecondary">
              No users found
            </Typography>
          </Box>
        )}
      </List>
    </Paper>
  );
};

export default Sidebar;
