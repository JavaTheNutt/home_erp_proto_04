const mongoose = require('mongoose');
const Logger = require('../../util/Logger')('AUTH_PROVIDER_MODEL');
const AuthProviderSchema = mongoose.Schema({
	name: {
		type: String,
		default: 'self'
	},
	identifier: String,
	password: String
});
AuthProviderSchema.pre('validate', function (next) {
	'use strict';
	Logger.info(`validating auth provider model`);
	if (!this.password && !this.identifier) {
		Logger.warn(`no password or identifier present on model, aborting`);
		return next(new Error('either a password or an identifier must be provided'));
	}
	if (this.identifier && (!this.name || this.name === 'self')) {
		Logger.warn(`identifier provided, but no name provided, aborting`);
		return next(new Error('if an identifier is provided, a name must be provided also'));
	}
	Logger.info(`model valid`);
	return next()
});

const AuthProviderModel = mongoose.model('AuthProvider', AuthProviderSchema);

module.exports = {
	model: AuthProviderModel,
	schema: AuthProviderSchema
};
