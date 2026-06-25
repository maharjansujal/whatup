import { Server, Socket } from "socket.io";

const userSocketMap = new Map<number, string>();

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    //Register user connection
    const userIdStr = socket.handshake.query.userId;
    if (userIdStr) {
      const userId = Number(userIdStr);
      if (!isNaN(userId)) {
        userSocketMap.set(userId, socket.id);
        console.log(`User ${userId} associated with socket ${socket.id}`);
      }
    }

    // handle disconnects
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
      // Find and remove the user from map

      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} removed from active connections`);
          break;
        }
      }
    });

    // Listen for typing events from sender and relay to receiver
    socket.on("typing", ({ senderId, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(Number(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userTyping", {
          senderId: Number(senderId),
        });
      }
    });

    // Listen for stopTyping events from sender and relay to receiver
    socket.on("stopTyping", ({ senderId, receiverId }) => {
      const receiverSocketId = getReceiverSocketId(Number(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("userStoppedTyping", {
          senderId: Number(senderId),
        });
      }
    });
  });
};

// Helper function to send real-time events to a specific user
export const getReceiverSocketId = (receiverId: number): string | undefined =>
  userSocketMap.get(receiverId);

export { userSocketMap };
