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
function UserController () {


    return {


        getUser: () => {

            return 3354;

        }


    };


}


/* Defines the public output */
export let __factory = {
    name,
    factory: UserController
};
