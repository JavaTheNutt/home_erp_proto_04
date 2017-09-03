const restify        = require('restify');
const mongoose       = require('mongoose');
const restifyPlugins = require('restify-plugins');
const config         = require('../config');
const Logger         = require('./util/Logger')('INDEX');

const server = restify.createServer({});

server.use(restifyPlugins.bodyParser());
server.use(restifyPlugins.queryParser());
server.use(restifyPlugins.authorizationParser());

let mongoUrl;
switch (config.env) {
	case 'development':
		mongoUrl = config.db.dev.uri;
		break;
	case 'test':
		mongoUrl = config.db.test.uri;
		break;
	default:
		throw new Error('no db for specified environment');
}

/** MONGOOSE SETUP**/
mongoose.Promise = Promise;
mongoose.connect(mongoUrl, {useMongoClient: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	'use strict';
	Logger.info(`database connection opened`);
});
require('./routes/unsecured')(server);
server.listen(config.port, () => {
	Logger.info(`server running`);
});
