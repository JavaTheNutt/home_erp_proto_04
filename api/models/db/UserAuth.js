const mongoose        = require('mongoose');
const emailValidation = require('../../services/validation').validateEmail;
const UserAuthSchema  = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: emailValidation,
			message: 'email is improperly formatted'
		}
	},
	user: {
		type: mongoose.Types.ObjectId,
		required: true,
		unique: true
	},
	group: {
		type: mongoose.Types.ObjectId,
		required: true,
		unique: true
	}
})
