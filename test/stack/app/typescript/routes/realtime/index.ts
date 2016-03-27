/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {ISocketRequest} from "../../../../../../interfaces/socketRequest";


export let socket = () => {

    return {

        __middleware: [
            () => {
                console.log(3333)
            }
        ],

        chat: (socket: ISocketRequest) => {

            socket.joinChannel("bumTitty");

            socket.broadcast({
                event: "chat",
                target: "bumTitty",
                data: [22, 33, 44]
            });

        }

    };

};
