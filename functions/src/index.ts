import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import itemsRouter from "./routes/itemsRouter";
import accountRouter from "./routes/accountRouter";
import dotenv from "dotenv";

// defines Express server that is used to handle our HTTP requests.

const app = express();

app.use(cors());
app.use(express.json());
app.use("/account", accountRouter);
app.use("/api/shopping-cart", itemsRouter);
dotenv.config();

export const api = functions.https.onRequest(app);
