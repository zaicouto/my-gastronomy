import { promisify } from "node:util";
import crypto from "crypto";

export default async function pbkdf2(password, salt) {
  const hashedPassword = await promisify(crypto.pbkdf2)(
    password,
    salt,
    310000,
    16,
    "sha256",
  );

  return hashedPassword;
}
