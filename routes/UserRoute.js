import express from "express";
import {
  getUser,
  updateUser,
  changePassword,
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/Verify.js";

const router = express.Router();

router.get('/', verifyToken, getUser);
router.put('/', verifyToken, updateUser);
router.put('/change-password', verifyToken, changePassword);

export default router;