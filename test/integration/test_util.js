const mongoose = require('mongoose');
const config = require('../../config');

mongoose.Promise = Promise;

module.exports = {
	initialSetup (collectionName, done) {
		'use strict';
		mongoose.connect(config.db.test.uri, {useMongoClient: true}, (err) => {
			if (err) {
				return done(err);
			}
			if (mongoose.connection.collections[collectionName]) {
				mongoose.connection.collections[collectionName].drop((err) => {
					if (err && err.message !== 'ns not found') {
						return done(err);
					}
					return done(null);
				})
			}
		})
	},
	clearCollection (collectionName, done) {
		'use strict';
		mongoose.connection.collections[collectionName].remove((err) => {
			if (err) {
				return done(err);
			}
			return done();
		});
	},
	closeConnection (done) {
		'use strict';
		mongoose.connection.close();
		return done();
	}
};
