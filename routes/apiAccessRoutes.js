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
 *  Application API Endpoints
 */
router.post('/api/login', loginController);

router.post('/api/register', registerController);

router.post('/api/reset', resetController);

router.post('/api/reset/:token', validateResetController);


router.get('/config', checkAuth, getUserConfigController);

router.post('/config', checkAuth, initialSetupController);

router.put('/config', checkAuth, updateConfigController);


router.get('/refresh/:token', checkAuth, refreshKeyController);

/**
 *  Public Access API Endpoints
 */
router.post('/login', validateKey, loginController);

router.post('/register', validateKey, registerController);

router.post('/reset', validateKey, resetController);

router.post('/reset/:token', validateKey, validateResetController);

module.exports = router;