const expect = require('chai').expect;

const AuthProvider = require('../../../../api/models/db/AuthProvider').model;

describe('auth provider', function () {
	describe('creation', function () {
		'use strict';
		it('should create a valid identifier auth model', function () {
			const auth = new AuthProvider({
				name: 'firebase',
				identifier: 'test'
			});
			expect(auth._id).to.exist;
			expect(auth.name).to.equal('firebase');
			expect(auth.identifier).to.equal('test');
			expect(auth.validateSync()).to.not.exist;
		});
		it('should create a valid self auth model', function () {
			const auth = new AuthProvider({password: 'password'});
			expect(auth._id).to.exist;
			expect(auth.name).to.equal('self');
			expect(auth.validateSync()).to.not.exist;
		});
		it('should fail if an identifier is passed but no name', function () {
			const auth = new AuthProvider({identifier: 'test'});
			try {
				auth.validateSync();
			} catch (e) {
				expect(e.message).to.equal('if an identifier is provided, a name must be provided also');
			}
		});
		it('should fail if there is no password or identifier present', function () {
			const auth = new AuthProvider({name: 'firebase'});
			try {
				auth.validateSync();
			} catch (e) {
				expect(e.message).to.equal('either a password or an identifier must be provided');
			}
		})
	})
});
