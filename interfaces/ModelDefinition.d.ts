/**
 * ModelDefinition
 */


declare module Steeplejack {

    export interface IModelDefinition {
        type: any;
        value: any;
        column?: any;
        primaryKey?: boolean;
        validation?: Function[];
        enum?: any[];
        settings?: any;
    }

}
