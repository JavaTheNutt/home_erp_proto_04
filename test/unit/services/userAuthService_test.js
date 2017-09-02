const chai     = require('chai');
const expect   = chai.expect;
const sinon    = require('sinon');
const ObjectId = require('mongoose').Types.ObjectId;
chai.use(require('sinon-chai'));

const userAuthService = require('../../../api/services/userAuthService');
const UserAuth        = require('../../../api/models/db/UserAuth');
const UserGroup       = require('../../../api/models/db/UserGroup');
const User            = require('../../../api/models/db/User');

const mongoose   = require('mongoose');
mongoose.Promise = Promise;

describe('user auth service', function () {
	describe('data formatting', function () {
		it('should successfully format user auth details', function () {
			const userId               = ObjectId();
			const groupId              = ObjectId();
			const detailsToBeSanitised = {
				foo: 'bar',
				bar: 'baz',
				email: 'joewemyss3@gmail.com',
				user: userId,
				group: groupId,
				authProviders: [{
					name: 'firebase',
					identifier: 'test'
				}],
				roles: ['group_admin']
			};
			const result               = userAuthService.formatDetails(detailsToBeSanitised);
			expect(result.foo).to.not.exist;
			expect(result.bar).to.not.exist;
			expect(result.email).to.equal(detailsToBeSanitised.email);
			expect(result.user).to.equal(detailsToBeSanitised.user);
			expect(result.group).to.equal(detailsToBeSanitised.group);
			expect(result.authProviders.length).to.equal(1);
			expect(result.authProviders[0].name).to.equal(detailsToBeSanitised.authProviders[0].name);
		});
		it('should throw an error when no email is provided', function () {
			const userId               = ObjectId();
			const groupId              = ObjectId();
			const detailsToBeSanitised = {
				user: userId,
				group: groupId,
				authProviders: [{
					name: 'firebase',
					identifier: 'test'
				}],
				roles: ['group_admin']
			};
			try {
				userAuthService.formatDetails(detailsToBeSanitised);
			} catch (err) {
				expect(err.message).to.equal('invalid email provided');
			}
		});
		it('should throw an error when an invalid email is provided', function () {
			const userId               = ObjectId();
			const groupId              = ObjectId();
			const detailsToBeSanitised = {
				email: 'joe',
				user: userId,
				group: groupId,
				authProviders: [{
					name: 'firebase',
					identifier: 'test'
				}],
				roles: ['group_admin']
			};
			try {
				userAuthService.formatDetails(detailsToBeSanitised);
			} catch (err) {
				expect(err.message).to.equal('invalid email provided');
			}
		});
		it('should throw an error when an no auth providers are provided', function () {
			const userId               = ObjectId();
			const groupId              = ObjectId();
			const detailsToBeSanitised = {
				email: 'test@test.com',
				user: userId,
				group: groupId,
				authProviders: [],
				roles: ['group_admin']
			};
			try {
				userAuthService.formatDetails(detailsToBeSanitised);
			} catch (err) {
				expect(err.message).to.equal('no auth providers provided');
			}
		});
		it('should throw an error when no user id is provided', function () {
			'use strict';
			const groupId              = ObjectId();
			const detailsToBeSanitised = {
				email: 'test@test.com',
				group: groupId,
				authProviders: [{
					name: 'firebase',
					identifier: 'test'
				}],
				roles: ['group_admin']
			};
			try {
				userAuthService.formatDetails(detailsToBeSanitised);
			} catch (err) {
				expect(err.message).to.equal('invalid user id provided');
			}
		});
		it('should throw an error when no group id is provided', function () {
			'use strict';
			const groupId              = ObjectId();
			const detailsToBeSanitised = {
				email: 'test@test.com',
				user: groupId,
				authProviders: [{
					name: 'firebase',
					identifier: 'test'
				}],
				roles: ['group_admin']
			};
			try {
				userAuthService.formatDetails(detailsToBeSanitised);
			} catch (err) {
				expect(err.message).to.equal('invalid group id provided');
			}
		})
	});
	describe('object creation', function () {
		const saveStub   = sinon.stub(UserAuth.prototype, 'save');
		const preStub    = sinon.stub(UserAuth.prototype, 'pre').resolves(true);
		mongoose.Promise = Promise;

		beforeEach(function () {
			saveStub.reset();
			preStub.reset();
		});
		after(function () {
			saveStub.restore();
			preStub.restore();
		});
		it('should successfully create an object', async function () {
			const userId         = ObjectId();
			const groupId        = ObjectId();
			const testDetails    = {
				foo: 'bar',
				bar: 'baz',
				email: 'joewemyss3@gmail.com',
				user: userId,
				group: groupId,
				authProviders: [{
					name: 'firebase',
					identifier: 'test'
				}],
				roles: ['group_admin']
			};
			const expectedOutput = {
				_id: 'someidhere',
				email: 'joewemyss3@gmail.com',
				user: userId,
				group: groupId,
				authProviders: [{
					name: 'firebase',
					identifier: 'test'
				}],
				roles: ['group_admin']
			};
			saveStub.resolves(expectedOutput);
			const result = await userAuthService.createUserAuth(testDetails);
			expect(result._id).to.exist;
		})
	})
});
