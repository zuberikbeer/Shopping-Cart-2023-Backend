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

accountRouter.post("/login", async (req, res) => {
  try {
    const client = await getClient();
    console.log(
      "Received email and password:",
      req.body.email,
      req.body.password
    );

    // Query the database for an account with a matching email
    const account = await client
      .db("Shop")
      .collection<Account>("account")
      .findOne({ email: req.body.email });

    console.log("Retrieved account from the database:", account);

    // Check if the account was found
    if (!account) {
      console.log("Account not found:", req.body.email);
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Check if the submitted password matches the account's password
    if (account.password !== req.body.password) {
      console.log("Incorrect password for:", req.body.email);
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Authentication succeeded
    res.status(200).json({
      message: "Authentication succeeded",
      account: {
        _id: account._id,
        email: account.email,
        userName: account.userName,
      },
    });
  } catch (error) {
    console.log("Error during login:", error);
    errorResponse(error, res);
  }
});

export default accountRouter;
