const restify = require('restify');

const config = require('../config');
const Logger = require('./util/Logger')('INDEX');

const server = restify.createServer({});

server.listen(config.port, () => {
	Logger.info(`server running`);
});
