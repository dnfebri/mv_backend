import express from "express";
import AuthRoute from "./AuthRoute.js";
import UserRoute from "./UserRoute.js";
import PostRoute from "./PostRoute.js";

const router = express.Router();

router.get('/', (reg, res) => {
  res.json({massage: "Server run...!"});
});

router.use('/auth', AuthRoute);
router.use('/user', UserRoute);
router.use('/post', PostRoute);

export default router;