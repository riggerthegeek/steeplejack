# v1.2.0

 - The dependency injector now accepts arrays - same syntax as AngularJS's DI
 - CORS now defaults to * if no arguments added
 - Removed typeofs and replaced with the lodash function
 - $outputHandler now accepts promises
 - Added OPTIONS HTTP method
 - Collection now has a `filter` method which is the opposite of the `where` method
 - The `routeDir` and `modules` in the main factory method can now receive absolute paths, not just ones relative to the
    result of `process.cwd()`

# v1.1.0

 - Added support for Plugins
 - Added `limit` method to the Collection - works similar to MySQL's `LIMIT`

# v1.0.2

 - Fixed an issue with the router that meant nested route files (below 3 subdirectories) didn't load correctly. Files
 that far down were assuming the file was `index.js`

# v1.0.1

 - Added a new server HTTP method of `all`. This cycles through all recognised HTTP methods, registering the given
 server endpoint against it.

# v1.0.0

Initial public release of the project.  Any usage of v0.x releases should be considered incompatible with the v1.x
release.  This is due to the removal of the steeplejack executable and the reworking of the dependency injection system.
