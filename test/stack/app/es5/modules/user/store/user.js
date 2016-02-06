/**
 * user
 */


"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


var name = "$userStore";

/*
 The factory function - any arguments are processed
 through the IOC container
 */
function UserStore ($poolGrabber, $SQLiteResource) {


    return {


        getUserById: function (userId) {

            return $poolGrabber($SQLiteResource, function (db) {

                return db.allAsync("SELECT * FROM users WHERE id = ? LIMIT 1", userId)
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
