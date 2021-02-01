const express = require("express");
const router = express.Router();
const checkAuth = require("./../middlewares/checkAuth");

const {
  saveUserProfileController,
  getUserProfileController,
} = require("./../controllers/userController");

router.post("/profile", checkAuth, saveUserProfileController);

router.get("/profile/:id", checkAuth, getUserProfileController);

module.exports = router;
