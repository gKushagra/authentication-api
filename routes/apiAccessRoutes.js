require('dotenv').config();
const express = require('express');
const router = express.Router();

const validateKey = require('./../middlewares/validateKey');

const {
    registerController,
    loginController,
    resetController,
    validateResetController,
    initialSetupController,
    updateConfigController,
    refreshKeyController
} = require("./../controllers/apiAccessController");

/**
 *  Application API Endpoints
 */
router.post('/api/login', loginController);

router.post('/api/register', registerController);

router.post('/api/reset', resetController);

router.post('/api/reset/:token', validateResetController);

router.post('/', initialSetupController);   // get key, config: db creds[host,port,pwd,db,user], password reqs=[letters,digits,special] [encrypt]=[1,2,3,4,5,6,7,8]

router.post('/config', updateConfigController); // update config

router.get('/refresh/:token', refreshKeyController); // get new key

/**
 *  Public Access API Endpoints
 */
router.post('/login', validateKey, loginController);

router.post('/register', validateKey, registerController);

router.post('/reset', validateKey, resetController);

router.post('/reset/:token', validateKey, validateResetController);

module.exports = router;