const testUtils = require('../test_util');
const chai      = require('chai');
const expect    = chai.expect;
const sinon     = require('sinon');
chai.use(require('sinon-chai'));
const USER_GROUP_COLLECTION = 'user_group';
const USER_AUTH_COLLECTION  = 'user_auth';
const userGroupCtrl         = require('../../../api/controllers/UserGroupController');
describe('user group controller', function () {
	before(function (done) {
		testUtils.initialSetup([USER_GROUP_COLLECTION, USER_AUTH_COLLECTION], done);
	});
	afterEach(function (done) {
		testUtils.clearCollection([USER_GROUP_COLLECTION, USER_AUTH_COLLECTION], done);
	});
	after(function (done) {
		testUtils.closeConnection(done);
	});
	describe('create new group', function () {
		it('should call res.send with a status of 200', async function () {
			const req  = {
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
			const res  = {
				send: sinon.spy()
			};
			const next = sinon.spy();

			await userGroupCtrl.createNewGroup(req, res, next);
			expect(res.send).to.be.calledWith(200, {message: 'user group added successfully'})
		})
	})
});
