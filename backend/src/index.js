import express from "express";
import cors from "cors";
import { Mongo } from "./database/mongo.js";
import { config } from "dotenv";

config();

async function main() {
  const app = express();
  const result = await Mongo.connect({
    mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
    databaseName: process.env.DATABASE_NAME,
  });
  console.log("result :>> ", result);

  app.use(cors());
  app.use(express.json());

  app.get("/", (_, res) => {
    res.send({
      success: true,
      body: "Hello World!",
    });
  });

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
