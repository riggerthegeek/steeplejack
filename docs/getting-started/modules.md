# Modules

The modules are where the main application logic will live. You have complete freedom as to how to structure your modules - a modular
structure is favoured as it's easier to spin these off into their own packages should you wish to reuse it.

```shell
src
├── modules
│   └── user
│       ├── collection
│       │   └── Users.js
│       ├── model
│       │   └── User.js
│       ├── store
│       │   └── user.js
│       └── service.js
├── resources
│   └── mongodb.js
├── routes
│   ├── hello
│   │   └── world.js
│   └── user
│       └── index.js
├── app.js
├── config.json
└── envvars.json
```

## Autoloading of files and dependency injection

To simplify your development and promote extreme testability, files in Steeplejack should be loaded automatically and your dependencies
reflectively loaded. This means you don't need to know the relative paths for files outside your module and means testing your files becomes
as easy as injecting a stubbed dependency.

To load your modules, you need to add a `modules` array to your initial factory. This accepts globbed paths.

```javascript
let app = Steeplejack.app({
    config: require("./config.json"),
    modules: [
        "src/!(routes)/**/*.js"
    ],
    routesDir: "src/routes"
});
```

### Naming convention of modules

In no way enforced, but this is a good convention.

 - Cross-cutting concerns (ie, something used outside a module) should start with `$`, eg `$userService`
 - Factory classes that would be invoked with `new` start with a capital letter, eg `UserModel`
 - Camel case for ordinary instances that would normally just be used within a module, eg `userStore`

## /src/routes/user/index.js

Create a new endpoint on `GET:/user`. This dispatches to the `$userService`.

```javascript
export let route = ($output, $userService) => {
    return {
        "/": {
            get: [
                (req, res) => {

                    let emailAddress = req.query.emailAddress;

                    $output(req, res, () => {

                        return $userService.getUserByEmailAddress(emailAddress);

                    });

                }
            ]
        }
    };
};
```

## /src/modules/user/service.js

This creates the `$userService`. It's a class that has two injected dependencies, `UserModel` and `userStore`, which are resolved
automatically. The `@Inject` decorator describe this file for the dependency injector - the minimum is the `name` of it.

```javascript
import {Steeplejack} from "steeplejack";
import {Inject} from "steeplejack/decorators/inject";
import {ValidationException} from "steeplejack/exception/validation";

@Inject({
    name: "$userService"
})
export class UserService {

    constructor (UserModel, userStore) {
        this._deps = {
            UserModel,
            userStore
        };
    }

    getUserByEmailAddress (emailAddress) {

        /* Check input is an email */
        try {
            Steeplejack.validation.email(emailAddress);
        } catch (err) {
            throw new ValidationException("emailAddress is required");
        }

        /* Check the database for the user */
        return this._deps.userStore.getUserByEmailAddress(emailAddress)
            .then(res => {

                if (res) {
                    return new this._deps.UserModel(res);
                }

            });

    }
}
```

## /src/modules/user/model/User.js

This is the `UserModel`. The schema has four items to it. Also notice how the `@Inject` now has a `factory` boolean. This tells the
dependency injector that this class must not be instantiated, but any dependencies set as static methods.

```javascript
import {Inject} from "steeplejack/decorators/inject";
import {Model} from "steeplejack/lib/model";

@Inject({
    name: "UserModel",
    factory: true
})
export class User extends Model {
    _schema () {
        return {
            id: {
                type: "integer"
            },
            firstName: {
                type: "string"
            },
            lastName: {
                type: "string"
            },
            emailAddress: {
                type: "string"
            }
        };
    }
}
```

## /src/modules/user/store/user.js

Finally the `userStore`. This would ordinarily connect to a database, but for this example it just searches a static array.

```javascript
import {_} from "lodash";
import {Inject} from "steeplejack/decorators/inject";
import {Promise} from "es6-promise";

/* Data - this would normally be in a DB */
const data = [{
    id: 1,
    firstName: "Test",
    lastName: "Testington",
    emailAddress: "test@test.com"
}];

@Inject({
    name: "userStore"
})
export class UserStore {

    getUserByEmailAddress (emailAddress) {

        return new Promise(resolve => {

            let user = _.reduce(data, (result, user) => {

                if (user.emailAddress === emailAddress) {
                    result = user;
                }

                return result;

            }, null);

            resolve(user);

        });

    }

}
```

**[PREVIOUS - Routing](routing.md)**

**[NEXT - Config](config.md)**
