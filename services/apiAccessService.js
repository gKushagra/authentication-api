require("dotenv").config();
const dbDriver = require("mongoose");
const SSOUser = dbDriver.model("SSOUsers");
const ResetAuth = dbDriver.model("ResetAuth");
const mailer = require("nodemailer");

async function connectDb() {
  try {
    dbDriver.connect(`${process.env.CENTRAL_STORE_HOST}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log("db connected");
  } catch (error) {
    console.log("db connection error");
    console.log(error);
  }
}

async function disconnectDb() {
  try {
    dbDriver.disconnect();

    console.log("db dis-connected");
  } catch (error) {
    console.log("db dis-connection error");
    console.log(error);
  }
}

/**
 * [TESTED]
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * Algorithm
 * step 1: check if email exists in database
 * step 2: if exists return email exists, if not proceed
 * step 3: create hash and insert into db email and hash
 * step 4: return jwt to user
 *
 */
const registerService = async (req) => {
  const user = req.body;

  await connectDb();

  try {
    var emailExists = await SSOUser.exists({ email: user.email });
  } catch (error) {
    await disconnectDb();
    console.log(error);
    throw new Error(error);
  }

  if (emailExists) {
    await disconnectDb();

    return { message: "email exists" };
  }

  const _newUser = new SSOUser(user);

  _newUser.setPassword(user.password);

  console.log(_newUser);

  try {
    await _newUser.save();
  } catch (error) {
    await disconnectDb();
    console.log(error);
    throw new Error(error);
  }

  const token = _newUser.getToken();
  console.log(token);

  await disconnectDb();

  return { message: "user created", token: token };
};

/**
 * [TESTED]
 *
 * @param {*} req
 *
 * Algorithm
 * step 1: check if a user exists
 * step 2: validate password
 * step 3: based on validation result, return res
 */
const loginService = async (req) => {
  const user = req.body;

  await connectDb();

  try {
    var _userFound = await SSOUser.findOne({ email: user.email });
  } catch (error) {
    await disconnectDb();
    console.log(error);
    throw new Error(error);
  }

  if (_userFound) {
    const _existingUser = new SSOUser(_userFound);
    var validUser = _existingUser.validatePassword(
      user.password,
      _existingUser.password
    );

    if (validUser) {
      const token = _existingUser.getToken();

      await disconnectDb();

      return { message: "authorized", token: token };
    } else {
      await disconnectDb();

      return { message: "unauthorized" };
    }
  } else {
    await disconnectDb();

    return { message: "user not found" };
  }
};

/**
 * [TESTED]
 *
 * @param {*} req
 *
 *
 */
const resetService = async (req) => {
  const userEmail = req.body.email;
  console.log(userEmail);

  await connectDb();

  // check if acc with this email exists?
  try {
    var _userExists = await SSOUser.exists({ email: userEmail });
  } catch (error) {
    await disconnectDb();
    console.log(error);
    throw new Error(error);
  }

  console.log(_userExists);

  if (!_userExists) {
    await disconnectDb();

    return { message: "user not found" };
  }

  const _newResetReq = new ResetAuth({ email: userEmail, uid: null });

  const uid = _newResetReq.setResetRequest(userEmail);

  console.log(_newResetReq);

  // save
  try {
    await _newResetReq.save();
  } catch (error) {
    await disconnectDb();
    console.log(error);
    throw new Error();
  }

  await disconnectDb();

  //   send mail
  let transporter = await mailer.createTransport({
    host: process.env.EHOST,
    port: process.env.EPORT,
    secure: false,
    auth: {
      user: process.env.EUSER,
      pass: process.env.EPASS,
    },
  });

  const resetAddr = process.env.RESET_URL;
  const url = new URL(resetAddr);
  url.searchParams.append("token", uid);

  try {
    let info = await transporter.sendMail({
      from: "oddfellow-sso@deltasaas.tech",
      to: `${userEmail}`,
      subject: "Password Reset Request From OddFellow SSO",
      text: `${url}`,
      html: `
      <p>Hello User!</p>
      <br>
      <br>
      <a href="${url}">Click to reset your password</a>
      <br>
      <br>
      <p>Best,<p>
      <p>OddFellow Single Sign On (SSO) Team</p>
      <br>
      <small>If you did not initiate this request, report at <b>oddfellow-sso@deltasaas.tech</b></small> 
      `,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  return { message: "reset link sent" };
};

/**
 *  [TESTED]
 *
 * @param {*} req
 *
 */
const validateResetService = async (req) => {
  const _newPass = req.body.password;
  const uid = req.params.token;
  console.log(uid);

  await connectDb();

  try {
    var _matchingUid = await ResetAuth.findOne({ uid: uid });
  } catch (error) {
    await disconnectDb();
    console.log(error);
    throw new Error(error);
  }

  console.log(_matchingUid);

  if (!_matchingUid) {
    await disconnectDb();
    return { message: "invalid reset request" };
  }

  var _updateUser = new SSOUser({
    email: _matchingUid.email,
    password: _newPass,
  });

  _updateUser.setPassword(_newPass);

  try {
    await SSOUser.findOneAndUpdate(
      { email: _matchingUid.email },
      { password: _updateUser.password }
    );
  } catch (error) {
    await disconnectDb();
    console.log(error);
    throw new Error(error);
  }

  await disconnectDb();

  let transporter = await mailer.createTransport({
    host: process.env.EHOST,
    port: process.env.EPORT,
    secure: false,
    auth: {
      user: process.env.EUSER,
      pass: process.env.EPASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: "oddfellow-sso@deltasaas.tech",
      to: `${_matchingUid.email}`,
      subject: "Password Reset Success",
      text: "Your account password as been reset successfully!",
      html: `
          <p>Hello User!</p>
          <br>
          <br>
          <p>Your account password as been reset successfully!</p>
          <br>
          <br>
          <p>Best,<p>
          <p>OddFellow Single Sign On (SSO) Team</p>
          <br>
          <small>If you did not initiate this request, report at <b>oddfellow-sso@deltasaas.tech</b></small> 
          `,
    });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }

  return { message: "password reset successfully" };
};

const initialSetupService = async (req, res, next) => {};

const updateConfigService = async (req, res, next) => {};

const refreshKeyService = async (req, res, next) => {};

module.exports = {
  registerService,
  loginService,
  resetService,
  validateResetService,
  initialSetupService,
  updateConfigService,
  refreshKeyService,
};
