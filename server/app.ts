import dotenv from "dotenv";
dotenv.config();
import express from "express";
import routes from "./src/routes";
import { errorHandler } from "./src/middleware/error.handler";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { initSocket } from "./src/socket";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.use(errorHandler);

// Wrap Express in HTTP server
const server = http.createServer(app);

// Initialize socket.io on top of HTTP server
initSocket(server);

server.listen(Number(PORT), () => {
  console.log(`Server started on port: ${PORT}`);
});

export default app;
