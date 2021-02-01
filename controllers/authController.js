const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const {
  signupService,
  checkAuthData,
  loginService,
  getProfileService,
  sendMail,
  updatePasswordService,
} = require("./../services/authService");

// POST
// Register a new user
const signupController = async (req, res, next) => {
  const { body: user } = req;

  //   console.log(user);

  const badData = checkAuthData(user);
  if (badData === "username is invalid" || badData === "password is invalid") {
    return res.status(422).json({
      error: badData,
    });
  }

  const doesUserExist = await Users.exists({ username: user.username });

  // console.log(doesUserExist);

  if (doesUserExist) return res.json({ msg: "username taken" });

  return signupService(user).then((userCreated) => {
    // console.log(userCreated);
    return res.json(userCreated);
  });
};

// POST
// Login a user
const loginController = (req, res, next) => {
  const { body: user } = req;

  const badData = checkAuthData(user);
  if (badData === "username is invalid" || badData === "password is invalid") {
    return res.status(422).json({
      error: badData,
    });
  }

  const response = loginService(req, res, next);

  return response;
};

// POST
// check if email exists and send pwd reset link via email
const sendResetUrlController = (req, res, next) => {
  const { body: data } = req;

  return getProfileService(data.email, async function (_p) {
    // console.log(_p);
    if (_p !== null) {

      try {
        // send email
        await sendMail(data.email, _p._id);
      } catch (error) {
        // console.log(error);
        return res.sendStatus(500);
      }

      return res.status(200).json({ msg: "email sent" })
    }
    else { return res.status(200).json({ msg: "user not found" }) }
  });
}

// POST
// update users username[Not available now] and password
const updatePasswordController = (req, res, next) => {
  const { body: data } = req;

  try {
    return updatePasswordService({ _id: req.params.token, password: data.password }, function (_stat) {
      if (_stat) { return res.status(200).json({ msg: "updated" }) }
    });
  } catch (error) {
    // console.log(error);
    return res.sendStatus(500)
  }
}

module.exports = {
  loginController,
  signupController,
  sendResetUrlController,
  updatePasswordController
};
