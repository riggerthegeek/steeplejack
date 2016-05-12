/**
 * index
 */

/// <reference path="../../../../../../typings/main.d.ts" />

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {ISocketRequest} from "../../../../../../interfaces/socketRequest";


export const socket = () => {

    return {

        connect: (conn: ISocketRequest) => {

            setTimeout(() => {
                conn.disconnect();
            }, 500);

        }

    };

};
