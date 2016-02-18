/**
 * user
 */


"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var Bluebird = require("bluebird");


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

                var map = {
                    "$firstName": "first_name",
                    "$lastName": "last_name",
                    "$emailAddress": "email_address"
                };

                var sql = "INSERT INTO users (first_name, last_name, email_address)" +
                    "VALUES($firstName, $lastName, $emailAddress)";

                var values = _.reduce(map, function (result, dataKey, valueKey) {

                    result[valueKey] = data[dataKey];

                    return result;

                }, {});

                var defer = Bluebird.defer();

                db.run(sql, values, function (err) {

                    if (err) {
                        return defer.reject(err);
                    }

                    data.id = this.lastID;

                    defer.resolve(data);

                });

                return defer.promise;

            });

        },


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
