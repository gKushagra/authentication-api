require('dotenv').config();
const dbDriver = require('mongoose');

try {
    dbDriver.connect(`${process.env.CENTRAL_STORE_HOST}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    });

    console.log('db connected');
} catch (error) {
    console.log('db connection error');
    console.log(error);
}

const SSOUser = dbDriver.model("SSOUsers");

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

    try {
        var emailExists = await SSOUser.exists({ email: user.email });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

    if (emailExists) return { message: "email exists" }

    const _newUser = new SSOUser(user);

    _newUser.setPassword(user.password);

    console.log(_newUser);

    try {
        await _newUser.save();
    } catch (error) {
        console.log(error);
        throw new Error(error)
    }

    const token = _newUser.getToken();
    console.log(token);

    return { message: "user created", token: token }
}

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

    try {
        var _userFound = await SSOUser.findOne({ email: user.email });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

    if (_userFound) {
        const _existingUser = new SSOUser(_userFound);
        var validUser = _existingUser.validatePassword(user.password, _existingUser.password);

        if (validUser) {
            const token = _existingUser.getToken();

            return { message: "authorized", token: token }
        } else {
            return { message: "unauthorized" }
        }
    } else {
        return { message: "user not found" }
    }
}

const resetService = async (req, res, next) => {

}

const validateResetService = async (req, res, next) => {

}

const initialSetupService = async (req, res, next) => {

}

const updateConfigService = async (req, res, next) => {

}

const refreshKeyService = async (req, res, next) => {

}

module.exports = {
    registerService,
    loginService,
    resetService,
    validateResetService,
    initialSetupService,
    updateConfigService,
    refreshKeyService
};