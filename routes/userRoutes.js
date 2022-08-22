const express = require("express");
const router = express.Router();

const checkAuth = require('./../middlewares/checkAuth');

const {
  saveUserProfileController,
  getUserProfileController,
} = require("./../controllers/userController");

router.get("/", checkAuth, getUserProfileController);

router.post("/", checkAuth, saveUserProfileController);

router.put("/");

module.exports = router;
