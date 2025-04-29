import mongo from "../mongo.js";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import pbkdf2 from "../../helpers/pbkdf2.js";

export default class PeopleDAO {
  collectionName = "people";

  async readAllPeople() {
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

    if (password) {
      const salt = crypto.randomBytes(16);
      const hashedPassword = await pbkdf2(userData.password, salt);
      rest.password = hashedPassword;
      rest.salt = salt;
    }

    const result = await mongo.db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: rest },
        { returnDocument: "after" },
      );

    if (!result) {
      throw new Error("User not found or update failed");
    }

    console.log("result :>> ", result);
    return result;
  }
}
