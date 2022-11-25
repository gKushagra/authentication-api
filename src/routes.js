/**
 * @author      Kushagra Gupta
 * @lastUpdated Fri Nov 18 20:48
 */
const express = require('express');
const checkAuth = require('./middlewares/checkAuth');
const router = express.Router();

const {
    registerController,
    loginController,
    resetLinkController,
    resetController,
    authorizeController,
} = require("./controllers/authController");

router.post('/auth/login', loginController);
router.post('/auth/register', registerController);
router.get('/auth/reset/:email', resetLinkController);
router.post('/auth/reset/:token', resetController);
router.get('/auth', checkAuth, authorizeController);

const {
    getApiStatusController
} = require("./controllers/statusController");

router.get('/status/ping', getApiStatusController);

module.exports = router;