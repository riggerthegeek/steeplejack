/**
 * Config.d
 */


declare module ISteeplejack {

    export interface IConfig {
        name: string;
        config: (config: Object) => any;
    }

}
