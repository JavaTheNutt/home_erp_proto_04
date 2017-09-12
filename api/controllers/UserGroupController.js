const Logger           = require('../util/Logger')('USER_GROUP_CTRL');
const userGroupService = require('../services/userGroupService');
const authService      = require('../services/userAuthService');
const errors           = require('restify-errors');
module.exports         = {
	async createNewGroup(req, res, next) {
		'use strict';
		Logger.info(`user group controller attempting to create new user group and auth records`);
		Logger.verbose(`details: ${JSON.stringify(req.body)}`);
		let groupToBeSaved;
		try {
			groupToBeSaved = await userGroupService.createGroup(req.body.group);
		} catch (err) {
			Logger.warn(`group could not be saved, sending error response`);
			// noinspection Annotator
			return next(new errors.BadRequestError(err.message));
		}
		Logger.info(`group details have been created without error`);
		Logger.verbose(`current auth details: ${JSON.stringify(req.body.group.auth)}`);
		//fixme : do something about the code below, its ugly
		let authToBeSaved;
		let authProvDetails = {};
		if (req.body.group.auth.identifier) {
		  Logger.info(`identifier found, assuming third party auth provider`);
			authProvDetails.identifier = req.body.group.auth.identifier;
			authProvDetails.name       = req.body.group.auth.name;
		} else {
		  Logger.info(`no identifier found, assuming password auth`);
			try {
				authProvDetails.password = await authService.hashPassword(req.body.group.auth.password);
				Logger.info(`password hashed successfully`);
			} catch (err) {
				Logger.warn(`password could not be hashed, ${err}`);
				await userGroupService.removeGroupById(groupToBeSaved._id);
				return next(new errors.BadRequestError(err.message));
			}
		}
		Logger.info(`auth details processed without error`);
		try {
			authToBeSaved = await authService.createUserAuth({
				email: req.body.group.email,
				user: groupToBeSaved.users[0]._id,
				group: groupToBeSaved._id,
				authProviders: [authProvDetails],
				roles: ['group_admin']
			});
		} catch (err) {
			Logger.warn(`auth object could not be saved, ${err}`);
			await userGroupService.removeGroupById(groupToBeSaved._id); //fixme no error check here
			return next(new errors.BadRequestError(err.message));
		}
		Logger.info(`details added successfully, returning 200 response`);
		return res.send(200, {message: 'user group added successfully'});
	},
	async tmpCreateNewGroup(req, res, next) {
		'use strict';
		Logger.info(`user group controller attempting to create new user group and auth records`);
		Logger.verbose(`details: ${JSON.stringify(req.body)}`);

	}
};
