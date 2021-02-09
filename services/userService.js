require('dotenv').config();
const dbDriver = require("mongoose");

const Profiles = dbDriver.model("Profiles");
const SSOUser = dbDriver.model("SSOUsers");

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
 * [NOT TESTED]
 * @param {*} req 
 */
const saveUserProfileService = async (req) => {

  const data = req.body;

  console.log(data);

  await connectDb();

  try {
    var user = await SSOUser.findOne({ _id: req._id });
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  console.log(user);

  const profile = new Profiles({
    _id: req._id,
    name: data.name,
    email: user.email
  });

  try {
    await profile.save();
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  await disconnectDb();

  return { msg: "Success", data: { name: data.name, email: user.email } };
};

/**
 * [NOT TESTED]
 * @param {*} req 
 */
const getUserProfileService = async (req) => {

  await connectDb();

  try {
    var user = await Profiles.findOne({ _id: req._id });
  } catch (error) {
    console.log(error);
    await disconnectDb();
    throw new Error(error);
  }

  console.log(user);

  await disconnectDb();

  return { message: "Success", data: { name: user.name, email: user.email } };
};

module.exports = {
  saveUserProfileService,
  getUserProfileService,
};
