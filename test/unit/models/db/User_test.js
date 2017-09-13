const expect = require('chai').expect;

const UserModel = require('../../../../api/models/db/User').model;


describe('User model', function () {
	describe('creation', function () {
		it('should create a valid user model', function () {
			const user = new UserModel({
				email: 'joewemyss3@gmail.com',
				firstName: 'joe',
				surname: 'wemyss'
			});
			expect(user.firstName).to.equal('joe');
			expect(user.surname).to.equal('wemyss');
			expect(user.email).to.equal('joewemyss3@gmail.com');
			expect(user._id).to.exist;
			// noinspection JSCheckFunctionSignatures
      expect(user.validateSync()).to.not.exist;
		});
		it('should fail validation when the email is improperly formatted', function () {
			const user = new UserModel({email: 'joe'});
			// noinspection JSCheckFunctionSignatures
      const err  = user.validateSync();
			expect(err.errors.email.message).to.equal('email is improperly formatted');
		});
		it('should fail validation when no email is provided', function () {
			const user = new UserModel({});
			// noinspection JSCheckFunctionSignatures
      const err  = user.validateSync();
			expect(err.errors.email.message).to.equal('Path `email` is required.')
		})
	})
});
