'use strict';
module.exports = {
    getOne: getOne,
    getAll: getAll,
    updateOne: updateOne,
    createOne: createOne,
    deleteOne: deleteOne,
    search: search,
};

// Imports
const FS = require('fs');
const Moment = require('moment');
const Mongoose = require('mongoose');
const Path = require('path');

const AppError = require('../../errors/AppError');
const TodoService = require('../services/TodoService');
const CONSTANTS = require('../../utils/Constant');
const To = require('../../utils/To');


/**
 * get one todo
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function getOne(authUser, todo, params, flags) {
    try {
        // Initialize
        let error, result;

        if (!flags) {
            flags = {};
        }

        // Get
        [error, result] = await To(TodoService.getOne(authUser, todo, params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length > 0) {
            return Promise.resolve({ mesage: 'Todo details fetched successfully.', code: 200, data: result.data });
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while fetching one todo details: " + error, data: null });
        }
    }
}

/**
 * get all
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function getAll(authUser, todo, params, flags) {
    try {
        // Initialize
        let error, result;
        let flags = {};

        // Get all todo
        [error, result] = await To(TodoService.getAll(authUser, todo, params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result) {
            return Promise.resolve({ code: 200, message: 'Todos details retreived successfully.', data: result.data });
        } else {
            throw new AppError("Some issue occured during fetching all todos.", 400, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while fetching all todos: " + error });
        }
    }
}

/**
 * update one todo details
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function updateOne(authUser, todo, params, flags) {
    try {
        // Initialize
        let error, result;

        if (!flags) {
            flags = {};
        }

        [error, result] = await To(getOne(authUser, { _id: todo._id }, null, null));
        if (error) {
            throw new AppError("Error while retrieving existing todo details: " + error.message, error.code, error.data);
        }
        if (result && Object.keys(result).length > 0 && result.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
            // Update
            [error, result] = await To(TodoService.updateOne(authUser, todo, params, flags));
            if (error) {
                throw new AppError(error.message, error.code, error.data);
            }

            if (result && Object.keys(result).length > 0 && result.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
                // Response
                return Promise.resolve({ code: 200, message: "Todo updated successfully.", data: result.data });
            } else {
                throw new AppError("An error occured while updating one todo details.", 409, null);
            }
        } else {
            throw new AppError("Todo not found.", 404, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while updating one todo details: " + error, data: null });
        }
    }
}

/**
 * create one 
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function createOne(authUser, todo, params, flags) {
    try {
        // Initialize
        let error, result;

        if (!params) {
            params = {};
        }
        if (!flags) {
            flags = {};
        }

        // Update
        [error, result] = await To(TodoService.createOne(authUser, todo, params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length > 0 && result.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
            return Promise.resolve({ code: 200, message: "Todo details created successfully.", data: result.data });
        } else {
            throw new AppError("An error occured while updating one todo details.", 409, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while updating one todo details: " + error, data: null });
        }
    }
}

/**
 * Delete one todo
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function deleteOne(authUser, todo, params, flags) {
    try {
        // Initialize
        let error, result;

        // Delete
        [error, result] = await To(TodoService.deleteOne(authUser, todo, params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && Object.keys(result).length > 0 && result.code === CONSTANTS.HTTP.STATUS.OK.CODE) {
            return Promise.resolve({ code: result.code, message: result.message, data: {} });
        } else {
            throw new AppError("An error occured while deleting one todo. Please try again.", 409, null);
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "An error occured while deleting one todo: " + error });
        }
    }
}

/**
 * Search
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function search(authUser, todo, params, flags) {
    try {
        // Initialize
        let error, result;

        // Search
        [error, result] = await To(TodoService.search(authUser, todo, params, flags));
        if (error) {
            throw new AppError(error.message, error.code, error.data);
        }

        // Response
        if (result && result.length > 0 && result.code === CONSTANTS.HTTP.STATUS.OK.CODE) {

            return Promise.resolve({ code: result.code, message: result.message, data: result.data });
        } else {
            return Promise.resolve({ code: result.code, message: "No todo found matching the search criteria.", data: [] });
        }
    } catch (error) {
        if (error && error.code && error.message) {
            return Promise.reject({ code: error.code, message: error.message, data: error.data });
        } else {
            return Promise.reject({ code: 409, message: "Error while searching todos: " + error });
        }
    }
}
