import express from "express";
import { getClient } from "../db";
import Account from "../models/Account";

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

//to get clients userName
accountRouter.get("/:userName", async (req, res) => {
  const username: string = req.params.userName;
  try {
    const client = await getClient();
    const cursor = client
      .db()
      .collection<Account>("account")
      .find({ userName: username });
    const results = await cursor.toArray();
    res.status(200);
    res.json(results);
  } catch (err) {
    errorResponse(err, res);
  }
});

// Create a new account
accountRouter.post("/addAccount", async (req, res) => {
  const newAccount: Account = req.body;
  try {
    const client = await getClient();
    const result = await client
      .db()
      .collection<Account>("account")
      .insertOne(newAccount);
    res.status(201).json(result.insertedId);
  } catch (error) {
    errorResponse(error, res);
  }
});

// Authenticate a user
accountRouter.post("/login", async (req, res) => {
  try {
    const { loginEmailOrUsername, loginPassword } = req.body;
    const client = await getClient();
    const account = await client
      .db()
      .collection<Account>("account")
      .findOne({
        $or: [
          { email: loginEmailOrUsername },
          { userName: loginEmailOrUsername },
        ],
      });

    if (!account || account.password !== loginPassword) {
      // Authentication failed
      res.status(401).json({ message: "Invalid email/username or password" });
      return;
    }

    // Authentication succeeded
    res.status(200).json({ message: "Authentication succeeded" });
  } catch (error) {
    errorResponse(error, res);
  }
});

export default accountRouter;
