const Logger = require('../util/Logger')('USER_AUTH_SERVICE');
const validation = require('../services/validation');

module.exports = {
	formatDetails(details){
		'use strict';
		if(!details.email || !validation.validateEmail(details.email)){
			Logger.warn(`invalid email provided, aborting`);
			throw new Error('invalid email provided');
		}
		if(!details.group || !validation.validateObjectId(details.group.toString())){
			Logger.warn(`invalid group id provided, aborting`);
			throw new Error('invalid group id provided');
		}
		if(!details.user || !validation.validateObjectId(details.user.toString())){
			Logger.warn(`invalid user id provided, aborting`);
			throw new Error('invalid user id provided');
		}
		if(!details.authProviders || !Array.isArray(details.authProviders)|| details.authProviders.length < 1){
			Logger.warn(`no auth providers specified, aborting`);
			throw new Error('no auth providers provided');
		}
		return {
			email: details.email,
			user: details.user,
			group: details.group,
			authProviders: details.authProviders,
			roles: details.roles
		}
	}
};
