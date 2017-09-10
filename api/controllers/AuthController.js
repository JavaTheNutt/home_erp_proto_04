const firebaseAuthService = require('../services/firebaseAuthService');
const userAuthService = require('../services/userAuthService');
const userGroupService = require('../services/userGroupService');
const Logger = require('../util/Logger')('AUTH_CTRL');
const _ = require('lodash');
module.exports = {
	//fixme: this needs serious refactoring
	async login(req, res, next){
		'use strict';
		let subject, authObj, groupObj;
		Logger.info(`request recieved`);
		Logger.verbose(`request : ${JSON.stringify(req.headers)}`);
		try {
			subject = await firebaseAuthService.verifyFirebaseToken(req.headers.token);
			Logger.info(`subject: ${subject}`);
			authObj = await userAuthService.findByAuthIdentifier(subject);
			Logger.info(`auth object: ${JSON.stringify(authObj)}`);
			const userId = authObj.user;
			const groupId = authObj.group;
			groupObj = await userGroupService.findGroupById(groupId);
			groupObj = userGroupService.formatGroupForDelivery(groupObj, userId);
			if(!_.includes(authObj.roles, 'group_admin')){
				groupObj.users = null;
			}
			return res.send(200, groupObj);
		} catch (err) {
			//fixme better handling
			Logger.error(`${err}`);
			return res.send(500, err);
		}

	}
};
