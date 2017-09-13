const Logger           = require('../util/Logger')('USER_GROUP_CTRL');
const userGroupService = require('../services/userGroupService');
const authService      = require('../services/userAuthService');
const errors           = require('restify-errors');
const _                = require('lodash');
module.exports         = {
  async createNewGroup(req, res, next) {
    'use strict';
    Logger.info(`user group controller attempting to create new user group and auth records`);
    Logger.verbose(`details: ${JSON.stringify(req.body)}`);
    let groupToBeSaved;
    try {
      groupToBeSaved = await userGroupService.createGroup(req.body.group);
    } catch (err) {
      Logger.warn(`group could not be saved, sending error response`);
      // noinspection Annotator
      return next(new errors.BadRequestError(err.message));
    }
    Logger.info(`group details have been created without error`);
    Logger.verbose(`current auth details: ${JSON.stringify(req.body.group.auth)}`);
    //fixme : do something about the code below, its ugly
    Logger.verbose(`attempting to create auth record`);
    try {
      const authDetails = {
        email: req.body.group.email,
        user: groupToBeSaved.users[0]._id,
        group: groupToBeSaved._id,
        authProvider: req.body.group.authProvider
      };
      Logger.verbose(`auth record to be created: ${JSON.stringify(authDetails)}`);
      let savedAuth = await authService.createDetails(authDetails);
      if (!savedAuth || _.isEmpty(authDetails)) {
        Logger.warn(`auth details are empty after create details step, aborting`);
        throw new Error('no auth details returned by save function');
      }
      Logger.verbose(`auth is assumed correctly saved`);
      Logger.verbose(`saved auth: ${savedAuth}`); //fixme bug with saved auth being undefined
    } catch (e) {
      Logger.warn(`auth object save failed in controller, ${e}`);
      await userGroupService.removeGroupById(groupToBeSaved._id);
      return next(new errors.BadRequestError(e.message));
    }
    Logger.info(`details added successfully, returning 200 response`);
    return res.send(200, {message: 'user group added successfully'});
  },
  async tmpCreateNewGroup(req, res, next) {
    'use strict';
    Logger.info(`user group controller attempting to create new user group and auth records`);
    Logger.verbose(`details: ${JSON.stringify(req.body)}`);

  }
};
