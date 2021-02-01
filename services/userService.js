const mongoose = require("mongoose");
const Profiles = mongoose.model("Profiles");

const saveNewProfile = (data) => {
  // console.log(data);
  const profile = new Profiles(data);

  return profile.save().then((p) => {
    // console.log(p);
    return { msg: "success", data: p };
  });
};

const getUserProfile = (data) => {
  // console.log(data);

  return Profiles.findOne({ _id: data }, function (err, profile) {
    return profile;
  });
};

module.exports = {
  saveNewProfile,
  getUserProfile,
};
