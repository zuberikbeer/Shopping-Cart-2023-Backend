// routes/items.ts
import express from "express";
import { getItems } from "../controllers/itemsController";

const itemsRouter = express.Router();

itemsRouter.get("/", getItems);

export default itemsRouter;
