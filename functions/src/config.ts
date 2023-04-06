// config.ts
import crypto from "crypto";

const jwtSecret =
  process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex");
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/Shop";

export default {
  jwtSecret,
  mongoUri,
  // Add other configuration settings as needed
};
