const {
    registerService,
    loginService,
    resetService,
    validateResetService,
    initialSetupService,
    updateConfigService,
    refreshKeyService,
    getUserConfigService
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
        console.log(error);
        res.sendStatus(500);
    }
}

const validateResetController = async (req, res, next) => {
    try {
        let data = await validateResetService(req);
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

const addClientConfigController = async (req, res, next) => {
    try {
        let data = await initialSetupService(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
}

const getClientConfigController = async (req, res, next) => {
    try {
        let data = await getUserConfigService(req);
        res.status(200).json(data);
    } catch (error) {
        res.sendStatus(500);
    }
}

const updateClientConfigController = async (req, res, next) => {
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
    addClientConfigController,
    getClientConfigController,
    updateClientConfigController,
    refreshKeyController
};