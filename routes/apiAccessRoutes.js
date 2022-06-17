require('dotenv').config();
const express = require('express');
const router = express.Router();

const checkAuth = require('./../middlewares/checkAuth');
const validateKey = require('./../middlewares/validateKey');

const {
    registerController,
    loginController,
    resetController,
    validateResetController,
    initialSetupController,
    updateConfigController,
    refreshKeyController,
    getUserConfigController
} = require("./../controllers/apiAccessController");

/**
 *  API accessible from SSO
 */
router.post('/api/login', loginController);                                 // #TESTED
router.post('/api/register', registerController);                           // #TESTED
router.post('/api/reset', resetController);                                 // #NOT-TESTED
router.post('/api/reset/:token', validateResetController);                  // #NOT-TESTED
router.get('/api/login/refresh-token', checkAuth, refreshKeyController);    // #NOT-TESTED

// router.get('/config', checkAuth, getUserConfigController);
// router.post('/config', checkAuth, initialSetupController);
// router.put('/config', checkAuth, updateConfigController);

/**
 *  Client specific API : Don't remember the Use Case
 */
// router.post('/login', validateKey, loginController);
// router.post('/register', validateKey, registerController);
// router.post('/reset', validateKey, resetController);
// router.post('/reset/:token', validateKey, validateResetController);

module.exports = router;