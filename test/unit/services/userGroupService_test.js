const chai    = require('chai');
const expect  = chai.expect;
const sinon   = require('sinon');
chai.use(require('sinon-chai'));

const mongoose         = require('mongoose');
mongoose.Promise       = Promise;
const userGroupService = require('../../../api/services/userGroupService');
const UserGroup        = require('../../../api/models/db/UserGroup').model;

describe('user group service', function () {
	describe('data formatting', function () {
		it('should successfully format a userGroup', function () {
			const details = {
				name: 'test',
				foo: 'foo',
				bar: 'bar',
				email: 'test@test.com',
				firstName: 'test',
				surname: 'mctesty'
			};
			const result  = userGroupService.formatGroup(details);
			expect(result.foo).to.not.exist;
			expect(result.bar).to.not.exist;
			expect(result.name).to.equal(details.name);
			expect(result.users.length).to.equal(1);
			expect(result.users[0].email).to.equal(details.email);
			expect(result.users[0].firstName).to.equal(details.firstName);
			expect(result.users[0].surname).to.equal(details.surname);
		});
		it('throws an error when no group name is provided', function () {
			const details = {
				email: 'joewemyss3@gmail.com',
				firstName: 'joe',
				surname: 'wemyss'
			};
			try {
				userGroupService.formatGroup(details);
			} catch (e) {
				expect(e.message).to.equal('no valid group name provided');
			}
		});
		it('throws an error when no user email is provided', function () {
			const details = {
				name: 'wemyss',
				firstName: 'joe',
				surname: 'wemyss'
			};
			try {
				userGroupService.formatGroup(details);
			} catch (e) {
				expect(e.message).to.equal('no valid user email provided');
			}
		});
		it('throws an error when an invalid email is provided', function () {
			const details = {
				name: 'wemyss',
				email: 'joe@.com',
				firstName: 'joe',
				surname: 'wemyss'
			};
			try {
				userGroupService.formatGroup(details);
			} catch (e) {
				expect(e.message).to.equal('no valid user email provided');
			}
		});
	});
	describe('object creation', function () {
		'use strict';
		const saveStub        = sinon.stub(UserGroup.prototype, 'save');
		mongoose.Promise      = Promise;
		beforeEach(function (done) {
			saveStub.reset();
			return done();
		});
		after(function (done) {
			saveStub.restore();
			return done();
		});
		it('creates an object without error', async function () {
			const correctDetailsIn   = {
				name: 'test',
				foo: 'foo',
				bar: 'bar',
				email: 'test@test.com',
				firstName: 'test',
				surname: 'mctesty'
			};
			const persistableDetails = {
				name: 'stark',
				users: [{
					email: 'eddard@stark.com',
					firstName: 'eddard',
					surname: 'stark'
				}]
			};
			const expectedDetailsOut = {
				_id: 'someidhere',
				name: 'stark',
				users: [{
					email: 'eddard@stark.com',
					firstName: 'eddard',
					surname: 'stark'
				}]
			};
			saveStub.resolves(expectedDetailsOut);
			const res = await userGroupService.createGroup(correctDetailsIn);
			expect(res).to.equal(expectedDetailsOut);
		})
	})
});
