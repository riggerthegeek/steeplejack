/**
 * Controller
 */


"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


/* Define the factory name for the public */
const name = "$userController";

/*
 The factory function - any arguments are processed
 through the IOC container
 */
function UserController ($userStore, UserModel) {


    return class Controller {


        static createUser (data) {

            var user = new UserModel(data);

            user.validate();

            return $userStore.createUser(user.toDb())
                .then((result) => {

                    return UserModel.toModel(result);

                });

        }


        static getUser (userId) {

            return $userStore.getUserById(userId)
                .then((result) => {

                    return UserModel.toModel(result);

                });

        }


    };


}


/* Defines the public output */
exports.__factory = {
    name: name,
    factory: UserController
};
