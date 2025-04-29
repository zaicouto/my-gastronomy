import mongo from "../mongo.js";
import { ObjectId } from "mongodb";

export default class OrdersDAO {
  collectionName = "orders";

  async readAllOrders() {
    const result = await mongo.db
      .collection(this.collectionName)
      .find({})
      .toArray();

    console.log("result.slice(0, 5) :>> ", result.slice(0, 5));
    return result;
  }

  async deleteOrder(orderId) {
    const result = await mongo.db
      .collection(this.collectionName)
      .findOneAndDelete({
        _id: new ObjectId(orderId),
      });

    if (!result) {
      throw new Error("Order not found or deletion failed");
    }

    console.log("result :>> ", result);
  }

  async updateOrder(orderId, orderData) {
    const result = await mongo.db
      .collection(this.collectionName)
      .findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { $set: orderData },
        { returnDocument: "after" },
      );

    if (!result) {
      throw new Error("Order not found or update failed");
    }

    console.log("result :>> ", result);
    return result;
  }

  async createOrder(orderData) {
    const { items, ...rest } = orderData;

    rest.createdAt = new Date();
    rest.status = "pending";
    rest.userId = new ObjectId(orderData.userId);

    const newOrder = await mongo.db
      .collection(this.collectionName)
      .insertOne(rest);

    if (!newOrder.insertedId) {
      throw new Error("Failed to create order");
    }

    const result = await mongo.db.collection("orders_items").insertMany(items);
    return result;
  }
}
