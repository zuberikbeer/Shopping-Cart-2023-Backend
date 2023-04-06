"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const accountRouter = express_1.default.Router();
const errorResponse = (error, res) => {
    console.error("FAIL", error);
    res.status(500).json({ message: "Internal Server Error" });
};
accountRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield (0, db_1.getClient)();
        const cursor = client.db().collection("account").find();
        const results = yield cursor.toArray();
        res.json(results);
    }
    catch (err) {
        errorResponse(err, res);
    }
}));
//to get clients userName
accountRouter.get("/:userName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.userName;
    try {
        const client = yield (0, db_1.getClient)();
        const cursor = client
            .db()
            .collection("account")
            .find({ userName: username });
        const results = yield cursor.toArray();
        res.status(200);
        res.json(results);
    }
    catch (err) {
        errorResponse(err, res);
    }
}));
// Create a new account
accountRouter.post("/addAccount", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newAccount = req.body;
    try {
        const client = yield (0, db_1.getClient)();
        const result = yield client
            .db()
            .collection("account")
            .insertOne(newAccount);
        res.status(201).json(result.insertedId);
    }
    catch (error) {
        errorResponse(error, res);
    }
}));
// Authenticate a user
accountRouter.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { loginEmailOrUsername, loginPassword } = req.body;
        const client = yield (0, db_1.getClient)();
        const account = yield client
            .db()
            .collection("account")
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
    }
    catch (error) {
        errorResponse(error, res);
    }
}));
exports.default = accountRouter;
//# sourceMappingURL=accountRouter.js.map