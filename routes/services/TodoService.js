'use strict';
module.exports = {
	getOne: getOne,
	updateOne: updateOne,
	createOne: createOne,
	deleteOne: deleteOne,
	search: search,
	getAll: getAll,
};

// Imports
const _ = require('underscore');
const Mongoose = require('mongoose');

const AppError = require('../../errors/AppError');
const TodoModel = require('../models/Todo');
const CONSTANTS = require('../../utils/Constant');
const To = require('../../utils/To');


/**
 * Get one todo
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function getOne(authUser, todo, params, flags) {
	try {
		// Initialize
		let result, query = {};

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		// Prepare
		if (todo._id) {
			query._id = Mongoose.Types.ObjectId(todo._id);
		}
		if (todo.name) {
			query.name = todo.name;
		}
		if (todo.title) {
			query.title = todo.title;
		}

		// Validate
		if (!(query && Object.keys(query).length > 0)) {
			throw new AppError("No keys found to retrieve one todo details.", 400, null);
		}

		result = await TodoModel.findOne(query).exec();

		if (result) {
			return Promise.resolve({ code: 200, message: "Todo details retrieved successfully.", data: result });
		} else {
			throw new AppError("Todo details not found.", 404, null);
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while retrieving one todo details: " + error });
		}
	}
}

/**
 * Get all todo
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function getAll(authUser, todo, params, flags) {
	try {
		// Initialize
		let result, query = {};

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		result = await TodoModel.find(query).exec();

		if (result) {
			return Promise.resolve({ code: 200, message: "Todo details retrieved successfully.", data: result });
		} else {
			return Promise.resolve({ messgae: "No todos found.", code: 200, data: null });
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while retrieving one todo details: " + error });
		}
	}
}

/**
 * Update one
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function updateOne(authUser, todo, params, flags) {
	try {
		// Initialize
		let error, result, todoResult;
		let query = {};

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		// Assign
		if (todo._id) {
			query._id = todo._id;
		} else if (todo.name) {
			query.name = todo.name;
		} else if (todo.title) {
			query.title = todo.title;
		}

		// Get existing todo details
		[error, todoResult] = await To(getOne(authUser, query, null, null));
		if (error) {
			throw new AppError("Error while retrieving existing todo details: " + error.message, error.code, error.data);
		}
		if (todoResult && Object.keys(todoResult).length > 0 && todoResult.code === CONSTANTS.HTTP.STATUS.OK.CODE
			&& todoResult.data && Object.keys(todoResult.data).length > 0) {

			// Update
			result = await TodoModel.findOneAndUpdate(query, todo, { useFindAndModify: false, new: true }).exec();

			// Response
			return Promise.resolve({ code: 200, message: "Todo details updated successfully.", data: result });
		} else {
			throw new AppError("Todo details not found.", 404, null);
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while updating todo details: " + error });
		}
	}
};

/**
 * create one
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function createOne(authUser, todo, params, flags) {
	try {
		let result;

		// Create
		result = await new TodoModel(todo).save();

		// Response
		return Promise.resolve({ code: 200, message: "One todo created successfully.", data: result });
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while updating todo details: " + error });
		}
	}
}

/**
 * Delete one
 * @param {*} authUser 
 * @param {*} todo 
 * @param {*} params 
 * @param {*} flags 
 */
async function deleteOne(authUser, todo, params, flags) {
	try {
		// Initialize
		let result;
		let query = {};

		if (todo._id) {
			query._id = todo._id;
		}

		// Validate
		if (!Object.keys(query).length > 0) {
			throw new AppError("No keys found to delete one token.", 400, null);
		}

		// Delete
		result = await TodoModel.deleteOne(query).exec();

		// Response
		if (result) {
			return Promise.resolve({ code: 200, message: "One todo details deleted successfully.", data: result });
		} else {
			throw new AppError("An error occured while deleting one todo details.", 409, null);
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while deleting one todo details: " + error });
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
		let result;
		let todoQuery = {};
		let totalCount = 0;

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		if (todo._id) {
			todoQuery._id = todo._id;
		}
		if (todo.ids && todo.ids.length > 0) {
			todoQuery._id = { $in: todo.ids };
		}
		if (todo.name) {
			todoQuery.name = { $regex: todo.name, $options: "i" };
		}
		if (todo.title) {
			todoQuery.title = { $regex: todo.title, $options: "i" };
		}

		// Set limit
		params.limit = (params.limit && isNaN(parseFloat(params.limit)) && isFinite(params.limit) && (parseFloat(params.limit) >= 0)) ? parseInt(params.limit) : 100;

		// Set skip
		params.skip = (params.skip && isNaN(parseFloat(params.skip)) && isFinite(params.skip) && (parseFloat(params.skip) >= 0)) ? parseInt(params.skip) : 0;

		// Set sort
		params.sort = (params.sort && (params.sort === 1 || params.sort === -1)) ? { _id: parseInt(params.sort) } : params.sort;

		// Since this is a Search API, atleast 1 search param is required
		if (todoQuery && Object.keys(todoQuery).length > 0) {
			// Get total count
			if (flags.isGetTotalCount) {
				totalCount = await TodoModel.countDocuments(todoQuery).exec();
			}

			// Search
			result = await TodoModel
				.find(todoQuery)
				.sort(params.sort)
				.skip(params.skip)
				.limit(params.limit)
				.exec();

			if (result && result.length > 0) {
				return Promise.resolve({ code: 200, message: "Todo details retrieved successfully.", data: result, total: totalCount });
			} else {
				return Promise.resolve({ code: 200, message: "No todos found that match the search criteria." });
			}
		} else {
			return Promise.reject({ code: 400, message: "No search keys found." });
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while searching todo details: " + error });
		}
	}
}
