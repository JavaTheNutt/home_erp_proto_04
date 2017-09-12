const admin    = require('firebase-admin');
const Logger   = require('../util/Logger')('FIREBASE_SERVICE');
module.exports = {
	async verifyFirebaseToken(token) {
		'use strict';
		Logger.info(`attempting to verify token`);
		let decodedToken;
		try {
			decodedToken = await admin.auth().verifyIdToken(token);
			Logger.info(`token validated successfully`);
			return decodedToken.sub;
		} catch (err) {
			Logger.error(`error validating firebase token`);
			throw new Error(err);
		}
	}
};
