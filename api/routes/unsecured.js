const userGroupController = require('../controllers/UserGroupController');
const authController = require('../controllers/AuthController');
module.exports = server => {
	'use strict';
	server.post('/user_group/create', userGroupController.createNewGroup);
	server.get('/login/firebase', authController.login)
};
