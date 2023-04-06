"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/items.ts
const express_1 = __importDefault(require("express"));
const itemsController_1 = require("../controllers/itemsController");
const itemsRouter = express_1.default.Router();
itemsRouter.get("/", itemsController_1.getItems);
exports.default = itemsRouter;
//# sourceMappingURL=itemsRouter.js.map