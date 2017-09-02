const chai                = require('chai');
const expect              = chai.expect;
const sinon               = require('sinon');
const ObjectId            = require('mongoose').Types.ObjectId;
const userGroupService    = require('../../../api/services/userGroupService');
const userAuthService     = require('../../../api/services/userAuthService');
const userGroupController = require('../../../api/controllers/UserGroupController');
chai.use(require('sinon-chai'));

require('mongoose').Promise = Promise;

describe('user group controller', function () {
	describe('add group', function () {
		const userId         = ObjectId();
		const groupId        = ObjectId();
		let req, res, next, createGroupStub, createAuthStub;
		const groupToBeSaved = {
			name: 'testgroup',
			users: [{
				email: 'test@test.com',
				firstName: 'test',
				surname: 'test'
			}]
		};
		const authToBeSaved  = {
			email: groupToBeSaved.users[0].email,
			user: userId,
			group: groupId,
			authProviders: [{password: 'password'}],
			roles: ['group_admin']
		};
		before(function () {
			createGroupStub = sinon.stub(userGroupService, 'createGroup');
			createAuthStub  = sinon.stub(userAuthService, 'createUserAuth')
		});
		beforeEach(function () {
			req  = {
				body: {
					group: {
						name: 'testgroup',
						users: [{
							email: 'test@test.com',
							firstName: 'test',
							surname: 'test',
							auth: {
								authProviders: [{
									password: 'password'
								}]
							},
							roles: ['group_admin']
						}]
					}
				}
			};
			res  = {
				send: sinon.spy()
			};
			next = sinon.spy();
		});
		afterEach(function () {
			createGroupStub.reset();
			createAuthStub.reset();
		});
		after(function () {
			createGroupStub.restore();
			createAuthStub.restore();
		});
		it('should successfully add a group', async function () {
			createGroupStub.withArgs(req.body.group).resolves({
				_id: groupId,
				name: 'stark',
				users: [{
					_id: userId,
					email: 'test@test.com',
					firstName: 'test',
					surname: 'test'
				}]
			});
			createAuthStub.withArgs(authToBeSaved).resolves({
				_id: ObjectId(),
				email: groupToBeSaved.users[0].email,
				user: userId,
				group: groupId,
				authProviders: [{
					_id: ObjectId(),
					password: 'password'
				}],
				roles: ['group_admin']
			});
			await userGroupController.createNewGroup(req, res, next);
			expect(createGroupStub).to.be.calledWith(req.body.group);
			expect(createGroupStub).to.be.calledBefore(createAuthStub);
			expect(createAuthStub).to.be.calledWith(authToBeSaved);
			expect(res.send).to.be.calledWith(200, {message: 'user group added successfully'});
		})
	})
});
