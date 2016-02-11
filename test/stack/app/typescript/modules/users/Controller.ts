/**
 * Controller
 */



"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Inject} from "../../../../../../decorators/inject";


@Inject("$userController", "UserModel", "$userStore")
export class UserController {

    protected static UserModel: any;

    protected static $userStore: any;


    public static createUser (data: any) {

        var user = new UserController.UserModel(data);

        user.validate();

        return UserController.$userStore.createUser(user.toDb())
            .then((result: any) => {

                return UserController.UserModel.toModel(result);

            });

    }


    public static getUser (userId: string) {

        return UserController.$userStore.getUserById(userId)
            .then((result: any) => {

                return UserController.UserModel.toModel(result);

            });

    }


}
