const emailValidator = require('email-validator');
module.exports = {
	validateEmail(email){
		'use strict';
		return emailValidator.validate(email);
	}
};
