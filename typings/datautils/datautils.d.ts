declare module "datautils" {
    export class data {
        static approxDate(expected: any, actual?: any, leeway?: any) : boolean;
        static setArray(input: any, def?: any) : any;
        static setBool(input: any, def?: any) : any;
        static setDate(input: any, def?: any) : any;
        static setEnum(input: any, values: any[], def?: any) : any;
        static setFloat(input: any, def?: any) : any;
        static setFunction(input: any, def?: any) : any;
        static setInstanceOf(input: any, instance: Function, def?: any) : any;
        static setInt(input: any, def?: any) : any;
        static setObject(input: any, def?: any) : any;
        static setRegex(regex: any, input: any, def?: any) : any;
        static setString(input:any, def?:any, values?:any):number;
    }
    export class validation {
        static email(value: string) : boolean;
        static equal(value: any, match: any) : boolean;
        static greaterThan(value: any, target: any) : boolean;
        static greaterThanOrEqual(value: any, target: any) : boolean;
        static length(value: any, length: number) : boolean;
        static lengthBetween(value: any, minLength: number, maxLength: number) : boolean;
        static lessThan(value: any, target: any) : boolean;
        static lessThanOrEqual(value: any, target: any) : boolean;
        static maxLength(value: any, length: number) : boolean;
        static minLength(value: any, length: number) : boolean;
        static regex(value: string, length: number) : boolean;
        static required(value: any) : boolean;
    }
}
