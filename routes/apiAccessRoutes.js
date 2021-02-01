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

router.post('/login');

router.post('/register');

router.post('/reset');

router.post('/reset/:token');

router.post('/');   // get key, config: db creds[host,port,pwd,db,user], password reqs=[letters,digits,special] [encrypt]=[1,2,3,4,5,6,7,8]

router.post('/config'); // update config

router.get('/refresh/:token'); // get new key

module.exports = router;