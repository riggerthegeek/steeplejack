/**
 * User
 */


"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Model} from "../../../../../../../lib/model";


const name = "UserModel";


function UserModel () {


    return class User extends Model {


        _schema () {

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


}


/* Defines the public output */
exports.__factory = {
    name: name,
    factory: UserModel
};
