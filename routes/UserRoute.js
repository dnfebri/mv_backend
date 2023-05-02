var express = require("express");
var {
  getUser,
  updateUser,
  changePassword,
} = require("../controllers/Users.js");
var { verifyToken } = require("../middleware/Verify.js");
var router = express.Router();

router.get("/", verifyToken, getUser);
router.put("/", verifyToken, updateUser);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;
