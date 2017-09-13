const Logger     = require('../util/Logger')('USER_AUTH_SERVICE');
const validation = require('../services/validation');
const UserAuth   = require('../models/db/UserAuth');
const bcrypt     = require('bcryptjs');
const _ = require('lodash');
module.exports   = {
  /**
   * This function will handle the decisions about what type of auth will be saved
   * @param details {object} the authentication details
   */
	async createDetails(details) {
		'use strict';
		Logger.info(`attempting to create user auth details in service`);
		Logger.verbose(`details to be formatted: ${JSON.stringify(details)}`);
		Logger.verbose(`new group being created, assigning user as admin`);
		details.roles = ['group_admin'];
		Logger.verbose(`new group details ${JSON.stringify(details)}`);
		//fixme: test this
		if(!details){
		  Logger.warn(`details were not provided to createDetails(), aborting`);
		  throw new Error('no details provided', 500)
    }
    Logger.verbose(`details found, proceeding`);
    try {

      details = this.formatDetails(details);
      Logger.verbose(`details have been formatted: ${JSON.stringify(details)}`);
      let authProviderDetails;
      if(details.authProviders[0].identifier){
        Logger.info(`identifier found, assuming third party auth`);
        authProviderDetails = this.createThirdPartyAuth({name:details.authProviders[0].name, identifier: details.authProviders[0].identifier});
      }else{
        Logger.info(`no identifier found, assuming self auth`);
        authProviderDetails = await this.createSelfAuthDetails({password: details.authProviders[0].password});
      }
      Logger.info(`auth details created successfully`);
      Logger.verbose(`details ${JSON.stringify(details)}`);
      Logger.verbose(`adding auth details to details`);
      details.authProvider = authProviderDetails;
      Logger.verbose(`details are now: ${JSON.stringify(details)}`);
      Logger.verbose(`calling create user auth with above details`);
      return await this.createUserAuth(details);
    } catch (e) {
      Logger.warn(`there was an error while creating the group: ${e}`);
      throw new Error(e.message);
    }
	},
  createThirdPartyAuth(details){
	  'use strict';
    Logger.info(`attempting to create third party auth details`);
    Logger.verbose(`details to be created: ${JSON.stringify(details)}`);
    if(!details.name){
      Logger.warn(`attempting to create nameless third party auth`);
      throw new Error('attempting to create nameless auth');
    }
    if(!details.identifier){
      Logger.warn(`attempting to create third party auth without identifier`);
      throw new Error('attempting to create third party auth without identifier');
    }
    details.name = {name: details.name, identifier: details.identifier};
    return details;
  },
  async createSelfAuthDetails(details){
    'use strict';
    Logger.info(`attempting to create self auth details`);
    Logger.verbose(`details to be created: ${JSON.stringify(details)}`);
    const password = await this.hashPassword(details.password);
    Logger.info(`password hash successful, returning formatted auth details`);
    return {password}
  },
  /**
   * This function will handle checking that all required details are provided, for database insertion
   * @param details {object} the authentication details
   * @returns {{email, user, group, authProviders: (*|Array), roles: [null]}}
   * @throws Error if an invalid email is provided
   * @throws Error if an invalid group ID is provided
   * @throws Error if invalid user ID is provided
   * @throws Error if no auth providers are provided
   * @throws Error if auth identifier is provided, but not a name
   */
	formatDetails(details) {
		'use strict';
		Logger.info(`attempting to format details`);
		Logger.verbose(`details to be formatted ${JSON.stringify(details)}`);
		if (!details.email || !validation.validateEmail(details.email)) {
			Logger.warn(`invalid email provided, aborting`);
			throw new Error('invalid email provided');
		}
		Logger.verbose('email is valid');
		if (!details.group || !validation.validateObjectId(details.group.toString())) {
			Logger.warn(`invalid group id provided, aborting`);
			throw new Error('invalid group id provided');
		}
		Logger.verbose('group id is valid format');
		if (!details.user || !validation.validateObjectId(details.user.toString())) {
			Logger.warn(`invalid user id provided, aborting`);
			throw new Error('invalid user id provided');
		}
		Logger.verbose(`user id is valid format`);
		if (!details.authProvider || _.isEmpty(details.authProvider)) {
			Logger.warn(`no auth provider specified, aborting`);
			throw new Error('no auth provider specified');
		}
		Logger.verbose(`auth provider details available`);
		if(details.authProvider.identifier && !details.authProvider.name){
		  Logger.warn(`an auth provider identifier was provided, but not a name`);
		  throw new Error('if an identifier is provided, a name must be provided also');
    }
    if(details.authProvider.name && !details.authProvider.identifier){
      Logger.warn(`an auth provider identifier was provided, but not a name`);
      throw new Error('if a name is provided, an identifier must be provided also');
    }
    Logger.verbose(`auth provider combo appears right`);
    Logger.info(`details appear correct, returning savable details`);

    const  detailsToBeReturned = {
      email: details.email,
      user: details.user,
      group: details.group,
      authProviders: [details.authProvider],
      roles: [details.roles]
    };
    Logger.verbose(`details to be returned: ${JSON.stringify(detailsToBeReturned)}`);
		return detailsToBeReturned;
	},
  /**
   * This function is a wrapper for the db insertion
   * @param details {object} the auth details to be saved
   * @returns {Promise.<*>}
   * @throws an error if the save operation fails
   */
	async createUserAuth(details) {
		'use strict';
		Logger.info(`attempting to create auth record`);
		Logger.verbose(`details: ${JSON.stringify(details)}`);
		const newAuth = new UserAuth(details);
		try {
			return await newAuth.save();
		} catch (err) {
			Logger.warn(`error saving auth object: ${err}`);
			throw new Error('error while saving auth object')
		}

	},
  /**
   * This function acts as a wrapper for password hashing
   * @param password the password to be hashed in string form
   * @returns {Promise.<*>}
   * @throws an error if the password is not suitable
   * @throws an error if the hash function fails
   */
	async hashPassword(password) {
		'use strict';
		if (!password || !password.toString() === password || password.length < 5) {
			Logger.warn(`password does not exist, or is unsuitable`);
			throw new Error('trying to hash an incompatible password')
		}
		Logger.verbose(`attempting to hash password: ${password}`);
		let hashedPw;
		try {
			hashedPw = await bcrypt.hash(password, 10);
		} catch (e) {
			Logger.error(`password hash failed: ${e}`);
			throw new Error('password hash failed');
		}
		Logger.verbose(`password hashed successfully`);
		return hashedPw;
	},
  /**
   * This function is finds an auth object by its third party identifier
   * @param id the third party auth id
   * @returns {Promise.<*>}
   */
	async findByAuthIdentifier(id) {
		'use strict';
		let result;
		Logger.info(`attempting to find user with the auth identifier: ${id}`);
		try {
			result = await UserAuth.findOne({'authProviders.identifier': id});
			Logger.info(`result of search: ${JSON.stringify(result)}`);
		} catch (e) {
			Logger.error(`error  finding data, ${e}`);
			throw e;
		}
		return result;
	}
};
