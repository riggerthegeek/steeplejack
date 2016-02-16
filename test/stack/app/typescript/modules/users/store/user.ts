/**
 * user
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";
let Bluebird = require("bluebird");


/* Files */
import {Inject} from "../../../../../../../decorators/inject";


//@Inject("$userStore", "$poolGrabber", "$SQLiteResource")
//export class Store {
//
//
//    protected static $poolGrabber: any;
//
//
//    protected static $SQLiteResource: any;
//
//
//    public static createUser (data: any) {
//
//        return Store.$poolGrabber(Store.$SQLiteResource, function (db: any) {
//
//            var map = {
//                "$firstName": "first_name",
//                "$lastName": "last_name",
//                "$emailAddress": "email_address"
//            };
//
//            var sql = "INSERT INTO users (first_name, last_name, email_address)" +
//                "VALUES($firstName, $lastName, $emailAddress)";
//
//            var values = _.reduce(map, function (result: any, dataKey: any, valueKey: any) {
//
//                result[valueKey] = data[dataKey];
//
//                return result;
//
//            }, {});
//
//            var defer = Bluebird.defer();
//
//            db.run(sql, values, function (err: any) {
//
//                if (err) {
//                    return defer.reject(err);
//                }
//
//                data.id = (<any>this).lastID;
//
//                defer.resolve(data);
//
//            });
//
//            return defer.promise;
//
//        });
//
//    }
//
//
//    public static getUserById (userId: string) {
//
//        return Store.$poolGrabber(Store.$SQLiteResource, (db: any) => {
//
//            return db.allAsync("SELECT * FROM users WHERE id = ? LIMIT 1", userId)
//                .then((result: any[]) => {
//                    return result[0];
//                });
//
//
//        });
//
//    }
//
//
//}
@Inject({
    name: "$userStore"
})
export class Store {

    public constructor (protected $poolGrabber: any, protected $SQLiteResource: any) {}

    public createUser (data: any) {

        return this.$poolGrabber(this.$SQLiteResource, function (db: any) {

            var map = {
                "$firstName": "first_name",
                "$lastName": "last_name",
                "$emailAddress": "email_address"
            };

            var sql = "INSERT INTO users (first_name, last_name, email_address)" +
                "VALUES($firstName, $lastName, $emailAddress)";

            var values = _.reduce(map, function (result: any, dataKey: any, valueKey: any) {

                result[valueKey] = data[dataKey];

                return result;

            }, {});

            var defer = Bluebird.defer();

            db.run(sql, values, function (err: any) {

                if (err) {
                    return defer.reject(err);
                }

                data.id = (<any>this).lastID;

                defer.resolve(data);

            });

            return defer.promise;

        });

    }

    public getUserById (userId: string) {

        return this.$poolGrabber(this.$SQLiteResource, (db: any) => {

            return db.allAsync("SELECT * FROM users WHERE id = ? LIMIT 1", userId)
                .then((result:any[]) => {
                    return result[0];
                });

        });

    }

}
