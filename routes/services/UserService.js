'use strict';
module.exports = {
	getOne: getOne,
	updateOne: updateOne,
	updateMany: updateMany,
	createOne: createOne,
	search: search,
	getAll: getAll,
};

// Imports
const _ = require('underscore');
const Bcrypt = require('bcryptjs');
const Mongoose = require('mongoose');

const AppError = require('../../errors/AppError');
const UserModel = require('../models/User');
const CONSTANTS = require('../../utils/Constant');
const To = require('../../utils/To');


/**
 * Get one user
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function getOne(authUser, user, params, flags) {
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
		if (user._id) {
			query._id = Mongoose.Types.ObjectId(user._id);
		}
		if (user.email) {
			query.email = user.email;
		}
		if (user.phone) {
			query.phone = user.phone;
		}

		// Validate
		if (!(query && Object.keys(query).length > 0)) {
			throw new AppError("No keys found to retrieve one user.", 400, null);
		}

		result = await UserModel.findOne(query).exec();

		if (result) {
			return Promise.resolve({ code: 200, message: "User details retrieved successfully.", data: result });
		} else {
			throw new AppError("User not found.", 404, null);
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while retrieving one user details: " + error });
		}
	}
}

/**
 * Get all user
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function getAll(authUser, user, params, flags) {
	try {
		// Initialize
		let result, query = {};

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		if (user._id) { // Exceptional condition.. Not required all the time..
			query._id = user._id;
		}

		result = await UserModel.find(query).exec();

		if (result) {
			return Promise.resolve({ code: 200, message: "User details retrieved successfully.", data: result });
		} else {
			throw new AppError("No users found.", 404, null);
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while retrieving one user details: " + error });
		}
	}
}

/**
 * Update one
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function updateOne(authUser, user, params, flags) {
	try {
		// Initialize
		let error, result, userResult;
		let query = {};

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		// Assign
		if (user._id) {
			query._id = user._id;
		} else if (user.email) {
			query.email = user.email;
		} else if (user.phone) {
			query.phone = user.phone;
		}

		// Get existing user details
		[error, userResult] = await To(getOne(authUser, query, null, null));
		if (error) {
			throw new AppError("Error while retrieving existing user details: " + error.message, error.code, error.data);
		}
		if (!(response && Object.keys(response).length > 0) && response.code === CONSTANTS.HTTP.STATUS.OK.CODE
			&& !(response.data && Object.keys(response.data).length > 0)) {
			// Validate
			if (user.password) {
				if (user.password.includes(userResult.data.email)) {
					throw new AppError("Password should not contain email.", 400, null);
				}
				if (user.password.includes(userResult.data.phone)) {
					throw new AppError("Password should not contain phone.", 400, null);
				}
				user.password = Bcrypt.hashSync(user.password, Bcrypt.genSaltSync(10));
			}

			if (!user["$addToSet"]) {
				user["$addToSet"] = {};
			}

			// Update
			result = await UserModel.findOneAndUpdate(query, user, { useFindAndModify: false, new: true }).exec();

			// Response
			return Promise.resolve({ code: 200, message: "User updated successfully.", data: result });
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while updating user details: " + error });
		}
	}
};

/**
 * Update many
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function updateMany(authUser, user, params, flags) {
	try {
		// Initialize
		let error, result, userResult;
		let query = {};

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		// Assign
		if (user._id) {
			query._id = user._id;
		} else if (user.email) {
			query.email = user.email;
		} else if (user.phone) {
			query.phone = user.phone;
		}

		// Update
		result = await UserModel.updateMany(query, user, { useFindAndModify: false, new: true }).exec();

		// Response
		return Promise.resolve({ code: 200, message: "Multiple user updated successfully.", data: result });
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while updating multiple users details: " + error });
		}
	}
};

/**
 * create one
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function createOne(authUser, user, params, flags) {
	try {
		let result;

		// Create
		result = await new UserModel(user).save();

		// Remove fields
		if (result) {
			delete result.password;
			delete result.token;
		}

		// Response
		return Promise.resolve({ code: 200, message: "One user created successfully.", data: result });
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while updating user details: " + error });
		}
	}
}

/**
 * Search
 * @param {*} authUser 
 * @param {*} user 
 * @param {*} params 
 * @param {*} flags 
 */
async function search(authUser, user, params, flags) {
	try {
		let result;
		let userQuery = {};
		let totalCount = 0;

		if (!params) {
			params = {};
		}
		if (!flags) {
			flags = {};
		}

		if (user._id) {
			userQuery._id = user._id;
		}
		if (user.ids && user.ids.length > 0) {
			userQuery._id = { $in: user.ids };
		}
		if (user.name) {
			userQuery.name = { $regex: user.name, $options: "i" };
		}
		if (user.email) {
			userQuery.email = { $regex: user.email, $options: "i" };
		}
		if (user.phone) {
			userQuery.phone = { $regex: user.phone, $options: "i" };
		}
		if (user.phones && user.phones.length > 0) {
			userQuery.phone = { $in: user.phones };
		}
		if (user.status) {
			userQuery.status = user.status;
		}
		if (user.statuses) {
			userQuery.status = { $in: user.statuses };
		}
		if (user.type) {
			userQuery.type = user.type;
		}
		if (user.types) {
			userQuery.type = { $in: user.types };
		}

		// Set limit
		params.limit = (params.limit && isNaN(parseFloat(params.limit)) && isFinite(params.limit) && (parseFloat(params.limit) >= 0)) ? parseInt(params.limit) : 100;

		// Set skip
		params.skip = (params.skip && isNaN(parseFloat(params.skip)) && isFinite(params.skip) && (parseFloat(params.skip) >= 0)) ? parseInt(params.skip) : 0;

		// Set sort
		params.sort = (params.sort && (params.sort === 1 || params.sort === -1)) ? { _id: parseInt(params.sort) } : params.sort;

		// Since this is a Search API, atleast 1 search param is required
		if (userQuery && Object.keys(userQuery).length > 0) {
			// Get total count
			if (flags.isGetTotalCount) {
				totalCount = await UserModel.countDocuments(userQuery).exec();
			}

			// Search
			result = await UserModel
				.find(userQuery)
				.sort(params.sort)
				.skip(params.skip)
				.limit(params.limit)
				.exec();

			if (result && result.length > 0) {
				return Promise.resolve({ code: 200, message: "Users retrieved successfully.", data: result, total: totalCount });
			} else {
				return Promise.resolve({ code: 200, message: "No users found that match the search criteria." });
			}
		} else {
			return Promise.reject({ code: 400, message: "No search keys found." });
		}
	} catch (error) {
		if (error && error.code && error.message) {
			return Promise.reject({ code: error.code, message: error.message, data: error.data });
		} else {
			return Promise.reject({ code: 409, message: "Error while searching user details: " + error });
		}
	}
}
