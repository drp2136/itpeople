'use strict';
module.exports = {
    signUp: signUp,
    signIn: signIn,

};

// Import
const AppError = require('../../errors/AppError');
const UserHelper = require('../helpers/UserHelper');
const CONSTANTS = require('../../utils/Constant');
const To = require('../../utils/To');


/**
 * SignUp a User
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function signUp(req, res, next) {
    try {
        // Initialize
        let error, result;

        // Do a signup..
        [error, result] = await To(UserHelper.signUp(req.authUser, req.body, req.params, req.flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        if (result && Object.keys(result).length > 0 && result.code == 200) {
            res.send(result);
        } else {
            throw new AppError("Some issue occured during sign up process.", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while registering one user: " + error, data: {} };
        }
        res.send(req.logs);
    }
}

/**
 * Signin a User
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function signIn(req, res, next) {
    try {
        // Initialize
        let error, result, flags = {};

        // Do a signin..
        [error, result] = await To(UserHelper.signIn(req.authUser, req.body, req.params, req.flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        if (result && Object.keys(result).length > 0 && result.code == 200) {
            res.send(result);
        } else {
            throw new AppError("Some issue occured during sign in process.", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while signin in one user: " + error, data: {} };
        }
        res.send(req.logs);
    }
}
