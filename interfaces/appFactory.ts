/**
 * AppFactory.d
 */

import {IPlugin} from "./plugin";


export interface IAppFactory {
    config?: Object;
    env?: Object;
    modules?: string[] | IPlugin[];
    routesDir?: string;
    routesGlob?: string;
}
