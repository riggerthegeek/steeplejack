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
})
export class UserController {


    public constructor (protected UserModel: any, protected $userStore: any) {}


    public createUser (data: any) {

        var user = new this.UserModel(data);

        user.validate();

        return this.$userStore.createUser(user.toDb())
            .then((result: any) => {

                return this.UserModel.toModel(result);

            });

    }


    public getUser (userId: string) {

        return this.$userStore.getUserById(userId)
            .then((result: any) => {
                return this.UserModel.toModel(result);
            });

    }


}
