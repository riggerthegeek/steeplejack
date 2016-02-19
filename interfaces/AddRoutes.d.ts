/**
 * AddRoutes.d
 */


declare module ISteeplejack {

    export interface IAddRoutes {
        [key: string]: {
            [route: string]: Function | Function[];
        };
    }

}
