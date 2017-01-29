/**
 * User
 */

/* Node modules */

/* Third-party modules */
import {Model} from '@steeplejack/data';

/* Files */

export default () => {
  class User extends Model {
    _schema() {
      return {
        id: {
          type: "integer"
        },
        firstName: {
          type: "string",
          column: "first_name",
          validation: [{
            rule: "required"
          }]
        },
        lastName: {
          type: "string",
          column: "last_name",
          validation: [{
            rule: "required"
          }]
        },
        emailAddress: {
          type: "string",
          column: "email_address",
          validation: [{
            rule: "required"
          }, {
            rule: "email"
          }]
        }
      };
    }
  }

  return User;
};

/* Defines the public output */
export const inject = {
  name: 'UserModel'
};
