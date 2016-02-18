/**
 * User
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Model} from "../../../../../../../lib/model";
import {Inject} from "../../../../../../../decorators/inject";


@Inject({
    name: "UserModel",
    factory: true
})
export class User extends Model {


    protected _schema () {

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
