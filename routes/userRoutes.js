const express = require("express");
const router = express.Router();

const {
  saveUserProfileController,
  getUserProfileController,
} = require("./../controllers/userController");

router.post("/profile", saveUserProfileController);

router.get("/profile/:id", getUserProfileController);

module.exports = router;
