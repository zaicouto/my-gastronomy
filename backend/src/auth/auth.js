import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import { Mongo } from "../database/mongo.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const collectionName = "people";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, callback) => {
      try {
        const user = await Mongo.db
          .collection(collectionName)
          .findOne({ email });

        if (!user) {
          return callback(null, false);
        }

        const saltBuffer = user.salt.saltBuffer;

        crypto.pbkdf2(
          password,
          saltBuffer,
          310000,
          16,
          "sha256",
          (err, hashedPassword) => {
            if (err) {
              return callback(null, false);
            }

            const userPasswordBuffer = Buffer.from(user.password.buffer);
            if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
              return callback(null, false);
            }

            const { password, salt, ...rest } = user;
            return callback(null, rest);
          }
        );
      } catch (error) {
        console.error(error);
        return callback(null, false);
      }
    }
  )
);

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const userExists = await Mongo.db
    .collection(collectionName)
    .findOne({ email: req.body.email });

  if (userExists) {
    return res.status(400).json({
      success: false,
      error: "User already exists",
      body: null,
    });
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
        return res.status(400).json({
          success: false,
          error: "Error hashing password",
          body: null,
        });
      }

      const result = await Mongo.db.collection(collectionName).insertOne({
        email: req.body.email,
        password: hashedPassword,
        salt,
      });

      if (result.insertedId) {
        const { password, salt, ...rest } = await Mongo.db
          .collection(collectionName)
          .findOne({ _id: new ObjectId(result.insertedId) });

        const token = jwt.sign(
          {
            id: rest._id,
            email: rest.email,
          },
          process.env.JWT_SECRET
        );

        return res.json({
          success: true,
          error: null,
          body: { token, user: rest, loggedIn: true },
        });
      }
    }
  );
});

export default authRouter;
