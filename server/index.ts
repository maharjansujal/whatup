import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import userRouter from "./src/routes/user.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
