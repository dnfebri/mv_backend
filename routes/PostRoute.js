import express from "express";
import {
  createPost,
  updatePost
} from "../controllers/Posts.js";
import { verifyToken } from "../middleware/Verify.js";

const router = express.Router();

router.post('/', verifyToken, createPost);
router.put('/:id', verifyToken, updatePost);

export default router;