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
                name: getColumnKeys()
                returns: array
                desc: Gets the keys and the column name  as an array of objects
            -
                name: getDefinition(key)
                returns: object|null
                desc: Gets the definition object for the given key
            -
                name: getPrimaryKey()
                returns: string
                desc: Gets the primary key
            -
                name: getPrimaryKeyValue
                returns: mixed
                desc: Gets the value of the primary key
            -
                name: get(key[, checkForCustom = true])
                returns: mixed
                desc: |
                    Gets an individual parameter.  If there is a custom method set (ie, one call `getName` where Name
                    is the key we're looking for) and we're looking for a custom method, it will go to that.  Otherwise,
                    it will just return the value set to the model.
            -
                name: set(key, value[, checkForCustom = true])
                returns:
                desc: |
                    Sets the value to the object. If there is a custom method set (ie, one call `setName` where Name
                    is the key we're looking for) and we're looking for a custom method, it will go to that.  Otherwise,
                    it will set the data based on the rules in the definition.
            -
                name: toData()
                returns: object
                desc: |
                    Pushes the data to the database representation (ie, your `column` names)
    -
        type: static
        items:
            -
                name: toModel(data)
                returns: object
                desc: |
                    Pushes the data object into a model.  This will be the object that you're expecting to be returned
                    from your data store - any column keys you have set up in the definition will be looked for in this
                    call.

                        var data = {
                            key_1: "value1",
                            key2: "value2"
                        };

                        var Model = steeplejack.Model.extend({
                            definition: {
                                key1: { // with column set
                                    type: "string",
                                    column: "key_1"
                                },
                                key2: { // with no column set
                                    type: "string"
                                }
                            }
                        });

                        var obj = Model.toData(data);
                        // this creates an instance of the model with "value1" set
                        // to key1 and "value2" set to key2
---
