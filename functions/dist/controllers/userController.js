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
exports.googleSignIn = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const config_1 = __importDefault(require("../config"));
const client = new google_auth_library_1.OAuth2Client("427752898275-knf3lj28r0uhm0miv1dc85i433f424ov.apps.googleusercontent.com");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const client = req.app.locals.db;
        const accountCollection = client.db("Shop").collection("account");
        const existingUser = yield accountCollection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const newUser = yield accountCollection.insertOne({
            email,
            password: hashedPassword,
        });
        const createdUser = Object.assign(Object.assign({}, req.body), { _id: newUser.insertedId }); // Use insertedId
        res.status(201).json({ message: "User created", user: createdUser });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const client = req.app.locals.db;
        const accountCollection = client.db("Shop").collection("account");
        const user = yield accountCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.default.jwtSecret, {
            expiresIn: "1h",
        });
        res.status(200).json({ message: "Logged in", token });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.loginUser = loginUser;
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenId } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: tokenId,
            audience: "427752898275-knf3lj28r0uhm0miv1dc85i433f424ov.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();
        const sub = payload.sub; // Use type assertion
        const email = payload.email; // Use type assertion
        const dbClient = req.app.locals.db;
        const accountCollection = dbClient.db("Shop").collection("account");
        let user = yield accountCollection.findOne({ googleId: sub });
        if (!user) {
            const newUser = yield accountCollection.insertOne({
                googleId: sub,
                email,
            });
            user = { email, googleId: sub, _id: newUser.insertedId };
        }
        const token = jsonwebtoken_1.default.sign({ id: user === null || user === void 0 ? void 0 : user._id }, config_1.default.jwtSecret, {
            expiresIn: "1h",
        }); // <- Use optional chaining with '?'
        res.status(200).json({ message: "Logged in with Google", token });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});
exports.googleSignIn = googleSignIn;
//# sourceMappingURL=userController.js.map