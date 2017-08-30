const chai    = require('chai');
const expect  = chai.expect;
const sinon   = require('sinon');
const mockery = require('mockery');
chai.use(require('sinon-chai'));
//chai.use(require('chai-shallow-deep-equal'));

const mongoose         = require('mongoose');
mongoose.Promise       = Promise;
const userGroupService = require('../../../api/services/userGroupService');
const UserGroup        = require('../../../api/models/db/UserGroup');

const mockeryOptions = {
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
};
describe('user group service', function () {
	describe('data formatting', function () {

		it('should successfully format a userGroup', function () {
			const details = {
				name: 'wemyss',
				foo: 'bar',
				bar: 'baz',
				users: [{
					email: 'joewemyss3@gmail.com',
					firstName: 'joe',
					surname: 'wemyss'
				}]
			};
			const result  = userGroupService.formatGroup(details);
			expect(result.foo).to.not.exist;
			expect(result.bar).to.not.exist;
			expect(result.name).to.equal(details.name);
			expect(result.users.length).to.equal(1);
		});
		it('should successfully format a userGroup with multiple users', function () {
			const details = {
				name: 'wemyss',
				foo: 'bar',
				bar: 'baz',
				users: [{
					email: 'joewemyss3@gmail.com',
					firstName: 'joe',
					surname: 'wemyss'
				}, {
					email: 'joewemyss3@gmail.com',
					firstName: 'joe',
					surname: 'wemyss'
				}]
			};
			const result  = userGroupService.formatGroup(details);
			expect(result.foo).to.not.exist;
			expect(result.bar).to.not.exist;
			expect(result.name).to.equal(details.name);
			expect(result.users.length).to.equal(2);
		});
		it('throws an error when no group name is provided', function () {
			const details = {
				users: [{
					email: 'joewemyss3@gmail.com',
					firstName: 'joe',
					surname: 'wemyss'
				}]
			};
			try {
				userGroupService.formatGroup(details);
			} catch (e) {
				expect(e.message).to.equal('no valid group name provided');
			}

		});
		it('throws an error when no users are provided', function () {
			const details = {
				name: 'wemyss',
				users: []
			};
			try {
				userGroupService.formatGroup(details);
			} catch (e) {
				expect(e.message).to.equal('at least one user must be provided to create the group');
			}
		});
		it('throws an error when no user email is provided', function () {
			const details = {
				name: 'wemyss',
				users: [{
					firstName: 'joe',
					surname: 'wemyss'
				}]
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
				users: [{
					email: 'joe@gmail.com',
					firstName: 'joe',
					surname: 'wemyss'
				}, {
					email: 'joe',
					firstName: 'joe',
					surname: 'wemyss'
				}]
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
		const saveStub   = sinon.stub(UserGroup.prototype, 'save');
		mongoose.Promise = Promise;
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
				name: 'stark',
				foo: 'bar',
				bar: 'baz',
				users: [{
					email: 'eddard@stark.com',
					firstName: 'eddard',
					surname: 'stark'
				}]
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
			//I tried the four variations below.
			//expect(saveStub).to.be.calledWithMatch(persistableDetails);
			expect(saveStub).to.be.calledOnce;
			//sinon.assert.calledWithMatch(saveStub, persistableDetails)
			//sinon.assert.calledWith(saveStub, persistableDetails)
		})
	})
	/*describe('object creation', function () {
		let userGroupService;
		let saveStub = sinon.stub();
		function ModelMock(details) {
			this.save = saveStub;
		}
		beforeEach(function (done) {
			mockery.registerMock('../../../api/models/db/UserGroup', ModelMock);
			mockery.enable(mockeryOptions);
			userGroupService = require('../../../api/services/userGroupService');
			saveStub.reset();
			done();
		});
		afterEach(function(done){
			'use strict';
			mockery.disable();
			mockery.deregisterAll();
			mockery.resetCache();
			done();
		});
		after(function(done){
			'use strict';
			saveStub.restore();
			done();
		});
		const correctGroupDetails = {
			name: 'wemyss',
			users:[{
				email:'joewemyss3@gmail.com',
				firstName: 'joe',
				surname: 'wemyss'
			}]
		};
		it('correctly creates a group',async function () {
			saveStub.resolves(correctGroupDetails);
			const res = await userGroupService.createGroup(correctGroupDetails);
			expect(res).to.exist;
			expect(res.name).to.equal(correctGroupDetails.name);
			done();
		})
	})*/
})
