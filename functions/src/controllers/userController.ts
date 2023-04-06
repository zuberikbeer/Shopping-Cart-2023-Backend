import { Request, Response } from "express";
import { MongoClient, ObjectId, InsertOneResult } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library/build/src/auth/oauth2client";
import config from "../config";

const client = new OAuth2Client(
  "427752898275-knf3lj28r0uhm0miv1dc85i433f424ov.apps.googleusercontent.com"
);

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const client: MongoClient = req.app.locals.db;
    const accountCollection = client.db("Shop").collection("account");

    const existingUser = await accountCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const newUser: InsertOneResult<any> = await accountCollection.insertOne({
      email,
      password: hashedPassword,
    });
    const createdUser = { ...req.body, _id: newUser.insertedId }; // Use insertedId
    res.status(201).json({ message: "User created", user: createdUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const client: MongoClient = req.app.locals.db;
    const accountCollection = client.db("Shop").collection("account");

    const user = await accountCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Logged in", token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience:
        "427752898275-knf3lj28r0uhm0miv1dc85i433f424ov.apps.googleusercontent.com",
    });
    const payload = ticket.getPayload();
    const sub = (payload as any).sub; // Use type assertion
    const email = (payload as any).email; // Use type assertion

    const dbClient: MongoClient = req.app.locals.db;
    const accountCollection = dbClient.db("Shop").collection("account");

    let user = await accountCollection.findOne({ googleId: sub });
    if (!user) {
      const newUser: InsertOneResult<any> = await accountCollection.insertOne({
        googleId: sub,
        email,
      });
      user = { email, googleId: sub, _id: newUser.insertedId };
    }
    const token = jwt.sign({ id: user?._id }, config.jwtSecret, {
      expiresIn: "1h",
    }); // <- Use optional chaining with '?'
    res.status(200).json({ message: "Logged in with Google", token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
