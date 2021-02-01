require('dotenv').config();
const nm = require('nodemailer');
const passport = require("passport");
const crypto = require('crypto');
const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const Profiles = mongoose.model('Profiles');

// add a new user to users db
const signupService = async (data) => {
  const user = new Users(data);

  user.setPassword(data.password);

  return user.save().then(() => {
    return { user: user.toAuthJSON() };
  });
};

// look for a user in users db
const loginService = (req, res, next) => {
  //   console.log(req.body);
  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      //   console.log(passportUser);
      //   console.log(info);

      if (err) {
        // console.log(err);
        return res.status(500);
      }

      if (passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        return res.json({ user: user.toAuthJSON() });
      } else {
        return res.status(401).json({ error: "Unauthorised" });
      }

      //   return res.status(400).json(info);
    }
  )(req, res, next);
};

// check if auth data is corrupt
const checkAuthData = (data) => {
  // console.log("here", data);
  if (!data.username) {
    return "username is invalid";
  }

  if (!data.password) {
    return "password is invalid";
  }
};

// get user profile matching the email provided
// by user for resetting password
function getProfileService(data, callback) {
  var profile = null;
  Profiles.findOne({ 'email': data }, function (err, _p) {
    if (err) { /*console.log(err);*/ }
    if (_p) { profile = _p; }
    callback(profile)
  })
}

// update users password
function updatePasswordService(data, callback) {
  var updated = null;

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(data.password, salt, 10000, 512, "sha512").toString("hex")

  Users.findOneAndUpdate({ _id: data._id }, { salt: salt, hash: hash }, { upsert: true }, function (err, doc) {
    if (err) { throw new Error(err); }
    updated = true;
    callback(updated);
  });
}

// send password reset email to user using nodemailer
async function sendMail(data, id) {
  let transporter = await nm.createTransport({
    host: process.env.EHOST,
    port: process.env.EPORT,
    secure: false,
    auth: {
      user: process.env.EUSER,
      pass: process.env.EPASS
    }
  });

  const addr = process.env.RESETURL;
  const url = new URL(addr);
  url.searchParams.append('token', id);
  // console.log(url);

  try {
    let info = await transporter.sendMail({
      from: 'oddchat@deltasaas.tech',
      to: `${data}`,
      subject: "Password Reset Request",
      text: `${url}`,
      html: `
      <p>Hello User!</p>
      <br>
      <br>
      <a href="${url}">Click to reset your password</a>
      <br>
      <br>
      <p>Best,<p>
      <p>OddChat Support</p>
      <br>
      <small>If you did not initiate this request, report at <b>oddchat@deltasaas.tech</b></small>`
    });
    // console.log(info.messageId);
    return;
  } catch (error) {
    // console.log(error);
    throw new Error(error);
  }
}

module.exports = {
  signupService,
  checkAuthData,
  loginService,
  getProfileService,
  sendMail,
  updatePasswordService
};
