
'use strict';
/** Import Modules */
const Express = require('express');
const ExpressJoiValidation = require('express-joi-validation').createValidator({ passError: true });
const Joi = require('joi');
const ObjectId = require('joi-objectid');

const TodoController = require('./controllers/TodoController');
const PreRequestInterceptor = require('./intercepter/PreRequest');

const Router = Express.Router();

Joi.objectId = ObjectId(Joi);

const userParamsSchema = Joi.object({
	_userId: Joi.objectId().required(),
});
const todoParamsSchema = Joi.object({
	_todoId: Joi.objectId().required(),
});


/** Insert one todo */
let todoInsertSchema = Joi.object({
	// type: Joi.string().required(),		// normal_steps|treads_coins|rewards
	name: Joi.string().required(),      // todo name
	title: Joi.string().required(),
	text: Joi.string(),                 // description

	dates: {
		start: Joi.number(), // todo start date time
		end: Joi.number(),   // todo end date time
	}, // if required

	flags: Joi.object(),
});
Router.post(
	'/',
	PreRequestInterceptor.verifyToken,
	ExpressJoiValidation.body(todoInsertSchema),
	TodoController.createOne,
);

/** Fetch all */
Router.get(
	'/',
	PreRequestInterceptor.verifyToken,
	TodoController.getAll,
);

/** Fetch one todo details */
Router.get(
	'/:_todoId',
	PreRequestInterceptor.verifyToken,
	ExpressJoiValidation.params(todoParamsSchema),
	TodoController.getOne,
);

/** Update one todo details */
let todoUpdateSchema = Joi.object({
	// type: Joi.string().required(),		// normal_steps|treads_coins|rewards
	name: Joi.string().required(),      // todo name
	title: Joi.string().required(),
	text: Joi.string(),                 // description

	dates: {
		start: Joi.number(), // todo start date time
		end: Joi.number(),   // todo end date time
	}, // if required

	flags: Joi.object(),
});
Router.put(
	'/:_todoId',
	PreRequestInterceptor.verifyToken,
	ExpressJoiValidation.params(todoParamsSchema),
	ExpressJoiValidation.body(todoUpdateSchema),
	TodoController.updateOne,
);

/** Delete one todo */
Router.delete(
	'/:_todoId',
	PreRequestInterceptor.verifyToken,
	ExpressJoiValidation.params(todoParamsSchema),
	TodoController.deleteOne,
);



module.exports = Router;
