# v3.1.0
 - Exposed the allowable HTTP methods as a static method on the Server class - `Server.allowableHTTPMethods()`
 - Allowed the data object on the `Logger.prototype.trigger()` method to be optional
 - If error status code is returned and no body, the HTTP error message will be returned
 - If the logger in `Steeplejack.app` is set to `true`, the logger will use `console.log`. This is not really intended
   for production use, but it's useful if demonstrating the capability or if haven't/aren't configuring a more
   comprehensive logger.

# v3.0.0
 - Support for NodeJS versions below v4 discontinued. At the time of writing (Feb 2017), v4 is the oldest version of
 NodeJS to be supported. This means no `.extend` static method on each class and should now use the class-based
 extension.
 - Project moved from [TypeScript](http://typescriptlang.org) to ES6, compiled using [Babel](http://babeljs.io). Was
 finding the move to TSv2 problematic and rerunning a build on same commit a few weeks later would fail - compare two
 builds of [c0157e3](https://github.com/riggerthegeek/steeplejack/commit/c0157e32810783007094461e6251b1a27089cd50)
 on [Oct 2016](https://travis-ci.org/riggerthegeek/steeplejack/builds/170377371) and
 [Feb 2017](https://travis-ci.org/riggerthegeek/steeplejack/builds/200259810). Whilst this is likely to be a configuration
 issue rather than a TypeScript issue _per se_, ES6 is the future of the language.
 - Moved the [Base](https://github.com/steeplejack-js/core), [Collection/Model](https://github.com/steeplejack-js/data)
 and [Injector](https://github.com/steeplejack-js/injector) into their own repos so can be used independently of this
 project.
 - Injector has moved away from parsing the factory's argument to having the dependencies explicitly defined. This is
 less brittle and will support minification/obfuscation.
 - Middleware can now to applied to all endpoints in a route file.

# v2.0.0

## General
 - Project completely rewritten using [TypeScript](http://typescriptlang.org). It keeps the `.extend` static method for
 use with ES5 projects, however a transpiled language (TypeScript, ES6 or CoffeeScript) is the preferred way of using.
 - Dropped support for NodeJS 0.8. The lowest supported version of NodeJS is 0.10. This is supported simply because it
 is still the version on [OpenShift](http://openshift.redhat.com). However, you really should be using the officially
 supported stable or LTS version of NodeJS (at time of writing, v4.x.x and above).
 - Removed the child objects from the main `Steeplejack` class. Now, you should call by using the require namespacing,
 eg `var Base = require("steeplejack/lib/base");`.
 - Socket connections now supported by default.
 - Project is now capitalised, ie "Steeplejack" rather than "steeplejack".
 - Tested to run in ES5, ES6, TypeScript and CoffeeScript.

## Base
 - Removed the `.create` static method.
 - Removed the `.extendsConstructor` static method.
 - Removed the `.validation` static method/

## Collection
 - Largely works the same as before. Biggest difference is defining the model. Now should be a method called `_model`,
 eg, `protected _model () { return Model; }`.
 - The class is a TypeScript abstract class meaning it cannot be directly invoked.
 - Removed the methods of `.get` and `.remove` which do everything. Replaced with a much stricter interface -
 `.getAllById`, `.getAllByKey`, `.getAllByModel`, `.getById`, `.getByKey`, `.getByModel`, `.removeById`,
  `.removeByModel` which do the action with the specific input type.

## Exceptions
 - Rewritten, but no major changes to the interface.
 - The Exception class is a TypeScript abstract class meaning it cannot be directly invoked.

## Injector
 - Rewritten, but no major changes to the interface.
 - Added an `@Inject` decorator for use in TypeScript/ES6.

## Logger
 - Rewritten as a true strategy pattern rather than having to extend this class.

## Model
 - Works largely the same as before. Biggest difference is in defining the schema. Now should be a method called
 `_schema`, eg, `protected _schema () { return { ...schema... }`.
 - The class is a TypeScript abstract class meaning it cannot be directly invoked.

## Plugin
 - Rewritten, but no major changes to the interface.

## Router
 - Rewritten as a true strategy pattern rather than having to extend this class.
 - Rewritten so that the files it accepts are now defined by `exports.route` or `exports.socket`.
 - Sockets are now available as well as HTTP routes.

## Server
 - Rewritten as a true strategy pattern rather than having to extend this class.
 - The `.discoverRoutes` method now accepts a glob.

## Steeplejack
 - Removed the static methods that exposed the child objects.
 - Change `.app` routeDir to route, which now accepts a glob.
 - The automated IOC registration has been improved and allows a much simpler `class` registration

---

# v1.2.1
 - Added a `find` and `findLast` method.  Works the same as the [`find`](https://lodash.com/docs#find) and
 [`findLast`](https://lodash.com/docs#findLast) methods on lodash.

---

# v1.2.0

 - The dependency injector now accepts arrays - same syntax as AngularJS's DI
 - CORS now defaults to * if no arguments added
 - Removed `typeof`s and replaced with the appropriate lodash function
 - $outputHandler now accepts promises
 - Added OPTIONS HTTP method
 - Collection now has a `filter` method which is the opposite of the `where` method
 - The `routeDir` and `modules` in the main factory method can now receive absolute paths, not just ones relative to the
    result of `process.cwd()`

---

# v1.1.0

 - Added support for Plugins
 - Added `limit` method to the Collection - works similar to MySQL's `LIMIT`

---

# v1.0.2

 - Fixed an issue with the router that meant nested route files (below 3 subdirectories) didn't load correctly. Files
 that far down were assuming the file was `index.js`

---

# v1.0.1

 - Added a new server HTTP method of `all`. This cycles through all recognised HTTP methods, registering the given
 server endpoint against it.

---

# v1.0.0

Initial public release of the project.  Any usage of v0.x releases should be considered incompatible with the v1.x
release.  This is due to the removal of the steeplejack executable and the reworking of the dependency injection system.
