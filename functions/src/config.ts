// config.ts
import crypto from "crypto";

const jwtSecret =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");

export default {
  jwtSecret,
  // Add other configuration settings as needed
};
