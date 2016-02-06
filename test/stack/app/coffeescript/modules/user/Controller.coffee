###
 * Controller
###

"use strict";


# Node modules


# Third-party modules


# Files


# Define the factory name for the public
name = "$userController"


###
 The factory function - any arguments are processed
 through the IOC container
###
UserController = (UserModel, $userStore) ->

    {

        createUser: (data) ->

            user = new UserModel data

            user.validate()

            $userStore.createUser user.toDb()
                .then (result) ->
                    UserModel.toModel result

        getUser: (userId) ->

            $userStore.getUserById userId
                .then (result) ->
                    UserModel.toModel result

    }


# Defines the public output
exports.__factory =
    name: name
    factory: UserController
