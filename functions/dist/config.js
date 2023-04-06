"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// config.ts
const crypto_1 = __importDefault(require("crypto"));
const jwtSecret = process.env.JWT_SECRET || crypto_1.default.randomBytes(32).toString("hex");
exports.default = {
    jwtSecret,
    // Add other configuration settings as needed
};
//# sourceMappingURL=config.js.map