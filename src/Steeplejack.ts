/**
 * Steeplejack
 */

/// <reference path="../typings/tsd.d.ts" />


/* Node modules */
import * as http from "http";


/* Third-party modules */


/* Files */
import Base from "./lib/Base";


export default class Steeplejack {

    twat: number;


    constructor () {

        this.twat = Base.twat();

    }


}
