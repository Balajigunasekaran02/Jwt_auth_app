const express = require("express");
const {
  signUp,
  signIn,
  getUser,
  logOut,
} = require("../controllers/authController.js");
const jwtAuth = require("../middleware/jwtAuth.js");
const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);
authRouter.get("/getuser", jwtAuth, getUser);
authRouter.get("/logout", jwtAuth, logOut);

module.exports = authRouter;
