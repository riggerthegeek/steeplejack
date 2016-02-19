/**
 * AddRoutes.d
 */


declare module Steeplejack {

    export interface IAddRoutes {
        [key: string]: {
            [route: string]: Function | Function[];
        };
    }

}
