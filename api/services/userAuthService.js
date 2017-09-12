const Logger     = require('../util/Logger')('USER_AUTH_SERVICE');
const validation = require('../services/validation');
const UserAuth   = require('../models/db/UserAuth');
const bcrypt     = require('bcryptjs');
module.exports   = {
	createDetails(details) {
		'use strict';

	},
	formatDetails(details) {
		'use strict';
		if (!details.email || !validation.validateEmail(details.email)) {
			Logger.warn(`invalid email provided, aborting`);
			throw new Error('invalid email provided');
		}
		if (!details.group || !validation.validateObjectId(details.group.toString())) {
			Logger.warn(`invalid group id provided, aborting`);
			throw new Error('invalid group id provided');
		}
		if (!details.user || !validation.validateObjectId(details.user.toString())) {
			Logger.warn(`invalid user id provided, aborting`);
			throw new Error('invalid user id provided');
		}
		if (!details.authProviders || !Array.isArray(details.authProviders) || details.authProviders.length < 1) {
			Logger.warn(`no auth providers specified, aborting`);
			throw new Error('no auth providers provided');
		}
		if(details.authProviders[0].identifier && !details.authProviders[0].name){
		  Logger.warn(`an auth provider identifier was provided, but not a name`);
		  throw new Error('if an identifier is provided, a name must be provided also');
    }
		return {
			email: details.email,
			user: details.user,
			group: details.group,
			authProviders: details.authProviders,
			roles: [details.roles]
		}
	},
	async createUserAuth(details) {
		'use strict';
		Logger.info(`attempting to create auth record`);
		Logger.verbose(`details: ${details}`);
		const newAuth = new UserAuth(this.formatDetails(details));
		try {
			return await newAuth.save();
		} catch (err) {
			Logger.warn(`error saving auth object: ${err}`);
			throw new Error('error while saving auth object')
		}

	},
	async hashPassword(password) {
		'use strict';
		if (!password || !password.toString() === password || password < 1) {
			Logger.warn(`password does not exist`);
			throw new Error('trying to hash an incompatible password')
		}
		Logger.verbose(`attempting to hash password: ${password}`);
		let hashedPw;
		try {
			hashedPw = await bcrypt.hash(password, 10);
		} catch (e) {
			Logger.error(`password hash failed: ${e}`);
			throw new Error('password hash failed');
		}
		Logger.verbose(`password hashed successfully`);
		return hashedPw;
	},
	async findByAuthIdentifier(id) {
		'use strict';
		let result;
		Logger.info(`attempting to find user with the auth identifier: ${id}`);
		try {
			result = await UserAuth.findOne({'authProviders.identifier': id});
			Logger.info(`result of search: ${JSON.stringify(result)}`);
		} catch (e) {
			Logger.error(`error  finding data, ${e}`);
			throw e;
		}
		return result;
	},
	async authenticateFirebase() {
		'use strict';

	}
};
