/**
 * AppFactory.d
 */


declare interface IAppFactory {
    config?: Object;
    env?: Object;
    modules?: string[] | IPlugin[];
    routesDir?: string;
    routesGlob?: string;
}
