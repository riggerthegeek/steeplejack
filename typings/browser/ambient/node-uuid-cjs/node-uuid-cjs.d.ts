// Compiled using typings@0.6.3
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/3de2726e83e2995643b2907359a092408172fa30/node-uuid/node-uuid-cjs.d.ts
// Type definitions for node-uuid.js
// Project: https://github.com/broofa/node-uuid
// Definitions by: Jeff May <https://github.com/jeffmay>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


/**
 * Expose as CommonJS module
 * For use in node environment or browser environment (using webpack or other module loaders)
 */
declare module "node-uuid" {
    var uuid: __NodeUUID.UUID;
    export = uuid;
}