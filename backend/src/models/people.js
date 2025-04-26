import mongo from "../data/mongo.js";
import { ObjectId } from "mongodb";
import crypto from "crypto";

const collectionName = "people";

export default class People {
  async getAllPeople() {
    const result = await mongo.db.collection(collectionName).find({}).toArray();
    console.log("result.slice(0, 5) :>> ", result.slice(0, 5));
    return result;
  }

  async deleteUser(userId) {
    const result = await mongo.db.collection(collectionName).findOneAndDelete({
      _id: new ObjectId(userId),
    });

    if (!result) {
      throw new Error("User not found or deletion failed");
    }

    console.log("result :>> ", result);
  }

  async updateUser() {}
}
