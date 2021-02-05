require('dotenv').config();
const express = require('express');
const router = express.Router();

const {
    registerController,
    loginController,
    resetController,
    validateResetController,
    initialSetupController,
    updateConfigController,
    refreshKeyController
} = require("./../controllers/apiAccessController");

router.post('/login', loginController);

router.post('/register', registerController);

router.post('/reset', resetController);

router.post('/reset/:token', validateResetController);

router.post('/', initialSetupController);   // get key, config: db creds[host,port,pwd,db,user], password reqs=[letters,digits,special] [encrypt]=[1,2,3,4,5,6,7,8]

router.post('/config', updateConfigController); // update config

router.get('/refresh/:token', refreshKeyController); // get new key

module.exports = router;