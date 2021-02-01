require('dotenv').config();
const express = require("express");
const router = express.Router();
const checkAuth = require("./../middlewares/checkAuth");

const {
  loginController,
  signupController,
  sendResetUrlController,
  updatePasswordController,
} = require("./../controllers/authController");

router.post("/login", checkAuth, loginController);

router.post("/signup", checkAuth, signupController);

router.post("/reset", checkAuth, sendResetUrlController);

router.post("/reset/:token", checkAuth, updatePasswordController);

module.exports = router;
