const mongoose        = require('mongoose');
const emailValidation = require('../../services/validation').validateEmail;
const AuthProvider    = require('./AuthProvider').schema;
const UserGroup       = require('./UserGroup').model;

const Logger         = require('../../util/Logger')('USER_AUTH_MODEL');
//fixme tests fail when importing this module
const UserAuthSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: emailValidation,
			message: 'email is improperly formatted'
		}
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		unique: true,
		required: true,
		validate: {
			isAsync: true,
			validator: checkUserIdExists,
			message: 'the specified user does not exist'
		}
	},
	group: {
		type: mongoose.Schema.ObjectId,
		ref: 'UserGroup',
		required: true,
		validate: {
			isAsync: true,
			validator: checkGroupIdExists,
			message: 'the specified user group does not exist'
		}
	},
	authProviders: [AuthProvider],
	roles: [String]
}, {collection: 'user_auth'});

const UserAuthModel = mongoose.model('UserAuth', UserAuthSchema);

module.exports = UserAuthModel;

async function checkGroupIdExists(id, done) {
	Logger.verbose(`attempting to verify that user group exists`);
	const result = await UserGroup.findById(id);
	if (!result || !result._id || !result._id === id) {
		Logger.error(`user group does not exist, aborting`);
		return done(false);
	}
	Logger.verbose(`user group exists`);
	return done(true)
}
async function checkUserIdExists(id, done){
	'use strict';
	Logger.verbose(`attempting to verify if user exists`);
	const result = await UserGroup.findOne({"users._id": id})
	if (!result || !result._id) {
		Logger.error(`user does not exist, aborting`);
		return done(false);
	}
	Logger.verbose(`user exists`);
	return done();
}
