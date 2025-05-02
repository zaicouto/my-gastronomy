import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongo from "../data/mongo.js";
import { ObjectId } from "mongodb";
import authMiddleware from "../middlewares/auth.middleware.js";
import pbkdf2 from "../helpers/pbkdf2.js";

const router = express.Router();

const collectionName = "people";

router.post("/signup", async (req, res) => {
  console.log("Trying to sign up -> /auth/signup");
  console.log("req.body.email :>> ", req.body.email);

  const userExists = await mongo.db
    .collection(collectionName)
    .findOne({ email: req.body.email });

  if (userExists) {
    return res.bad("User already exists");
  }

  const newSalt = crypto.randomBytes(16);
  const hashedPassword = await pbkdf2(req.body.password, newSalt);
  const result = await mongo.db.collection(collectionName).insertOne({
    email: req.body.email,
    password: hashedPassword,
    salt: newSalt,
  });

  if (!result.insertedId) {
    throw new Error("Failed to create user");
  }

  const { password, salt, ...rest } = await mongo.db
    .collection(collectionName)
    .findOne({ _id: new ObjectId(result.insertedId) });

  const token = jwt.sign(
    {
      id: rest._id,
      email: rest.email,
    },
    process.env.JWT_SECRET
  );

  return res.ok({ token, user: rest, loggedIn: true });
});

router.post("/login", authMiddleware, (req, res) => {
  res.ok(req.auth);
});

export default router;
