import { MongoClient } from "mongodb";

export const Mongo = {
  async connect({ mongoConnectionString, databaseName }) {
    try {
      const client = new MongoClient(mongoConnectionString);
      this.client = client;

      await client.connect();
      console.log("Connected to MongoDB");

      this.db = client.db(databaseName);

      return "MongoDB connected successfully";
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
