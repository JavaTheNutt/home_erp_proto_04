const mongoose = require('mongoose');

const UserSchema = require('./User').schema;
const UserGroupSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	users:[UserSchema]
}, {collection: 'user_group'});

const UserGroupModel = mongoose.model('UserGroup', UserGroupSchema);
module.exports = UserGroupModel;
