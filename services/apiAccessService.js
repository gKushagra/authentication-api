require("dotenv").config();
const dbDriver = require("mongoose");
const SSOUser = dbDriver.model("SSOUsers");
const ResetAuth = dbDriver.model("ResetAuth");
const SSOUserConfig = dbDriver.model("SSOUserConfig");
const Profile = dbDriver.model("Profiles");
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

  if (req.externalUser && req.user.db_host) {
    dbDriver.connect(`mongodb://${req.user.db_user}:${req.user.db_pwd}@${req.user.db_host}:${req.user.db_port}/${req.user.db_database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
  } else {
    await connectDb();
  }

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

  if (req.externalUser && req.user.db_host) {
    dbDriver.connect(`mongodb://${req.user.db_user}:${req.user.db_pwd}@${req.user.db_host}:${req.user.db_port}/${req.user.db_database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
  } else {
    await connectDb();
  }

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

  if (req.externalUser && req.user.db_host) {
    dbDriver.connect(`mongodb://${req.user.db_user}:${req.user.db_pwd}@${req.user.db_host}:${req.user.db_port}/${req.user.db_database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
  } else {
    await connectDb();
  }

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

  if (req.externalUser && req.user.db_host) {
    dbDriver.connect(`mongodb://${req.user.db_user}:${req.user.db_pwd}@${req.user.db_host}:${req.user.db_port}/${req.user.db_database}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
  } else {
    await connectDb();
  }

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

/**
 * [NOT TESTED]
 * 
 * @param {*} req 
 */
const initialSetupService = async (req) => {
  // set api key and redirect url
  const data = req.body;

  await connectDb();

  // get user email from db
  try {
    var user = await Profile.findOne({ _id: req._id });
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  console.log(user);

  var newSSOUserConfig = new SSOUserConfig({
    email: null,
    api_key: null,
    db_host: null,
    db_port: null,
    db_user: null,
    db_pwd: null,
    db_database: null,
    redirect_url: null,
  });

  newSSOUserConfig.setAPIKey(user.email);

  newSSOUserConfig.setRedirectUrl(data.redirect_url);

  if (data.db_host) {
    newSSOUserConfig.setDbConfig({
      db_host: data.db_host,
      db_port: data.db_port,
      db_user: data.db_user,
      db_pwd: data.db_pwd,
      db_database: data.db_database,
    });
  }

  console.log(newSSOUserConfig);

  try {
    await newSSOUserConfig.save();
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  await disconnectDb();

  return {
    message: "Success",
    api_key: newSSOUserConfig.api_key,
    redirect_url: newSSOUserConfig.redirect_url,
    db_config: null
  }
};

/**
 * [NOT TESTED]
 * 
 * @param {*} req 
 */
const getUserConfigService = async (req) => {

  await connectDb();

  try {
    var user = await Profile.findOne({ _id: req._id });
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  console.log(user);

  try {
    var config = await SSOUserConfig.findOne({ email: user.email });
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  console.log(config);

  await disconnectDb();

  return {
    message: "Success",
    api_key: config.api_key,
    redirect_url: config.redirect_url,
    db_config: null
  }
}

const updateConfigService = async (req) => { };

const refreshKeyService = async (req) => { };

module.exports = {
  registerService,
  loginService,
  resetService,
  validateResetService,
  initialSetupService,
  getUserConfigService,
  updateConfigService,
  refreshKeyService,
};
