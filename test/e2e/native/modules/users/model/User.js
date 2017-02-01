/**
 * User
 */

/* Node modules */

/* Third-party modules */
const { Model } = require('@steeplejack/data');

/* Files */

exports.default = () => {
  class User extends Model {
    _schema () {
      return {
        id: {
          type: 'integer',
        },
        firstName: {
          type: 'string',
          column: 'first_name',
          validation: [{
            rule: 'required',
          }],
        },
        lastName: {
          type: 'string',
          column: 'last_name',
          validation: [{
            rule: 'required',
          }],
        },
        emailAddress: {
          type: 'string',
          column: 'email_address',
          validation: [{
            rule: 'required',
          }, {
            rule: 'email',
          }],
        },
      };
    }
  }

  return User;
};

/* Defines the public output */
exports.inject = {
  name: 'UserModel',
};
