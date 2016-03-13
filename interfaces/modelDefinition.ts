/**
 * ModelDefinition
 */

"use strict";


/* Node modules */


/* Third-party modules */
import {IDefinitionValidation} from "./definitionValidation";


/* Files */


export interface IModelDefinition {
    type: any;
    value: any;
    column?: any;
    primaryKey?: boolean;
    validation?: IDefinitionValidation[];
    enum?: any[];
    settings?: any;
}
