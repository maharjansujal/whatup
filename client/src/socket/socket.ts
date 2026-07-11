import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.log("Socket error:", err.message);
});

export default socket;
