'use strict';
/** Import Modules */
const Express = require('express');
const ExpressJoiValidation = require('express-joi-validation').createValidator({ passError: true });
const Joi = require('joi');
const ObjectId = require('joi-objectid');

const UserController = require('./controllers/UserController');

const Router = Express.Router();
const NAME_PATTERN = /^[a-zA-Z0-9. ]+$/i;
const PASSWORD_PATTERN = /((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,8})/;
const NAME_VALIDATION_MSG = "Name is either missing or invalid. Only alphabets, numerics, space and dot are allowed.";
const PASSWORD_VALIDATION_MSG = "Should be more than 8 digit with a special character and an upper-case letter.";

Joi.objectId = ObjectId(Joi);


/* GET home page. */
Router.get('/', function (req, res, next) { res.render('index', { title: 'Express' }); });


// /** Users Account related: Direct */
/** Signup using email */
let signUpSchema = Joi.object({
	name: Joi.string().max(70).regex(NAME_PATTERN, NAME_VALIDATION_MSG).trim(),
	email: Joi.string().email().trim().required(),
	password: Joi.string().min(8).regex(PASSWORD_PATTERN, PASSWORD_VALIDATION_MSG).trim().required(),

	flags: Joi.object(),
});
Router.post(
	'/signup',
	ExpressJoiValidation.body(signUpSchema),
	UserController.signUp,
);

/** Signin using email */
let signInSchema = Joi.object({
	email: Joi.string().trim().required(),
	password: Joi.string().min(8).required().regex(PASSWORD_PATTERN, PASSWORD_VALIDATION_MSG).trim(),
});
Router.post(
	'/signin',
	ExpressJoiValidation.body(signInSchema),
	UserController.signIn,
);



module.exports = Router;
