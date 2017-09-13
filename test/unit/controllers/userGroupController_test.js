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
		// noinspection JSUnusedLocalSymbols
    const sampleHash     = '$2a$10$VjoTsEslNeeOTwY7tMGTh.VbwWp6HI8WuAG1gq6XP1Bdqg/Q4fmqm';
		let req, res, next, createGroupStub, createAuthStub, hashPasswordStub;
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
			authProviders: [{name: 'firebase', identifier:'uu0SMEK2itPcoQrvpfKXXOjZ5cL2'}],
			roles: ['group_admin']
		};
		before(function () {
			createGroupStub  = sinon.stub(userGroupService, 'createGroup');
			createAuthStub   = sinon.stub(userAuthService, 'createUserAuth');
			hashPasswordStub = sinon.stub(userAuthService, 'hashPassword');
		});
		beforeEach(function () {
			req  = {
				body: {
					group: {
						name: 'testgroup',
						email: 'test@test.com',
						firstName: 'test',
						surname: 'test',
						auth:{
							identifier: 'uu0SMEK2itPcoQrvpfKXXOjZ5cL2',
							name: 'firebase'
						}
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
			hashPasswordStub.reset();

		});
		after(function () {
			createGroupStub.restore();
			createAuthStub.restore();
			hashPasswordStub.restore();
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
					name: authToBeSaved.name,
					identifier: authToBeSaved.identifier
				}],
				roles: ['group_admin']
			});
			//hashPasswordStub.withArgs(req.body.group.users[0].auth.authProviders[0].password).resolves(sampleHash);
			await userGroupController.createNewGroup(req, res, next);
			expect(createGroupStub).to.be.calledWith(req.body.group);
			expect(createGroupStub).to.be.calledBefore(createAuthStub);
			expect(createAuthStub).to.be.calledWith(authToBeSaved);
			expect(res.send).to.be.calledWith(200, {message: 'user group added successfully'});
		})
	})
});
