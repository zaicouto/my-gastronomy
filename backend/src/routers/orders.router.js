import express from "express";
import OrdersDAO from "../data/access/orders.dao.js";

const router = express.Router();

const ordersDao = new OrdersDAO();

router.get("/", async (_, res) => {
  console.log("Reading all orders -> /orders");
  const orders = await ordersDao.readAllOrders();
  res.ok(orders);
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(`Reading user's orders -> /orders/${userId}`);

  const orders = await ordersDao.readUserOrders(userId);
  res.ok(orders);
});

router.post("/", async (req, res) => {
  console.log("Creating order -> /orders");
  console.log("req.body :>> ", req.body);

  const result = await ordersDao.createOrder(req.body);
  res.ok({
    message: "Order created successfully",
    orderId: result.insertedId,
  });
});

router.delete("/:orderId", async (req, res) => {
  const { orderId } = req.params;
  console.log(`Deleting order -> /orders/${orderId}`);

  await ordersDao.deleteOrder(orderId);
  res.ok({ message: "Order deleted successfully" });
});

router.put("/:orderId", async (req, res) => {
  const { orderId } = req.params;

  console.log(`Updating order -> /orders/${orderId}`);
  console.log("req.body :>> ", req.body);

  const result = await ordersDao.updateOrder(orderId, req.body);
  res.ok({
    message: "Order updated successfully",
    orderId: result._id,
  });
});

export default router;
