const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const AuthCtrl = require('../../../api/controllers/AuthController');
const UserAuth  = require('../../../api/models/db/UserAuth');
const testUtils = require('../test_util');
const COLLECTION_NAME = 'user_auth';
const ObjectId = require('mongoose').Types.ObjectId;
describe('auth controller', function () {
  //fixme: complete unit testing first
  const passwordLogin = {
    email: 'test@test.com',
    password: 'pa$$word'
  };
  const savedPasswordDetails = {
    email: passwordLogin.email,
    user: ObjectId(),
    group: ObjectId(),
    authProviders:[{password: passwordLogin.password}],
    roles: ['group_admin``']
  };
  before(function(done){
    'use strict';
    testUtils.initialSetup([USER_GROUP_COLLECTION, USER_AUTH_COLLECTION], done);
  });
  beforeEach(function (done) {

  });
  describe('successful requests', function () {

  })
});
