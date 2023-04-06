// routes/users.ts
import express from "express";
import {
  registerUser,
  loginUser,
  googleSignIn,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/googleSignIn", googleSignIn);

export default router;
