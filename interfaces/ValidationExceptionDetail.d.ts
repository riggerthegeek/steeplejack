/**
 * ValidationExceptionDetail
 */


declare module Steeplejack {

    export interface IValidationExceptionDetail {
        message: string;
        value: any;
        additional?: any;
    }

}
