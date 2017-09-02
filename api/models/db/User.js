const mongoose = require('mongoose');

const Logger          = require('../../util/Logger')('USER_MODEL');
const emailValidation = require('../../services/validation').validateEmail;
const UserSchema      = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: emailValidation,
			message: 'email is improperly formatted'
		}
	},
	firstName: String,
	surname: String

});
const UserModel       = mongoose.model('User', UserSchema);

module.exports = {
	schema: UserSchema,
	model: UserModel
};
