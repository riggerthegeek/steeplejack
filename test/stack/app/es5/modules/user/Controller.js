/**
 * Controller
 */


"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


/* Define the factory name for the public */
var name = "$userController";

/*
 The factory function - any arguments are processed
 through the IOC container
 */
function UserController ($userStore, UserModel) {


    return {


        createUser: function (data) {

            var user = new UserModel(data);

            user.validate();

            return $userStore.createUser(user.toDb())
                .then(function (result) {

                    return UserModel.toModel(result);

                });

        },


        getUser: function (userId) {

            return $userStore.getUserById(userId)
                .then(function (result) {

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
