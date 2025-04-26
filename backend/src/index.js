import express from "express";
import cors from "cors";
import mongo from "./data/mongo.js";
import { config } from "dotenv";
import path from "node:path";
import authRouter from "./routers/auth.router.js";
import httpResponseMiddleware from "./middlewares/http-response.middleware.js";
import peopleRouter from "./routers/people.router.js";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";

config({
  path: path.join(process.cwd(), "src", ".env"),
});

async function main() {
  const connectionString = process.env.MONGO_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error("MONGO_CONNECTION_STRING is not defined");
  }

  const databaseName = process.env.DATABASE_NAME;
  if (!databaseName) {
    throw new Error("DATABASE_NAME is not defined");
  }

  await mongo.connect({
    connectionString,
    databaseName,
  });
  console.log("databaseName :>> ", databaseName);

  const app = express();

  app.use(cors());

  app.use(express.json());

  app.use(httpResponseMiddleware);

  
  app.get("/", (_, res) => res.ok("Hello World!"));
  
  app.use("/auth", authRouter);
  
  app.use("/people", peopleRouter);
  
  app.use(errorHandlerMiddleware);
  
  const port = process.env.PORT || 3000;
  const hostname = process.env.HOSTNAME || "localhost";

  app.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
}

main().catch((err) => {
  console.error("Error starting app :>> ", err);
  process.exit(1);
});
