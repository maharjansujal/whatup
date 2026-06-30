import dotenv from "dotenv";
dotenv.config();
import express from "express";
import routes from "./src/routes";
import { errorHandler } from "./src/middleware/error.handler";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/api", routes);

app.use(errorHandler);

app.listen(Number(PORT), () => {
  console.log(`Server started on port: ${PORT}`);
});

export default app;
