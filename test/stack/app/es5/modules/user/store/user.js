/**
 * user
 */


"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");


/* Files */


var name = "$userStore";

/*
 The factory function - any arguments are processed
 through the IOC container
 */
function UserStore ($poolGrabber, $SQLiteResource) {


    return {


        createUser: function (data) {

            return $poolGrabber($SQLiteResource, function (db) {

                return db.insert("users", data);

            });

        },


        getUserById: function (userId) {

            return $poolGrabber($SQLiteResource, function (db) {

                return db.get("users", {id: userId}, 1)
                    .then(function (result) {
                        return result[0];
                    });


            });

        }


    };


}


/* Defines the public output */
exports.__factory = {
    name: name,
    factory: UserStore
};
