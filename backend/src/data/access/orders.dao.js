import mongo from "../mongo.js";
import { ObjectId } from "mongodb";

export default class OrdersDAO {
  collectionName = "orders";

  async readAllOrders() {
    const result = await mongo.db
      .collection(this.collectionName)
      .aggregate([
        {
          $lookup: {
            from: "ordersItems",
            localField: "_id",
            foreignField: "orderId",
            as: "items",
          },
        },
        {
          $lookup: {
            from: "people",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "meals",
            localField: "items.mealId",
            foreignField: "_id",
            as: "items.details",
          },
        },
        {
          $project: {
            userId: 0,
            "user.password": 0,
            "user.salt": 0,
            "items.mealId": 0,
          },
        },
        {
          $group: {
            _id: "$_id",
            pickupTime: { $first: "$pickupTime" },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            user: { $first: "$user" },
            items: { $push: "$items" },
          },
        },
      ])
      .toArray();

    console.log("result.slice(0, 5) :>> ", result.slice(0, 5));
    return result;
  }

  async readUserOrders(userId) {
    const result = await mongo.db
      .collection(this.collectionName)
      .aggregate([
        {
          $match: {
            userId: new ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "ordersItems",
            localField: "_id",
            foreignField: "orderId",
            as: "items",
          },
        },
        {
          $lookup: {
            from: "people",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "meals",
            localField: "items.mealId",
            foreignField: "_id",
            as: "items.details",
          },
        },
        {
          $project: {
            userId: 0,
            "user.password": 0,
            "user.salt": 0,
            "items.mealId": 0,
          },
        },
        {
          $group: {
            _id: "$_id",
            pickupTime: { $first: "$pickupTime" },
            status: { $first: "$status" },
            createdAt: { $first: "$createdAt" },
            user: { $first: "$user" },
            items: { $push: "$items" },
          },
        },
      ])
      .toArray();

    console.log("result.slice(0, 5) :>> ", result.slice(0, 5));
    return result;
  }

  async deleteOrder(orderId) {
    const orderToDelete = await mongo.db
      .collection(this.collectionName)
      .findOneAndDelete({
        _id: new ObjectId(orderId),
      });

    if (!orderToDelete) {
      throw new Error("Order not found or deletion failed");
    }
    console.log("orderToDelete :>> ", orderToDelete);

    const result = await mongo.db
      .collection("ordersItems")
      .deleteMany({ orderId: new ObjectId(orderId) });

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
    rest.pickupTime = new Date(orderData.pickupTime);

    const newOrder = await mongo.db
      .collection(this.collectionName)
      .insertOne(rest);

    if (!newOrder.insertedId) {
      throw new Error("Failed to create order");
    }
    console.log("newOrder :>> ", newOrder);

    items.forEach((item) => {
      item.mealId = new ObjectId(item.mealId);
      item.orderId = new ObjectId(newOrder.insertedId);
    });

    const newOrderItems = await mongo.db
      .collection("ordersItems")
      .insertMany(items);

    if (newOrderItems.insertedCount !== items.length) {
      throw new Error("Failed to create order items");
    }
    console.log("newOrderItems :>> ", newOrderItems);

    return newOrder;
  }
}
