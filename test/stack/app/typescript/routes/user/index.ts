/**
 * index
 */

"use strict";


/* Node modules */


/* Third-party modules */


/* Files */
import {ISocketRequest} from "../../../../../../interfaces/socketRequest";


export let route = ($userController: any) => {

    return {

        "/": {

            get: (request: any) => {

                /* Simulate a valid bearer token */
                if (request.headers.authorization !== "bearer valid") {
                    return 401;
                }

                return $userController.getUser("1");

            },

            post: (request: any) => {
                /* Simulate a valid bearer token */
                if (request.headers.authorization !== "bearer valid") {
                    return 401;
                }

                return $userController.createUser(request.body);
            }

        }

    };

};


export let socket = () => {

    return {

        __middleware: [
            () => {
                console.log(2222)
            }
        ],

        connect: () => {

        },

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
