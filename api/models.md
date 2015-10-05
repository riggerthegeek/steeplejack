---
layout: api
title: Model
permalink: /api/model/
section: api

source: src/library/DomainModel/index.js
description: |
    A model is a representation of data so it can be used in a consistent way throughout the application. As JavaScript
    isn't [strongly-typed](http://whatis.techtarget.com/definition/strongly-typed), the models can be used to ensure
    that the data is always in the same format.

    To define a model, you must give a definition when extending.  This will take in the schema of the model, the
    allowed datatype, the default value, validation rules and the datastore's name for it.

        var Model = steeplejack.Model.extend({
            definition: {
                name: {
                    type: "string",
                    value: null, // Defaults to null
                    column: "my_name", // 'name' key called 'my_name' in the database
                    validation: [{
                        rule: "required" // Makes it a required parameter
                    }, {
                        rule: "minLength", // Minimum length is 10 characters
                        param: 10
                    }, {
                        rule: function (model, value) { // A custom rule to prevent the name being Bob
                            if (value === "Bob") {
                                throw new Error("Bob is an invalid name");
                            }
                            return true; // Returning false is an implicit error
                        }
                    }]
                }
            },

            // You can add in custom getters and setters by creating a method `get'Key'` and `set'Key'`
            getName: function () {
                // The false prevents it from calling this function again
                return "Hello " + this.get("name", false);
            },

            setName: function (name, def) {
                // The false prevents it from calling this function again
                this.set("name", name.toUpperCase(), false);
            }
        });

    You can now call `obj.get("name")` and `obj.set("name")` which will call the custom methods

extends:
api:
    -
        type: method
        items:
            -
                name: method
                returns:
                desc: |
    -
        type: static
        items:
            -
                name: method
                returns:
                desc: |
---
