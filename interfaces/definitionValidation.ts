/**
 * DefinitionValidation
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {Model} from "../lib/model";


export interface IDefinitionValidation {
    rule: string | ((model: Model, value: any) => boolean);
    param?: any[];
}
