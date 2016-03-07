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
function UserController (spankStore, spankModel) {


    return class Controller {


        static createUser (data) {

            var user = new spankModel(data);

            user.validate();

            return spankStore.createUser(user.toDb())
                .then((result) => {

                    return spankModel.toModel(result);

                });

        }


        static getUser (userId) {

            return spankStore.getUserById(userId)
                .then((result) => {

                    return spankModel.toModel(result);

                });

        }


    };


}


/* Defines the public output */
export let __factory = {
    name,
    factory: ["$userStore", "UserModel", UserController]
};
