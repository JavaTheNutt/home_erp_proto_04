const chai     = require('chai');
const expect   = chai.expect;
const sinon    = require('sinon');
const ObjectId = require('mongoose').Types.ObjectId;
chai.use(require('sinon-chai'));

const userAuthService = require('../../../api/services/userAuthService');
const UserAuth        = require('../../../api/models/db/UserAuth');
// noinspection JSUnusedLocalSymbols
const UserGroup       = require('../../../api/models/db/UserGroup');
const User            = require('../../../api/models/db/User');

const mongoose   = require('mongoose');
mongoose.Promise = Promise;

describe('user auth service', function () {
  let details, userId, groupId;
  before(function () {
    details = {
      email: 'joewemyss3@gmail.com',
      authProvider: {
        name: 'firebase',
        identifier: 'test'
      },
      roles: ['group_admin']
    }
  });
  beforeEach(function () {
    details = {
      email: 'joewemyss3@gmail.com',
      authProvider: {
        name: 'firebase',
        identifier: 'test'
      },
      roles: ['group_admin']
    }
    userId        = ObjectId();
    groupId       = ObjectId();
    details.user  = userId;
    details.group = groupId;
  });
  describe('data formatting', function () {
    it('should successfully format user auth details', function () {
      details.foo  = 'bar';
      details.bar  = 'baz';
      const result = userAuthService.formatDetails(details);
      expect(result.foo).to.not.exist;
      expect(result.bar).to.not.exist;
      expect(result.email).to.equal(details.email);
      expect(result.user).to.equal(details.user);
      expect(result.group).to.equal(details.group);
      expect(result.authProviders.length).to.equal(1);
      expect(result.authProviders[0].name).to.equal(details.authProvider.name);
    });
    it('should throw an error when no email is provided', function () {
      details.name = null;
      try {
        userAuthService.formatDetails(details);
      } catch (err) {
        expect(err.message).to.equal('invalid email provided');
      }
    });
    it('should throw an error when an invalid email is provided', function () {
      details.name = null;
      try {
        userAuthService.formatDetails(details);
      } catch (err) {
        expect(err.message).to.equal('invalid email provided');
      }
    });
    it('should throw an error when an no auth provider is provided', function () {
      details.authProvider = null;
      try {
        userAuthService.formatDetails(details);
      } catch (err) {
        expect(err.message).to.equal('no auth provider specified');
      }
    });
    it('should throw an error when no user id is provided', function () {
      'use strict';
      details.user = null;
      try {
        userAuthService.formatDetails(details);
      } catch (err) {
        expect(err.message).to.equal('invalid user id provided');
      }
    });
    it('should throw an error when an invalid user id is provided', function () {
      'use strict';
      details.user = 'a';
      try {
        userAuthService.formatDetails(details);
      } catch (err) {
        expect(err.message).to.equal('invalid user id provided');
      }
    });
    it('should throw an error when no group id is provided', function () {
      'use strict';
      details.group = null;
      try {
        userAuthService.formatDetails(details);
      } catch (err) {
        expect(err.message).to.equal('invalid group id provided');
      }
    });
    it('should throw an error when no group id is provided', function () {
      'use strict';
      details.group = 'a';
      try {
        userAuthService.formatDetails(details);
      } catch (err) {
        expect(err.message).to.equal('invalid group id provided');
      }
    })
  });
    describe('auth creation', function () {
      sampleHash                    = '$2a$10$VK0doarhv9QjTu44UZUHA.UxLF52CKzYTR83pZejeKVr5zz2Wkk0a';
      const saveStub                = sinon.stub(UserAuth.prototype, 'save');
      const preStub                 = sinon.stub(UserAuth.prototype, 'pre').resolves(true);
      const formatSpy               = sinon.spy(userAuthService, 'formatDetails');
      const hashPasswordStub        = sinon.stub(userAuthService, 'hashPassword').withArgs('pa$$word').resolves(sampleHash);
      const removeGroupStub         = sinon.stub(userAuthService, 'removeGroup');
      const createSelfAuthSpy       = sinon.spy(userAuthService, 'createSelfAuthDetails');
      const createThirdPartyAuthSpy = sinon.spy(userAuthService, 'createThirdPartyAuth');

      mongoose.Promise = Promise; //ensure mongoose uses ES6 promises
      let outputDetails;
      beforeEach(function () {
        outputDetails = {
          _id: 'someidhere',
          email: 'joewemyss3@gmail.com',
          user: userId,
          group: groupId,
          authProvider: {
            name: 'firebase',
            identifier: 'test'
          },
          roles: ['group_admin']
        };
      });
      afterEach(function () {
        saveStub.reset();
        formatSpy.reset();
        preStub.reset();
        userAuthService.hashPassword.reset();
        removeGroupStub.reset();
        createSelfAuthSpy.reset();
        createThirdPartyAuthSpy.reset();
      });
      after(function () {
        saveStub.restore();
        formatSpy.restore();
        preStub.restore();
        userAuthService.hashPassword.restore();
        removeGroupStub.restore();
        createSelfAuthSpy.restore();
        createThirdPartyAuthSpy.restore();
      });
      describe('create user auth', function () {
        it('should successfully save an object', async function () {
          details.foo = 'bar';
          details.bar = 'bar';
          saveStub.resolves(outputDetails);
          const result = await userAuthService.createUserAuth(details);
          expect(saveStub).to.be.calledOnce;
          expect(result._id).to.exist;
          expect(result.foo).to.not.exist;
          expect(result.bar).to.not.exist;
        });
      });
      describe('create details function', function () {
        it('should successfully create an object with third party auth', async function () {
          'use strict';
          details.foo  = 'bar';
          details.baz  = 'bar';
          saveStub.resolves(outputDetails);
          const result = await userAuthService.createDetails(details);

          expect(hashPasswordStub, 'password stub called while testing third party').to.not.be.called;
          expect(formatSpy).to.be.calledOnce;
          expect(formatSpy).to.be.calledBefore(createThirdPartyAuthSpy);
          expect(formatSpy).to.be.calledWith(details);
          expect(createSelfAuthSpy).to.not.be.called;
          expect(createThirdPartyAuthSpy).to.be.calledOnce;
          expect(createThirdPartyAuthSpy).to.be.calledBefore(saveStub);
          expect(saveStub).to.be.calledOnce;
        });
        it('should successfully create an object with self auth', async function () {
          'use strict';
          details.authProvider = [{password: 'pa$$word'}];
          const result          = await userAuthService.createDetails(details);
          hashPasswordStub.withArgs('pa$$word').resolves(sampleHash);
          saveStub.resolves(outputDetails);
          //expect(hashPasswordStub, 'hash password stub was not called exactly once').to.be.calledOnce;
          expect(createSelfAuthSpy, 'self auth spy was not called once').to.be.calledOnce;
          expect(createThirdPartyAuthSpy).to.not.be.called;
          expect(createSelfAuthSpy).to.be.calledBefore(saveStub);
          expect(saveStub).to.be.calledOnce;
        })
      });
    });
  describe('password hashing', function () {
    'use strict';
    it('should successfully hash a password', async function () {
      const hashedPassword = await userAuthService.hashPassword('password');
      expect(hashedPassword.length).to.equal(60);
    });
  })
});
