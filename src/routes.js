/**
 * @author      Kushagra Gupta
 * @lastUpdated Fri Nov 18 20:48
 * 
 * Notes
 *  1. Client can configure if it wants token or cookie based authentication
 */
const config = require('./config');
const express = require('express');
const checkAuth = require('./middlewares/checkAuth');
const validateKey = require('./middlewares/validateKey');

const router = express.Router();

const {
    registerController,
    loginController,
    resetController,
    validateResetController,
    refreshKeyController,
} = require("./controllers/authController");

router.get('/auth/verify', checkAuth, refreshKeyController);
router.post('/auth/login', loginController);
router.post('/auth/register', registerController);
router.get('/auth/reset/:email', resetController);
router.post('/auth/reset/:token', validateResetController);

const { getApiStatusController } = require("./controllers/statusController");

router.get('/status/ping', getApiStatusController(req, res));

module.exports = router;