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

                return db.insert("users", data);

            });

        }


        static getUserById (userId) {

            return $poolGrabber($SQLiteResource, (db) => {

                return db.get("users", {id: userId}, 1)
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
