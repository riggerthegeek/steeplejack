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
        static setRegex(input: any, input: any, def?: any) : any;
        static setString(input:any, def?:any, values?:any):number;
    }
}
