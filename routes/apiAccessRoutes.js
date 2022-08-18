/**
 * 
 * All code in this project belongs to @KushagraGupta
 * Last Edited on June 18 00:44
 * 
 * Tags:
 *  @TESTED             Testing complete
 *  @NOT_TESTED         Testing is pending or code may be incomplete
 *  @DEV_COMPLETE       The code is written and tested
 *  @IN_DEVELOPEMENT    The code is under development and may be partially tested
 *  @UPCOMING           It is a upcoming task/project 
 * 
 */
require('dotenv').config();
const express = require('express');
const checkAuth = require('./../middlewares/checkAuth');
const validateKey = require('./../middlewares/validateKey');

const router = express.Router();

const {
    registerController,
    loginController,
    resetController,
    validateResetController,
    addClientConfigController,
    updateClientConfigController,
    refreshKeyController,
    getClientConfigController
} = require("./../controllers/apiAccessController");

/**
 *  @DEV_COMPLETE API accessible to SSO Client
 */
router.post('/login', loginController);                                 /** @TESTED */
router.post('/register', registerController);                           /** @TESTED */
router.post('/reset', resetController);                                 /** @TESTED */
router.post('/reset/:token', validateResetController);                  /** @TESTED */
router.get('/login/refresh-token', checkAuth, refreshKeyController);    /** @NOT_TESTED */

/**
 *  @IN_DEVELOPMENT API accessible to 
 */

router.post('/client', checkAuth, addClientConfigController);               /** @NOT_TESTED */
router.get('/client', checkAuth, getClientConfigController);                /** @NOT_TESTED */
router.put('/client/:resource', checkAuth, updateClientConfigController);   /** @NOT_TESTED */

/**
 *  @UPCOMING API accessible to SSO Client with custom deployment
 */
// router.post('/login', validateKey, loginController);
// router.post('/register', validateKey, registerController);
// router.post('/reset', validateKey, resetController);
// router.post('/reset/:token', validateKey, validateResetController);

module.exports = router;