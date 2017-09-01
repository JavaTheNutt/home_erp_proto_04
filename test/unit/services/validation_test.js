const expect = require('chai').expect;

const validationService = require('../../../api/services/validation');
const ObjectId = require('mongoose').Types.ObjectId;
describe('validation', function () {
	describe('email validation', function () {
		describe('error checking', function () {
			it('returns false with incorrect emails', function (done) {
				let tmpEmail = 'joe';
				let res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail}" was a correct email`).to.be.false;
				tmpEmail = 'joe@.com';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail}" was a correct email`).to.be.false;
				tmpEmail = '@joe.com';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail}" was a correct email`).to.be.false;
				tmpEmail = '@.com';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail}" was a correct email`).to.be.false;
				tmpEmail = '@joe.';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail}" was a correct email`).to.be.false;
				tmpEmail = 'joe@joe.c';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail}" was a correct email`).to.be.false;
				tmpEmail = 'joe@joe.';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail}" was a correct email`).to.be.false;
				return done();
			});
			it('returns true for valid emails', function (done) {
				let tmpEmail = 'joewemyss@gmail.com';
				let res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail} was an invalid email`).to.be.true;
				tmpEmail = 'joewemyss@gmail.co.uk';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail} was an invalid email`).to.be.true;
				tmpEmail = 'joe.wemyss@gmail.co.uk';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail} was an invalid email`).to.be.true;
				tmpEmail = 'joewemyss+social@gmail.co.uk';
				res = validationService.validateEmail(tmpEmail);
				expect(res, `thought "${tmpEmail} was an invalid email`).to.be.true;
				return done();
			})
		})
	});
	describe('validate Object Id', function(){
		'use strict';
		it('should return true for valid object ids', function () {
			const oid1 = ObjectId();
			const oid2 = ObjectId();
			const oid3 = ObjectId();
			let result = validationService.validateObjectId(oid1.toString());
			expect(result).to.be.true;
			result = validationService.validateObjectId(oid2.toString());
			expect(result).to.be.true;
			result = validationService.validateObjectId(oid3.toString());
			expect(result).to.be.true;
		});
		it('should return false for invalid object ids', function(){
			const test01 = 'wwwwwwwwwwwwww';
			const test02 = 'thisisadummystringtotestoid';
			const test03 = '01hj67thbtrs';
			let result = validationService.validateObjectId(test01);
			expect(result).to.be.false;
			result = validationService.validateObjectId(test02);
			expect(result).to.be.false;
			result = validationService.validateObjectId(test03);
			expect(result).to.be.false;
		})
	})
});
