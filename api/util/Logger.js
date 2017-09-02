const winston = require('winston');
const config  = require('../../config');
const Logger  = new (winston.Logger)({
	transports: [new (winston.transports.Console)({
		colorize: true,
		prettyPrint: true
	})]
});

if (config.env !== 'production') {
	Logger.level = 'verbose';
	Logger.add(winston.transports.File, {
		name: 'debug-log',
		filename: './log/server_debug_log.log',
		level: 'verbose',
		handleExceptions: true,
		humanReadableUnhandledException: true,
		timestamp: true,
		json: false
	});
	Logger.add(winston.transports.File, {
		name: 'error-log',
		filename: './log/server_error_log.log',
		level: 'error',
		handleExceptions: true,
		humanReadableUnhandledException: true,
		timestamp: true,
		json: false
	})
} else {
	Logger.level = 'error';
}
module.exports = function (moduleName) {
	'use strict';
	return {
		error(text) {
			Logger.error(`${moduleName}: ${text}`)
		},
		info(text) {
			Logger.info(`${moduleName}: ${text}`)
		},
		warn(text) {
			Logger.warn(`${moduleName}: ${text}`)
		},
		verbose(text) {
			Logger.verbose(`${moduleName}: ${text}`)
		}
	}
};
