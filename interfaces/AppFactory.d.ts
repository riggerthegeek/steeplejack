/**
 * AppFactory.d
 */


declare module Steeplejack {

    export interface IAppFactory {
        config?: Object;
        env?: Object;
        modules?: string[] | IPlugin[];
        routesDir?: string;
        routesGlob?: string;
    }

}
