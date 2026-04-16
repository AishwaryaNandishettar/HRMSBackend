// services/chatSocket.js
import { io } from "socket.io-client";

export const chatSocket = io(`${import.meta.env.VITE_API_BASE_URL}`, {
  auth: {
    token: localStorage.getItem("token")
  }
});
