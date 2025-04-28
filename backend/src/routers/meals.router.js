import express from "express";
import MealsDAO from "../data/access/meals.dao.js";

const router = express.Router();

const mealsDao = new MealsDAO();

router.get("/", async (_, res) => {
  console.log("Reading all meals -> /meals");
  const meals = await mealsDao.readAllMeals();
  res.ok(meals);
});

router.get("/available", async (_, res) => {
  console.log("Reading available meals -> /meals/available");
  const meals = await mealsDao.readAvailableMeals();
  res.ok(meals);
});

router.post("/", async (req, res) => {
  console.log("Creating meal -> /meals");
  console.log("req.body :>> ", req.body);

  const result = await mealsDao.createMeal(req.body);
  res.ok({
    message: "Meal created successfully",
    mealId: result.insertedId,
  });
});

router.delete("/:mealId", async (req, res) => {
  const { mealId } = req.params;
  console.log(`Deleting meal -> /meals/${mealId}`);

  await mealsDao.deleteMeal(mealId);
  res.ok({ message: "Meal deleted successfully" });
});

router.put("/:mealId", async (req, res) => {
  const { mealId } = req.params;

  console.log(`Updating meal -> /meals/${mealId}`);
  console.log("req.body :>> ", req.body);

  const result = await mealsDao.updateMeal(mealId, req.body);
  res.ok({
    message: "Meal updated successfully",
    mealId: result._id,
  });
});

export default router;
