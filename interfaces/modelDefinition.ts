/**
 * ModelDefinition
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */


export interface IModelDefinition {
    type: any;
    value: any;
    column?: any;
    primaryKey?: boolean;
    validation?: Function[];
    enum?: any[];
    settings?: any;
}
