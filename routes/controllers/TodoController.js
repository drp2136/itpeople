'use strict';
module.exports = {
    getOne: getOne,
    getAll: getAll,
    createOne: createOne,
    updateOne: updateOne,
    deleteOne: deleteOne,
    search: search,
};

// Import
const Mongoose = require('mongoose');

const AppError = require('../../errors/AppError');
const TodoHelper = require('../helpers/TodoHelper');
const CONSTANTS = require('../../utils/Constant');
const To = require('../../utils/To');


/**
 * Get one todo
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getOne(req, res, next) {
    try {
        // Initialize
        let error, result;
        let flags = {};

        // Validate
        if (!Mongoose.Types.ObjectId.isValid(req.params._todoId)) {
            throw new AppError("Invalid todo id.", 400, null);
        }

        // Get one todo
        [error, result] = await To(TodoHelper.getOne(req.authUser, { _id: req.params._todoId }, req.params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length) {
            res.send(result);
        } else {
            throw new AppError("Some issue occured while fetching one todo", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while fetching one todo: " + error, data: {} };
        }
        res.send(req.logs);
    }
}

/**
 * get all
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function getAll(req, res, next) {
    try {
        // Initialize
        let error, result;
        let flags = {};

        // Get all todos
        [error, result] = await To(TodoHelper.getAll(req.authUser, {}, req.params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length) {
            res.send(result);
        } else {
            throw new AppError("Some issue occured during fetching all todos.", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while fetching all todos from DB: " + error, data: {} };
        }
        res.send(req.logs);
    }
}

/**
 * Create one todo
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function createOne(req, res, next) {
    try {
        // Initialize
        let error, result;
        let flags = {};

        // // Validation
        // if (!req.body.type) {
        //     throw new AppError("Todo type is either missing or invalid.", 400, null);
        // }
        // if (!req.body.category) {
        //     throw new AppError("Todo category is either missing or invalid.", 400, null);
        // }
        // if (!req.body.price || !VALIDATIONS.isNonEmptyObject(req.body.price)) {
        //     throw new AppError("Todo price is either missing or invalid.", 400, null);
        // }

        // Assign
        req.body.createdBy = (req.authUser && req.authUser.id) || req.params._userId;

        // create one todo
        [error, result] = await To(TodoHelper.createOne(req.authUser, req.body, req.params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length) {
            res.send(result);
        } else {
            throw new AppError("Some issue occured while creating one todo details", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while adding one todo: " + error, data: {} };
        }
        res.send(req.logs);
    }
}

/**
 * Update one todo
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function updateOne(req, res, next) {
    try {
        // Initialize
        let error, result;
        let flags = req.body.flags || {};

        // // Validation
        // if (req.body && !VALIDATIONS.isNonEmptyObject(req.body)) {
        //     throw new AppError("No details there to update", 400, null);
        // }
        // if (!VALIDATIONS.isValidMongoObjectId(req.params._todoId)) {
        //     throw new AppError("Invalid todo id.", 400, null);
        // }
        // // _TODO: add other params validation(Logical)..


        // Assign
        req.body._id = req.params._todoId;
        req.body.updatedBy = (req.authUser && req.authUser.id) || req.params._userId;

        // Update User
        [error, result] = await To(TodoHelper.updateOne(req.authUser, req.body, req.params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length) {
            res.send(result);
        } else {
            throw new AppError("Some issue occured while updating todo details.", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while updating one todo details: " + error, data: {} };
        }
        res.send(req.logs);
        // next();
    }
}

/**
 * Delete one todo
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function deleteOne(req, res, next) {
    try {
        // Initialize
        let error, result;
        let flags = {};

        // Validate
        if (!Mongoose.Types.ObjectId.isValid(req.params._todoId)) {
            throw new AppError("Invalid todo id.", 400, null);
        }

        // Get one todo
        [error, result] = await To(TodoHelper.deleteOne(req.authUser, { _id: req.params._todoId }, req.params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length) {
            res.send(result);
        } else {
            throw new AppError("Some issue occured while deleting one todo", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while deleting one todo: " + error, data: {} };
        }
        res.send(req.logs);
        // next();
    }
}

/**
 * Search Users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function search(req, res, next) {
    try {
        // Initialize
        let error, userResult;
        let flags = {};

        // Validate
        if (!VALIDATIONS.isNonEmptyObject(req.body)) {
            throw new AppError("No parameters set for searching users todo.", 400, null);
        }

        // Assign
        if (req.body.flags) {
            flags = req.body.flags;
        }

        // Search todo
        [error, userResult] = await To(TodoHelper.search(req.authUser, req.body, req.params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        req.logs = userResult;
        res.send(req.logs);
        // next();
    } catch (error) {
        if (error && error.code && error.message) {
            req.logs = { code: error.code, message: error.message, data: error.data };
        } else {
            req.logs = { code: 409, message: "Error while searching todos: " + error, data: null };
        }
        res.send(req.logs);
    }
}
