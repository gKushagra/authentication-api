const express = require("express");

const { saveNewProfile, getUserProfile } = require("./../services/userService");

// POST
// save user profile
const saveUserProfileController = (req, res, next) => {
  try {
    return saveNewProfile(req.body).then((data) => {
      return res.status(200).json(data);
    });
  } catch (error) {
    // console.log(error.message);
    res.status(500);
  }
};

const getUserProfileController = (req, res, next) => {
  try {
    return getUserProfile(req.params.id).then((data) => {
      const _restrictData = { _id: data._id, name: data.name, avatar: data.avatar }
      return res.status(200).json(_restrictData);
    });
  } catch (error) {
    // console.log(error.message);
    res.status(500);
  }
};

module.exports = {
  saveUserProfileController,
  getUserProfileController,
};
