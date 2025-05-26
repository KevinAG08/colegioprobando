import express from "express";
import { login, refreshToken, logout } from "../controllers/auth";

const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
