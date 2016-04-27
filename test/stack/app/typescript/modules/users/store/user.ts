/**
 * user
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Inject} from "../../../../../../../decorators/inject";


@Inject({
    name: "$userStore"
})
export class Store {

    public constructor (protected $poolGrabber: any, protected $SQLiteResource: any) {}

    public createUser (data: any) {

        return this.$poolGrabber(this.$SQLiteResource, function (db: any) {

            return db.insert("users", data);

        });

    }

    public getUserById (userId: string) {

        return this.$poolGrabber(this.$SQLiteResource, (db: any) => {

            return db.get("users", {id: userId}, 1)
                .then((result:any[]) => {
                    return result[0];
                });

        });

    }

}
