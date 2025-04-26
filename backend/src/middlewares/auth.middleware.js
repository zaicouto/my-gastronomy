import passport from "passport";
import LocalStrategy from "passport-local";
import crypto from "crypto";
import mongo from "../data/mongo.js";
import jwt from "jsonwebtoken";

const collectionName = "people";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, callback) => {
      const user = await mongo.db.collection(collectionName).findOne({ email });

      if (!user) {
        return callback(null, false);
      }

      const saltBuffer = user.salt.buffer;

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
    }
  )
);

export default function authMiddleware(req, res, next) {
  passport.authenticate(
    "local",
    {
      session: false,
      failWithError: true,
    },
    (err, user) => {
      if (err) {
        throw new Error("Failed to authenticate user");
      }

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const { password, salt, ...rest } = user;
      const token = jwt.sign(rest, process.env.JWT_SECRET);

      req.auth = { token, user: rest, loggedIn: true };

      next();
    }
  )(req, res, next);
}
