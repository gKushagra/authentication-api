const {
    registerService,
    loginService,
    resetService,
    validateResetService,
    initialSetupService,
    updateConfigService,
    refreshKeyService
} = require("./../services/apiAccessService");

const registerController = async (req, res, next) => {
    try {
        let data = await registerService(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

const loginController = async (req, res, next) => {
    try {
        let data = await loginService(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

const resetController = async (req, res, next) => {
    try {
        let data = await resetService(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
}

const validateResetController = async (req, res, next) => {
    try {
        let data = await validateResetService(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
}

const initialSetupController = async (req, res, next) => {
    try {
        let data = await initialSetupService(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
}

const updateConfigController = async (req, res, next) => {
    try {
        let data = await updateConfigService(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
}

const refreshKeyController = async (req, res, next) => {
    try {
        let data = await refreshKeyService(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
}

module.exports = {
    registerController,
    loginController,
    resetController,
    validateResetController,
    initialSetupController,
    updateConfigController,
    refreshKeyController
};