const express = require("express");

const {
  saveUserProfileService,
  getUserProfileService
} = require("./../services/userService");

const saveUserProfileController = async (req, res, next) => {
  try {
    let data = await saveUserProfileService(req);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const getUserProfileController = async (req, res, next) => {
  try {
    let data = await getUserProfileService(req);
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  saveUserProfileController,
  getUserProfileController,
};
