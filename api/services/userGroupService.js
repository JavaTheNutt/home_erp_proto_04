const UserGroup      = require('../models/db/UserGroup').model;
const Logger         = require('../util/Logger')('USER_GROUP_SERVICE');
const emailValidator = require('../services/validation').validateEmail;
module.exports       = {
	async createGroup(details) {
		'use strict';
		Logger.info(`create group called`);
		const group  = new UserGroup(this.formatGroup(details));
		// noinspection Annotator
		const result = await group.save();
		Logger.verbose(`results of save: ${JSON.stringify(result)}`);
		return result;
	},
	formatGroup(details) {
		'use strict';
		Logger.info(`attempting to format a group`);
		Logger.verbose(`group: ${JSON.stringify(details)}`);
		if (!details.name) {
			Logger.warn(`no name found to format group, throwing error`);
			throw new Error('no valid group name provided');
		}
		if (!details.users || !Array.isArray(details.users) || details.users.length < 1) {
			Logger.warn(`no users found to format group, throwing error`);
			throw new Error('at least one user must be provided to create the group');
		}
		const returnableDetails = {
			name: details.name,
			users: []
		};
		details.users.forEach(user => {
			if (!user.email || !emailValidator(user.email)) {
				Logger.warn(`no user email found to format group, throwing error`);
				throw new Error('no valid user email provided');
			}
			returnableDetails.users.push({
				email: user.email,
				firstName: user.firstName,
				surname: user.surname
			});
		});
		return returnableDetails;
	}
};
