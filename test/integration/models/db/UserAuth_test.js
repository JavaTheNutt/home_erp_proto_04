const expect       = require('chai').expect;
const ObjectId     = require('mongoose').Types.ObjectId;
const UserAuth     = require('../../../../api/models/db/UserAuth');
const AuthProvider = require('../../../../api/models/db/AuthProvider').model;
const testUtils    = require('../../test_util');
const UserGroup    = require('../../../../api/models/db/UserGroup').model;

const COLLECTION_NAME = 'user_auth';

describe('user auth', function () {
	before(function (done) {
		testUtils.initialSetup(COLLECTION_NAME, done);
	});
	afterEach(function (done) {
		testUtils.clearCollection(COLLECTION_NAME, done);
	});
	after(function (done) {
		testUtils.closeConnection(done);
	});
	describe('creation', function () {
		let groupId, userId, group;
		before(async function () {
			'use strict';
			const tmpGroup = new UserGroup({
				name: 'test',
				users: [{
					email: 'test@test.com',
					firstName: 'test',
					surname: 'test'
				}]
			});
			group          = await tmpGroup.save();
			groupId        = group._id;
			userId         = group.users[0]._id;
		});
		after(function (done) {
			UserGroup.remove({_id: groupId}, function (err) {
				if (err) {
					return done(err);
				}
				return done();
			})
		});
		it('should fail when an incorrect group id is present', async function () {
			const authProvider = new AuthProvider({
				name: 'firebase',
				identifier: 'test'
			});
			const userAuth     = new UserAuth({
				email: 'test@test.com',
				user: ObjectId().toString(),
				group: ObjectId().toString(),
				authProviders: [authProvider],
				roles: ['group_admin']
			});
			try {

			} catch (e) {
				expect(e.message.indexOf('the specified user group does not exist')).to.not.equal(-1);
			}
		});
		it('should successfully create an auth object', async function () {
			'use strict';
			const authProvider = new AuthProvider({
				name: 'firebase',
				identifier: 'test'
			});
			const userAuth     = new UserAuth({
				email: 'test@test.com',
				user: userId,
				group: groupId,
				authProviders: [authProvider],
				roles: ['group_admin']
			});
			const result       = await userAuth.save();
			expect(result._id).to.exist;
		});
		it('should successfully create a self auth object', async function () {
			const authProvider = new AuthProvider({
				password: 'password'
			});
			const userAuth     = new UserAuth({
				email: 'test@test.com',
				user: userId,
				group: groupId,
				authProviders: [authProvider],
				roles: ['group_admin']
			});
			const result       = await userAuth.save();
			expect(result._id).to.exist;
		});
		it('should fail when an incorrect userId is present', async function () {
			'use strict';
			const authProvider = new AuthProvider({
				name: 'firebase',
				identifier: 'test'
			});
			const userAuth     = new UserAuth({
				email: 'test@test.com',
				user: userId,
				group: groupId,
				authProviders: [authProvider],
				roles: ['group_admin']
			});
			try {

			} catch (e) {
				expect(e.message.indexOf('the specified user does not exist')).to.not.equal(-1);
			}
		})
	})
});
