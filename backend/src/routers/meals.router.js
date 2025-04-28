import express from "express";
import MealsDAO from "../data/access/meals.dao.js";

const router = express.Router();

const mealsDao = new MealsDAO();

router.get("/", async (_, res) => {});

router.get("/", async (_, res) => {});

export default router;
