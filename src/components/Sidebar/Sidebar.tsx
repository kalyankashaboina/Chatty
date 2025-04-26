import React, { useState } from "react";
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
import { User } from "../../../types";
import styles from "./Sidebar.module.css";
import { FiberManualRecord } from "@mui/icons-material";

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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper elevation={2} className={styles.sidebar}>
      {/* Sidebar header */}
      <Typography variant="h6" className={styles.sidebarHeader}>
        Users
      </Typography>

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

      {/* Add User Button */}
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
                sx={{ width: "100%"

          
                }}
                className={styles.singleUser}
              >
                {/* Profile Picture and User Info */}
                <Box>
                  <Avatar
                    src={user.profilePic || undefined}
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
                        top: 3,
                        right: 5,
                        fontSize: 12,
                        color: user.isOnline ? "#805ad5" : "gray",
                        backgroundColor: "#fff",
                        borderRadius: "50%",
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
                    <Typography sx={{whiteSpace:"nowrap"}}>{user.username}</Typography>
                    <Typography className={styles.time}>Today</Typography>
                  </Box>

                  <Box className={styles.userMessageDetails}>
                    <Typography className={styles.lastMessage}>
                      Last message here
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              {/* <Stack direction="row" spacing={2} alignItems="center">
                <Box position="relative" sx={{ display: "inline-block" }}>
                  <Avatar
                    src={user.profilePic || undefined}
                    alt={user.username}
                    sx={{ width: 40, height: 40 }}
                  />
                  <FiberManualRecord
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      fontSize: 12,
                      color: user.isOnline ? "#805ad5" : "gray",
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 ,width: "100%"}}>
                  <Box sx={{ display: "flex", justifyContent: "space-around"}}>
                  <Typography>{user.username}</Typography>
                  <Typography className={styles.time}>Today</Typography>
                  </Box>
                 
                  <Box className={styles.userMessageDetails}>
                    <Typography className={styles.lastMessage}>
                      Last message here
                    </Typography>
                    
                  </Box>
                </Box>
              </Stack> */}
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
