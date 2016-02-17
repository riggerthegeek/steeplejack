/**
 * Controller
 */



"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Inject} from "../../../../../../decorators/inject";


@Inject({
    name: "$userController",
    deps: [
        "UserModel",
        "$userStore"
    ]
})
export class UserController {


    public constructor (protected MyUserModel: any, protected store: any) {}


    public createUser (data: any) {

        var user = new this.MyUserModel(data);

        user.validate();

        return this.store.createUser(user.toDb())
            .then((result: any) => {

                return this.MyUserModel.toModel(result);

            });

    }


    public getUser (userId: string) {

        return this.store.getUserById(userId)
            .then((result: any) => {
                return this.MyUserModel.toModel(result);
            });

    }


}
