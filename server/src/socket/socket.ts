import { Server, Socket } from "socket.io";

const userSocketMap = new Map<number, string>();

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    const user = socket.data.user;
    if (!user || !user.id) {
      console.error("Socket connected without a valid user ID payload");
      return socket.disconnect();
    }
    const userId = Number(user.id);

    userSocketMap.set(userId, socket.id);
    console.log(`Client connected: ${socket.id}`);

    // handle disconnects
    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      console.log(`User ${userId} removed from active connections`);
    });

    // Listen for typing events from sender and relay to receiver
    socket.on("typing", ({ receiverId }) => {
      const senderId = socket.data.user.id;
      const receiverSocketId = getReceiverSocketId(Number(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          senderId,
        });
      }
    });

    // Listen for stopTyping events from sender and relay to receiver
    socket.on("stopTyping", ({ receiverId }) => {
      const senderId = socket.data.user.id;
      const receiverSocketId = getReceiverSocketId(Number(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStoppedTyping", { senderId });
      }
    });
  });
};

// Helper function to send real-time events to a specific user
export const getReceiverSocketId = (receiverId: number): string | undefined =>
  userSocketMap.get(receiverId);

export { userSocketMap };
