'use strict';
module.exports = {
    verifyToken: verifyToken, // primary
};

// Imports
// const Crypto = require('crypto');
const JWT = require('jsonwebtoken');
const Moment = require('moment');

const AppError = require('../../errors/AppError');
const UserHelper = require('../helpers/UserHelper');
const CONSTANTS = require('../../utils/Constant');
const To = require('../../utils/To');



/**
 * Verify Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function verifyToken(req, res, next) {
    try {
        // Initialize
        let error, result, userResult, webTokenResult;

        // Assign
        let token = req.query.token || req.query.access_token || req.query.ugs_token || req.query.admin_token || req.query.app_token;

        // Bearer token
        if (!token) {
            // Check if it is part of Authorization Bearer header and extract it
            if (req.headers.authorization) {
                let bearerArr = req.headers.authorization.split(' ');
                if (bearerArr && Array.isArray(bearerArr) && bearerArr.length === 2
                    && (bearerArr[0] == 'bearer' || bearerArr[0] == 'Bearer')) {
                    token = bearerArr[1];
                }
            }
        }

        if (token) {
            // Validate Token
            JWT.verify(token, CONSTANTS.JWT.SECRET, async (err, decoded) => {
                try {
                    if (err) {
                        if (req.query.isLogout && err.name == "TokenExpiredError") {
                            // Since token is already expired and this is logout API, we can return success
                            res.send({ code: 200, message: "User successfully logged out." });
                        } else {
                            throw new AppError("Invalid token.", 401, null);
                        }
                    } else {
                        if (decoded && decoded.aud) {
                            // Initialize
                            let result;
                            error = null;

                            // Verify UserId
                            [error, result] = await To(UserHelper.getOne({ type: 'auth' }, { _id: decoded.jti }, null, null));
                            if (error) {
                                throw new AppError(error.message, error.code, error.data);
                            }
                            if (result && Object.keys(result).length > 0 && result.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
                                console.debug("User verified.");
                            } else {
                                throw new AppError("Invalid token! User not found.", 404, null);
                            }

                            // Prepare for APIs, about the Requestee
                            req.authUser = {
                                id: decoded.jti,
                                type: decoded.aud,
                                token: token
                            };

                            next();
                        } else {
                            throw new AppError("You are not authorized to access this API.", 401, null);
                        }
                    }
                } catch (error) {
                    if (error && error.code && error.message) {
                        req.logs = { code: error.code, message: error.message, data: error.data };
                    } else {
                        req.logs = { code: 409, message: 'Error while verifying token: ' + error, data: null };
                    }
                    res.send(req.logs);
                }
            });
        } else {
            throw new AppError("Token not found.", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: 'Error while verifying token: ' + error, data: null };
        }
        res.send(req.logs);
    }
}
