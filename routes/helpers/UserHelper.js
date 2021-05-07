'use strict';
module.exports = {
    signUp: signUp,
    signIn: signIn,
    getOne: getOne,
    // logout: logout,

};

// Imports
const Bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const Moment = require('moment');
const Mongoose = require('mongoose');
const Path = require('path');

const AppError = require('../../errors/AppError');
const UserService = require('../services/UserService');
const CONSTANTS = require('../../utils/Constant');
const To = require('../../utils/To');


/**
 * Generate a JWT - token
 * @param {*} authUser 
 * @param {*} JWTObj 
 * @param {*} params 
 * @param {*} flags 
 */
async function generateJWTToken(authUser, JWTObj, params, flags) {
    // Generate UGS Token
    try {
        // Assign
        // let error, result, webTokenResult;
        let dateTime = new Date().getTime();
        let expiry = dateTime + 86400000;
        let JWT_aud = 'Temporary';
        let JWT_sub = 'Temporary token';
        let JWT_uid = '';

        if (JWTObj.aud) JWT_aud = JWTObj.aud;
        if (JWTObj.sub) JWT_sub = JWTObj.sub;
        if (JWTObj.jti) JWT_uid = JWTObj.jti;

        // Prepare
        let tokenObj = {
            aud: JWT_aud,
            exp: Math.ceil(expiry / 1000),
            iat: Math.ceil(dateTime / 1000),
            sub: JWT_sub,
            jti: JWT_uid,
        };

        // Generate a token
        let token = await JWT.sign(tokenObj, CONSTANTS.JWT.SECRET);
        let userToken = {
            ...tokenObj,
            user: Mongoose.Types.ObjectId(JWTObj.jti),
            token: token,
        };

        return Promise.resolve({ message: 'JWT token generated successfully.', code: 200, data: userToken });
    } catch (error) {
        console.log("Error while generating JWT token: ");
        console.dir(error);
        return Promise.reject({ message: 'Error while generating JWT token: ' + error, code: 400, data: null });
    }
}


/**
 * signUp
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function signUp(authUser, user, params, flags) {
    try {
        // Initialize
        let error, userResult, generateTokenResult;

        // Insert the user details..
        if (user.password) {
            user.password = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10));
        }

        // Insert the user details..
        [error, userResult] = await To(UserService.createOne(authUser, user, params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        if (userResult && Object.keys(userResult).length > 0 && userResult.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
            let userDetails = JSON.parse(JSON.stringify(userResult.data));

            // // Generate the JWT token, if signup will redirect directly to inside..
            // let jwtToken = {
            //     aud: "user",
            //     sub: "User Token",
            //     jti: userDetails._id,
            // };
            // [error, generateTokenResult] = await To(generateJWTToken(authUser, jwtToken, null, flags));
            // if (error) {
            //     throw new AppError(error.message, error.code, error.data);
            // }
            // if (generateTokenResult && Object.keys(generateTokenResult).length > 0 && generateTokenResult.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
            //     userDetails.token = generateTokenResult.data.token;
            //     userDetails.token_expiry = generateTokenResult.data.exp;
            // }
            return Promise.resolve({ message: "User registered successfully.", code: 200, data: userDetails })
        } else {
            throw new AppError('Some error occured. Please try again later.', 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error during sign up process for one user: " + error, data: null });
        }
    }
}

/**
 * signIn
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function signIn(authUser, user, params, flags) {
    try {
        // Initialize
        let error, userResult, generateTokenResult;
        let query = {};
        let isPasswordsMatch = true;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        // Get user details
        [error, userResult] = await To(UserService.getOne(authUser, user, params, flags));
        if (error) {
            if (error.code === CONSTANTS.HTTP.STATUS.NOT_FOUND.CODE) {
                throw new AppError("Invalid user credentials.", CONSTANTS.HTTP.STATUS.NOT_AUTHENTICATED.CODE, null);
            } else {
                throw new AppError(error.message, error.code, error.data);
            }
        }

        if (userResult && Object.keys(userResult).length > 0 && userResult.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
            // Assign
            let userDetails = JSON.parse(JSON.stringify(userResult.data));

            // Compare password hash
            isPasswordsMatch = Bcrypt.compareSync(user.password, userDetails.password);

            if (isPasswordsMatch) {
                // Check if User's account is not "active"
                if (userDetails.status !== 'Active') {
                    switch (userDetails.status) {
                        case 'Locked':
                            throw new AppError("Yours account is locked.", 403, {});
                        case 'Not_verified':
                            throw new AppError("User's email is not verified.", CONSTANTS.HTTP.STATUS.NOT_AUTHORIZED.CODE, {});
                        case 'Deleted':
                            throw new AppError("User is not authorized to login. Please contact your administrator.", 403, {});
                        default:
                            throw new AppError("Unable to identify user's current status. Please contact your administrator.", CONSTANTS.HTTP.STATUS.NOT_AUTHORIZED.CODE, {});
                    }
                }

                // Generate the JWT token..
                let jwtToken = {
                    aud: "user",
                    sub: "User Token",
                    jti: userDetails._id,
                };
                [error, generateTokenResult] = await To(generateJWTToken(authUser, jwtToken, null, flags));
                if (error) {
                    throw new AppError(error.message, error.code, error.data);
                }

                let data = {};
                if (generateTokenResult && Object.keys(generateTokenResult).length > 0) {
                    data = {
                        ...userDetails,
                        token: generateTokenResult.data.token,
                        token_expiry: generateTokenResult.data.exp,
                    };
                }
                // Response
                return Promise.resolve({ code: 200, message: "User credentials verification successful.", data });
            }
        } else {
            throw new AppError("Invalid user credentials.", CONSTANTS.HTTP.STATUS.NOT_AUTHENTICATED.CODE, {});
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error during sign in process: " + error, data: null });
        }
    }
}

/**
 * get one user
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function getOne(authUser, user, params, flags) {
    try {
        // Initialize
        let error, result;

        if (!flags) {
            flags = {};
        }

        // Get
        [error, result] = await To(UserService.getOne(authUser, user, params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length > 0) {
            return Promise.resolve({ mesage: 'User details fetched successfully.', code: 200, data: result.data });
        } else {
            throw new AppError({ mesage: 'No user found with this details.', code: 404, data: null });
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while fetching one user details: " + error, data: null });
        }
    }
}
