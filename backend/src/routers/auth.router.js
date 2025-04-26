import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongo from "../data/mongo.js";
import { ObjectId } from "mongodb";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

const collectionName = "people";

router.post("/signup", async (req, res) => {
  const userExists = await mongo.db
    .collection(collectionName)
    .findOne({ email: req.body.email });

  if (userExists) {
    return res.bad("User already exists");
  }

  const salt = crypto.randomBytes(16);

  crypto.pbkdf2(
    req.body.password,
    salt,
    310000,
    16,
    "sha256",
    async (err, hashedPassword) => {
      if (err) {
        return res.bad("Failed to hash password");
      }

      const result = await mongo.db.collection(collectionName).insertOne({
        email: req.body.email,
        password: hashedPassword,
        salt,
      });

      if (result.insertedId) {
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
      }
    }
  );
});

router.post("/login", authMiddleware, (req, res) => {
  res.ok(req.auth);
});

export default router;
