require("dotenv").config();
const dbDriver = require("mongoose");
const config = require("../config");
const extensions = require("../helperMethods");
const emailService = require("./emailService");

const SSOUser = dbDriver.model("SSOUsers");
const ResetAuth = dbDriver.model("ResetAuth");
const DatabaseSetting = dbDriver.model("DatabaseSetting");
const ClientConfig = dbDriver.model("ClientConfig");
const ClientApplication = dbDriver.model("ClientApplication");
const Profile = dbDriver.model("Profiles");

async function connectDb() {
  try {
    dbDriver.connect(config.dbConnectionString, config.dbOptions);
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

  await checkIsClient(req);

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

  await checkIsClient(req);

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

  await checkIsClient(req);

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
    throw new Error(error);
  }

  await disconnectDb();

  // send mail
  const url = await extensions.getPasswordResetUrl(uid);
  if (!url) {
    console.log(`Error creating html template ${uid}`);
    throw new Error(`Error creating html template - no uid ${uid}`);
  }
  // console.log(url);
  const html = await extensions.getPasswordResetEmailHtml(url);

  // await emailService.sendEmail({
  //   to: userEmail,
  //   subject: "Softwright Single Sign-On Password Reset Request",
  //   text: url,
  //   html
  // });
  await emailService.sendEmailSendgrid({
    to: userEmail,
    subject: "Softwright Single Sign-On Password Reset Request",
    text: url,
    html
  });

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

  await checkIsClient(req);

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

  const html = await extensions.getPasswordResetSuccessEmailHtml();

  // await emailService.sendEmail({
  //   to: _matchingUid.email,
  //   subject: "Softwright Single Sign-On Password Reset Request",
  //   text: "Your account password has been reset successfully!",
  //   html
  // });
  await emailService.sendEmailSendgrid({
    to: _matchingUid.email,
    subject: "Softwright Single Sign-On Password Reset Request",
    text: "Your account password has been reset successfully!",
    html
  });

  return { message: "password reset successfully" };
};

/**
 * [NOT TESTED]
 * 
 * @param {*} req 
 */
const addClientConfigService = async (req) => {
  const data = req.body;

  await connectDb();

  // check if client already exists
  try {
    var clientConfig = await ClientConfig.findOne({ email: data.email });
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  console.log(clientConfig);
  if (clientConfig._id) {
    return "client already exists";
  }

  // add new client
  var newClientConfig = new ClientConfig({
    email: data.email,
    api_key: null,
    api_secret: null,
    db_setting: null,
    applications: []
  });

  newClientConfig.setAPIKey(data.email);

  if (data.db_setting) {
    var newDatabaseSetting = new DatabaseSetting({
      host: data.db_setting.host,
      port: data.db_setting.host,
      user: data.db_setting.host,
      pass: null,
      database: data.db_setting.host,
      auth_source: data.db_setting.host
    });

    newDatabaseSetting.encryptDatabasePass(data.db_setting.pass);
    newClientConfig.setDatabaseSetting(newDatabaseSetting);
  }

  try {
    await newClientConfig.save();
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  await disconnectDb();

  return {
    message: "successfully created client",
    data: newClientConfig
  }
};

/**
 * [NOT TESTED]
 * 
 * @param {*} req 
 */
const getClientConfigService = async (req) => {

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

const updateClientConfigService = async (req) => { };

const refreshKeyService = async (req) => { };

const checkIsClient = async (req) => {
  if (req.isClient) {
    console.log(`trying to connect to client db`);
    dbDriver.connect(
      await extensions.generateMongoUri(req.client.env),
      config.dbOptions
    );
    console.log(`client ${req.client._id} db connected`);
  } else {
    await connectDb();
  }
}

module.exports = {
  registerService,
  loginService,
  resetService,
  validateResetService,
  addClientConfigService,
  getClientConfigService,
  updateClientConfigService,
  refreshKeyService,
};
