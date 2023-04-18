import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getPostId,
  getPostByUserId
} from "../controllers/Posts.js";
import { like, unLike } from "../controllers/UserLikePost.js";
import { verifyToken } from "../middleware/Verify.js";

const router = express.Router();

router.put('/like/:id', verifyToken, like);
router.put('/unlike/:id', verifyToken, unLike);

router.get('/', verifyToken, getAllPost);
router.get('/:id', verifyToken, getPostId);
router.get('/user/:id', verifyToken, getPostByUserId);
router.post('/', verifyToken, createPost);
router.put('/:id', verifyToken, updatePost);
router.delete('/:id', verifyToken, deletePost);

export default router;