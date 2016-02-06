/**
 * User
 */


"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
var Model = require("../../../../../../../lib/model").Model;


var name = "UserModel";


function UserModel () {

    return Model.extend({


        _schema: function () {

            return {
                id: {
                    type: "integer"
                },
                firstName: {
                    type: "string",
                    column: "first_name"
                },
                lastName: {
                    type: "string",
                    column: "last_name"
                },
                emailAddress: {
                    type: "string",
                    column: "email_address"
                }
            }

        }


    });

}


/* Defines the public output */
exports.__factory = {
    name: name,
    factory: UserModel
};
