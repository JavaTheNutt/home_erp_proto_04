const userGroupController = require('../controllers/UserGroupController');

module.exports = server => {
	'use strict';
	server.post('/user_group/create', userGroupController.createNewGroup)
};
