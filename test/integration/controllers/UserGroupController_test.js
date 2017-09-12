const testUtils = require('../test_util');
const chai      = require('chai');
const expect    = chai.expect;
const sinon     = require('sinon');
chai.use(require('sinon-chai'));
const USER_GROUP_COLLECTION = 'user_group';
const USER_AUTH_COLLECTION  = 'user_auth';
const userGroupCtrl         = require('../../../api/controllers/UserGroupController');
const errors                = require('restify-errors');


describe('user group controller', function () {
  let req;
  const badRequestSpy = sinon.spy(errors, 'BadRequestError');
  const res = {
    send: sinon.spy()
  };
  const next = sinon.spy();
  before(function (done) {
    testUtils.initialSetup([USER_GROUP_COLLECTION, USER_AUTH_COLLECTION], done);
  });
  beforeEach(function () {
    req = {
      body: {
        group: {
          name: 'testgroup',
          email: 'test@test.com',
          firstName: 'test',
          surname: 'test',
          auth: {
            password: 'password'
          }
        }
      }
    };

  });
  afterEach(function (done) {
    testUtils.clearCollection([USER_GROUP_COLLECTION, USER_AUTH_COLLECTION], done);
    badRequestSpy.reset();
    res.send.reset();
    next.reset();
  });
  after(function (done) {
    testUtils.closeConnection(done);
    badRequestSpy.restore();
    res.send.reset();
    next.reset();
  });
  describe('create new group', function () {
    it('should call res.send with a status of 200 for third-party auth', async function () {
      await userGroupCtrl.createNewGroup(req, res, next);
      expect(res.send).to.be.calledWith(200, {message: 'user group added successfully'})
    });
    it('should call res.send with a status of 200 for password auth', async function () {
      req.body.group.auth = {
        identifier : 'testId',
        name: 'firebase'
      };
      await userGroupCtrl.createNewGroup(req, res, next);
      expect(res.send).to.be.calledWith(200, {message: 'user group added successfully'})
    });
    it('should call next with a bad request error when a identifier is specified, but not a name', async function () {
      req.body.group.auth = {
        identifier: 'firebase'
      };
      await userGroupCtrl.createNewGroup(req, res, next);
      expect(badRequestSpy).to.be.calledWith('if an identifier is provided, a name must be provided also');
    })
  })
});
