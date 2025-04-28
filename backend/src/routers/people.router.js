import express from "express";
import PeopleDAO from "../data/access/people.dao.js";

const router = express.Router();

const peopleDao = new PeopleDAO();

router.get("/", async (_, res) => {
  console.log("Reading all people -> /people");
  const people = await peopleDao.getAllPeople();
  res.ok(people);
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(`Deleting user -> /people/${userId}`);

  await peopleDao.deleteUser(userId);
  res.ok("User deleted successfully");
});

router.put("/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log(`Updating user -> /people/${userId}`);
  console.log(`req.body :>> `, req.body);

  const result = await peopleDao.updateUser(userId, req.body);
  res.ok({
    message: "User updated successfully",
    userId: result._id,
  });
});

export default router;
