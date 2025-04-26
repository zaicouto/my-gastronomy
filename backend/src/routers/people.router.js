import express from "express";
import PeopleController from "../controllers/people.controller.js";

const router = express.Router();

const peopleController = new PeopleController();

router.get("/", async (_, res) => {
  console.log("Getting all people -> /people");
  const result = await peopleController.getAllPeople();
  res.ok(result);
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(`Deleting user -> /people/${userId}`);

  const result = await peopleController.deleteUser(userId);
  res.ok(result);
});

export default router;
