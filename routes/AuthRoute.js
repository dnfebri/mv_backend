import express from "express";
import {Login, Register, logOut, Me} from "../controllers/Auth.js";
import { verifyToken } from "../middleware/Verify.js";

const router = express.Router();

// router.get('/me', verifySession, Me);
router.post('/login', Login);
router.post('/register', Register);
router.post('/logout', verifyToken, logOut);

export default router;