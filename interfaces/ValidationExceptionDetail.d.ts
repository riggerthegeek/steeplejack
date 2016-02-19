/**
 * ValidationExceptionDetail
 */


declare module ISteeplejack {

    export interface IValidationExceptionDetail {
        message: string;
        value: any;
        additional?: any;
    }

}
