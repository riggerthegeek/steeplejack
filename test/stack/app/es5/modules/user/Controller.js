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
function UserController () {


    return {


            getUser: function () {

                return 3354;

            }


    };


}


/* Defines the public output */
exports.__factory = {
    name: name,
    factory: UserController
};
