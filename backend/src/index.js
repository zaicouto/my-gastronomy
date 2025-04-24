import express from "express";
import cors from "cors";
import { Mongo } from "./database/mongo.js";
import { config } from "dotenv";
import path from "node:path";
import authRouter from "./auth/auth.js";

config({
  path: path.join(process.cwd(), "src", ".env"),
});

async function main() {
  const mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
  if (!mongoConnectionString) {
    throw new Error("MONGO_CONNECTION_STRING is not defined");
  }

  const databaseName = process.env.DATABASE_NAME;
  if (!databaseName) {
    throw new Error("DATABASE_NAME is not defined");
  }

  await Mongo.connect({
    mongoConnectionString,
    databaseName,
  });
  console.log("databaseName :>> ", databaseName);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_, res) => {
    res.json({
      success: true,
      error: null,
      body: "Hello World!",
    });
  });

  app.use("/auth", authRouter);

  const PORT = process.env.PORT || 3000;
  const hostname = process.env.HOSTNAME || "localhost";

  app.listen(PORT, () => {
    console.log(`Server is running on http://${hostname}:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
