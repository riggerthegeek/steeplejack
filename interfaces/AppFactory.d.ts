/**
 * AppFactory.d
 */


declare interface IAppFactory {
    config: Object;
    env: Object;
    modules: any[];
    routesDir: string;
    routesGlob: string;
}
