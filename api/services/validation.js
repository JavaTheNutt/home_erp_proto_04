const emailValidator = require('email-validator');
const ObjectId       = require('mongoose').Types.ObjectId;
const Logger         = require('../util/Logger')('VALIDATION_SERVICE');
module.exports       = {
	validateEmail(email) {
		'use strict';
		return emailValidator.validate(email);
	},
	validateObjectId(strValue) {
		'use strict';
		try {
			Logger.verbose(`checking if ${strValue} is valid object id`);
			return new ObjectId(strValue).toString() === strValue;
		} catch (e) {
			Logger.warn(`not valid id`);
			return false;
		}
	}
};
