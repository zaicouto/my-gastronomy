import mongo from "../mongo.js";
import { ObjectId } from "mongodb";

export default class MealsDAO {
  collectionName = "meals";

  async readAllMeals() {
    const result = await mongo.db
      .collection(this.collectionName)
      .find({})
      .toArray();

    console.log("result.slice(0, 5) :>> ", result.slice(0, 5));
    return result;
  }

  async readAvailableMeals() {
    const result = await mongo.db
      .collection(this.collectionName)
      .find({ available: true })
      .toArray();

    console.log("result.slice(0, 5) :>> ", result.slice(0, 5));
    return result;
  }

  async createMeal(mealData) {
    const result = await mongo.db
      .collection(this.collectionName)
      .insertOne(mealData);

    return result;
  }

  async deleteMeal(mealId) {
    const result = await mongo.db
      .collection(this.collectionName)
      .findOneAndDelete({
        _id: new ObjectId(mealId),
      });

    if (!result) {
      throw new Error("Meal not found or deletion failed");
    }

    console.log("result :>> ", result);
  }

  async updateMeal(mealId, mealData) {
    const result = await mongo.db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(mealId) },
        { $set: mealData },
        { returnDocument: "after" },
      );

    if (!result) {
      throw new Error("Meal not found or update failed");
    }

    console.log("result :>> ", result);
    return result;
  }
}
