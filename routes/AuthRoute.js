var express = require("express");
var { Login, Register, logOut, Me } = require("../controllers/Auth.js");
var { verifyToken } = require("../middleware/Verify.js");

var router = express.Router();

// router.get('/me', verifySession, Me);
router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", verifyToken, logOut);

module.exports = router;
