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
		if (!details.email || !emailValidator(details.email)) {
			Logger.warn(`no user email found to format group, throwing error`);
			throw new Error('no valid user email provided');
		}
		return {
			name: details.name,
			users: [{
				email: details.email,
				firstName: details.firstName,
				surname: details.surname
			}]
		};
	},
  //fixme: not tested
	async removeGroupById(groupId) {
		'use strict';
		Logger.info(`attempting to remove group with id: ${groupId}`);
		try {
			await UserGroup.findByIdAndRemove(groupId);
			Logger.verbose(`item removed`);
			return true;
		} catch (e) {
			Logger.warn(`error removing object`);
			throw new Error('unable to remove specified item');
		}
	},
  //fixme: not tested
	async findGroupById(id) {
		'use strict';
		Logger.info(`attempting to find group with id ${id}`);
		let group;
		try {
			group = await UserGroup.findById(id);
			Logger.info(`group found`);
			Logger.verbose(`group: ${group}`);
			return group;
		} catch (err) {
			Logger.error(`error finding group`);
			Logger.error(`error`);
			throw new Error(err);
		}
	},
  //fixme, this function is not tested
	formatGroupForDelivery(group, userId) {
		'use strict';
		Logger.info(`attempting to format group: ${JSON.stringify(group)} with user ${userId}`);
		const returnedGroup = {
			name: group.name,
			users: []
		};
		group.users.forEach((elem) => {
			Logger.info(`user currently being tested: ${JSON.stringify(elem)}`);
			Logger.verbose(`comparing ${elem._id} to ${userId}`);
			if (elem._id.equals(userId)) {
				Logger.info(`current user found`);
				returnedGroup.currentUser = elem;
			} else {
				Logger.info(`other user found`);
				returnedGroup.users.push(elem);
			}
			Logger.info(`group formatted`);
			Logger.verbose(`new group: ${JSON.stringify(returnedGroup)}`);
			return returnedGroup;
		})
	}
};
