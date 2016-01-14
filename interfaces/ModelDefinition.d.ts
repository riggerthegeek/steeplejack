/**
 * ModelDefinition
 */


declare interface IModelDefinition {
    type: any;
    value: any;
    column?: any;
    primaryKey?: boolean;
    validation?: Function[];
    enum?: any[];
    settings?: any;
}
