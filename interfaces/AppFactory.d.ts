/**
 * AppFactory.d
 */


declare module ISteeplejack {

    export interface IAppFactory {
        config?: Object;
        env?: Object;
        modules?: string[] | IPlugin[];
        routesDir?: string;
        routesGlob?: string;
    }

}
