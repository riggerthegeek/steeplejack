/**
 * AppFactory.d
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {IPlugin} from "./plugin";


export interface IAppFactory {
    config?: Object;
    env?: Object;
    modules?: string[] | IPlugin[];
    routesDir?: string;
    routesGlob?: string;
}
