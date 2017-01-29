/**
 * user
 */

/* Node modules */

/* Third-party modules */
import {_} from "lodash";

/* Files */

export default sqlite => ({
  createUser: data => {
    console.log('new user');
    console.log(data);
    process.exit();
  },

  getUserById: userId => sqlite
    .get("users", {id: userId}, 1)
    .then(result => result[0])

});

export const inject = {
  name: 'userStore',
  deps: [
    '$SQLiteResource'
  ]
};

// function UserStore ($poolGrabber, $SQLiteResource) {
//
//
//     return class Store {
//
//
//         static createUser (data) {
//
//             return $poolGrabber($SQLiteResource, function (db) {
//
//                 return db.insert("users", data);
//
//             });
//
//         }
//
//
//         static getUserById (userId) {
//
//             return $poolGrabber($SQLiteResource, (db) => {
//
//                 return db.get("users", {id: userId}, 1)
//                     .then((result) => {
//                         return result[0];
//                     });
//
//
//             });
//
//         }
//
//
//     }
//
//
// }
//
//
// /* Defines the public output */
// export let __factory = {
//     name: name,
//     factory: UserStore
// };
