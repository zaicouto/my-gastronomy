import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import mongo from "../data/mongo.js";
import jwt from "jsonwebtoken";
import pbkdf2 from "../helpers/pbkdf2.js";

const collectionName = "people";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, userPassword, callback) => {
      const user = await mongo.db.collection(collectionName).findOne({ email });

      if (!user) {
        return callback(null, false);
      }

      try {
        const hashedPassword = await pbkdf2(userPassword, user.salt.buffer);
        const userPasswordBuffer = Buffer.from(user.password.buffer);
        if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
          console.error("Invalid password: ", userPassword);
          return callback(null, false);
        }

        const { password, salt, ...rest } = user;
        return callback(null, rest);
      } catch (error) {
        console.error("Failed to hash password: ", error);
        return callback(null, false);
      }
    },
  ),
);

export default function authMiddleware(req, res, next) {
  console.log("Trying to authenticate");
  console.log("req.body.email :>> ", req.body.email);

  passport.authenticate(
    "local",
    {
      session: false,
      failWithError: true,
    },
    (err, user) => {
      if (err) {
        console.error("Authentication error: ", err);
        return next(new Error("Failed to authenticate user"));
      }

      if (!user) {
        return next(new Error("Invalid email or password"));
      }

      console.log("Authenticated");

      const { password, salt, ...rest } = user;
      const token = jwt.sign(rest, process.env.JWT_SECRET);

      req.auth = { token, user: rest, loggedIn: true };

      next();
    },
  )(req, res, next);
}
