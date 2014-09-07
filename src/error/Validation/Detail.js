/**
 * Details
 *
 * This is a simple object that handles the details
 * that get stored to the Validation Exception
 */

"use strict";


/* Node modules */


/* Third-party modules */
var _ = require("lodash");
var datatypes = require("datautils").data;


/* Files */


function Detail (options) {

    options = datatypes.setObject(options, {});

    this.message = datatypes.setString(options.message, null);
    this.value = options.value;
    /* Mixed value - default to undefined */
    this.additional = options.additional;
    /* Mixed value - default to undefined. Object is preferred */

    return this;

}


_.extend(Detail.prototype, {


    /**
     * To DTO
     *
     * Pushed to an object literal
     *
     * @returns {unresolved}
     */
    toDTO: function () {

        var keys = [
            "message",
            "value",
            "additional"
        ];

        var obj = _.pick(this, [
            "message",
            "value"
        ]);

        if (this.additional !== undefined) {
            obj.additional = this.additional;
        }

        return obj;

    },


    validate: function () {

        if (this.message === null) {
            throw new SyntaxError("MESSAGE_MUST_BE_SET");
        }

        return true;

    }


});


_.extend(Detail, {


    toModel: function (value, message, additional) {

        return new Detail({
            value: value,
            message: message,
            additional: additional
        });

    }


});


module.exports = Detail;
