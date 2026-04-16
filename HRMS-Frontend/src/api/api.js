import axios from "axios";

// Centralized Axios instance for all backend requests
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Backend base URL
  headers: {
    "Content-Type": "application/json", // Crucial for JSON POST/PUT
  },
  withCredentials: true, // optional if using cookies
});

export default API;