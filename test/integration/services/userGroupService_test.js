// noinspection Annotator
const expect      = require('chai').expect;
const testUtils   = require('../test_util');
//const UserGroup = require('../../../api/models/db/UserGroup');
const userService = require('../../../api/services/userGroupService');

const COLLECTION_NAME = 'user_group';
// noinspection Annotator
describe('user group service', function () {
	// noinspection Annotator
  before(function (done) {
		testUtils.initialSetup(COLLECTION_NAME, done);
	});
	afterEach(function (done) {
		testUtils.clearCollection(COLLECTION_NAME, done);
	});
	// noinspection Annotator
  after(function (done) {
		testUtils.closeConnection(done);
	});
	// noinspection Annotator
  describe('object deletion', async function () {
		let groupId;
		beforeEach(async function () {
			const tmpGroup = await userService.createGroup({
				name: 'stark',
				email: 'eddard@stark.com',
				firstName: 'eddard',
				surname: 'stark'
			});
			groupId        = tmpGroup._id;
		});
		it('should delete a group successfully', async function () {
			'use strict';
			const res = await userService.removeGroupById(groupId);
			// noinspection Annotator
      expect(res).to.be.true;
		})
	})
})
