/**
 * Config.d
 */


declare module Steeplejack {

    export interface IConfig {
        name: string;
        config: (config: Object) => any;
    }

}
