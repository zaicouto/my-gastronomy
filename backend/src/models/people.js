import mongo from "../data/mongo.js";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { promisify } from "node:util";

export default class People {
  collectionName = "people";

  async getAllPeople() {
    const result = await mongo.db
      .collection(this.collectionName)
      .find({})
      .toArray();

    console.log("result.slice(0, 5) :>> ", result.slice(0, 5));
    return result;
  }

  async deleteUser(userId) {
    const result = await mongo.db
      .collection(this.collectionName)
      .findOneAndDelete({
        _id: new ObjectId(userId),
      });

    if (!result) {
      throw new Error("User not found or deletion failed");
    }

    console.log("result :>> ", result);
  }

  async updateUser(userId, userData) {
    const { _id, password, ...rest } = userData;
    const updateFields = { ...rest };

    if (password) {
      const salt = crypto.randomBytes(16);
      try {
        const hashedPassword = await promisify(crypto.pbkdf2)(
          userData.password,
          salt,
          310000,
          16,
          "sha256"
        );

        updateFields.password = hashedPassword;
        updateFields.salt = salt;
      } catch (err) {
        console.error("Failed to hash password :>> ", err);
        throw new Error("Failed to hash password");
      }
    }

    const result = await mongo.db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateFields },
        { returnDocument: "after" }
      );

    if (!result) {
      throw new Error("User not found or update failed");
    }

    console.log("result :>> ", result);
    return result;
  }
}
