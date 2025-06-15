import axiosInstance from "../utils/axios";
import { disconnectSocket } from "../utils/socket";

// Login Service
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post("/api/login", { email, password });
        localStorage.setItem("user", JSON.stringify(response.data?.user));
        return response.data; // The server's response data (e.g., token, user)
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Login failed. Please check your credentials.");
    }
};

// Register Service
export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post("/api/register", { username, email, password });
        return response.data; // The server's response data (e.g., user details)
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Registration failed. Please try again.");
    }
};

// Logout Service
export const logoutUser = async () => {
    try {
        await axiosInstance.post("/api/logout");
        disconnectSocket()
        

    } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Logout failed. Please try again.");
    }
};
