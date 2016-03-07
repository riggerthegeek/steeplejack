/**
 * user
 */


"use strict";


/* Node modules */


/* Third-party modules */
import {_} from "lodash";
import Bluebird from "bluebird";


/* Files */


const name = "$userStore";

/*
 The factory function - any arguments are processed
 through the IOC container
 */
function UserStore ($poolGrabber, $SQLiteResource) {


    return class Store {


        static createUser (data) {

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

        }


        static getUserById (userId) {

            return $poolGrabber($SQLiteResource, (db) => {

                return db.allAsync("SELECT * FROM users WHERE id = ? LIMIT 1", userId)
                    .then((result) => {
                        return result[0];
                    });


            });

        }


    }


}


/* Defines the public output */
export let __factory = {
    name: name,
    factory: UserStore
};
