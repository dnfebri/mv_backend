var express = require("express");
var AuthRoute = require("./AuthRoute.js");
var UserRoute = require("./UserRoute.js");
var PostRoute = require("./PostRoute.js");

var router = express.Router();

router.get("/", (req, res) => {
  res.json({ massage: "Server run...!" });
});

router.use("/auth", AuthRoute);
router.use("/user", UserRoute);
router.use("/post", PostRoute);

module.exports = router;
