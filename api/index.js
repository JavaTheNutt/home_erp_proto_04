const restify                = require('restify');
const mongoose               = require('mongoose');
const restifyPlugins         = require('restify-plugins');
const config                 = require('../config');
const Logger                 = require('./util/Logger')('INDEX');
const admin                  = require('firebase-admin');
const firebaseServiceAccount = require('../firebase_service_key.json');
const corsMiddleware         = require('restify-cors-middleware');
const cors                   = corsMiddleware({
	origins: ['*'],
	allowHeaders: ['*', 'X-Requested-With', 'token', 'content-type', 'origin', 'authProvider']
});
/**Firebase setup**/
admin.initializeApp({
	credential: admin.credential.cert(firebaseServiceAccount),
	databaseURL: 'https://finance-tracker-1cc05.firebaseio.com/'
});
const server = restify.createServer({
  log: Logger
});

server.use(restifyPlugins.bodyParser());
server.use(restifyPlugins.queryParser());
server.use(restifyPlugins.authorizationParser());
server.pre(cors.preflight);
server.pre((req, res, next)=>{
  'use strict';
  req.log.info({req}, 'REQUEST');
});
server.use(cors.actual);

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
