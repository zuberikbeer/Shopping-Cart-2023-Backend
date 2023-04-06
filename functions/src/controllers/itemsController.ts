// controllers/itemsController.ts
import { Request, Response } from "express";
import { MongoClient, ObjectId } from "mongodb";

export const getItems = async (req: Request, res: Response) => {
  try {
    const client: MongoClient = req.app.locals.db;
    const shoppingCartCollection = client
      .db("Shop")
      .collection("shoppingCartItem");

    const items = await shoppingCartCollection.find().toArray();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
