import { MongoClient } from "mongodb";

export const Mongo = {
  async connect({ mongoConnectionString, databaseName }) {
    try {
      const client = new MongoClient(mongoConnectionString);
      this.client = client;

      await client.connect();

      this.db = client.db(databaseName);

      console.log("Connected to MongoDB");
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
