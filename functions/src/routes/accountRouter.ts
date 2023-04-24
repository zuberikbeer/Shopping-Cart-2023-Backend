import express from "express";
import { getClient } from "../db";
import Account from "../models/Account";
import { ObjectId } from "mongodb";

const accountRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

accountRouter.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const cursor = client.db().collection<Account>("account").find();
    const results = await cursor.toArray();
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});
accountRouter.get("/user/:uid", async (req, res) => {
  const uid: string = req.params.uid;
  try {
    const client = await getClient();
    const cursor = client
      .db()
      .collection<Account>("account")
      .findOne({ uid: uid });
    const results = await cursor;
    if (results) {
      res.json(results);
    } else {
      res.status(404).json({ message: "uid not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// Create a new account
accountRouter.post("/addAccount", async (req, res) => {
  const newAccount: Account = req.body;
  try {
    const client = await getClient();
    await client.db().collection<Account>("account").insertOne(newAccount);
    res.status(201).json(newAccount);
  } catch (error) {
    errorResponse(error, res);
  }
});

accountRouter.put("/:id", async (req, res) => {
  const id: string = req.params.id;
  const updatedAccount: Account = req.body;
  delete updatedAccount._id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("account")
      .replaceOne({ _id: new Object(id) }, updatedAccount);
    if (result.matchedCount) {
      updatedAccount._id = new ObjectId(id);
      res.status(200).json(updatedAccount);
    } else {
      res.status(404).json({ message: `${id} not found` });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

accountRouter.delete("/:id", async (req, res) => {
  const idToDelete: string = req.params.id;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("account")
      .deleteOne({ _id: new ObjectId(idToDelete) });
    if (result.deletedCount > 0) {
      // something was deleted
      res.sendStatus(204);
    } else {
      // didn't delete anything (not found)
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default accountRouter;
