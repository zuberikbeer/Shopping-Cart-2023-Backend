import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import accountRouter from "./routes/accountRouter";

// defines Express server that is used to handle our HTTP requests.

const app = express();
app.use(cors());
app.use(express.json());
app.use("/account", accountRouter);
export const api = functions.https.onRequest(app);
