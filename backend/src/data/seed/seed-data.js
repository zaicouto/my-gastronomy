import fs from "node:fs/promises";
import path from "node:path";
import mongo from "../mongo.js";
import { config } from "dotenv";

const collectionName = "meals";
const fileName = "meals.json";

async function seedData() {
  config({
    path: path.join(process.cwd(), "src", ".env"),
  });

  console.log("Seeding data...");
  try {
    await mongo.connect({
      connectionString: process.env.MONGO_CONNECTION_STRING,
      databaseName: process.env.DATABASE_NAME,
    });

    const filePath = path.join(process.cwd(), "src", "data", "seed", fileName);
    console.log("filePath :>> ", filePath);

    const data = await fs.readFile(filePath, "utf-8");
    const result = await mongo.db
      .collection(collectionName)
      .insertMany(JSON.parse(data));

    console.log("result :>> ", result);
  } catch (error) {
    console.error("Error seeding data: ", error);
  } finally {
    await mongo.client.close();
  }
}

seedData().catch((error) => {
  console.error(error);
});
