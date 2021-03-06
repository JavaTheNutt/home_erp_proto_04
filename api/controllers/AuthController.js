const firebaseAuthService = require('../services/firebaseAuthService');
const userAuthService     = require('../services/userAuthService');
const userGroupService    = require('../services/userGroupService');
const Logger              = require('../util/Logger')('AUTH_CTRL');
const _                   = require('lodash');
const errors              = require('restify-errors');
module.exports            = {
	//fixme: this needs serious refactoring
	async login(req, res, next) {
		'use strict';
		let subject, authObj, groupObj;
		Logger.info(`request recieved`);
		Logger.verbose(`request headers: ${JSON.stringify(req.headers)}`);
		try {
			subject = await firebaseAuthService.verifyFirebaseToken(req.headers.token);
			if (!subject) {
				return next(new errors.UnauthorizedError('token rejected'));
			}
			Logger.verbose(`subject: ${subject}`);
			authObj = await userAuthService.findByAuthIdentifier(subject);

			Logger.info(`auth object: ${JSON.stringify(authObj)}`);
			const userId  = authObj.user;
			const groupId = authObj.group;
			groupObj      = await userGroupService.findGroupById(groupId);
			groupObj      = userGroupService.formatGroupForDelivery(groupObj, userId);

			return res.send(200, groupObj);
		} catch (err) {
			//fixme better handling
			Logger.error(`${err}`);
			return res.send(500, err);
		}

	}
};
