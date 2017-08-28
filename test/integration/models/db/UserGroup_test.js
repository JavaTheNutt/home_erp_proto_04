const expect   = require('chai').expect;
const mongoose = require('mongoose');

const UserGroup = require('../../../../api/models/db/UserGroup');
const User      = require('../../../../api/models/db/User').model;
const config    = require('../../../../config');
const testUtils = require('../../test_util');

const COLLECTION_NAME = 'user_group';

describe('user group', function () {
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

		it('should create a user succesfully', async function () {
			const user      = new User({
				email: 'joewemyss3@gmail.com',
				firstName: 'joe',
				surname: 'wemyss'
			});
			const userGroup = new UserGroup({
				name: 'wemyss',
				users: [user]
			});
			const res       = await userGroup.save();
			expect(res._id).to.exist;
			expect(res.users.length).to.equal(1);
			expect(res.name).to.equal('wemyss');
		});
		it('should fail when no email is provided', async function () {
			const user  = new User({
				firstName: 'joewemyss',
				surname: 'wemyss'
			});
			const group = new UserGroup({
				name: 'wemyss',
				users: [user]
			});
			try {
				const res = await group.save();
			} catch (err) {
				expect(err).to.exist;
			}
		});
		it('should fail when email is badly formatted', async function () {
			const user  = new User({
				email: 'joewemyss',
				firstName: 'joewemyss',
				surname: 'wemyss'
			});
			const group = new UserGroup({
				name: 'wemyss',
				users: [user]
			});
			try {
				const res = await group.save();
			} catch (err) {
				expect(err).to.exist;
			}
		});
		it('should fail when no users are provided', async function () {
			const group = new UserGroup({
				name: 'wemyss',
				users: []
			});
			try {
				const res = await group.save();
			} catch (err) {
				expect(err).to.exist;
			}
		});
		it('should fail when no group name is provided', async function () {
			const user      = new User({
				email: 'joewemyss3@gmail.com',
				firstName: 'joe',
				surname: 'wemyss'
			});
			const group = new UserGroup({
				users: [user]
			});
			try {
				const res = await group.save();
			} catch (err) {
				expect(err).to.exist;
			}
		});
	})
});
