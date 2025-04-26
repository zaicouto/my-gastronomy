import { MongoClient } from "mongodb";

class Mongo {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect({ connectionString, databaseName }) {
    const client = new MongoClient(connectionString);
    this.client = client;

    await client.connect();

    this.db = client.db(databaseName);
    console.log("Connected to MongoDB");
  }
}

const mongo = new Mongo();

export default mongo;
