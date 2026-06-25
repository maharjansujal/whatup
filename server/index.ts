import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import userRouter from "./src/routes/user.routes";
import messageRoutes from "./src/routes/message.routes";
import { initSocket } from "./src/socket/socket";
import { registerSocketMiddleware } from "./src/middleware/socket.middleware";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/messages", messageRoutes);

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
// io.on("connection", (socket) => {
//   console.log("Client connected:", socket.id);
// });

registerSocketMiddleware(io);
initSocket(io);
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
