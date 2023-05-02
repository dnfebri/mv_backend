var express = require("express");
var {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getPostId,
  getPostByUserId,
} = require("../controllers/Posts.js");
var { like, unLike } = require("../controllers/UserLikePost.js");
var { verifyToken } = require("../middleware/Verify.js");

var router = express.Router();

router.put("/like/:id", verifyToken, like);
router.put("/unlike/:id", verifyToken, unLike);

router.get("/", verifyToken, getAllPost);
router.get("/:id", verifyToken, getPostId);
router.get("/user/:id", verifyToken, getPostByUserId);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

module.exports = router;
