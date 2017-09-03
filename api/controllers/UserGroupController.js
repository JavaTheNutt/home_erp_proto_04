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
			return next(new errors.BadRequestError(err, 'there was a problem with the request'));
		}
		Logger.verbose(`group details have been created without error`);

		let authToBeSaved;
		let authProvDetails = {};
		if(req.body.group.users[0].auth.authProviders[0].identifier){
			authProvDetails.identifier = req.body.group.users[0].auth.authProviders[0].identifier;
			authProvDetails.name = req.body.group.users[0].auth.authProviders[0].name;
		}else{
			authProvDetails.password = await authService.hashPassword(req.body.group.users[0].auth.authProviders[0].password)
		}
		try {
			authToBeSaved = await authService.createUserAuth({
				email: req.body.group.users[0].email,
				user: groupToBeSaved.users[0]._id,
				group: groupToBeSaved._id,
				authProviders: [authProvDetails],
				roles: req.body.group.users[0].roles
			});
		} catch (err) {
			Logger.warn(`auth object could not be saved`);
			return next(new errors.BadRequestError(err, 'there was a problem with the request'));
		}
		return res.send(200, {message: 'user group added successfully'});

	}
};
