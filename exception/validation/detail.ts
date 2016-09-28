/**
 * Detail
 *
 * The detail object for a validation error
 */

"use strict";


/* Node modules */


/* Third-party modules */
import * as _ from "lodash";


/* Files */


export class Detail {


    public additional: any;

    public message: string;

    public value: any;


    public constructor ({message, value, additional}: { message: string, value: any, additional: any }) {

        this.message = message;
        this.value = value;
        this.additional = additional;

    }


    /**
     * To DTO
     *
     * Converts the class to a data
     * transfer object
     *
     * @returns {object}
     */
    public toDTO () {

        let obj: any;

        obj = _.pick(this, [
            "message",
            "value"
        ]);

        /* Add the optional additional tag */
        if (_.isUndefined(this.additional) === false) {
            obj.additional = this.additional;
        }

        return obj;

    }


    /**
     * Validate
     *
     * Validates this instance, throw an error
     * if invalid.
     *
     * @returns {boolean}
     */
    public validate () : boolean {

        if (_.isEmpty(this.message)) {
            throw new SyntaxError("MESSAGE_MUST_BE_SET");
        }

        return true;

    }


    /**
     * To Model
     *
     * Factory to create an instance of this
     * class
     *
     * @param {*} value
     * @param {string} message
     * @param {*} additional
     * @returns {Detail}
     */
    public static toModel (value: any, message: string, additional: any = void 0) : Detail {

        return new Detail({
            value,
            message,
            additional
        });

    }


}
